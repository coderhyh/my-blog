---
title: 前端埋点SDK
date: 2022-07-18
sidebar: 'auto'
tags:
 - 资料
categories:
 - 随笔
---

## 前端埋点

[埋点](https://juejin.cn/search?query=%E5%9F%8B%E7%82%B9)就是 数据采集-数据处理-数据分析和挖掘，如用户停留时间，用户哪个按钮点的多 ==

打包工具 --- `rollup`

使用rollup 应为 rollup打包干净，而webpack非常臃肿，可读性差，所以rollup非常适合开发SDK和一些框架，webpack 适合开发一些项目

::: tip

目录结构

```
src
	--- core 核心代码
	--- utils 工具函数存放
	--- types 声明文件
rollup.config.js
tsconfig.json
package.json
```

:::

## 开发依赖

```ini
npm install rollup -D
npm install rollup-plugin-dts -D
npm install rollup-plugin-typescript2 -D
npm install typescript -D
```

### 配置rollup.config.js

```js
import ts from 'rollup-plugin-typescript2'
import path from 'path'
import dts from 'rollup-plugin-dts';
export default [{
  //入口文件
  input: "./src/core/index.ts",
  output: [
    //打包esModule
    {
      file: path.resolve(__dirname, './dist/index.esm.js'),
      format: "es"
    },
    //打包common js
    {
      file: path.resolve(__dirname, './dist/index.cjs.js'),
      format: "cjs"
    },
    //打包 AMD CMD UMD
    {
      input: "./src/core/index.ts",
      file: path.resolve(__dirname, './dist/index.js'),
      format: "umd",
      name: "tracker"
    }
  ],
  //配置ts
  plugins: [
    ts(),
  ]

}, {
  //打包声明文件
  input: "./src/core/index.ts",
  output:{
    file: path.resolve(__dirname, './dist/index.d.ts'),
    format: "es",
  },
  plugins: [dts()]
}] 
```

## 类型定义

```typescript
/**
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带Tracker-key 点击事件上报
 * @historyTracker sdkVersion sdk版本
 * @historyTracker extra 透传字段
 * @jsError js 和 promise 报错异常上报
 */
export interface DefaultOptons {
  uuid: string | undefined,
  requestUrl: string | undefined,
  historyTracker: boolean,
  hashTracker: boolean,
  domTracker: boolean,
  sdkVersion: string | number,
  extra: Record<string, any> | undefined,
  jsError: boolean
}


export interface Options extends Partial<DefaultOptons> {
  requestUrl: string,
}


export enum TrackerConfig {
  version = '1.0.0'
}

export type reportTrackerData = {
  [key: string]: any,
  event: string,
  targetKey: string
}
```

## 核心代码

1. PV：页面访问量，即`PageView`，用户每次对网站的访问均被记录

   - 主要监听了 `history` 和 `hash`

   - `history` 无法通过 `popstate`  监听 只能重写其函数 在utils/pv

     ```typescript
     export const createHistoryEvnent = <T extends keyof History>(type: T): () => any => {
       const origin = history[type];
       return function (this: any) {
         const res = origin.apply(this, arguments)
         var e = new Event(type)
         window.dispatchEvent(e)
         return res;
       }
     }
     ```

   - `hash` 使用`hashchange` 监听

2. UV(独立访客)：即`Unique Visitor`，访问您网站的一台电脑客户端为一个访客

   - 用户唯一表示 可以在登录之后通过接口返回的id 进行设置值 提供了`setUserId`
   - 也可以使用`canvas` 指纹追踪技术

3. 使用 `navigator.sendBeacon` 上报

   - 这个上报的机制 跟 `XMLHttrequest` 对比 
   - `navigator.sendBeacon` 即使页面关闭了 也会完成请求 而`XMLHTTPRequest`不一定

4. DOM事件监听

   - 主要是给需要监听的元素添加一个属性 用来区分是否需要监听 target-key="当前元素的信息"

```typescript
import { DefaultOptons, Options, TrackerConfig, reportTrackerData } from "../types/core";
import { createHistoryEvnent } from "../utils/pv";

const MouseEventList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover']

export default class Tracker {
  public data: Options;
  private version: string | undefined;

  public constructor(options: Options) {
    this.data = Object.assign(this.initDef(), options)
    this.installInnerTrack()
  }

  private initDef(): DefaultOptons {
    this.version = TrackerConfig.version;
    window.history['pushState'] = createHistoryEvnent("pushState")
    window.history['replaceState'] = createHistoryEvnent('replaceState')
    return <DefaultOptons>{
      sdkVersion: this.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false
    }
  }

  public setUserId<T extends DefaultOptons['uuid']>(uuid: T) {
    this.data.uuid = uuid;
  }

  public setExtra<T extends DefaultOptons['extra']>(extra: T) {
    this.data.extra = extra
  }

  public sendTracker<T extends reportTrackerData>(data: T) {
    this.reportTracker(data)
  }

  private captureEvents<T>(MouseEventList: string[], targetKey: string, data?: T) {
    MouseEventList.forEach(event => {
      window.addEventListener(event, () => {
        this.reportTracker({ event, targetKey, data })
      })
    })
  }
  private installInnerTrack() {
    if (this.data.historyTracker) {
      this.captureEvents(['pushState'], 'history-pv')
      this.captureEvents(['replaceState'], 'history-pv')
      this.captureEvents(['popstate'], 'history-pv')
    }
    if (this.data.hashTracker) {
      this.captureEvents(['hashchange'], 'hash-pv')
    }
    if (this.data.domTracker) {
      this.targetKeyReport()
    }
    if (this.data.jsError) {
      this.jsError()
    }
  }
  //dom 点击上报
  private targetKeyReport() {
    MouseEventList.forEach(event => {
      window.addEventListener(event, (e) => {
        const target = e.target as HTMLElement
        const targetValue = target.getAttribute('target-key')
        if (targetValue) {
          this.sendTracker({
            targetKey: targetValue,
            event
          })
        }
      })
    })
  }
  private jsError() {
    this.errorEvent()
    this.promiseReject()
  }
  //捕获js报错
  private errorEvent() {
    window.addEventListener('error', (e) => {
      this.sendTracker({
        targetKey: 'message',
        event: 'error',
        message: e.message
      })
    })
  }
  //捕获promise 错误
  private promiseReject() {
    window.addEventListener('unhandledrejection', (event) => {
      event.promise.catch(error => {
        this.sendTracker({
          targetKey: "reject",
          event: "promise",
          message: error
        })
      })
    })
  }
  //上报
  private reportTracker<T>(data: T) {
    const params = Object.assign(this.data, data, { time: new Date().getTime() })
    let headers = {
      type: 'application/x-www-form-urlencoded'
    };
    let blob = new Blob([JSON.stringify(params)], headers);
    navigator.sendBeacon(this.data.requestUrl, blob)
  }
}
```

## 配置package.json 

参考 [package.json 配置](/docs/essay/package-config.html#name)

### 发布npm

::: tip

一定要使用npm 的源  不能使用淘宝镜像 否则 报错403

:::

```ini
npm adduser
npm login
npm publish
```



