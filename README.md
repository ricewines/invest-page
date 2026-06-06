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