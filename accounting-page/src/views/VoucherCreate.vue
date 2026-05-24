<template>
  <div class="page-container">
    <van-nav-bar title="凭证记账" fixed />

    <van-form @submit="submit" class="content">
      <van-field
          v-model="voucher.voucherNo"
          label="凭证号"
          placeholder="自动生成"
          readonly
      />
      <van-field
          v-model="voucher.voucherDate"
          label="日期"
          type="date"
          value-format="YYYY-MM-DD"
      />
      <van-field
          v-model="voucher.description"
          label="摘要"
          placeholder="输入备注"
      />

      <div class="title">凭证明细（可添加多笔）</div>

      <div
          v-for="(entry, index) in entries"
          :key="index"
          class="entry-card"
      >
        <van-cell-group :border="false">
          <van-field
              :model-value="entry.accountName"
              label="科目"
              placeholder="点击选择科目"
              is-link
              @click="openAccountPicker(index)"
          />
          <!-- 改为支持小数 -->
          <van-field
              v-model="entry.debit"
              label="借方金额"
              type="number"
              @change="calcTotal"
          />
          <van-field
              v-model="entry.credit"
              label="贷方金额"
              type="number"
              @change="calcTotal"
          />
        </van-cell-group>

        <div style="text-align: right; padding: 4px 12px">
          <van-button
              size="small"
              type="danger"
              plain
              @click="removeEntry(index)"
          >
            删除此行
          </van-button>
        </div>
      </div>

      <van-button
          type="primary"
          plain
          block
          @click="addEntry"
          style="margin: 12px 0"
      >
        + 添加一笔分录
      </van-button>

      <van-cell-group>
        <van-cell title="借方合计" :value="totalDebit" />
        <van-cell title="贷方合计" :value="totalCredit" />
      </van-cell-group>

      <van-button
          type="primary"
          block
          native-type="submit"
          style="margin-top: 16px"
      >
        保存凭证（借贷必须相等）
      </van-button>
    </van-form>

    <!-- 左右分栏科目选择弹窗 -->
    <van-popup v-model:show="showAccountPicker" position="center" round class="account-popup">
      <div class="picker-header">
        <span class="picker-title">选择会计科目</span>
        <van-icon name="cross" size="22" @click="showAccountPicker = false" />
      </div>
      <div class="split-picker">
        <!-- 左侧分类 -->
        <div class="left-category">
          <div
              v-for="cate in categoryList"
              :key="cate.id"
              class="cate-item"
              :class="{ active: activeCateId === cate.id }"
              @click="switchCategory(cate.id)"
          >
            {{ cate.name }}
          </div>
        </div>
        <!-- 右侧科目列表 -->
        <div class="right-account">
          <div
              v-for="acc in currentAccountList"
              :key="acc.id"
              class="acc-item"
              @click="selectAccount(acc)"
          >
            {{ acc.text }}
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'
import axios from 'axios'

const showAccountPicker = ref(false)
const currentEntryIndex = ref(0)
const rawAccountList = ref<any[]>([])
const categoryList = ref<any[]>([])
const currentAccountList = ref<any[]>([])
const activeCateId = ref<number>()

const totalDebit = ref(0)
const totalCredit = ref(0)

// 初始化空白凭证
const initVoucher = () => {
  return {
    voucherNo: 'PZ' + new Date().getTime(),
    voucherDate: getLocalISODate(new Date()),
    description: '',
    status: '草稿',
    ifrsBasis: 'IFRS',
    entries: []
  }
}

// 本地时区日期
const getLocalISODate = (date: Date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
}

const voucher = reactive<Voucher>(initVoucher())
const entries = ref([
  { accountName: '', accountId: null, debit: '', credit: '', remark: '' }
])

interface Voucher {
  voucherNo: string
  voucherDate: string
  description: string
  status: string
  ifrsBasis: string
  entries: any[]
}

// 加载科目
onMounted(() => {
  axios.get('/account/accounts').then(res => {
    rawAccountList.value = res.data.map((item: { code: string; name: string; id: number; type?: string }) => ({
      text: `${item.code} ${item.name}`,
      value: item.id,
      category: item.type
    }))
    splitCategory(rawAccountList.value)
  })
})

// 分类处理
const splitCategory = (list: { category: string }[]) => {
  const cateMap = new Map<string, { id: number; name: string }>()
  list.forEach(item => {
    const cateName = item.category || '其他'
    if (!cateMap.has(cateName)) {
      cateMap.set(cateName, { id: cateMap.size + 1, name: cateName })
    }
  })
  categoryList.value = Array.from(cateMap.values())
  if (categoryList.value.length) {
    activeCateId.value = categoryList.value[0].id
    if (activeCateId.value) switchCategory(activeCateId.value)
  }
}

// 切换分类
const switchCategory = (cateId: number) => {
  activeCateId.value = cateId
  const targetCate = categoryList.value.find(c => c.id === cateId)
  currentAccountList.value = rawAccountList.value.filter(item => item.category === targetCate?.name)
}

// 选择科目
const selectAccount = (acc: any) => {
  const entry = entries.value[currentEntryIndex.value]
  entry.accountName = acc.text
  entry.accountId = acc.value
  showAccountPicker.value = false
}

const openAccountPicker = (index: number) => {
  currentEntryIndex.value = index
  showAccountPicker.value = true
}

const addEntry = () => {
  entries.value.push({
    accountName: '', accountId: null, debit: '', credit: '', remark: ''
  })
}

const removeEntry = (index: number) => {
  if (entries.value.length === 1) {
    showToast('至少保留一笔分录')
    return
  }
  entries.value.splice(index, 1)
  calcTotal()
}

// 精确计算（保留2位小数）
const calcTotal = () => {
  let debit = 0
  let credit = 0
  entries.value.forEach(e => {
    debit += Math.round((parseFloat(e.debit) || 0) * 100)
    credit += Math.round((parseFloat(e.credit) || 0) * 100)
  })
  totalDebit.value = Math.round(debit) / 100
  totalCredit.value = Math.round(credit) / 100
}

// ==============================================
// 保存成功 → 自动新建空白凭证（核心功能）
// ==============================================
const submit = () => {
  calcTotal()
  if (totalDebit.value !== totalCredit.value) {
    showToast('❌ 借贷必须相等！')
    return
  }

  voucher.entries = entries.value.map(e => ({
    account: { id: e.accountId },
    debit: parseFloat(e.debit) || 0,
    credit: parseFloat(e.credit) || 0,
    description: voucher.description
  }))

  axios.post('/voucher/create', voucher).then(() => {
    showToast('✅ 凭证保存成功')

    // 自动新开空白凭证
    Object.assign(voucher, initVoucher())
    entries.value = [{ accountName: '', accountId: null, debit: '', credit: '', remark: '' }]
    calcTotal()

  }).catch(err => {
    showToast('❌ 保存失败')
    console.error(err)
  })
}
</script>

<style scoped>
.page-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  padding-top: 46px;
  box-sizing: border-box;
}

.content {
  padding: 0 12px 20px;
}

.title {
  padding: 10px 2px;
  font-weight: bold;
}

.entry-card {
  background: #f7f8fa;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 10px;
}

.account-popup {
  width: 90%;
  height: 70vh;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.picker-title {
  font-size: 16px;
  font-weight: 500;
}

.split-picker {
  display: flex;
  height: calc(100% - 48px);
}

.left-category {
  width: 35%;
  background: #f5f5f5;
  overflow-y: auto;
}

.cate-item {
  padding: 14px 10px;
  text-align: center;
  font-size: 14px;
}

.cate-item.active {
  background: #fff;
  color: #1989fa;
}

.right-account {
  flex: 1;
  overflow-y: auto;
}

.acc-item {
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;
}
</style>