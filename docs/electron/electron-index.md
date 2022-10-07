---
title: electron初始化
date: 2022-10-07
sidebar: 'auto'
tags:
 - 笔记
 - electron
categories:
 - electron
---



## 初始化Electron
[electron官网](https://www.electronjs.org/)

创建一个vite项目

```zsh
npm init vite@latest
```

安装electron

```zsh
npm i electron vite-plugin-electron  -D
```

根目录新建 electron / index.ts

修改vite.config.ts 配置文件

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), electron({
    main: {
      entry: "electron/index.ts"
    }
  })]
})
```

编写代码 electron / index.ts

```typescript
import { app, BrowserWindow } from 'electron'
import path from 'path'
//app 控制应用程序的事件生命周期。
//BrowserWindow 创建并控制浏览器窗口。

let win: BrowserWindow | null;
//定义全局变量获取 窗口实例

const createWindow = () => {
  win = new BrowserWindow({
    webPreferences: {
      devTools: true,
      contextIsolation: false,
      nodeIntegration: true
      //允许html页面上的javascipt代码访问nodejs 环境api代码的能力（与node集成的意思）
    }
  })
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../index.html"));
  } else {
    win.loadURL(`http://${process.env['VITE_DEV_SERVER_HOSTNAME']}:${process.env['VITE_DEV_SERVER_PORT']}`)
  }
}
//isPackage 不好使换下面的
//  if(process.env.NODE_ENV != 'development'){
//  win.loadFile(path.join(__dirname, "../index.html"));
//  }else{
//win.loadURL(`http://${process.env['VITE_DEV_SERVER_HOSTNAME']}:${process.env['VITE_DEV_SE//RVER_PORT']}`)
// }
//在Electron完成初始化时被触发
app.whenReady().then(createWindow)
```

配置package.json 增加main字段；type 去掉

```json
{
  "name": "electron-vite",
  "private": true,
  "version": "0.0.0",
  "main": "dist/electron/index.js",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build  &&  electron-builder",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.2.37"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^3.0.0",
    "electron": "^19.0.10",
    "electron-builder": "^23.1.0",
    "typescript": "^4.6.4",
    "vite": "^3.0.0",
    "vite-plugin-electron": "^0.8.3",
    "vue-tsc": "^0.38.4"
  }
}
```

之后就可以`npm run dev`了

## 打包Electron

需要安装electron-builder

```zsh
npm install electron-builder -D
```

package json 配置 build 修改npm run build命令

```
"build": "vue-tsc --noEmit && vite build  &&  electron-builder",
```

```json
{
  "build": {
    "appId": "com.electron.desktop",
    "productName": "electron",
    "asar": true,
    "copyright": "Copyright © 2022 electron",
    "directories": {
      "output": "release/"
    },
    "files": [
      "dist"
    ],
    "mac": {
      "artifactName": "${productName}_${version}.${ext}",
      "target": [
        "dmg"
      ]
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": [
            "x64"
          ]
        }
      ],
      "artifactName": "${productName}_${version}.${ext}"
    },
    "nsis": {
      "oneClick": false,
      "perMachine": false,
      "allowToChangeInstallationDirectory": true,
      "deleteAppDataOnUninstall": false
    },
    "publish": [
      {
        "provider": "generic",
        "url": "http://127.0.0.1:8080"
      }
    ],
    "releaseInfo": {
      "releaseNotes": "版本更新的具体内容"
    }
  }
}
```

nsis 配置详解 

```json
{		
  "oneClick": false, // 创建一键安装程序还是辅助安装程序（默认是一键安装）
  "allowElevation": true, // 是否允许请求提升，如果为false，则用户必须使用提升的权限重新启动安装程序 （仅作用于辅助安装程序）
  "allowToChangeInstallationDirectory": true, // 是否允许修改安装目录 （仅作用于辅助安装程序）
  "installerIcon": "public/timg.ico",// 安装程序图标的路径
  "uninstallerIcon": "public/timg.ico",// 卸载程序图标的路径
  "installerHeader": "public/timg.ico", // 安装时头部图片路径（仅作用于辅助安装程序）
  "installerHeaderIcon": "public/timg.ico", // 安装时标题图标（进度条上方）的路径（仅作用于一键安装程序）
  "installerSidebar": "public/installerSiddebar.bmp", // 安装完毕界面图片的路径，图片后缀.bmp，尺寸164*314 （仅作用于辅助安装程序）
  "uninstallerSidebar": "public/uninstallerSiddebar.bmp", // 开始卸载界面图片的路径，图片后缀.bmp，尺寸164*314 （仅作用于辅助安装程序）
  "uninstallDisplayName": "${productName}${version}", // 控制面板中的卸载程序显示名称
  "createDesktopShortcut": true, // 是否创建桌面快捷方式
  "createStartMenuShortcut": true,// 是否创建开始菜单快捷方式
  "shortcutName": "SHom", // 用于快捷方式的名称，默认为应用程序名称
  "include": "script/installer.nsi",  // NSIS包含定制安装程序脚本的路径，安装过程中自行调用  (可用于写入注册表 开机自启动等操作)
  "script": "script/installer.nsi",  // 用于自定义安装程序的NSIS脚本的路径
  "deleteAppDataOnUninstall": false, // 是否在卸载时删除应用程序数据（仅作用于一键安装程序）
  "runAfterFinish": true,  // 完成后是否运行已安装的应用程序（对于辅助安装程序，应删除相应的复选框）
  "menuCategory": false, // 是否为开始菜单快捷方式和程序文件目录创建子菜单，如果为true，则使用公司名称
}
```

##  Electron Vscode 输出乱码解决方案(windows)

dev 的字段 加上chcp 65001 输出中文

::: tip

mac就不需要了

:::

```
"dev": "chcp 65001 && vite",
```

## 渲染进程和主进程通信

::: tip

vite.config.ts 需要修改 不然会报一个错`Error: Module "path" has been externalized for browser compatibility. Cannot`

只要安装了 vite-plugin-electron 就会带上 `vite-plugin-electron-renderer` 直接引入用就行

:::

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import electronRender from 'vite-plugin-electron-renderer'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), electron({
    main: {
      entry: "electron/index.ts"
    }
  }),electronRender()],
  build:{
    emptyOutDir: false,
  }
})
```

渲染进程使用ipcRenderer 发送

```typescript
import { ipcRenderer } from 'electron'

const open = () => {
  ipcRenderer.send('openFlyCar')
}
```

主进程使用 ipcMain 接收

```typescript
ipcMain.on('openFlyCar',()=>{
  console.log('收到')
})
```

主进程通知渲染进程

```typescript
const  win = new BrowserWindow(xxxxx)
win!.webContents.send('load', { message: "electron初始化了" })
```

渲染进程接受

```typescript
ipcRenderer.on('load',(_,data)=>{
  console.log(data)
})
```

## 更多配置查看该插件

[vite-plugin-electron: Vite plugin for electron-builder](https://gitee.com/xxXyh1908/vite-plugin-electron)

