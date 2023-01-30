---
title: JavaScript运行原理
date: 2022-07-18
sidebar: 'auto'
tags:
 - 笔记
 - js
categories:
 - javascript
---



## JavaScript是一门编程语言

::: tip

**JavaScript是一门高级的编程语言。**

:::

那么有高级编程语言，就有低级编程语言，从编程语言发展历史来说，可以划分为三个阶段：

- 机器语言：1000100111011000，一些机器指令；
- 汇编语言：mov ax,bx，一些汇编指令；
- 高级语言：C、C++、Java、JavaScript、Python；

但是计算机它本身是不认识这些高级语言的，所以我们的代码最终还是需要被转换成机器指令：

![image-20220718143020263](/javascript/js-advanced/image-20220718143020263.png)

## 浏览器的工作原理

<img src="/javascript/js-advanced/image-20220718143326318.png" alt="image-20220718143326318" style="zoom: 67%;" />

## 认识浏览器的内核

我们经常会说：不同的浏览器有不同的内核组成

- Gecko：早期被Netscape和Mozilla Firefox浏览器浏览器使用；
- Trident：微软开发，被IE4~IE11浏览器使用，但是Edge浏览器已经转向Blink；
- Webkit：苹果基于KHTML开发、开源的，用于Safari，Google Chrome之前也在使用；
- Blink：是Webkit的一个分支，Google开发，目前应用于Google Chrome、Edge、Opera等；
- ==

事实上，我们经常说的浏览器内核指的是浏览器的排版引擎：

- 排版引擎（layout engine），也称为浏览器引擎（browser engine）、页面渲染引擎（rendering engine） 或样版引擎。

## 浏览器渲染过程

1. HTML被HTML解析器解析成DOM 树
2. css则被css解析器解析成CSSOM 树
3. 结合DOM树和CSSOM树，生成一棵渲染树(Render Tree)
4. 生成布局（flow），即将所有渲染树的所有节点进行平面合成
5. 将布局绘制（paint）在屏幕上

第四步和第五步是最耗时的部分，这两步合起来，就是我们通常所说的**渲染**



但是在这个执行过程中，HTML解析的时候遇到了JavaScript标签，应该怎么办呢？

- 会停止解析HTML，而去加载和执行JavaScript代码；

  ![image-20220718151655697](/javascript/js-advanced/image-20220718151655697.png)

  那么，JavaScript代码由谁来执行呢？ -----   **JavaScript引擎**

## 认识JavaScript引擎

为什么需要JavaScript引擎呢？

- 们前面说过，**高级的编程语言**都是需要转成最终的**机器指令来执行**的；
- 事实上我们编写的JavaScript无论你交给**浏览器或者Node执行**，最后都是需要被CPU执行的；
- 但是CPU只认识自己的指令集，实际上是机器语言，才能被CPU所执行；
- 所以我们需要JavaScript引擎帮助我们将**JavaScript代码翻译成CPU指令来执行**；

比较常见的JavaScript引擎有哪些呢？

- SpiderMonkey：第一款JavaScript引擎，由Brendan Eich开发（也就是JavaScript作者）；
- Chakra：微软开发，用于IT浏览器；
- JavaScriptCore：WebKit中的JavaScript引擎，Apple公司开发；
- V8：Google开发的强大JavaScript引擎，也帮助Chrome从众多浏览器中脱颖而出；
- ==

## 浏览器内核和JS引擎的关系

这里我们先以WebKit为例，WebKit事实上由两部分组成的：

- WebCore：负责HTML解析、布局、渲染等等相关的工作；
- JavaScriptCore：解析、执行JavaScript代码；

在小程序中编写的JavaScript代码就是被JSCore执行的：

<img src="/javascript/js-advanced/image-20220718145354083.png" alt="image-20220718145354083" style="zoom: 80%;" /> <img src="/javascript/js-advanced/image-20220718154317130.png" alt="image-20220718154317130" style="zoom:80%;" />

另外一个强大的JavaScript引擎就是**V8引擎**。

## V8引擎的原理

官方对V8引擎的定义：

- V8是用C ++编写的Google开源高性能JavaScript和WebAssembly引擎，它用于Chrome和Node.js等。

- 它实现ECMAScript和WebAssembly，并在Windows 7或更高版本，macOS 10.12+和使用x64，IA-32， ARM或MIPS处理器的Linux系统上运行。

- V8可以独立运行，也可以嵌入到任何C ++应用程序中。

  ::: tip

  这里转为字节码是因为在不同cpu运行的**指令是不一样的**，而这里**字节码是可以跨平台**的；所以这里由`Ignition`转为字节码，然后字节码还需要再转为汇编代码，再执行cpu中对应的指令

  :::

  <img src="/javascript/js-advanced/image-20220718145555601.png" alt="image-20220718145555601" style="zoom:80%;" />

  ![image-20220718160201133](/javascript/js-advanced/image-20220718160201133.png)

::: tip 

在 `parse` 把js代码转为 `ast` 时会先做 **词法分析**，然后通过语法分析 把js代码转为 **ast抽象语法树**

这个网站可以查看词法分析结果 https://astexplorer.net/

:::

### V8引擎的架构

V8引擎本身的源码非常复杂，大概有超过100w行C++代码，通过了解它的架构，可以知道它是如何对JavaScript执行的：

**Parse**模块会将JavaScript代码转换成AST（抽象语法树），这是因为解释器并不直接认识JavaScript代码；

- 如果函数没有被调用，那么是不会被转换成AST的；
- Parse的V8官方文档：https://v8.dev/blog/scanner

**Ignition**是一个解释器，会将AST转换成ByteCode（字节码）

- 同时会收集TurboFan优化所需要的信息（比如函数参数的类型信息，有了类型才能进行真实的运算）；
- 如果函数只调用一次，Ignition会执行解释执行ByteCode；
- Ignition的V8官方文档：https://v8.dev/blog/ignition-interpreter

**TurboFan**是一个编译器，可以将字节码编译为CPU可以直接执行的机器码；

- 如果一个函数被多次调用，那么就会被标记为**热点函数**，那么就会经过**TurboFan转换成优化的机器码，提高代码的执行性能**；
- 但是，**机器码实际上也会被还原为ByteCode**，这是因为如果后续执行函数的过程中，**类型发生了变化（比如sum函数原来执行的是 number类型，后来执行变成了string类型）**，之前优化的机器码并不能正确的处理运算，就会逆向的转换成字节码；
- TurboFan的V8官方文档：https://v8.dev/blog/turbofan-jit

### V8引擎的解析图（官方）

<img src="/javascript/js-advanced/image-20220718145913997.png" alt="image-20220718145913997" style="zoom:67%;" />

### V8执行的细节

那么我们的JavaScript源码是如何被解析（Parse过程）的呢？

1. Blink将源码交给V8引擎，Stream获取到源码并且进行编码转换；
2. Scanner会进行词法分析（lexical analysis），词法分析会将代码转换成tokens；
3. 接下来tokens会被转换成AST树，经过Parser和PreParser：
   - Parser就是直接将tokens转成AST树架构；
   - PreParser称之为预解析，为什么需要预解析呢？
     - 这是因为并不是所有的JavaScript代码，在一开始时就会被执行。那么对所有的JavaScript代码进行解析，必然会 影响网页的运行效率；
     - 所以V8引擎就实现了**Lazy Parsing（延迟解析）**的方案，它的作用是**将不必要的函数进行预解析**，也就是只解析暂 时需要的内容，而对**函数的全量解析**是在**函数被调用时才会进行**；
     - 比如我们在一个函数outer内部定义了另外一个函数inner，那么inner函数就会进行预解析；
   - 生成AST树后，会被Ignition转成字节码（bytecode），之后的过程就是代码的执行过程（后续会详细分析）。

## js执行原理

1. 在v8引擎解析经过 `parse` 的时候，会创建一个 `globalObject(GO)` 

- 里面会包含各种全局的属性 比如 String、Array、Date ==
- 其中也会有一个属性为 `window`， 它的值为 this ---> 也就是当前的 go，所以使用时会发现可以一直 `window.window.window.window...`

`var` 关键字为什么会有变量提升呢？---> 可看下方 **图1**

- 原因就是在于 v8 在将代码转化为 ast 的时候 会先创建一个 `globalObject` --- 也就是 go
- 在创建 `go` 的时候 会把全局用 `var` 定义的变量储存在里面，初始值就为`undefined`

```js
var name = "hyh"
console.log(num1)
var num1 = 20
var num2 = 30
var result = num1 + num2
console.log(result)

var globalObject = {
  String: "类",
  Date: "类",
  setTimeount: "函数",
  window: globalObject,
  name: undefined,
  num1: undefined,
  num2: undefined,
  result: undefined
}
```

2. 运行代码
   - v8为了执行代码, v8引擎内部会有一个**执行上下文栈**(**Execution Context Stack** ---> **ECStack**)(**函数调用栈**)
   - 因为我们执行的是全局代码, 为了全局代码能够正常的执行, 需要创建 **全局执行上下文**(**Global Execution Context**)(全局代码需要被执行时才会创建)
   - 遇到函数时, 只有在调用时才会编译函数; 在没有调用时是会做一个**预编译(lazy-parsing)**; 只是知道有这段代码然后创建一个函数对象，但是没有编译

全局代码执行过程解析 ---> 图1

![image-20220719140030874](/javascript/js-advanced/image-20220719140030874.png)

全局代码执行过程解析(函数) ---> 图2

![image-20220719142106296](/javascript/js-advanced/image-20220719142106296.png)

全局代码执行过程解析(函数嵌套) ---> 图3

<img src="/javascript/js-advanced/image-20220719142252497.png" alt="image-20220719142252497" style="zoom:80%;" />



## 变量环境和环境记录

其实上面的讲解都是基于早期ECMA的版本规范：

<img src="/javascript/js-advanced/image-20220719152705644.png" alt="image-20220719152705644" style="zoom:80%;" />

在最新的ECMA的版本规范中，对于一些词汇进行了修改：

<img src="/javascript/js-advanced/image-20220719152722237.png" alt="image-20220719152722237" style="zoom:80%;" />

::: tip

通过上面的变化我们可以知道，在最新的ECMA标准中，我们前面的变量对象VO已经有另外一个称呼了变量环境 --- VE。

:::