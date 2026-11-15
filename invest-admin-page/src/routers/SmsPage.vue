<template>
  <div class="sms-container">
    <!-- 顶部操作栏：筛选输入框、刷新按钮、消息铃铛红点 -->
    <div class="header">
      <!-- 按发送号码筛选，回车触发查询 -->
      <van-field
          v-model="filterSender"
          placeholder="按发送号码筛选"
          clearable
          @keyup.enter="loadList"
          style="width: 300px"
      />
      <van-button type="primary" @click="loadList">刷新</van-button>
      <!-- 消息铃铛，点击滚动到列表顶部 -->
      <div class="bell-wrap" @click="scrollToTop">
        <van-icon name="bell" size="24"/>
        <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
      </div>
    </div>

    <!-- 短信列表 -->
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
      <van-cell
          v-for="item in tableData"
          :key="item.id"
          :class="{ unread: item.isRead === 0 }"
          @click="openDetail(item)"
      >
        <template #title>
          <span>发送：{{ item.sender }}</span>
          <span class="receiver">接收：{{ item.receiver }}</span>
        </template>
        <template #label>
          <div class="content-line">{{ item.content.slice(0, 60) }}...</div>
          <div class="time-line">{{ item.receiveTime }}</div>
        </template>
      </van-cell>
    </van-list>

    <!-- 短信详情弹窗 -->
    <van-popup
        v-model:show="detailVisible"
        position="bottom"
        round
        :style="{ height: '60%' }"
    >
      <div class="popup-content">
        <div class="popup-title">短信详情</div>
        <div class="row">
          <span class="label">发送号码：</span>
          <span>{{ currentRow.sender }}</span>
        </div>
        <div class="row">
          <span class="label">接收号码：</span>
          <span>{{ currentRow.receiver }}</span>
        </div>
        <div class="row">
          <span class="label">接收时间：</span>
          <span>{{ currentRow.receiveTime }}</span>
        </div>
        <div class="row">
          <span class="label">短信内容：</span>
        </div>
        <van-field
            v-model="currentRow.content"
            type="textarea"
            readonly
            rows="6"
        />
        <van-button block type="primary" class="close-btn" @click="detailVisible = false">关闭</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'
import {
  Button as VanButton,
  Cell as VanCell,
  Field as VanField,
  Icon as VanIcon,
  List as VanList,
  Popup as VanPopup
} from 'vant'
// 筛选条件：发送号码
const filterSender = ref('')
// 表格数据列表
const tableData = ref([])
// 分页参数
const pageNum = ref(1)
const pageSize = ref(20)
const total = ref(0)
// 未读消息数量，用于铃铛红点
const unreadCount = ref(0)
// 详情弹窗控制
const detailVisible = ref(false)
// 当前打开详情的短信记录
const currentRow = ref({})
// SSE 实例
let sse = null

// van-list 上拉加载状态
const loading = ref(false)
const finished = ref(false)

const BASE_URL = '/invest/macro/api'

/**
 * 封装GET请求，使用原生fetch
 * @param {string} url 请求地址
 * @param {Record<string, any>} params 查询参数
 * @returns {Promise<any>}
 */
async function fetchGet(url:string, params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      searchParams.append(k, v)
    }
  })
  const queryStr = searchParams.toString()
  const fullUrl = queryStr ? `${url}?${queryStr}` : url

  const res = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!res.ok) {
    throw new Error(`HTTP error, status: ${res.status}`)
  }
  return res.json()
}

/**
 * 封装POST请求，使用原生fetch
 * @param {string} url 请求地址
 * @param {any} body 提交数据
 * @returns {Promise<any>}
 */
async function fetchPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) {
    throw new Error(`HTTP error, status: ${res.status}`)
  }
  // 后端部分接口返回void无body，兼容处理
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

/**
 * 加载短信列表数据
 * 适配后端接口：GET /sys/sms/list
 */
async function loadList() {
  pageNum.value = 1
  finished.value = false
  const data = await fetchGet(`${BASE_URL}/sys/sms/list`, {
    sender: filterSender.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value
  })
  tableData.value = data.list
  total.value = data.total
  await getUnread()
}

/**
 * VanList 上拉加载更多
 */
async function onLoad() {
  loading.value = true
  try {
    const data = await fetchGet(`${BASE_URL}/sys/sms/list`, {
      sender: filterSender.value,
      pageNum: pageNum.value + 1,
      pageSize: pageSize.value
    })
    pageNum.value++
    tableData.value.push(...data.list)
    // 判断是否已经加载完所有数据
    if (tableData.value.length >= data.total) {
      finished.value = true
    }
  } finally {
    loading.value = false
  }
}

/**
 * 获取未读短信数量
 * 接口：GET /sys/sms/unread-count
 */
async function getUnread() {
  unreadCount.value = await fetchGet(`${BASE_URL}/sys/sms/unread-count`)
}

/**
 * 打开短信详情弹窗 + 如果是未读，自动调用标记已读接口
 * @param {Object} row 短信记录VO
 */
async function openDetail(row) {
  currentRow.value = {...row}
  detailVisible.value = true
  // 未读状态，调用后端标记已读
  if (row.isRead === 0) {
    await fetchPost(`${BASE_URL}/sys/sms/read?id=${row.id}`, {})
    // 本地状态同步更新
    row.isRead = 1
    await getUnread()
  }
}

/**
 * SSE 订阅新消息推送
 * 接口：GET /sys/sms/subscribe
 * 监听 new-sms 事件，收到新短信自动刷新列表
 */
function connectSSE() {
  const clientId = 'client_' + Date.now()
  sse = new EventSource(`${BASE_URL}/sys/sms/subscribe?clientId=${clientId}`)
  sse.addEventListener('new-sms', async () => {
    // 收到新短信，重新加载列表与未读计数
    await loadList()
    // 浏览器桌面通知，需要用户授权
    if (Notification.permission === 'granted') {
      new Notification('收到新短信')
    }
  })
  // SSE 异常断开，3秒后自动重连
  sse.onerror = () => {
    sse.close()
    setTimeout(connectSSE, 3000)
  }
}

/**
 * 铃铛点击：滚动到列表顶部
 */
function scrollToTop() {
  window.scrollTo({top: 0, behavior: 'smooth'})
}

// 组件挂载：初始化列表、申请通知权限、建立SSE长连接
onMounted(() => {
  loadList()
  if (Notification.permission !== 'granted') {
    Notification.requestPermission()
  }
  connectSSE()
})

// 组件销毁：关闭SSE连接，释放资源
onUnmounted(() => {
  sse?.close()
})
</script>

<style scoped>
.sms-container {
  padding: 16px;
  background-color: #f7f8fa;
  min-height: 100vh;
}

.header {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.bell-wrap {
  position: relative;
  cursor: pointer;
  margin-left: auto;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ee0a24;
  color: #fff;
  border-radius: 50%;
  font-size: 10px;
  padding: 1px 6px;
}

.unread {
  font-weight: bold;
}

.receiver {
  margin-left: 12px;
  color: #666;
  font-size: 12px;
}

.content-line {
  color: #333;
  margin: 4px 0;
}

.time-line {
  font-size: 12px;
  color: #999;
}

.popup-content {
  padding: 20px;
}

.popup-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
}

.row {
  margin-bottom: 10px;
}

.label {
  color: #666;
}

.close-btn {
  margin-top: 20px;
}
</style>
