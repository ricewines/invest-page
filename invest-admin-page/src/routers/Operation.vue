<template>
  <div class="task-page">
    <van-nav-bar title="任务操作页" left-arrow fixed @click-left="onBack" />
    <div style="padding: 60px 16px 16px">
      <!-- 功能按钮区 -->
      <van-button
          type="primary"
          block
          size="large"
          @click="handleAdd"
          style="margin-bottom: 12px"
      >
        新建任务
      </van-button>

      <van-button
          type="success"
          block
          size="large"
          @click="handleExport"
          style="margin-bottom: 12px"
      >
        导出数据
      </van-button>

      <van-button
          type="warning"
          block
          size="large"
          @click="handleRefresh"
          style="margin-bottom: 12px"
      >
        刷新列表
      </van-button>

      <van-button
          type="danger"
          block
          size="large"
          @click="handleBatch"
          style="margin-bottom: 12px"
      >
        批量删除
      </van-button>

      <!-- 新增：加仓、调仓、投资比例 -->
      <van-button
          type="primary"
          block
          size="large"
          @click="handlePositionAdd"
          style="margin-bottom: 12px;background:#4e83fd"
      >
        加仓
      </van-button>

      <van-button
          type="primary"
          block
          size="large"
          @click="handlePositionAdjust"
          style="margin-bottom: 12px;background:#6777ef"
      >
        调仓
      </van-button>

      <van-button
          type="primary"
          block
          size="large"
          @click="getInvestRatio"
          style="margin-bottom: 12px;background:#00b42a"
      >
        投资比例
      </van-button>

      <!-- 任务列表 -->
      <van-cell-group inset style="margin-top: 20px">
        <van-cell
            v-for="item in taskList"
            :key="item.id"
            :title="item.name"
            :value="item.status"
        >
          <template #right-icon>
            <van-button
                size="mini"
                type="primary"
                @click="handleEdit(item)"
            >
              编辑
            </van-button>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import {
  NavBar as VanNavBar,
  Button as VanButton,
  CellGroup as VanCellGroup,
  Cell as VanCell
} from 'vant'

const router = useRouter()
const onBack = () => router.back()

// 任务列表
const taskList = ref([
  { id: 1, name: '后台接口开发', status: '进行中' },
  { id: 2, name: '权限模块重构', status: '待处理' },
  { id: 3, name: '页面适配优化', status: '已完成' },
])

// 基础功能
const handleAdd = () => showToast('新建任务')
const handleExport = () => showToast('导出成功')
const handleRefresh = () => showToast('刷新成功')
const handleBatch = () => showToast('批量删除')
const handleEdit = (item: { name: string }) => showToast('编辑：' + item.name)

// ==================== 新增接口功能 ====================
// 接口基础路径
const BASE_URL = '/invest/macro/api'

// 1. 加仓
const handlePositionAdd = () => {
  getInvestRatioData('add')
}

// 2. 调仓
const handlePositionAdjust = () => {
  getInvestRatioData('adjust')
}

// 3. 投资比例（直接查询）
const getInvestRatio = () => {
  getInvestRatioData('ratio')
}

/**
 * 统一 GET 请求接口
 * @param type 操作类型 add/adjust/ratio
 */
const getInvestRatioData = async (type: string) => {
  try {
    const res = await fetch(`${BASE_URL}/invest-ratio/position-add-and-adjust?type=${type}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json()
    console.log('接口返回：', data)
    showToast(`操作成功：${type}`)
  } catch (err) {
    console.error('接口请求失败：', err)
    showToast('请求失败')
  }
}
</script>