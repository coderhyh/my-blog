---
title: BOM笔记
date: 2022-02-10
sidebar: 'auto'
tags:
 - 笔记
 - js
categories:
 -  javascript
---

# BOM笔记

## `Window`  尺寸

有三种方法能够确定浏览器窗口的尺寸。

对于Internet Explorer、Chrome、Firefox、Opera 以及 Safari：

- window.innerHeight - 浏览器窗口的内部高度(包括滚动条)
- window.innerWidth - 浏览器窗口的内部宽度(包括滚动条)

对于 Internet Explorer 8、7、6、5：

- document.documentElement.clientHeight
- document.documentElement.clientWidth

或者

- document.body.clientHeight
- document.body.clientWidth


## BMO 浏览器对象模型

![img](/javascript/javascript-note/image-20210731100443402.png)

![img](/javascript/javascript-note/image-20210731100632467.png)

::: tip
window对象是浏览器的顶级对象   它具有双重角色

1.它是js访问浏览器窗口的一个接口

2.他是一个全局对象。定义在全局作用域的 变量、函数 都会变成window对象的属性和方法

注意：window 下的特殊属性 window.name   这是window自带的 所以定义全局变量建议不要定义name

:::


## JavaScript执行机制

![img](/javascript/javascript-note/image-20210731143300491.png)

::: tip
js执行会分为同步和异步  [详细看pink90集](https://www.bilibili.com/video/BV1k4411w7sV?p=90)

js是单线程的语言，也就是说同一时间只能做一件事情。
:::
::: tip
为了利用多核CPU的计算能力，HTML5提出`Web Worker`标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。
:::

## `location` 对象

![img](/javascript/javascript-note/image-20210731145031489.png)

![img](/javascript/javascript-note/image-20210731145050953.png)

## `location` 跳转

![img](/javascript/javascript-note/image-20210731154637292.png)

::: tip
可以直接给URL赋值进行跳转  location.href = 'http://www.itcast.cn';  记录历史  可以后退
:::

## `navigator` 对象判断pc端|手机端

```js
if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    window.location.href = ""; //手机
}else{
    window.location.href = ""; //电脑
}
```

## `history` 对象前进后退功能

![img](/javascript/javascript-note/image-20210731160211882.png)

::: tip
`go(1)` 前进几个页面就写几   后退就是 -1
:::

**pushState** => 往栈中添加一个url尾部地址  ---  可以后退

**replaceState** => 替换url尾部地址 -- 不可以后退



## `offset`  系列 获取元素位置 大小

- 1.可以得到元素的偏移 位置 返回的不带单位的数值 

  - **它以带有定位的父类为准 如果么有父类或者父类没有定位 则以 body 为准**

  - div.offsetTop

  - div.offsetLeft

- 2.可以得到元素的大小 宽度和高度 是包含padding + border + width

  - div.offsetWidth
  - div.offsetHeight

- 3.返回带有定位的爸爸 否则返回的是body

  - **返回带有定位的爸爸 否则返回的是body**

  - div.offsetParent

  - **返回父亲 是最近一级的父亲 亲爸爸 不管爸爸有没有定位**

  - div.parentNode


## `client`  系列 获取元素大小 **不带边框** 

![img](/javascript/javascript-note/image-20210801152549328.png)

::: tip
事件对象 e.clientX  ||  e.clientY  获取鼠标位置
:::


## `scroll`  滚动条事件  页面被卷去距离 是否在**可视区**

![img](/javascript/javascript-note/image-20210801160933872.png)

::: tip
注：1. 这个计算的是元素  中的  **内容**  被卷去的距离

计算页面被卷去的距离是：

`var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;` **(可以赋值)** 

`window.pageYOffset` 跟 `window.pageXOffset` (只读)

window.scrollTo(X,Y);(改变)
:::


::: tip
注：2. 返回的 `宽度 高度` 是会计算盒子的 宽高 并且包括了盒子里的内容被撑开出来的大小
:::

![img](/javascript/javascript-note/image-20210801161306545.png)

::: tip
超出后添加css属性 `overflow: scroll;` 会出现滚动条

添加 `resize: both;` 可以改变框的大小
:::

::: tip
滚动条事件
:::

```js
div.addEventListener('scroll', function() {
    console.log(div.scrollTop);
})
```

::: tip
被卷去距离 + 屏幕高度的 / 2 > 元素距离顶部 && 卷去距离  + 屏幕高度 / 2 < 元素距离顶部 + 元素自身高度
:::
  
![img](/javascript/javascript-note/image-20211125205824147.png)


## 返回顶部  `window.scroll(x,y)`

::: tip
里面的x和y 不跟单位的 直接写数字即可

`window.scroll(0, 0);` y 为 0 即可瞬间回到顶部

如需滚动 加上定时器上面的缓动动画
:::


## `cookie` 

| 添加cookie | document.cookie="name=李四";            |
| ---------- | :-------------------------------------- |
| 获取cookie | document.cookie --- 返回字符串 需要切割 |
|            |                                         |

::: tip
**会话级**cookie

退出浏览器cookie就会清空
:::



::: tip
获取cookie
:::

```js
function getCookie(){
  var arr=document.cookie.split("; ");
  var obj={};
  for(var i=0;i<arr.length;i++){
    var s=arr[i].split("=");
    obj[s[0]]=s[1];
  }
  return obj;
}
```

::: tip
添加 / 删除
:::

```js
// 添加cookie
function setCookie(key, val, day) {
  if (day) {
    var date = new Date();
    var ms = date.getTime() + day * 24 * 60 * 60 * 1000;
    date.setTime(ms);
    var str = date.toGMTString();
    document.cookie = key + "=" + val + ";expires=" + str;
  } else {
    document.cookie = key + "=" + val;
  }
}
```

## 本地存储

- `sessionStorage`  生命周期关闭页面就没了 --- 只在当前标签页面生效
- `localStorage` 生命周期永久生效 关闭页面还在

::: tip
存储数据 `上方存储.setItem('key', val);`  
:::

::: tip
获取数据 `上方存储.getItem('key') ` 
:::

::: tip
删除数据 `上方存储.removeItem('key');`  
:::

::: tip
删除所有数据 `上方存储.clear();` 
:::

::: tip
webStorage` 与 `cookie` 的区别
:::

```js
webStorage 
	容量5M左右
  localStorage 一直存在 除非手动清除
  sessionStorage 类似与会话cookie 关闭当前标签页自动清除 只在当前标签页面生效
  操作webStorage更方便
cookie 
	容量4k
  可以添加过期时间
  伴随请求在客户端和服务端之间往返(客户端和服务端都可以操作)
	操作cookie更繁琐
```