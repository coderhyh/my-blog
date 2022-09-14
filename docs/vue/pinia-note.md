---
title: pinia
date: 2022-02-10
sidebar: 'auto'
tags:
 - 笔记
 - pinia
categories:
 - pinia
---



## 前言

Pinia.js 有如下特点：

- 完整的 ts 的支持；
- 足够轻量，压缩后的体积只有1kb左右;
- 去除 mutations, modules，只有 state，getters，actions；
- actions 支持同步和异步；
- 代码扁平化没有模块嵌套，只有 store 的概念，store 之间可以自由使用，每一个store都是独立的
- 无需手动添加 store，store 一旦创建便会自动添加；
- 支持Vue3 和 Vue2

官方文档[Pinia](https://pinia.vuejs.org/)

中文文档[Pinia](https://pinia.web3doc.top/)

## 安装

`npm install pinia`



## 引入注册Vue

Vue3 使用

```js
import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from 'pinia'
 
const store = createPinia()
let app = createApp(App)
 
app.use(store)
app.mount('#app')
```

Vue2 使用

```js
import { createPinia, PiniaVuePlugin } from 'pinia'
 
Vue.use(PiniaVuePlugin)
const pinia = createPinia()
 
new Vue({
  el: '#app',
  // other options...
  // ...
  // note the same `pinia` instance can be used across multiple Vue apps on
  // the same page
  pinia,
})
```

## 初始化仓库Store

1. **新建一个文件夹Store**

2. **新建文件[name].ts**

3. **定义仓库Store**

   1. `import { defineStore } from 'pinia'`

4. **储存是使用定义的`defineStore()`，并且它需要一个唯一的名称，作为第一个参数传递**

   新建文件 store-namespace/index.ts

   ```typescript
   export const enum Names {
     Test = 'TEST'
   }
   ```

   store 引入

   ```typescript
   import { defineStore } from 'pinia'
   import { Names } from './store-namespace'
   //这个名称，也称为id，是必要的，Pania 使用它来连接到 devtools。将返回的函数命名为use...是可组合项之间的约定，以使其使用习惯。
   export const useTestStore = defineStore(Names.Test, {
    
   })
   ```

5. **定义值**

   **State 箭头函数 返回一个对象 在对象里面定义值**

   ```typescript
   import { defineStore } from 'pinia'
   import { Names } from './store-namespce'
    
   export const useTestStore = defineStore(Names.Test, {
        state:()=>{
            return {
                current:1
            }
        },
        //类似于computed 可以帮我们去修饰我们的值
        getters:{
    
        },
        //可以操作异步 和 同步提交state
        actions:{
    
        }
   })
   ```



## 操作State

### 1.State 是允许直接修改值的

```vue
<template>
<div>
  <button @click="Add">+</button>
  <div>
    {{Test.current}}
  </div>
  </div>
</template>

<script setup lang='ts'>
  import {useTestStore} from './store'
  const Test = useTestStore()
  const Add = () => {
    Test.current++
  }

</script>

<style>

</style>
```

### 2.批量修改State的值

在他的实例上有$patch方法可以批量修改多个值

```vue
<template>
	<div>
    <button @click="Add">+</button>
    <div> {{Test.current}} </div>
    <div> {{Test.age}} </div>
  </div>
</template>

<script setup lang='ts'>
  import {useTestStore} from './store'
  const Test = useTestStore()
  const Add = () => {
    Test.$patch({
      current:200,
      age:300
    })
  }

</script>
```

### 3.批量修改函数形式

使用函数形式 可以自定义修改逻辑

```vue
<template>
	<div>
    <button @click="Add">+</button>
    <div> {{Test.current}} </div>
    <div> {{Test.age}} </div>
  </div>
</template>

<script setup lang='ts'>
  import {useTestStore} from './store'
  const Test = useTestStore()
  const Add = () => {
    Test.$patch((state)=>{ // 传入一个回调函数 state参数就是数据
      state.current++;
      state.age = 40
    })
  }

</script>
```

### 4.通过原始对象修改整个实例

`$state` 可以通过将store的属性设置为新对象来替换store的整个状态

缺点就是**必须修改整个对象的所有属性**

```vue
<template>
	<div>
    <button @click="Add">+</button>
    <div> {{Test.current}} </div>
    <div> {{Test.age}} </div>
  </div>
</template>

<script setup lang='ts'>
  import {useTestStore} from './store'
  const Test = useTestStore()
  const Add = () => {
    Test.$state = {
      current:10,
      age:30
    }    
  }
</script>
```

### 5.通过actions修改

定义Actions

在actions 中直接使用this就可以指到state里面的值

```typescript
import { defineStore } from 'pinia'
import { Names } from './store-naspace'
export const useTestStore = defineStore(Names.TEST, {
  state:()=>{
    return {
      current:1,
      age:30
    }
  },

  actions:{
    setCurrent () {
      this.current++
    }
  }
})
```

使用方法直接在实例调用

```vue
<template>
	<div>
    <button @click="Add">+</button>
    <div> {{Test.current}} </div>
    <div> {{Test.age}} </div>
  </div>
</template>

<script setup lang='ts'>
  import {useTestStore} from './store'
  const Test = useTestStore()
  const Add = () => {
    Test.setCurrent()
  }
</script>
```

## 解构store

在Pinia是不允许直接解构是会**失去响应性**的

```typescript
const Test = useTestStore()
const { current, name } = Test
console.log(current, name);
```

解决方案可以使用 `storeToRefs`

```typescript
import { storeToRefs } from 'pinia'
const Test = useTestStore()
const { current, name } = storeToRefs(Test)
```

其原理跟toRefs 一样的给里面的数据包裹一层toref

## API

### 1.$reset

重置`store`到他的初始状态

```typescript
state: () => ({
  user: <Result>{},
  name: "default",
  current:1
}),
```

例如我把值改变到了10 => 然后调用$reset() => 将会把state所有值 重置回 **原始定义态**

### 2.订阅state的改变

只要有state 的变化就会走这个函数

```typescript
Test.$subscribe((args,state)=>{
  console.log(args,state);
})
```

第一个参数是一个回调函数

如果你的组件卸载之后还想继续调用可以设置第二个参数

```typescript
Test.$subscribe((args,state)=>{
  console.log(args,state);
},{
  detached:true
})
```

###  3.订阅Actions的调用

 只要有actions被调用就会走这个函数

```typescript
Test.$onAction((args)=>{
  console.log(args);
})
```

## pinia插件

pinia 和 vuex 都有一个通病 页面刷新状态会丢失

可以写一个pinia 插件缓存他的值

```typescript
import {createPinia} from 'pinia'

const __piniaKey = '__PINIAKEY__'

type OptPinia = Partial<Options>
const setStorage = (key: string, value: any): void => {
  localStorage.setItem(key, JSON.stringify(value))
}

const getStorage = (key: string) => {
  return (localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : {})
}

const piniaPlugin = (options: OptPinia) => {

  return (context: PiniaPluginContext) => {

    const { store } = context;

    const data = getStorage(`${options?.key ?? __piniaKey}-${store.$id}`)

    store.$subscribe(() => {

      setStorage(`${options?.key ?? __piniaKey}-${store.$id}`, toRaw(store.$state));

    })

    return {

      ...store.$state,

      ...data

    }

  }

}

const pinia = createPinia()
pinia.use(piniaPlugin({

  key: "pinia"

}))
```



