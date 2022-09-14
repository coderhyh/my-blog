---
title: Mitt 发布订阅模式插件
date: 2022-06-01
sidebar: 'auto'
tags:
 - 笔记
 - vue
 - plugin
categories:
 -  vue
---



在vue3中$on，$off 和 $once 实例方法已被移除，组件实例不再实现事件触发接口，因此大家熟悉的`EventBus`便无法使用了。

然而我们习惯了使用`EventBus`，对于这种情况我们可以使用Mitt库

## 安装

:::tip

`npm install mitt -S`

:::

## main.ts 初始化

全局总线，vue 入口文件 main.ts 中挂载全局属性

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'

const Mit = mitt()

//TypeScript注册
// 由于必须要拓展ComponentCustomProperties类型才能获得类型提示
declare module "vue" {
  export interface ComponentCustomProperties {
    $Bus: typeof Mit
  }
}

const app = createApp(App)

//Vue3挂载全局API
app.config.globalProperties.$Bus = Mit

app.mount('#app')
```

## 使用方法

通过emit派发， on 方法添加事件，off 方法移除，clear 清空所有 

A组件派发（emit）

```vue
<template>
<div>
  <h1>我是A</h1>
  <button @click="emit1">emit1</button>
  <button @click="emit2">emit2</button>
  </div>
</template>

<script setup lang='ts'>
  import { getCurrentInstance } from 'vue'
  const instance = getCurrentInstance();
  const emit1 = () => {
    instance?.proxy?.$Bus.emit('on-num', 100)
  }
  const emit2 = () => {
    instance?.proxy?.$Bus.emit('*****', 500)
  }
</script>

<style>
</style>
```

B组件监听（on）

```vue
<template>
<div>
  <h1>我是B</h1>
  </div>
</template>

<script setup lang='ts'>
  import { getCurrentInstance } from 'vue'
  const instance = getCurrentInstance()
  instance?.proxy?.$Bus.on('on-num', (num) => {
    console.log(num,'===========>B')
  })
</script>

<style>
</style>
```

监听所有事件（ on("*") ）

```typescript
instance?.proxy?.$Bus.on('*',(type,num)=>{
  console.log(type,num,'===========>B')
})
```

移除监听事件（off）

```typescript
const Fn = (num: any) => {
  console.log(num, '===========>B')
}
instance?.proxy?.$Bus.on('on-num',Fn)//listen
instance?.proxy?.$Bus.off('on-num',Fn)//unListen
```

清空所有监听（clear）

```typescript
instance?.proxy?.$Bus.all.clear()
```

