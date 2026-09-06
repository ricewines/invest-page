# invest-page 前端操作手册（Windows PowerShell）

## 1 配置 Node.js 环境变量（IDE内置Node）

```shell
edit D:\Users\CXH\data\secret\.env.secret.txt
```

```shell
Get-Content D:\Users\CXH\data\secret\.env.secret.txt | ForEach-Object {$l=$_.Trim();if($l -and !$l.StartsWith("#")){$i=$l.IndexOf('=');$k=$l.Substring(0,$i).Trim();$v=$l.Substring($i+1).Trim();[Environment]::SetEnvironmentVariable($k,$v,"Process")}} ; 
echo "QAZCXH_163_COM_MAIL_PASSWORD=$env:QAZCXH_163_COM_MAIL_PASSWORD";
echo "ZHI_PU_AI_API_KEY=$env:ZHI_PU_AI_API_KEY";

; $env:PATH+=";"+$env:USERPROFILE+"\AppData\Roaming\JetBrains\IntelliJIdea2026.2\node\versions\24.18.1\" ;
# 校验npm版本
npm -v;
echo "INVEST_VERSION=$env:INVEST_VERSION";
```

```shell
cd ~/IdeaProjects/ricewines/invest-page
```

```shell
cd accounting-page ;
# 读取 package.json
;$pkg = Get-Content ./package.json -Raw | ConvertFrom-Json;

;$pkgVersion = $pkg.version;
;$envVersion = $env:INVEST_VERSION;

Write-Host "package.json version: $pkgVersion";
Write-Host "INVEST_VERSION env:   $envVersion";

if ($pkgVersion -eq $envVersion) {
    Write-Host "✅ 版本校验通过，二者相等";
} else {
    Write-Error "❌ 版本不匹配！package.json:$pkgVersion , INVEST_VERSION:$envVersion";
};
cd ..;
```

```shell
cd invest-admin-page ;
# 读取 package.json
;$pkg = Get-Content ./package.json -Raw | ConvertFrom-Json;

;$pkgVersion = $pkg.version;
;$envVersion = $env:INVEST_VERSION;

Write-Host "package.json version: $pkgVersion";
Write-Host "INVEST_VERSION env:   $envVersion";

if ($pkgVersion -eq $envVersion) {
    Write-Host "✅ 版本校验通过，二者相等"
} else {
    Write-Error "❌ 版本不匹配！package.json:$pkgVersion , INVEST_VERSION:$envVersion"
};
cd ..;
```

```shell
cd accounting-page ; npm run build ; cd ..;
cd invest-admin-page ; npm run build ; cd ..;
```

## 3 Git 提交代码 + 打版本标签

```shell
git add . ; git commit -m "做邮箱订阅功能 #29" ; 
# 拉取主线代码变基
git pull origin main --rebase ;
git tag -a v$env:INVEST_VERSION -m "发布版本$env:INVEST_VERSION" ;
git push origin v$env:INVEST_VERSION ; git push origin dev_chixh ;
```

## 5 NPM 包发布流程

### 5.1 登录 NPM 仓库

```shell
npm login
```

### 5.2 发布 accounting-page 模块

```shell
cd ./accounting-page ; npm publish; cd ..;
```

### 5.3 发布 invest-admin-page 模块

```shell
cd ./invest-admin-page ; npm publish; cd ..;
```