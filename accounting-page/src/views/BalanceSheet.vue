<template>
  <div>
    <van-nav-bar title="资产负债" fixed/>
    <van-nav-bar title="资产负债" />

    <van-field
        v-model="startDate"
        label="开始日期"
        type="date"
        value-format="YYYY-MM-DD"
    />
    <van-field
        v-model="endDate"
        label="结束日期"
        type="date"
        value-format="YYYY-MM-DD"
    />

    <van-button
        type="primary"
        block
        @click="loadData">查询报表
    </van-button>

    <van-cell-group title="资产">
      <van-cell
          v-for="item in assets"
          :key="item.code"
          :title="item.name"
          :value="item.balance"
      />
    </van-cell-group>

    <van-cell-group title="负债">
      <van-cell
          v-for="item in liabilities"
          :key="item.code"
          :title="item.name"
          :value="item.balance"
      />
    </van-cell-group>

    <van-cell-group title="权益">
      <van-cell
          v-for="item in equity"
          :key="item.code"
          :title="item.name"
          :value="item.balance"
      />
    </van-cell-group>
    -->
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import axios from 'axios'

// 自动获取：本月首日
const getMonthFirstDay = () => {
  // 传入 Date，返回【当前系统时区】的 toISOString 格式日期（YYYY-MM-DD）
  let now =new Date()
  let date =new Date(now.getFullYear(), now.getMonth() ,1)
  return  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString().split('T')[0];
}

// 自动获取：今日
const getToday = () => {
  return new Date().toISOString().slice(0, 10)
}

// 默认值：本月首日 — 今日
const startDate = ref(getMonthFirstDay())
const endDate = ref(getToday())

const assets = ref<Array<{ code: string; name: string; balance: number }>>([])
const liabilities = ref<Array<{ code: string; name: string; balance: number }>>([])
const equity = ref<Array<{ code: string; name: string; balance: number }>>([])

const loadData = () => {
  axios.get('/balance-sheet', {
    params: {startDate: startDate.value, endDate: endDate.value}
  }).then(res => {
    assets.value = res.data.assets
    liabilities.value = res.data.liabilities
    equity.value = res.data.equity
  })
}

// 进入页面自动加载一次
onMounted(() => {
  loadData()
})
</script>


<style scoped>
</style>