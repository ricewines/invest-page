<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
</script>

<template>
  <router-view />
  <van-tabbar v-model="active" fixed>
    <van-tabbar-item icon="balance" to="/balance-sheet" >资产负债表</van-tabbar-item>
    <van-tabbar-item icon="orders" to="/voucher" >凭证记账</van-tabbar-item>
  </van-tabbar>
</template>

<style>
</style>