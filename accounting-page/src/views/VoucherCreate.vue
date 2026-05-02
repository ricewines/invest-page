<template>
  <div class="page">
    <van-nav-bar title="凭证记账" fixed />

    <van-form class="form" @submit="submit">
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
        class="entry-group"
      >
        <van-cell-group :border="false">
          <van-field
            :model-value="entry.accountName"
            label="科目"
            placeholder="点击选择科目"
            is-link
            @click="openAccountPicker(index)"
          />
          <van-field
            v-model="entry.debit"
            label="借方金额"
            type="digit"
            @change="calcTotal"
          />
          <van-field
            v-model="entry.credit"
            label="贷方金额"
            type="digit"
            @change="calcTotal"
          />
        </van-cell-group>

        <div style="text-align: right; padding: 0 10px">
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
        style="margin: 10px 0"
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
        style="margin-top: 20px"
      >
        保存凭证（借贷必须相等）
      </van-button>
    </van-form>

    <van-popup v-model:show="showAccountPicker" position="bottom" :style="{ height: '40%' }">
      <van-picker
        :columns="accountList"
        @confirm="onSelectAccount"
        title="选择科目"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'
import axios from 'axios'

const showAccountPicker = ref(false)
const accountList = ref([])
const currentEntryIndex = ref(0)

const voucher = reactive({
  voucherNo: 'PZ' + new Date().getTime(),
  voucherDate: new Date().toISOString().slice(0, 10),
  description: '',
  status: '草稿',
  ifrsBasis: 'IFRS',
})

const entries = ref([
  { accountName: '', accountId: null, debit: 0, credit: 0, remark: '' }
])

const totalDebit = ref(0)
const totalCredit = ref(0)

onMounted(() => {
  axios.get('/account/accounts').then(res => {
    accountList.value = res.data.map(item => ({
      text: `${item.code} ${item.name}`,
      value: item.id
    }))
  })
})

const openAccountPicker = (index) => {
  currentEntryIndex.value = index
  showAccountPicker.value = true
}

const onSelectAccount = ({ selectedOptions }) => {
  const entry = entries.value[currentEntryIndex.value]
  entry.accountName = selectedOptions[0].text
  entry.accountId = selectedOptions[0].value
  showAccountPicker.value = false
}

const addEntry = () => {
  entries.value.push({
    accountName: '', accountId: null, debit: 0, credit: 0, remark: ''
  })
}

const removeEntry = (index) => {
  if (entries.value.length === 1) {
    showToast('至少保留一笔分录')
    return
  }
  entries.value.splice(index, 1)
  calcTotal()
}

const calcTotal = () => {
  let debit = 0
  let credit = 0
  entries.value.forEach(e => {
    debit += Number(e.debit || 0)
    credit += Number(e.credit || 0)
  })
  totalDebit.value = debit
  totalCredit.value = credit
}

const submit = () => {
  calcTotal()
  if (totalDebit.value !== totalCredit.value) {
    showToast('❌ 借贷必须相等！')
    return
  }

  voucher.entries = entries.value.map(e => ({
    account: { id: e.accountId },
    debit: e.debit,
    credit: e.credit,
    description: voucher.description
  }))

  axios.post('/voucher/create', voucher).then(() => {
    showToast('✅ 凭证保存成功')
  }).catch(err => {
    showToast('❌ 保存失败')
    console.error(err)
  })
}
</script>

<style scoped>
.page {
  padding: 46px 10px 80px; /* 修复被底部导航遮挡 */
}
.title {
  padding: 10px;
  font-weight: bold;
  color: #323233;
}
.form {
  margin-top: 10px;
}
.entry-group {
  background: #f7f8fa;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>