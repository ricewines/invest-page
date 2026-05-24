<script setup lang="ts">
import { ref } from 'vue'
/// 获取页面路径
console.log(""+location.pathname)
let pathname = ref(location.pathname)
const active = ref(pathname.value)
</script>

<template>
  <router-view />
  <van-tabbar v-model="active" fixed>
    <van-tabbar-item icon="balance" to="/balance-sheet" name="/balance-sheet">资产负债表</van-tabbar-item>
    <van-tabbar-item icon="orders" to="/voucher" name="/voucher">凭证记账</van-tabbar-item>
  </van-tabbar>
</template>

<style>
</style>