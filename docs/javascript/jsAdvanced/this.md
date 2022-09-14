---
title: this绑定规则
date: 2022-07-29
sidebar: 'auto'
tags:
 - 笔记
 - js
categories:
 - javascript
---

## this指向

- this在全局作用于下指向什么？
  - 在浏览器中测试就是指向`window`
  - 在node中是指向 `{}`
    - 这是因为`node` 在执行的时候 会把这个文件当成一个**模块**
    - 然后进行**加载**  ->  **编译** 之后**放到一个函数中**
    - 最后**执行这个函数**的时候使用 `call` 把 `{}` 绑定给了**这个函数**
  - 在浏览器中严格模式下 **自执行函数(默认绑定)会指向`undefined`**
- 但是，开发中很少直接在全局作用于下去使用this，通常都是在函数中使用。
  - 所有的函数在被调用时，都会创建一个执行上下文：
  - 这个上下文中记录着函数的调用栈、AO对象等；
  - this也是其中的一条记录；



::: tip
箭头函数的this是指向谁的？

向外层的作用域中，一层一层查找this，直到有this的定义，那么就是指向他
:::

```js
this一般情况下，通过谁调用，就指向谁。
在js全局作用域, this指向window
在对象中,this指向这个对象本身
构造函数中，this是正在创建的对象。
在事件函数中,this指向事件目标
(注意: 在计时器中this会被还原成window或置空,但箭头函数可以保留this指向)

可用通过call(), apply(), bind()改变this的指向
apply，和call一样,修改指向的同时调用函数，唯一的区别是，传参方式不同，aplly需要提供一个数组。
bind修改this指向时不会调用函数，而是生成一个新的函数，新的函数和原函数代码一样，但是里面的this是绑定过的。
```

::: tip
`bind`  

修改this指向时**不会调用函数**，而是生成一个**新的函数**，新的函数和原函数代码一样，但是里面的**this是绑定过的** 
:::

```js
btn.onclick=function(){
  setTimeout(function(){
    this.style.fontSize="80px";
  }.bind(this),1000) //在传入函数之前 改变this的指向
}
```

::: tip
`call` 与 `apply` 

`apply`和`call`一样,修改指向的同时调用函数，唯一的区别是，传参方式不同，aplly需要提供一个数组。
:::

```js
/调用时改变this指向
function fun(a,b){
  console.log(this,a,b);
}

var obj={name:"obj"};
fun.call(obj,10,20);//this指向obj 并调用了自身
fun.apply(obj,[10,20]);
```

## this到底是怎么样的绑定规则呢

1. 默认绑定；
2. 隐式绑定； 
3. 显示绑定；
4. new绑定；

## 默认绑定

- 什么情况下使用默认绑定呢？独立函数调用。
  - 独立的函数调用我们可以理解成函数没有被绑定到某个对象上进行调用； 

通过几个案例来看一下，常见的默认绑定

```js
// 1.案例一:
function foo() {
  console.log(this)
}
foo()

// 2.案例二:
function foo1() {
  console.log(this)
}
function foo2() {
  console.log(this)
  foo1()
}
function foo3() {
  console.log(this)
  foo2()
}
foo3()

// 3.案例三:
var obj = {
  name: "hyh",
  foo: function() {
    console.log(this)
  }
}
var bar = obj.foo
bar() // window
```

## 隐式绑定

- 另外一种比较常见的调用方式是通过某个对象进行调用的：
  - 也就是它的调用位置中，是通过某个对象发起的函数调用。

通过几个案例来看一下，常见的隐式绑定

```ts
// 隐式绑定: object.fn()
// object对象会被js引擎绑定到fn函数的中this里面
function foo() {
  console.log(this)
}

// 1.案例一:
var obj = {
  name: "hyh",
  foo: foo
}
obj.foo() // obj对象

// 2.案例二:
var obj = {
  name: "hyh",
  eating: function() {
    console.log(this.name + "在吃东西")
  },
  running: function() {
    console.log(obj.name + "在跑步")
  }
}
// obj.eating() // obj
// obj.running() // obj
var fn = obj.eating
fn() // 

// 3.案例三:
var obj1 = {
  name: "obj1",
  foo: function() {
    console.log(this)
  }
}
var obj2 = {
  name: "obj2",
  bar: obj1.foo
}
obj2.bar()
```

## 显示绑定

- 隐式绑定有一个前提条件：
  - 必须在调用的对象内部有一个对函数的引用（比如一个属性）；
  - 如果没有这样的引用，在进行调用时，会报找不到该函数的错误;
  - 正是通过这个引用，间接的将this绑定到了这个对象上；
- 如果我们不希望在 **对象内部** 包含这个函数的引用，同时又希望在这个对象上进行强制调用，该怎么做呢？
  - JavaScript所有的函数都可以使用call和apply方法（这个和Prototype有关）。
    - 它们两个的区别这里不再展开；
    - 其实非常简单，第一个参数是相同的，后面的参数，apply为数组，call为参数列表；
  - 这两个函数的第一个参数都要求是一个对象，这个对象的作用是什么呢？就是给this准备的
  - 在调用这个函数时，会将this绑定到这个传入的对象上。
- 因为上面的过程，我们明确的绑定了this指向的对象，所以称之为 **显示绑定**

## new绑定

- JavaScript中的函数可以当做一个类的构造函数来使用，也就是使用new关键字。
- 使用new关键字来调用函数是，会执行如下的操作：
  1. 创建一个全新的对象；
  2. 这个新对象会被执行prototype连接；
  3. 这个新对象会绑定到函数调用的this上（this的绑定在这个步骤完成）；
  4. 如果函数没有返回其他对象，表达式会返回这个新对象；

```js
// 通过一个new关键字调用一个函数时(构造器), 这个时候this是在调用这个构造器时创建出来的对象
// this = 创建出来的对象
// 这个绑定过程就是new 绑定

function Person(name, age) {
  this.name = name
  this.age = age
}

var p1 = new Person("hyh", 18)
console.log(p1.name, p1.age)

var p2 = new Person("yh", 30)
console.log(p2.name, p2.age)

var obj = {
  foo: function() {
    console.log(this)
  }
}
```

## 规则优先级

- 默认规则的优先级最低

  - 毫无疑问，默认规则的优先级是最低的，因为存在其他规则时，就会通过其他规则的方式来绑定this

- 显示绑定优先级高于隐式绑定

  ```js
  function foo() {
    console.log(this)
  }
  var obj = {
    name: "obj",
    foo: foo.bind("aaa")
  }
  obj.foo()
  ```

- new绑定优先级高于隐式\显示绑定

- new绑定优先级高于bind

  - new绑定和call、apply是不允许同时使用的，所以不存在谁的优先级更高
  - new绑定可以和bind一起使用，new绑定优先级更高

- `new绑定 > 显示绑定(apply/call/bind) > 隐式绑定(obj.foo()) > 默认绑定(独立函数调用)`

## call函数的实现

::: tip

`call` 与 `apply` 传入`null` 或者 `undefined` 会指向 `window`

:::

```js
Function.prototype.mycall = function(thisArg, ...args) {
  // 1.获取需要被执行的函数
  const fn = this

  // 2.对thisArg转成对象类型(防止它传入的是非对象类型)
  thisArg = (thisArg !== null && thisArg !== undefined) ? Object(thisArg): window

  // 3.调用需要被执行的函数
  thisArg.fn = fn
  const result = thisArg.fn(...args)
  delete thisArg.fn

  // 4.将最终的结果返回出去
  return result
}
```

## apply函数的实现

```js
Function.prototype.myapply = function(thisArg, argArray) {
  // 1.获取到要执行的函数
  var fn = this

  // 2.处理绑定的thisArg
  thisArg = (thisArg !== null && thisArg !== undefined) ? Object(thisArg): window

  // 3.执行函数
  thisArg.fn = fn
 
  argArray = argArray || []
  result = thisArg.fn(...argArray)

  delete thisArg.fn

  // 4.返回结果
  return result
}
```

## bind函数的实现

::: tip

`bind` 是可以在使用的时候传入参数，随后调用的时候继续传参

```js
function sum(num1, num2, num3, num4) {
  console.log(num1, num2, num3, num4)
}
var newSum = sum.bind("aaa", 10)
newSum(20, 30, 40) // 10, 20, 30, 40
```

:::

```js
Function.prototype.mybind = function(thisArg, ...argArray) {
  // 1.获取到真实需要调用的函数
  var fn = this

  // 2.绑定this
  thisArg = (thisArg !== null && thisArg !== undefined) ? Object(thisArg): window

  function proxyFn(...args) {
    // 3.将函数放到thisArg中进行调用
    thisArg.fn = fn
    // 特殊: 对两个传入的参数进行合并
    var finalArgs = [...argArray, ...args]
    var result = thisArg.fn(...finalArgs)
    delete thisArg.fn

    // 4.返回结果
    return result
  }
  return proxyFn
}
```

