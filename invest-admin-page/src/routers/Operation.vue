<template>
  <div class="task-page">
    <van-nav-bar title="投资比例" left-arrow fixed @click-left="onBack" />
    <div style="padding: 60px 16px 16px">
      <van-button
          type="primary"
          block
          size="large"
          @click="getInvestRatio"
          style="margin-bottom: 12px;background:#00b42a"
      >
        投资比例
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import {
  NavBar as VanNavBar,
  Button as VanButton
} from 'vant'

const router = useRouter()
const onBack = () => router.back()

const BASE_URL = '/invest/macro/api'

const getInvestRatio = async () => {
  try {
    const res = await fetch(`${BASE_URL}/invest-ratio/position-add-and-adjust?type=ratio`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json()
    console.log('接口返回：', data)
    showToast('查询成功')
  } catch (err) {
    console.error('接口请求失败：', err)
    showToast('请求失败')
  }
}
</script>