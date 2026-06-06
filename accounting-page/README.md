# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3
`<script setup>` SFCs, check out
the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in
the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Run

### 环境

```shell
$$env:PATH+=";"+$env:USERPROFILE+"\AppData\Roaming\JetBrains\IntelliJIdea2026.1\node\versions\24.13.0\"
```

### 新的开发

```shell
cd ~\IdeaProjects\ricewines\invest-page\accounting-page
```

```shell
$$env:INVEST_VERSION = (Get-Content "./version.txt" -Raw).Trim()
```

```shell
echo "已设置版本：$env:INVEST_VERSION"
echo "已设置版本：$env:PATH"
```

```shell
git add .
```

```shell
git commit -m "#16 升级"
```

```shell
git tag -a v$env:INVEST_VERSION -m "发布版本$env:INVEST_VERSION"
```

```shell
git push origin v$env:INVEST_VERSION
```

```shell
git push origin dev_chixh
```

### 发布

```shell
npm login
```

```shell
npm publish
```

## TODO

- [X] 统计周期：本月首日—今日，报表类型选择资产负债表
- [X] 科目选择框设置为全屏/最大化
- [X] 凭证保存成功后，自动新建空白凭证窗口
- [ ] 科目选择框新增搜索功能（暂时搁置）
- [X] 金额支持小数点，计算精度保留到分
- [ ] 输入框点击后，无需聚焦。