<script setup lang="ts">
import {ref} from 'vue'
import {Tabbar as VanTabbar, TabbarItem as VanTabbarItem} from 'vant'
import {RouterView} from "vue-router";

const active = ref(0)
</script>

<template>
    <router-view />

    <div>
        <van-tabbar v-model="active" route placeholder>
            <van-tabbar-item icon="balance" to="/balance-sheet">资产负债表</van-tabbar-item>
            <van-tabbar-item icon="orders" to="/voucher">凭证记账</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<style>
</style>