# invest-page

## Run

### 环境

```shell
$$env:PATH+=";"+$env:USERPROFILE+"\AppData\Roaming\JetBrains\IntelliJIdea2026.1\node\versions\24.13.0\"
```

### 新的开发
```shell
cd ~\IdeaProjects\ricewines\invest-page\
```
```shell
$$env:INVEST_VERSION = (Get-Content "./version.txt" -Raw).Trim()
```

```shell
echo "已设置版本：$env:INVEST_VERSION"
```

```shell
git add .
```

```shell
git commit -m "#15 处理：统计周期：本月首日—今日，报表类型选择资产负债表；科目选择框设置为全屏/最大化；凭证保存成功后，自动新建空白凭证窗口；金额支持小数点，计算精度保留到分"
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