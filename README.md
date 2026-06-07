# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


## 提交与发布

### 环境

```shell
$$env:PATH+=";"+$env:USERPROFILE+"\AppData\Roaming\JetBrains\IntelliJIdea2026.1\node\versions\24.13.0\"
```

### 新的开发

```shell
$ cd ~\IdeaProjects\ricewines\invest-page ; npm -v; $env:INVEST_VERSION = (Get-Content "./version.txt" -Raw).Trim() ; echo "已设置版本：$env:INVEST_VERSION"
```

```shell
git add . ; git commit -m "#17 增加投资管理" ; git tag -a v$env:INVEST_VERSION -m "发布版本$env:INVEST_VERSION"
```

```shell
git push origin v$env:INVEST_VERSION ; git push origin dev_chixh
```

### 发布

```shell
npm login
```

```shell
cd ./accounting-page ; npm publish
```
```shell
cd ./invest-admin-page ; npm publish
```