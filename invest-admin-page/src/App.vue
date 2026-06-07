<template>
  <div>
    <!-- 页面内容 -->
    <router-view/>

    <!-- 底部导航（Vant） -->
    <van-tabbar v-model="active" route fixed>
      <van-tabbar-item to="/operation" icon="orders-o">操作</van-tabbar-item>
      <van-tabbar-item to="/config" icon="setting-o">配置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {   Tabbar as VanTabbar,TabbarItem as VanTabbarItem} from 'vant'
import {RouterView} from "vue-router";

const active = ref(0)
</script>

<style>
</style>