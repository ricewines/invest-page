<template>
  <div class="config-page">
    <van-nav-bar title="系统配置" left-arrow fixed @click-left="onBack" />

    <div style="padding: 60px 16px 16px">
      <van-cell-group inset>
        <van-field
            v-model="config.systemName"
            label="系统名称"
            placeholder="请输入"
        />

        <!-- 开关 替换 SwitchCell -->
        <van-cell title="自动刷新任务" center>
          <template #right-icon>
            <van-switch v-model="config.autoRefresh" />
          </template>
        </van-cell>

        <van-field
            v-model="config.pageSize"
            label="每页条数"
            placeholder="20"
        />

        <!-- 开关 替换 SwitchCell -->
        <van-cell title="任务提醒" center>
          <template #right-icon>
            <van-switch v-model="config.taskAlert" />
          </template>
        </van-cell>

        <van-field
            v-model="config.timeout"
            label="超时时间(ms)"
            placeholder="5000"
        />

        <van-radio-group v-model="config.theme" direction="horizontal">
          <van-cell title="主题模式">
            <template #right-icon>
              <van-radio name="light">浅色</van-radio>
              <van-radio name="dark">深色</van-radio>
            </template>
          </van-cell>
        </van-radio-group>
      </van-cell-group>

      <div style="margin-top: 20px; display: flex; gap: 12px">
        <van-button type="primary" block @click="saveConfig">
          保存配置
        </van-button>
        <van-button block @click="resetConfig">
          重置
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Button as VanButton,
  NavBar as VanNavBar,
  CellGroup as VanCellGroup,
  Cell as VanCell,
  Field as VanField,
  Switch as VanSwitch,
  RadioGroup as VanRadioGroup,
  Radio as VanRadio,
  showToast
} from 'vant'

const router = useRouter()
const onBack = () => router.back()

const config = ref({
  systemName: '任务管理系统',
  autoRefresh: true,
  pageSize: '20',
  taskAlert: true,
  timeout: '5000',
  theme: 'light',
})

const saveConfig = () => {
  showToast('保存成功 ✅')
}

const resetConfig = () => {
  config.value = {
    systemName: '任务管理系统',
    autoRefresh: true,
    pageSize: '20',
    taskAlert: true,
    timeout: '5000',
    theme: 'light',
  }
  showToast('已重置')
}
</script>