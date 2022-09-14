---
title: vue transition 过渡
date: 2022-06-01
sidebar: 'auto'
tags:
 - 笔记
 - vue
categories:
 -  vue
---



 Vue 提供了 transition 的封装组件，在下列情形中，可以给任何元素和组件添加进入/离开过渡:

- 条件渲染 (使用 v-if)
- 条件展示 (使用 v-show)
- 动态组件
- 组件根节点



## 过渡的类名

:::tip

在进入/离开的过渡中，会有 6 个 class 切换。

:::

`v-enter-from`：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。

`v-enter-active`：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。

`v-enter-to`：定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 v-enter-from 被移除)，在过渡/动画完成之后移除。

`v-leave-from`：定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。

`v-leave-active`：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。

`v-leave-to`：离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 v-leave-from 被移除)，在过渡/动画完成之后移除。

如下：

```html
<button @click='flag = !flag'>切换</button>
<transition name='fade'>
  <div v-if='flag' class="box"></div>
</transition>
```

```css
//开始过度
.fade-enter-from{
  background:red;
  width:0px;
  height:0px;
  transform:rotate(360deg)
}
//开始过度了
.fade-enter-active{
  transition: all 2.5s linear;
}
//过度完成
.fade-enter-to{
  background:yellow;
  width:200px;
  height:200px;
}
//离开的过度
.fade-leave-from{
  width:200px;
  height:200px;
  transform:rotate(360deg)
}
//离开中过度
.fade-leave-active{
  transition: all 1s linear;
}
//离开完成
.fade-leave-to{
  width:0px;
  height:0px;
}
```

## 自定义过渡 class 类名

trasnsition props

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

自定义过度时间 单位毫秒

你也可以分别指定进入和离开的持续时间：

```html
<transition :duration="1000">...</transition>
 
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

### 通过自定义class 结合css动画库animate css

安装库 npm install animate.css

引入 import 'animate.css'

使用方法

官方文档 [Animate.css | A cross-browser library of CSS animations.](https://animate.style/)

```html
<transition
            leave-active-class="animate__animated animate__bounceInLeft"
            enter-active-class="animate__animated animate__bounceInRight"
            >
  <div v-if="flag" class="box"></div>
</transition>
```

## transition 生命周期8个

```vue
@before-enter="beforeEnter" //对应enter-from
@enter="enter"//对应enter-active
@after-enter="afterEnter"//对应enter-to
@enter-cancelled="enterCancelled"//显示过度打断
@before-leave="beforeLeave"//对应leave-from
@leave="leave"//对应enter-active
@after-leave="afterLeave"//对应leave-to
@leave-cancelled="leaveCancelled"//离开过度打断
```

当只用 JavaScript 过渡的时候，在 **`enter` 和 `leave` 钩子中必须使用 `done` 进行回调**

结合gsap 动画库使用 [GreenSock](https://greensock.com/)

```js
const beforeEnter = (el: Element) => {
  console.log('进入之前from', el);
}
const Enter = (el: Element,done:Function) => {
  console.log('过度曲线');
  setTimeout(()=>{
    done()
  },3000)
}
const AfterEnter = (el: Element) => {
  console.log('to');
}
```

## appear

通过这个属性可以设置初始节点过度 就是页面加载完成就开始动画 对应三个状态

```txt
appear-active-class=""
appear-from-class=""
appear-to-class=""
appear
```

## transition-group过度列表

- 单个节点
- 多个节点，每次只渲染一个

> 那么怎么同时渲染整个列表，比如使用 `v-for`？在这种场景下，我们会使用 `<transition-group>` 组件。在我们深入例子之前，先了解关于这个组件的几个特点：

默认情况下，它不会渲染一个包裹元素，但是你可以通过 tag attribute 指定渲染一个元素。
过渡模式不可用，因为我们不再相互切换特有的元素。
内部元素总是需要提供唯一的 key attribute 值。
CSS 过渡的类将会应用在内部的元素中，而不是这个组/容器本身。

```html
<transition-group>
  <div style="margin: 10px;" :key="item" v-for="item in list">{{ item }</div>
</transition-group>
```

```js
const list = reactive<number[]>([1, 2, 4, 5, 6, 7, 8, 9])
const Push = () => {
  list.push(123)
}
const Pop = () => {
  list.pop()
}
```

## 列表的移动过渡

transition-group> 组件还有一个特殊之处。除了进入和离开，它还可以为定位的改变添加动画。只需了解新增的 v-move 类就可以使用这个新功能，它会应用在元素改变定位的过程中。像之前的类名一样，它的前缀可以通过 name attribute 来自定义，也可以通过 move-class attribute 手动设置

```vue
<template>
<div>
  <button @click="shuffle">Shuffle</button>
  <transition-group class="wraps" name="mmm" tag="ul">
    <li class="cell" v-for="item in items" :key="item.id">{{ item.number }}</li>
  </transition-group>
  </div>
</template>

<script setup  lang='ts'>
  import _ from 'lodash'
  import { ref } from 'vue'
  let items = ref(Array.apply(null, { length: 81 } as number[]).map((_, index) => {
    return {
      id: index,
      number: (index % 9) + 1
    }
  }))
  const shuffle = () => {
    items.value = _.shuffle(items.value)
  }
</script>

<style scoped lang="less">
  .wraps {
    display: flex;
    flex-wrap: wrap;
    width: calc(25px * 10 + 9px);
    .cell {
      width: 25px;
      height: 25px;
      border: 1px solid #ccc;
      list-style-type: none;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .mmm-move {
    transition: transform 0.8s ease;
  }
</style>
```

## 状态过渡

Vue 也同样可以给数字 Svg 背景颜色等添加过度动画 今天演示数字变化

```vue
<template>
<div>
  <input step="20" v-model="num.current" type="number" />
  <div>{{ num.tweenedNumber.toFixed(0) }}</div>
  </div>
</template>

<script setup lang='ts'>
  import { reactive, watch } from 'vue'
  import gsap from 'gsap'
  const num = reactive({
    tweenedNumber: 0,
    current:0
  })

  watch(()=>num.current, (newVal) => {
    gsap.to(num, {
      duration: 1,
      tweenedNumber: newVal
    })
  })

</script>

<style>
</style>
```



