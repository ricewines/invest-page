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

      <van-cell-group inset style="margin-top: 16px" id="unsubscribe-section">
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
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {
  Button as VanButton,
  NavBar as VanNavBar,
  CellGroup as VanCellGroup,
  Cell as VanCell,
  Field as VanField,
  showToast
} from 'vant'

const router = useRouter()
const route = useRoute()
const onBack = () => router.back()

const config = ref({
  systemName: '投资系统',
})

const subscribeForm = ref({
  email: '',
})

const unsubscribeForm = ref({
  email: '',
  token: '',
})

onMounted(() => {
  const token = route.query.token
  if (typeof token === 'string' && token.trim()) {
    unsubscribeForm.value.token = token.trim()
  }
  unSubscribeTokenToEmail();


  if (typeof token === 'string' && token.trim()) {
    const el = document.getElementById('unsubscribe-section')
    el?.scrollIntoView({behavior: 'smooth', block: 'start'})
  }
})

const unSubscribeTokenToEmail = () => {
  if (!unsubscribeForm.value.token) {
    return Promise.resolve();
  }
  const url = `/invest/macro/api/subscribe/un-subscribe-token-to-email?token=${unsubscribeForm.value.token}`
  const res = fetch(url, {
    method: 'GET'
  })
  return res.then(response => {
    if (!response.ok) {
      throw new Error('获取邮箱失败')
    }
    return response.text().then(data => {
      unsubscribeForm.value.email = data;
    })
  });
}

const saveConfig = () => {
  showToast('保存成功 ✅')
}

const resetConfig = () => {
  config.value = {
    systemName: '投资系统',
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

const unsubscribeEmail = async () => {
  if (!unsubscribeForm.value.email.trim()) {
    showToast('请输入邮箱')
    return
  }

  const token = unsubscribeForm.value.token.trim()
  if (!token) {
    showToast('请输入取消订阅令牌')
    return
  }

  try {
    const params = new URLSearchParams()
    params.append('token', token)

    const res = await fetch('/invest/macro/api/subscribe/unsubscribe/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: params.toString(),
    })

    const text = await res.text()
    if (!res.ok) {
      throw new Error(text || '取消订阅失败')
    }

    showToast(text || '已取消订阅')
    unsubscribeForm.value.token = ''
  } catch (error: any) {
    console.error('取消订阅失败:', error)
    showToast(error?.message || '取消订阅失败')
  }
}
</script>