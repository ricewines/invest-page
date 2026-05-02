<script setup lang="ts">
import { ref } from 'vue'

const active = ref("voucher")
</script>

<template>
  <router-view />
  <van-tabbar v-model="active">
    <van-tabbar-item icon="orders" to="/voucher" name="voucher">凭证记账</van-tabbar-item>
    <van-tabbar-item icon="balance" to="/balance-sheet" name="balance-sheet">资产负债表</van-tabbar-item>
  </van-tabbar>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>