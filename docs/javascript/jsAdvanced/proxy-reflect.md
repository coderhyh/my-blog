---
title: Proxy-Reflect
date: 2022-08-24
sidebar: 'auto'
tags:
 - 笔记
 - js
categories:
 - javascript
---

## 监听对象的操作

- 先来看一个需求：有一个对象，我们希望监听这个对象中的属性被设置或获取的过程
  - 可以使用 `Object.defineProperty` 的存储属性描述符来对 属性的操作进行监听。
- 但是这样做有什么缺点呢？
  - 首先，`Object.defineProperty`设计的初衷，不是为了去监听截止一个对象中 所有的属性的。
    - 我们在定义某些属性的时候，初衷其实是定义普通的属性，但是后面我们强行将它变成了**数据属性描述符**。
  - 其次，如果我们想监听更加丰富的操作，比如新增属性、删除属性，那么 `Object.defineProperty`是无能为力的。
  - 所以我们要知道，**存储数据描述符**设计的初衷并不是为了去监听一个完整的对象。

## Proxy基本使用

- 在ES6中，新增了一个Proxy类，是用于帮助我们创建一个代理的：

  - 如果我们希望监听一个对象的相关操作，那么我们可以先创建一个代理对象（Proxy对象）；
  - 之后对该对象的所有操作，都通过代理对象来完成，代理对象可以监听我们想要对原对象进行哪些操作；

  ```js
  const obj = {
    name: "hyh",
    age: 18
  }
  
  const objProxy = new Proxy(obj, {
    // 获取值时的捕获器
    get: function(target, key) {
      console.log(`监听到对象的${key}属性被访问了`, target)
      return target[key]
    },
  
    // 设置值时的捕获器
    set: function(target, key, newValue) {
      console.log(`监听到对象的${key}属性被设置值`, target)
      target[key] = newValue
    }
  })
  ```

### Proxy的set和get捕获器

- 如果我们想要侦听某些具体的操作，那么就可以在handler中添加对应的捕捉器（Trap）：
- set和get分别对应的是函数类型；
  - set函数有四个参数：
    - target：目标对象（侦听的对象）；
    - property：将被设置的属性key；
    - value：新属性值；
    - receiver：调用的代理对象；
  - get函数有三个参数：
    - target：目标对象（侦听的对象）；
    - property：被获取的属性key；
    - receiver：调用的代理对象；

### Proxy所有捕获器

| proxy                              | 对应                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| handler.getPrototypeOf()           | Object.getPrototypeOf 方法的捕捉器                           |
| handler.setPrototypeOf()           | Object.setPrototypeOf 方法的捕捉器                           |
| handler.isExtensible()             | Object.isExtensible 方法的捕捉器                             |
| handler.preventExtensions()        | Object.preventExtensions 方法的捕捉器                        |
| handler.getOwnPropertyDescriptor() | Object.getOwnPropertyDescriptor 方法的捕捉器                 |
| handler.defineProperty()           | Object.defineProperty 方法的捕捉器                           |
| handler.ownKeys()                  | Object.getOwnPropertyNames 方法 和 Object.getOwnPropertySymbols 方法的捕捉器 |
| handler.has()                      | in 操作符的捕捉器                                            |
| handler.get()                      | 属性读取操作的捕捉器                                         |
| handler.set()                      | 属性设置操作的捕捉器                                         |
| handler.deleteProperty()           | delete 操作符的捕捉器                                      |
| handler.apply()                    | 函数调用操作的捕捉器                                         |
| handler.construct()                | new 操作符的捕捉器                                           |

### Proxy的construct和apply

- 我们看到捕捉器中还有`construct`和`apply`，它们是应用于函数对象的：

  ```js
  function foo() {}
  
  const fooProxy = new Proxy(foo, {
    apply: function(target, thisArg, argArray) {
      console.log("对foo函数进行了apply调用")
      return target.apply(thisArg, argArray)
    },
    construct: function(target, argArray, newTarget) {
      console.log("对foo函数进行了new调用")
      return new target(...argArray)
    }
  })
  
  fooProxy.apply({}, ["abc", "cba"])
  new fooProxy("abc", "cba")
  ```

### proxy->Receiver的作用

- 我们发现在使用getter、setter的时候有一个receiver的参数，它的作用是什么呢？

  - 如果我们的源对象（obj）有setter、getter的访问器属性，那么可以通过receiver来改变里面的this；

  ::: tip

  tips: 如果不使用`receiver`改变`this`指向的话，那么他会默认指向没有被代理的obj -> 这样就会造成拿 `_name` 的时候监听失效

  所以这里改变`this`那么就是指向被代理的`objProxy`，这样访问的`_name`就是被代理过的 -> 就可以监听操作

  :::

  ```js
  const obj = {
    _name: "hyh",
    get name() {
      return this._name
    },
    set name(newValue) {
      this._name = newValue
    }
  }
  
  const objProxy = new Proxy(obj, {
    get: function(target, key, receiver) {
      // receiver是创建出来的代理对象
      console.log("get方法被访问--------", key, receiver)
      console.log(receiver === objProxy)
      return Reflect.get(target, key, receiver)// 传入receiver改变this: 指向为 -> objProxy
    },
    set: function(target, key, newValue, receiver) {
      console.log("set方法被访问--------", key)
      Reflect.set(target, key, newValue, receiver)
    }
  })
  
  console.log(objProxy.name)
  objProxy.name = "kobe"
  ```

## Reflect的作用

- Reflect也是ES6新增的一个API，它是一个对象，字面的意思是反射
- 那么这个Reflect有什么用呢？
  - 它主要提供了很多操作**JavaScript对象的方法**，有点**像Object中操作对象的方法；**
  - 比如`Reflect.getPrototypeOf(target)`类似于 `Object.getPrototypeOf()`；
  - 比如`Reflect.defineProperty(target, propertyKey, attributes)`类似于`Object.defineProperty()` ；
- 如果我们有Object可以做这些操作，那么**为什么还需要有Reflect这样的新增对象呢？**
  - 这是因为在早期的ECMA规范中**没有考虑到这种对 对象本身 的操作如何设计会更加规范**，所以**将这些API放到了Object上面**；
  - 但是**Object作为一个构造函数**，这些操作实际上**放到它身上并不合适；**
  - 另外还包含一些类似于 in、delete操作符，让js看起来是会有一些奇怪的；
  - 所以在ES6中新增了Reflect，让我们这些操作都集中到了Reflect对象上；
- 那么Object和Reflect对象之间的API关系，可以参考MDN文档：
  - [文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/Comparing_Reflect_and_Object_methods)

### Reflect的常见方法

| Reflect                                                 | Object                                                       |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| Reflect.getPrototypeOf(target)                          | 类似于 Object.getPrototypeOf()                               |
| Reflect.setPrototypeOf(target, prototype)               | 设置对象原型的函数. 返回一个 Boolean， 如果更新成功，则返 回true |
| Reflect.isExtensible(target)                            | 类似于 Object.isExtensible()                                 |
| Reflect.preventExtensions(target)                       | 类似于 Object.preventExtensions()。返回一个Boolean           |
| Reflect.getOwnPropertyDescriptor(target, propertyKey)   | 类似于 Object.getOwnPropertyDescriptor()。<br />如果对象中存在 该属性，则返回对应的属性描述符, 否则返回 undefined |
| Reflect.defineProperty(target, propertyKey, attributes) | 和 Object.defineProperty() 类似。如果设置成功就会返回 true   |
| Reflect.ownKeys(target)                                 | 返回一个包含所有自身属性（不包含继承属性）的数组。<br />(类似于 Object.keys(), 但不会受enumerable影响) |
| Reflect.has(target, propertyKey)                        | 判断一个对象是否存在某个属性，和 in 运算符 的功能完全相同    |
| Reflect.get(target, propertyKey[, receiver])            | 获取对象身上某个属性的值，类似于 target[name]                |
| Reflect.set(target, propertyKey, value[, receiver])     | 将值分配给属性的函数。返回一个Boolean，如果更新成功，则返回true |
| Reflect.deleteProperty(target, propertyKey)             | 作为函数的delete操作符，相当于执行 delete target[name]       |
| Reflect.apply(target, thisArgument, argumentsList)      | 对一个函数进行调用操作，同时可以传入一个数组作为调用参数。<br />和 Function.prototype.apply() 功能类似 |
| Reflect.construct(target, argumentsList[, newTarget])   | 对构造函数进行 new 操作，相当于执行 new target(...args)      |

### Reflect的使用

- 那么我们可以将之前Proxy案例中对原对象的操作，都修改为Reflect来操作：

  ```js
  const obj = {
    name: "hyh",
    age: 18
  }
  
  const objProxy = new Proxy(obj, {
    get: function(target, key, receiver) {
      console.log("get---------")
      return Reflect.get(target, key)
    },
    set: function(target, key, newValue, receiver) {
      console.log("set---------")
      // target[key] = newValue
      const result = Reflect.set(target, key, newValue)
    }
  })
  
  objProxy.name = "kobe"
  console.log(objProxy.name)
  ```

### Reflect的construct

```js
function Student(name, age) {
  this.name = name
  this.age = age
}

function Teacher() {

}

// const stu = new Student("hyh", 18)
// console.log(stu)
// console.log(stu.__proto__ === Student.prototype)

// 执行Student函数中的内容, 但是创建出来对象是Teacher对象
const teacher = Reflect.construct(Student, ["hyh", 18], Teacher)
console.log(teacher)
console.log(teacher.__proto__ === Teacher.prototype) // true
```