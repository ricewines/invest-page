# invest-page 前端项目

## 技术栈

Vue 3 + TypeScript + Vite

## 技术说明

1. 项目统一采用 Vue3 `<script setup>`
   单文件组件语法，参考官方文档：[script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup)
2. TS 工程化配置、IDE 推荐配置可查阅 Vue 官方 TS
   指南：[Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup)

## 项目模块说明

1. accounting-page：账务页面子模块
2. invest-admin-page：投资管理后台页面子模块

## 发布规范

1. 版本统一读取根目录 `version.txt` 文件，全页面共用同一版本号 `INVEST_VERSION`
2. 代码提交、版本标签、npm 包发布统一流程，操作步骤详见 HELP.md
3. 发布前需完成 npm 仓库登录授权，分模块依次执行 publish 发布

## 开发环境依赖

Node.js 24.13.0（IDE内置Node版本）