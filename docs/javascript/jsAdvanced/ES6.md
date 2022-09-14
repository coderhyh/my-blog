---
title: ES6-ES12部分解析
date: 2022-08-18
sidebar: 'auto'
tags:
 - 笔记
 - js
categories:
 - javascript
---

## var/let/const -- ES6

- 在ES5中我们声明变量都是使用的var关键字，从ES6开始新增了两个关键字可以声明变量：let、const
  - let、const在其他编程语言中都是有的，所以也并不是新鲜的关键字；
  - 但是let、const确确实实给JavaScript带来一些不一样的东西；
- let关键字：
  - 从直观的角度来说，let和var是没有太大的区别的，都是用于声明一个变量
- const关键字：
  - const关键字是constant的单词的缩写，表示常量、衡量的意思；
  - 它表示保存的数据一旦被赋值，就不能被修改；
  - 但是如果赋值的是引用类型，那么可以通过引用找到对应的对象，修改对象的内容；
- 注意：另外let、const不允许重复声明变量；

### let/const作用域提升

- let、const和var的另一个重要区别是作用域提升：

  - 我们知道var声明的变量是会进行作用域提升的；
  - 但是如果我们使用let声明的变量，在声明之前访问会报错；

- 那么是不是意味着foo变量只有在代码执行阶段才会创建的呢？

  - 事实上并不是这样的，我们可以看一下ECMA262对let和const的描述；

  - **这些变量会被创建在包含他们的词法环境被实例化时，但是是不可以访问它们的，直到词法绑定被求值；**

    let and const declarations define variables that are scoped to the running execution context's LexicalEnvironment.`The variables are created when their containing Lexical Environment isinstantiated but may not be accessed in any way until the variable's LexicalBinding is evaluated.`A variable defined by a LexicalBinding with an Initializer is assigned the value of its Initializer'sAssignmentExpression when the LexicalBinding is evaluated, not when the variable is created. If aLexicalBinding in a let declaration does not have an lnitializer the variable is assigned the valueundefined when the LexicalBinding is evaluated.

### let/const有没有作用域提升呢？

- 从上面我们可以看出，在**执行上下文的词法环境创建出来的时候**，**变量事实上已经被创建了**，只是这个变量是**不能被访问的**
  - 那么变量已经有了，但是不能被访问，是不是一种作用域的提升呢？
- 事实上维基百科并没有对作用域提升有严格的概念解释，那么我们自己从字面量上理解；
  - 作用域提升：**在声明变量的作用域中，如果这个变量可以在声明之前被访问，那么我们可以称之为作用域提升；**
  - 在这里，它虽然被创建出来了，但是不能被访问，我**认为不能称之为作用域提升；**
- 所以我的观点是let、const**没有进行作用域提升**，**但是会在解析阶段被创建出来。**

### Window对象添加属性

- 我们知道，在全局通过var来声明一个变量，事实上会在window上添加一个属性
  - 但是let、const是不会给window上添加任何属性的。
- 那么我们可能会想这个变量是保存在哪里呢？
  - 会存放在[变量环境](/docs/javaScript/jsAdvanced/operatingPrinciple.html#变量环境和环境记录)中

### 变量被保存到VariableMap中

- 也就是说我们**声明的变量和环境记录**是被添加到**变量环境**中的：

  - 但是标准有没有规定这个对象是window对象或者其他对象呢？

  - 其实并没有，那么JS引擎在解析的时候，其实会有自己的实现；

  - 比如v8中其实是通过`VariableMap`的一个`hashmap`来实现它们的存储的

  - 那么`window`对象呢？而`window`对象是早期的**GO对象**，在最新的实现中其实是**浏览器添加的全局对象**，并且 一直保持了window和var之间值的相等性；(即window的属性与var声明的变量之间保持同步)

    ```c++
    // A hash·map to ·support·fast variable· declaration·and ·lookup.
    class VariableMap : public ZoneHashMap {
      public:
      	explicit VariableMap(Zone* zone);
      	VariableMap(const VariableMap& other,Zone* zone);
      	VariableMap (VariableMap&& other) V8_NOEXCEPT: ZoneHashMap(std : : move(other)){
        }
    ```

## Symbol -- ES6

- Symbol是什么呢？Symbol是ES6中新增的一个基本数据类型，翻译为符号。
- 那么为什么需要Symbol呢？
  - 在ES6之前，对象的属性名都是字符串形式，那么很容易造成属性名的冲突;
  - 比如原来有一个对象，我们希望在其中添加一个新的属性和值，但是我们在不确定它原来内部有什么内容的情况下， 很容易造成冲突，从而覆盖掉它内部的某个属性；
  - 比如开发中我们使用混入，那么混入中出现了同名的属性，必然有一个会被覆盖掉；
- Symbol就是为了解决上面的问题，用来生成一个独一无二的值。
  - Symbol值是通过Symbol函数来生成的，生成后可以作为属性名；
  - 也就是在ES6中，对象的属性名可以使用字符串，也可以使用Symbol值；
- Symbol即使多次创建值，它们也是不同的：Symbol函数执行后每次创建出来的值都是独一无二的；
- 我们也可以在创建Symbol值的时候传入一个描述description：这个是ES2019（ES10）新增的特性；

**Symbol的基本使用**

```js
const s1 = Symbol()
const s2 = Symbol()

console.log(s1 === s2)

// ES2019(ES10)中, Symbol还有一个描述(description)
const s3 = Symbol("aaa")
console.log(s3.description)


// Symbol值作为key
// 在定义对象字面量时使用
const obj = {
  [s1]: "abc",
  [s2]: "cba"
}

// 新增属性
obj[s3] = "nba"

// Object.defineProperty方式
const s4 = Symbol()
Object.defineProperty(obj, s4, {
  enumerable: true,
  configurable: true,
  writable: true,
  value: "mba"
})

console.log(obj[s1], obj[s2], obj[s3], obj[s4])
// 注意: 不能通过.语法获取
// console.log(obj.s1)

// 使用Symbol作为key的属性名,在遍历/Object.keys等中是获取不到这些Symbol值
// 需要Object.getOwnPropertySymbols来获取所有Symbol的key
console.log(Object.keys(obj))
console.log(Object.getOwnPropertyNames(obj))
console.log(Object.getOwnPropertySymbols(obj))
const sKeys = Object.getOwnPropertySymbols(obj)
for (const sKey of sKeys) {
  console.log(obj[sKey])
}
// 创建相同的Symbol
// 使用Symbol.for方法来做到这一点
// 并且可以通过Symbol.keyFor方法来获取对应的key；
// Symbol.for(key)/Symbol.keyFor(symbol)
const sa = Symbol.for("aaa")
const sb = Symbol.for("aaa")
console.log(sa === sb)

const key = Symbol.keyFor(sa)
console.log(key)
const sc = Symbol.for(key)
console.log(sa === sc)
```

## Set的基本使用 -- ES6

- 在ES6之前，我们存储数据的结构主要有两种：数组、对象。
  - 在ES6中新增了另外两种数据结构：Set、Map，以及它们的另外形式WeakSet、WeakMap。
- Set是一个新增的数据结构，可以用来保存数据，类似于数组，但是和数组的区别是元素**不能重复(引用类型除外)**。
  - 创建Set我们需要通过Set构造函数（暂时没有字面量创建的方式）：

### Set的常见方法

- Set常见的属性：
  - size：返回Set中元素的个数；
- Set常用的方法：
  - add(value)：添加某个元素，返回Set对象本身；
  - delete(value)：从set中删除和这个值相等的元素，返回boolean类型；
  - has(value)：判断set中是否存在某个元素，返回boolean类型；
  - clear()：清空set中所有的元素，没有返回值；
  - forEach(callback, [, thisArg])：通过forEach遍历set；
- 另外Set是支持for of的遍历的。

## WeakSet使用 -- ES6

- 和`Set`类似的另外一个数据结构称之为`WeakSet`，也是内部元素不能重复的数据结构。
- 和`Set`的区别
  - 区别一：`WeakSet`中只能存放对象类型，不能存放基本数据类型；
  - 区别二：`WeakSet`对元素的引用是弱引用，如果其他对象都不再引用该对象，那么GC就会对该对象进行回收；
- WeakSet常见的方法：
  - add(value)：添加某个元素，返回WeakSet对象本身；
  - delete(value)：从WeakSet中删除和这个值相等的元素，返回boolean类型；
  - has(value)：判断WeakSet中是否存在某个元素，返回boolean类型；

## Map的基本使用 -- ES6

- 另外一个新增的数据结构是Map，用于存储映射关系。
- 但是我们可能会想，在之前我们可以使用对象来存储映射关系，他们有什么区别呢？
  - 事实上我们对象存储映射关系只能用字符串（ES6新增了Symbol）作为属性名（key）；
  - 某些情况下我们可能希望通过其他类型作为key，比如对象，这个时候会自动将对象转成字符串来作为key；

### Map的常用方法

- Map常见的属性：
  - size：返回Map中元素的个数；
- Map常见的方法：
  - set(key, value)：在Map中添加key、value，并且返回整个Map对象；
  - get(key)：根据key获取Map中的value；
  - has(key)：判断是否包括某一个key，返回Boolean类型；
  - delete(key)：根据key删除一个键值对，返回Boolean类型；
  - clear()：清空所有的元素；
  - forEach(callback, [, thisArg])：通过forEach遍历Map；
- Map也可以通过for of进行遍历。

## WeakMap的使用 -- ES6

- 和Map类型的另外一个数据结构称之为WeakMap，也是以键值对的形式存在的。
- 和Map的区别
  - 区别一：WeakMap的key只能使用对象，不接受其他的类型作为key；
  - 区别二：WeakMap的key对对象想的引用是弱引用，如果其他对象都不再引用该对象，那么GC就可以回收该对象；
- WeakMap常见的方法有四个：
  - set(key, value)：在Map中添加key、value，并且返回整个Map对象；
  - get(key)：根据key获取Map中的value；
  - has(key)：判断是否包括某一个key，返回Boolean类型；
  - delete(key)：根据key删除一个键值对，返回Boolean类型；

### WeakMap的应用

****

- `WeakMap`是非常重要的
  - 因为vue的响应式原理就是用到了`WeakMap`来映射对应需要响应的属性

```js
// 应用场景(vue3响应式原理)
const obj1 = {
  name: "hyh",
  age: 18
}

function obj1NameFn1() {
  console.log("obj1NameFn1被执行")
}

function obj1NameFn2() {
  console.log("obj1NameFn2被执行")
}

function obj1AgeFn1() {
  console.log("obj1AgeFn1")
}

function obj1AgeFn2() {
  console.log("obj1AgeFn2")
}

// 1.创建WeakMap
const weakMap = new WeakMap()

// 2.收集依赖结构
// 2.1.对obj1收集的数据结构
const obj1Map = new Map()
obj1Map.set("name", [obj1NameFn1, obj1NameFn2])
obj1Map.set("age", [obj1AgeFn1, obj1AgeFn2])
weakMap.set(obj1, obj1Map)

obj1.name = "james"
// 3.如果obj1.name发生了改变 就会执行
// Proxy/Object.defineProperty
const targetMap = weakMap.get(obj1)
const fns = targetMap.get("name")
fns.forEach(item => item())
```

## Object entries -- ES8

通过Object.entries 可以获取到一个数组，数组中会存放可枚举属性的键值对数组。

```js
const obj = {
  name: "hyh",
  age: 18
}
console.log(Object.entries(obj)) // [ [ 'name', 'hyh' ], [ 'age', 18 ] ]

console.log(Object.entries(["abc", "cba", "nba"])) // [ [ '0', 'abc' ], [ '1', 'cba' ], [ '2', 'nba' ] ]
console.log(Object.entries("abc")) // [ [ '0', 'a' ], [ '1', 'b' ], [ '2', 'c' ] ]
```

## String Padding -- ES8

某些字符串我们需要对其进行前后的填充，来实现某种格式化效果，ES8中增加了 `padStart` 和 `padEnd` 方法，分 别是对字符串的首尾进行填充的。

```js
const message = "Hello World"

const newMessage = message.padStart(15, "*").padEnd(20, "-")
console.log(newMessage)
```

卡号只显示后四位案例

```js
const cardNumber = "321324234242342342341312"
const lastFourCard = cardNumber.slice(-4)
const finalCard = lastFourCard.padStart(cardNumber.length, "*")
console.log(finalCard)
```

## flat flatMap -- ES10

- flat() 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。
- flatMap() 方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。
  - flatMap是先进行map操作，再做flat的操作；
  - flatMap中的flat相当于深度为1；

```js
// 1.flat的使用
const nums = [10, 20, [2, 9], [[30, 40], [10, 45]], 78, [55, 88]]
nums.flat(depth?: 1 | undefined) // [ 10, 20, 2, 9, [ 30, 40 ], [ 10, 45 ], 78, 55, 88 ]
          
// 3.flatMap的应用场景
const messages = ["Hello World", "hello lyh", "my name is coderwhy"]
const words = messages.flatMap(item => {
  return item.split(" ")
})
console.log(words) // [ 'Hello', 'World', 'hello', 'lyh', 'my', 'name', 'is', 'coderwhy' ]
```

## Object fromEntries -- ES10

在前面，我们可以通过 `Object.entries` 将一个对象转换成 `entries`，那么如果我们有一个`entries`了，如何将其转换成对象呢？

```js
const queryString = 'name=hyh&age=18&height=1.85'
const queryParams = new URLSearchParams(queryString)
console.log(queryParams) // URLSearchParams { 'name' => 'hyh', 'age' => '18', 'height' => '1.85' }

const paramObj = Object.fromEntries(queryParams)
console.log(paramObj) // { name: 'hyh', age: '18', height: '1.85' }
```

## BigInt -- ES11

- 在早期的JavaScript中，我们不能正确的表示过大的数字：

  - 大于`Number.MAX_SAFE_INTEGER`的数值，表示的可能是不正确的。

- 那么ES11中，引入了新的数据类型BigInt，用于表示大的整数：

  - BitInt的表示方法是在数值的后面加上n

    ```js
    const bigInt = 900719925474099100n
    console.log(bigInt + 10n)
    const num = 100
    console.log(bigInt + BigInt(num))
    ```

## Global This -- ES11

- 在之前我们希望获取JavaScript环境的全局对象，不同的环境获取的方式是不一样的
  - 比如在浏览器中可以通过this、window来获取；
  - 比如在Node中我们需要通过global来获取；
- 那么在ES11中对获取全局对象进行了统一的规范：`globalThis`

## for..in 标准化 -- ES11

- 在ES11之前，虽然很多浏览器支持for...in来遍历对象类型，但是并没有被ECMA标准化。
- 在ES11中，对其进行了标准化，for...in是用于遍历对象的key的

## FinalizationRegistry -- ES12

- `FinalizationRegistry` 对象可以让你在对象被垃圾回收时请求一个回调

  - `FinalizationRegistry` 提供了这样的一种方法：

  - 当一个在注册表中注册的对象被回收时，请求在某个时间点上调 用一个清理回调。（清理回调有时被称为 `finalizer` ）;

  - 你可以通过调用register方法，注册任何你想要清理回调的对象，传入该对象和所含的值;

    ```js
    // ES12: FinalizationRegistry类
    const finalRegistry = new FinalizationRegistry((value) => {
      console.log("注册在finalRegistry的对象, 某一个被销毁", value)
    })
    
    let obj = { name: "hyh" }
    let info = { age: 18 }
    
    finalRegistry.register(obj, "obj")
    finalRegistry.register(info, "info")
    
    obj = null
    info = null
    ```

## WeakRefs -- ES12

- 如果我们默认将一个对象赋值给另外一个引用，那么这个引用是一个强引用：

  - 如果我们希望是一个弱引用的话，可以使用WeakRef :

    ```js
    let obj = { name: "hyh" }
    let info = new WeakRef(obj)
    ```





