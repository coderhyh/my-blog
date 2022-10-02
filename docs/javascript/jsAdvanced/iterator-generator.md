---
title: Iterator-Generator
date: 2022-09-20
sidebar: 'auto'
tags:
 - 笔记
 - js
categories:
 - javascript
---

## 迭代器

- 迭代器（iterator），是确使用户可在容器对象（container，例如链表或数组）上遍访的对象，使用该接口无需关心对象的内部实现细节。 
  - 其行为像数据库中的光标，迭代器最早出现在1974年设计的CLU编程语言中； 
  - 在各种编程语言的实现中，迭代器的实现方式各不相同，但是基本都有迭代器，比如Java、Python等；
-  从迭代器的定义我们可以看出来，迭代器是帮助我们对某个数据结构进行遍历的对象。
-  在JavaScript中，迭代器也是一个具体的对象，这个对象需要符合迭代器协议（iterator protocol）：
  - 迭代器协议定义了产生一系列值（无论是有限还是无限个）的标准方式； 
  - 那么在js中这个标准就是一个**特定的next方法**；
- next方法有如下的要求： 
  - 一个无参数或者一个参数的函数，返回一个应当拥有以下两个属性的对象： 
  - done（boolean）
    - 如果迭代器可以产生序列中的下一个值，则为 false。（这等价于没有指定 done 这个属性。） 
    - 如果迭代器已将序列迭代完毕，则为 true。这种情况下，value 是可选的，如果它依然存在，即为迭代结束之后的默认返回值。 
  - value 
    - 迭代器返回的任何 JavaScript 值。done 为 true 时可省略。

```js
// 数组
const names = ["abc", "cba", "nba"]

// 创建一个迭代器对象来访问数组
let index = 0

const namesIterator = {
  next: function() {
    if (index < names.length) {
      return { done: false, value: names[index++] }
    } else {
      return { done: true, value: undefined }
    }
  }
}
console.log(namesIterator.next())
console.log(namesIterator.next())
console.log(namesIterator.next()) // { done: false, value: "nba" }
console.log(namesIterator.next()) // { done: true, value: undefined }
```

生成迭代器的函数

```js
function createArrayIterator(arr) {
  let index = 0
  return {
    next: function() {
      if (index < arr.length) {
        return { done: false, value: arr[index++] }
      } else {
        return { done: true, value: undefined } 
      }
    }
  }
}
const names = ["abc", "cba", "nba"]

const namesIterator = createArrayIterator(names)
console.log(namesIterator.next())
console.log(namesIterator.next())
console.log(namesIterator.next())
```

## 可迭代对象

- 但是上面的代码整体来说看起来是有点奇怪的： 
  - 我们获取一个数组的时候，需要自己创建一个index变量，再创建一个所谓的迭代器对象； 
  - 事实上我们可以对上面的代码进行进一步的封装，让其变成一个可迭代对象；
- 什么又是可迭代对象呢？ 
  - 它和迭代器是不同的概念； 
  - 当一个对象实现了iterable protocol协议时，它就是一个可迭代对象； 
  - 这个对象的要求是必须实现 @@iterator 方法，在代码中我们使用 Symbol.iterator 访问该属性； 
- 当我们要问一个问题，我们转成这样的一个东西有什么好处呢？
  - 当一个对象变成一个可迭代对象的时候，进行某些迭代操作，比如 for...of 操作时，其实就会调用它的 @@iterator 方法；

```js
const iterableObj = {
  names: ["abc", "cba", "nba"],
  [Symbol.iterator]: function() {
    let index = 0
    return {
      next: () => {
        if (index < this.names.length) {
          return { done: false, value: this.names[index++] }
        } else {
          return { done: true, value: undefined }
        }
      }
    }
  }
}
const iterator = iterableObj[Symbol.iterator]()
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
```

## 原生迭代器对象

- 事实上我们平时创建的很多原生对象已经实现了可迭代协议，会生成一个迭代器对象的：
  - String、Array、Map、Set、arguments对象、NodeList集合；

## 自定义类的迭代

- 在上面我们看到Array、Set、String、Map等类创建出来的对象都是可迭代对象： 
  - 在面向对象开发中，我们可以通过class定义一个自己的类，这个类可以创建很多的对象： 
  - 如果我们也希望自己的类创建出来的对象默认是可迭代的，那么在设计类的时候我们就可以添加上 @@iterator 方法；
- 案例：创建一个classroom的类 
  - 教室中有自己的位置、名称、当前教室的学生； 
  - 这个教室可以进来新学生（push）； 
  - 创建的教室对象是可迭代对象；

```js
class Classroom {
  constructor(address, name, students) {
    this.address = address
    this.name = name
    this.students = students
  }

  entry(newStudent) {
    this.students.push(newStudent)
  }

  [Symbol.iterator]() {
    let index = 0
    return {
      next: () => {
        if (index < this.students.length) {
          return { done: false, value: this.students[index++] }
        } else {
          return { done: true, value: undefined }
        }
      },
      return: () => {
        console.log("迭代器提前终止了~")
        return { done: true, value: undefined }
      }
    }
  }
}
```

## 迭代器的中断

- 迭代器在某些情况下会在没有完全迭代的情况下中断：

  - 比如遍历的过程中通过break、continue、return、throw中断了循环操作； 
  - 比如在解构的时候，没有解构所有的值；

- 那么这个时候我们想要**监听中断**的话，可以添加return方法：

  ```js
  [Symbol.iterator]() {
    let index = 0
    return {
      next: () => {
        if (index < this.students.length) {
          return { done: false, value: this.students[index++] }
        } else {
          return { done: true, value: undefined }
        }
      },
      return: () => {
        console.log("迭代器提前终止了~")
        return { done: true, value: undefined }
      }
    }
  }
  ```

## 生成器

- 生成器是ES6中新增的一种函数控制、使用的方案，它可以让我们更加灵活的控制函数什么时候继续执行、暂停执行等。
- 平时我们会编写很多的函数，这些函数终止的条件通常是返回值或者发生了异常。
- 生成器函数也是一个函数，但是和普通的函数有一些区别：
  - 生成器函数需要在function的后面加一个符号：*
  - 生成器函数可以通过yield关键字来控制函数的执行流程
  - 生成器函数的返回值是一个Generator（生成器）：
    - 生成器事实上是一种特殊的迭代器；
    - MDN：Instead, they return a special type of iterator, called a Generator.

## 生成器函数执行

- 我们发现上面的生成器函数foo的执行体压根没有执行，它只是返回了一个生成器对象。
  - 那么如何可以让它执行函数中的东西呢？调用next即可；
  - 之前学习迭代器时，知道迭代器的next是会有返回值的；
  - 但是很多时候不希望next返回的是一个undefined，这个时候可以通过yield来返回结果；

```js
// 当遇到yield时候值暂停函数的执行
// 当遇到return时候生成器就停止执行
function* foo() {
  console.log("函数开始执行~")

  const value1 = 100
  console.log("第一段代码:", value1)
  yield value1

  const value2 = 200
  console.log("第二段代码:", value2)
  yield value2

  const value3 = 300
  console.log("第三段代码:", value3)
  yield value3

  console.log("函数执行结束~")
  return "123"
}

// generator本质上是一个特殊的iterator
const generator = foo()
console.log("返回值1:", generator.next())
console.log("返回值2:", generator.next())
console.log("返回值3:", generator.next())
console.log("返回值3:", generator.next())
```

## 生成器传递参数 – next函数

- 在调用next函数的时候，可以给它传递参数，那么这个参数会作为上一个yield语句的返回值；
- 注意：也就是说是为本次的函数代码块执行提供了一个值；

```js
function* foo(num) {
  console.log("函数开始执行~")

  const value1 = 100 * num
  console.log("第一段代码:", value1)
  const n = yield value1 // 10

  const value2 = 200 * n
  console.log("第二段代码:", value2)
  const count = yield value2 // 25

  const value3 = 300 * count
  console.log("第三段代码:", value3)
  yield value3

  console.log("函数执行结束~")
  return "123"
}

// 生成器上的next方法可以传递参数
const generator = foo(5)
console.log(generator.next())
// 第二段代码, 第二次调用next的时候执行的
console.log(generator.next(10))
console.log(generator.next(25))
```

## 生成器提前结束 – return函数

- 还有一个可以给生成器函数传递参数的方法是通过return函数：

  - return传值后这个生成器函数就会结束，之后调用next不会继续生成值了；

  ```js
  console.log(generator.return(15))
  ```

## 生成器抛出异常 – throw函数

- 除了给生成器函数内部传递参数之外，也可以给生成器函数内部抛出异常： 

  - 抛出异常后可以在生成器函数中捕获异常； 

  ```js
  function* foo() {
    console.log("代码开始执行~")
  
    const value1 = 100
    try {
      yield value1
    } catch (error) {
      console.log("捕获到异常情况:", error)
      yield "abc"
    }
  
    console.log("代码执行结束~")
  }
  
  const generator = foo()
  
  const result = generator.next()
  generator.throw("error message")
  ```


## 生成器替代迭代器

- 生成器是一种特殊的迭代器，那么在某些情况下我们可以使用生成器来替代迭代器
- 生成器是一个迭代器，那么也就可以使用for...of、Set等

```js
const names = ["abc", "cba", "nba"]
```

```js
function* createArrayIterator(arr) {
	// 1.第一种写法
  yield "abc" // { done: false, value: "abc" }
  yield "cba" // { done: false, value: "abc" }
  yield "nba" // { done: false, value: "abc" }
  
  // 2.第二种写法
  for (const item of arr) {
    yield item
  }
  
  // 3.第三种写法 yield* 语法糖
  // 使用yield*来生产一个可迭代对象
  yield* arr
}
```

## 异步处理方案

假设一个请求方法

```js
function requestData(url) {
  // 异步请求的代码会被放入到executor中
  return new Promise((resolve, reject) => {
    // 模拟网络请求
    setTimeout(() => {
      // 拿到请求的结果
      resolve(url)
    }, 2000);
  })
}

// 需求: 
// 1> url: why -> res: why
// 2> url: res + "aaa" -> res: whyaaa
// 3> url: res + "bbb" => res: whyaaabbb
```

```js
// 1.第一种方案: 多次回调
// 回调地狱
requestData("why").then(res => {
  requestData(res + "aaa").then(res => {
    requestData(res + "bbb").then(res => {
      console.log(res)
    })
  })
})
```

```js
// 2.第二种方案: Promise中then的返回值来解决
requestData("why").then(res => {
  return requestData(res + "aaa")
}).then(res => {
  return requestData(res + "bbb")
}).then(res => {
  console.log(res)
})
```

```js
// 3.第三种方案: Promise + generator实现
function* getData() {
  const res1 = yield requestData("why")
  const res2 = yield requestData(res1 + "aaa")
  const res3 = yield requestData(res2 + "bbb")
  const res4 = yield requestData(res3 + "ccc")
  console.log(res4)
}

// 1> 手动执行生成器函数 每一步需要手动执行 太繁琐
const generator = getData()
generator.next().value.then(res => {
  generator.next(res).value.then(res => {
    generator.next(res).value.then(res => {
      generator.next(res)
    })
  })
})
```

```js
// 2> 自己封装了一个自动执行的函数
function execGenerator(genFn) {
  const generator = genFn()
  function exec(res) {
    const result = generator.next(res)
    if (result.done) {
      return result.value
    }
    result.value.then(res => {
      exec(res)
    })
  }
  exec()
}

execGenerator(getData) // 可以自动执行生成器函数
```

```js
// 3> 第三方包co自动执行
// TJ: co/n(nvm)/commander(coderwhy/vue cli)/express/koa(egg)
const co = require('co')
co(getData)
```

```js
// 4.第四种方案: async/await
async function getData() {
  const res1 = await requestData("why")
  const res2 = await requestData(res1 + "aaa")
  const res3 = await requestData(res2 + "bbb")
  const res4 = await requestData(res3 + "ccc")
  console.log(res4)
}
```

