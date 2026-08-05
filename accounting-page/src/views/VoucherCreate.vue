<template>
  <van-sticky>
    <van-nav-bar title="凭证记账" />
  </van-sticky>

    <van-form @submit="submit">
      <van-index-bar :index-list="list.indexList" :sticky-offset-top="stickyOffsetTop">
          <van-index-anchor index="1">凭证基本信息</van-index-anchor>

          <van-field v-model="voucher.voucherNo" label="凭证号" placeholder="自动生成" readonly />
          <van-field v-model="voucher.voucherDate" label="日期" type="date" value-format="YYYY-MM-DD" />
          <van-field v-model="voucher.description" label="摘要" placeholder="输入备注" />

          <van-index-anchor index="2">凭证明细（可添加多笔）</van-index-anchor>
            <div v-for="(entry, index) in entries" :key="index" class="entry-card">
            <van-cell-group :border="false">
              <van-field :model-value="entry.accountName" label="科目" placeholder="点击选择科目" is-link
                @click="openAccountPicker(index)" />
              <van-field v-model="entry.debit" label="借方金额" type="number" @change="calcTotal" />
              <van-field v-model="entry.credit" label="贷方金额" type="number" @change="calcTotal" />
            </van-cell-group>
            <van-row justify="end">
              <van-col span="6">
                <van-button size="small" type="danger" plain @click="removeEntry(index)">
                  删除此行
                </van-button>
              </van-col>
            </van-row>
          </div>

          <van-button type="primary" plain block @click="addEntry" style="margin: 12px 0">
            + 添加一笔分录
          </van-button>
          <van-index-anchor index="3">凭证统计</van-index-anchor>
          <van-cell-group style="margin-bottom: 12px">
            <van-cell title="借方合计" :value="totalDebit" />
            <van-cell title="贷方合计" :value="totalCredit" />
          </van-cell-group>

          <van-button type="primary" block native-type="submit" style="margin: 0 0 12px">保存凭证（借贷必须相等）</van-button>
      </van-index-bar>

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
        <div v-for="cate in categoryList" :key="cate.id" class="cate-item" :class="{ active: activeCateId === cate.id }"
          @click="switchCategory(cate.id)">
          {{ cate.name }}
        </div>
      </div>
      <!-- 右侧科目列表 -->
      <div class="right-account">
        <van-field v-model="accountSearch" placeholder="搜索科目/编码" clearable style="margin:8px 12px;" />
        <div v-for="acc in filteredAccountList" :key="acc.value" class="acc-item" @click="selectAccount(acc)">
          {{ acc.text }}
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { showToast } from 'vant'
import axios from 'axios'

const stickyOffsetTop = Number.parseFloat(
  getComputedStyle(document.documentElement).getPropertyValue('--van-tabbar-height')
) || 0

const showAccountPicker = ref(false)
const currentEntryIndex = ref(0)
const rawAccountList = ref<any[]>([])
const categoryList = ref<any[]>([])
const currentAccountList = ref<any[]>([])
const activeCateId = ref<number>()
const accountSearch = ref('')

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
    entries: [],
  }
}

// 本地时区日期
const getLocalISODate = (date: Date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
}

const list = reactive<{
  indexList: number[];
}>({
  indexList: [1, 2, 3]
})

const voucher = reactive<Voucher>(initVoucher())
const entries = ref([
  { accountName: '', accountId: null, debit: '', credit: '', remark: '' },
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

// 根据搜索词计算显示的科目列表：
// - 若有搜索词，则在全部科目中全局匹配（code+name）
// - 否则显示当前分类的科目
const filteredAccountList = computed(() => {
  const q = accountSearch.value.trim().toLowerCase()
  if (!q) return currentAccountList.value
  return rawAccountList.value.filter(item => item.text.toLowerCase().includes(q))
})

// 选择科目
const selectAccount = (acc: any) => {
  const idx = currentEntryIndex.value
  const entry = entries.value[idx]
  entry.accountName = acc.text
  entry.accountId = acc.value
  showAccountPicker.value = false

  // 自动平衡逻辑（仅在两笔分录时启用）：
  // 当一方已有借/贷金额且另一方金额为空时，选完科目后自动把数值填到对方相反栏位
  if (entries.value.length === 2) {
    const otherIdx = idx === 0 ? 1 : 0
    const other = entries.value[otherIdx]

    // 优先使用已有的对方金额去填当前项的相反栏位
    if (other.debit !== '' && (entry.credit === '' || entry.credit == null)) {
      entry.credit = other.debit
      calcTotal()
      return
    }
    if (other.credit !== '' && (entry.debit === '' || entry.debit == null)) {
      entry.debit = other.credit
      calcTotal()
      return
    }

    // 否则如果当前项已有金额，则填充另一项的相反栏位
    if (entry.debit !== '' && (other.credit === '' || other.credit == null)) {
      other.credit = entry.debit
      calcTotal()
      return
    }
    if (entry.credit !== '' && (other.debit === '' || other.debit == null)) {
      other.debit = entry.credit
      calcTotal()
      return
    }
  }
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

    // 自动新开空白凭证（两笔起步）
    Object.assign(voucher, initVoucher())
    entries.value = [
      { accountName: '', accountId: null, debit: '', credit: '', remark: '' },
      { accountName: '', accountId: null, debit: '', credit: '', remark: '' }
    ]
    calcTotal()

  }).catch(err => {
    showToast('❌ 保存失败')
    console.error(err)
  })
}
</script>

<style scoped>


.title {
  padding: 10px 10px;
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