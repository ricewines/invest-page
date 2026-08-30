<template>
  <div class="config-page">
    <van-nav-bar title="系统配置" left-arrow fixed @click-left="onBack"/>

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
            <van-switch v-model="config.autoRefresh"/>
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
            <van-switch v-model="config.taskAlert"/>
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

      <van-cell-group inset style="margin-top: 16px">
        <van-cell title="邮件订阅管理" :label="'投资比例推送邮件'"/>

        <van-field
            v-model="subscribeForm.email"
            label="邮箱"
            type="email"
            placeholder="请输入邮箱"
        />

        <div style="padding: 0 16px 12px">
          <van-button type="primary" block @click="subscribeEmail">
            订阅
          </van-button>
        </div>
      </van-cell-group>

      <van-cell-group inset style="margin-top: 16px">
        <van-cell title="取消订阅" :label="'按邮箱取消邮件推送'"/>

        <van-field
            v-model="unsubscribeForm.email"
            label="邮箱"
            type="email"
            placeholder="请输入邮箱"
        />

        <van-field
            v-model="unsubscribeForm.token"
            label="令牌"
            placeholder="可选：填写取消订阅令牌"
        />

        <div style="padding: 0 16px 12px">
          <van-button plain block @click="unsubscribeEmail">
            取消订阅
          </van-button>
        </div>
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
import {ref} from 'vue'
import {useRouter} from 'vue-router'
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

const subscribeForm = ref({
  email: '',
})

const unsubscribeForm = ref({
  email: '',
  token: '',
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

const subscribeEmail = async () => {
  const email = subscribeForm.value.email.trim()
  if (!email) {
    showToast('请输入邮箱')
    return
  }

  try {
    const params = new URLSearchParams()
    params.append('email', email)

    const res = await fetch('/invest/macro/api/subscribe/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: params.toString(),
    })

    const text = await res.text()
    if (!res.ok) {
      let e: Error = new Error(text || '订阅失败')
      throw e;
    }

    showToast(text || '订阅成功 ✅')
    subscribeForm.value.email = ''
  } catch (error: any) {
    console.error('订阅失败:', error)
    showToast(error?.message || '订阅失败')
  }
}

const unsubscribeEmail = () => {
  if (!unsubscribeForm.value.email.trim()) {
    showToast('请输入邮箱')
    return
  }

  showToast('已取消订阅')
}
</script>