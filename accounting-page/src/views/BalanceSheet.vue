<template>
  <div class="page">
    <van-nav-bar title="资产负债表" fixed />

    <van-cell-group>
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
    </van-cell-group>

    <van-button
      type="primary"
      block
      @click="loadData"
      style="margin: 15px"
    >
      查询报表
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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

const startDate = ref('2025-01-01')
const endDate = ref('2025-12-31')

const assets = ref([])
const liabilities = ref([])
const equity = ref([])

const loadData = () => {
  axios.get('/balance-sheet', {
    params: { startDate: startDate.value, endDate: endDate.value }
  }).then(res => {
    assets.value = res.data.assets
    liabilities.value = res.data.liabilities
    equity.value = res.data.equity
  })
}
</script>

<style scoped>
.page { padding: 46px 0 0; }
</style>