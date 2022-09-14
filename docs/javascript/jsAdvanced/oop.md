---
title: 面向对象
date: 2022-08-10
sidebar: 'auto'
tags:
 - 笔记
 - js
 - oop
categories:
 - javascript
---



## defineProperty方法

```js
// name和age虽然没有使用属性描述符来定义, 但是它们也是具备对应的特性的
// value: 赋值的value
// configurable: true
// enumerable: true
// writable: true
var obj = {
  name: "hyh",
  age: 18
}
```

数据属性描述符:

```js
// 数据属性描述符
// 用了属性描述符, 那么会有默认的特性
Object.defineProperty(obj, "address", {
  value: "北京市", // 默认值undefined
  // 该特性不可删除/也不可以重新定义属性描述符
  configurable: false, // 默认值false
  // 该特性是配置对应的属性(address)是否是可以枚举
  enumerable: true, // 默认值false
  // 该特性是属性是否是可以赋值(写入值) 
  writable: false // 默认值false
})
```

存取属性描述符(vue2响应式原理):

```js
// 1.隐藏某一个私有属性被希望直接被外界使用和赋值
// 2.如果我们希望截获某一个属性它访问和设置值的过程时, 也会使用存储属性描述符
Object.defineProperty(obj, "address", {
  enumerable: true,
  configurable: true,
  get: function() { // 默认为undefined
    foo()
    return this._address
  },
  set: function(value) { // 默认为undefined
    bar()
    this._address = value
  }
})
console.log(obj.address)
obj.address = "上海市"
console.log(obj.address)

function foo() {
  console.log("获取了一次address的值")
}
function bar() {
  console.log("设置了addres的值")
}
```

Object.defineProperties() 方法直接在一个对象上定义 多个 新的属性或修改现有属性，并且返回该对象

```js
var obj = {
  // 私有属性(js里面是没有严格意义的私有属性)
  _age: 18,
  _eating: function() {},
  // 也是可以使用以下写法的 ***
  // set age(value) {
  //  this._age = value
  // },
  // get age() {
  //  return this._age
  // }
}

Object.defineProperties(obj, {
  name: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: "why"
  },
  age: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this._age
    },
    set: function(value) {
      this._age = value
    }
  }
})

obj.age = 19
console.log(obj.age)
console.log(obj)
```

### 对象方法补充

- 获取对象的属性描述符：
  - `getOwnPropertyDescriptor(obj, 'name')` 获取单个
  - `pgetOwnPropertyDescriptors(obj)` 获取全部
- 禁止对象扩展新属性：`preventExtensions(obj)`
  - 给一个对象添加新的属性会失败（在严格模式下会报错）
- 密封对象，不允许配置和删除属性：`seal(obj)`
  - 实际是调用preventExtensions
  - 并且将现有属性的configurable:false
- 冻结对象，不允许修改现有属性： `freeze(obj)`
  - 实际上是调用seal
  - 并且将现有属性的writable: false

## 工厂模式

- 工厂模式其实是一种常见的设计模式； 
- 通常我们会有一个工厂方法，通过该工厂方法我们可以产生想要的对象；

::: tip
无法解决对象识别的问题（即怎样知道一个对象的类型）
:::

```js
function createPerson (name, age) {
  return {
    name: name,
    age: age,
    sayName: function () {
      console.log(this.name)
    }
  }
}
var p1 = createPerson('张三', 18)
var p2 = createPerson('李四', 18)
```

## 构造函数模式

::: tip
构造函数代码执行过程
:::

要创建 `Person` 实例，则必须使用 `new` 操作符。 以这种方式调用构造函数会经历以下 4 个步骤：

1. 创建一个新对象。
2. 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）。
3. 执行构造函数中的代码。
4. 返回新对象。

```js
function Person (name, age) {
  this.name = name
  this.age = age
  this.sayName = function () {
    console.log(this.name)
  }
}

var p1 = new Person('张三', 18)
p1.sayName() // => 张三

var p2 = new Person('李四', 23)
p2.sayName() // => 李四
```

::: tip
同时我们可以识别对象的**具体类型**了。在每一个实例对象中的`__proto__`中同时有一个 `constructor` 属性，该属性指向创建该实例的**构造函数**：
:::

```js
console.log(p1.constructor === Person) // => true
console.log(p2.constructor === Person) // => true
console.log(p1.constructor === p2.constructor) // => true
```

对象的 `constructor` 属性最初是用来标识对象类型的， 但是，如果要检测对象的类型，还是使用 `instanceof` 操作符更可靠一些：

```js
console.log(p1 instanceof Person) // => true
console.log(p2 instanceof Person) // => true
```

::: warning
但是这样有一个很大的弊端。 那就是对于每一个实例对象，`p1` 和 `p2` 都是一模一样的内容， 每一次生成一个实例，都必须为重复的内容，多占用一些内存，如果实例对象很多，会造成极大的内存浪费。
:::

::: tip
对于这种问题我们 **可以把需要共享的函数定义到构造函数外部**：
:::

```js
var fns = {
  sayHello: function () {
    console.log('hello ' + this.name)
  },
  sayAge: function () {
    console.log(this.age)
  }
}

function Person (name, age) {
  this.name = name
  this.age = age
  this.type = '学生'
  this.sayHello = fns.sayHello
  this.sayAge = fns.sayAge
}

var p1 = new Person('王五', 18)
var p2 = new Person('李四', 16)

console.log(p1.sayHello === p2.sayHello) // => true
console.log(p1.sayAge === p2.sayAge) // => true
```

## 面向对象的特性 – 继承

- 面向对象有三大特性：封装、继承、多态
  - 封装：我们前面将属性和方法封装到一个类中，可以称之为封装的过程；
  - 继承：继承是面向对象中非常重要的，不仅仅可以减少重复代码的数量，也是多态前提（纯面向对象中）；
  - 多态：不同的对象在执行时表现出不同的形态；

```js
// 父类: 公共属性和方法
function Person() {
  this.name = "hyh"
  this.friends = []
}

Person.prototype.eating = function() {
  console.log(this.name + " eating~")
}

// 子类: 特有属性和方法
function Student() {
  this.sno = 111
}

Student.prototype = new Person()

Student.prototype.studying = function() {
  console.log(this.name + " studying~")
}

// name/sno
var stu = new Student()
```

```js
// 原型链实现继承的弊端:
// 1.第一个弊端: 打印stu对象, 继承的属性是看不到的
// console.log(stu) // Person { sno: 111 }

// 2.第二个弊端: 创建出来两个stu的对象
var stu1 = new Student()
var stu2 = new Student()

// 直接修改对象上的属性, 是给本对象添加了一个新属性
stu1.name = "kobe"
console.log(stu2.name) // hyh

// 获取引用, 修改引用中的值, 会相互影响
stu1.friends.push("kobe")

console.log(stu1.friends) // kobe
console.log(stu2.friends) // kobe

// 3.第三个弊端: 在前面实现类的过程中都没有传递参数
var stu3 = new Student("lilei", 112) // 无法给父类传
```

**借用构造函数方案**

```js
// 父类: 公共属性和方法
function Person(name, age, friends) {
  // this = stu
  this.name = name
  this.age = age
  this.friends = friends
}

Person.prototype.eating = function() {
  console.log(this.name + " eating~")
}

// 子类: 特有属性和方法
function Student(name, age, friends, sno) {
  // 通过调用父类进行传参
  // 由于改变了this指向  那么父类操作的this 就是子类的数据了~
  Person.call(this, name, age, friends)
  // this.name = name
  // this.age = age
  // this.friends = friends
  this.sno = 111
}

var p = new Person()
Student.prototype = p

Student.prototype.studying = function() {
  console.log(this.name + " studying~")
}

// name/sno
var stu = new Student("hyh", 18, ["kobe"], 111)

// console.log(stu.name)
// stu.eating()
// stu.studying()

// 强调: 借用构造函数也是有弊端:
// 1.第一个弊端: Person函数至少被调用了两次
// 2.第二个弊端: stu的原型对象上会多出一些属性, 但是这些属性是没有存在的必要
```

### 继承的原理

::: tip
每个普通对象都有一个 `__proto__` 属性，指向谁  就可以继承谁上面的属性和方法

实例对象的 `__proto__` 默认指向他的构造函数的原型对象
:::

## 原型对象模式

- JavaScript当中每个对象都有一个特殊的内置属性 `__proto__`，这个特殊的对象可以指向另外一个对象。
- 那么这个对象有什么用呢？
  - 当我们通过引用对象的属性key来获取一个value时，它会触发 [[Get]]的操作；
  - 这个操作会首先检查该属性是否有对应的属性，如果有的话就使用它；
  - 如果对象中没有改属性，那么会访问对象`__proto__`内置属性指向的对象上的属性；
- 如果通过字面量直接创建一个对象，这个对象也会有这样的属性的;
- 获取的方式有两种：
  - 方式一：通过对象的 __proto__ 属性可以获取到（但是这个是早期浏览器自己添加的，存在一定的兼容性问 题）；
  - 方式二：通过 `Object.getPrototypeOf` 方法可以获取到；
- 事实上原型对象上面是有一个属性的：constructor
  - 默认情况下原型上都会添加一个属性叫做constructor，这个constructor指向当前的函数对象；

```js
// 构造函数模式+原型对象模式
// 构造函数内部放私有的  原型对象上放公用的
function Person(name,age){
  // 生成的实例对象中私有的属性
  this.name=name;
  this.age=age;
}
// 构造函数的原型对象上  公用
// 定义在构造函数原型对象上的属性和方法都会被  实例对象 => 继承
Person.prototype.type="人";
Person.prototype.dance=function(){
  console.log("扭扭捏捏");
}

var p1=new Person("张三",20);
var p2=new Person("李四",30);
console.log(p1.dance==p2.dance);/
console.log(p1);
```

重写原型对象

```js
function foo() {}

foo.prototype = {
  // constructor: foo,
  name: "hyh",
  age: 18,
  height: 1.85
}

var f1 = new foo()

console.log(f1.name, f1.age, f1.height)

// 真实开发中我们可以通过Object.defineProperty方式添加constructor
Object.defineProperty(foo.prototype, "constructor", {
  enumerable: false,
  configurable: true,
  writable: true,
  value: foo
})
```

### 原型式继承

```js
var obj = {
  name: "hyh",
  age: 18
}

var info = Object.create(obj)

// 原型式继承函数 Object.create的原理
function createObject1(o) {
  var newObj = {}
  Object.setPrototypeOf(newObj, o)
  return newObj
}
// 早期 Object.create的原理
function createObject2(o) {
  function Fn() {}
  Fn.prototype = o
  var newObj = new Fn()
  return newObj
}

// var info = createObject2(obj)
var info = Object.create(obj)
console.log(info) // {}
console.log(info.__proto__) // { name: "hyh", age: 18 }
```

**优化**

**但是这样又回到工厂模式了，所以还不是最终方案**

```js
var personObj = {
  running: function() {
    console.log("running")
  }
}

function createStudent(name) {
  var stu = Object.create(personObj)
  stu.name = name
  stu.studying = function() {
    console.log("studying~")
  }
  return stu
}

var stuObj = createStudent("hyh")
var stuObj1 = createStudent("kobe")
var stuObj2 = createStudent("james")
```

### 最终方案

```js
function createObject(o) {
  function Fn() {}
  Fn.prototype = o
  return new Fn()
}
------------------------
function inheritPrototype(SubType, SuperType) {
  SubType.prototype = Objec.create(SuperType.prototype)
  Object.defineProperty(SubType.prototype, "constructor", { 
    enumerable: false,
    configurable: true,
    writable: true,
    value: SubType
  })
}

function Person(name, age, friends) {
  this.name = name
  this.age = age
  this.friends = friends
}

Person.prototype.running = function() {
  console.log("running~")
}

Person.prototype.eating = function() {
  console.log("eating~")
}

function Student(name, age, friends, sno, score) {
  Person.call(this, name, age, friends)
  this.sno = sno
  this.score = score
}

inheritPrototype(Student, Person)

Student.prototype.studying = function() {
  console.log("studying~")
}

var stu = new Student("hyh", 18, ["kobe"], 111, 100)
console.log(stu)
stu.studying()
stu.running()
stu.eating()

console.log(stu.constructor.name)
```

## ES6 class

- 在ES6（ECMAScript2015）新的标准中使用了class关键字来直接定义类；
- 但是类本质上依然是前面所讲的构造函数、原型链的语法糖而已；

我们来研究一下类的一些特性：

- 你会发现它和我们的构造函数的特性其实是一致的；

```js
// 类的声明
class Person {
}
// 类的表达式
var Animal = class {
}

// 研究一下类的特性
console.log(Person) // [class Person]
console.log(Person.prototype) // {}
console.log(Person.prototype.__proto__)
console.log(Person.prototype.constructor)// [class Person]
console.log(typeof Person) // function
 
var p = new Person()
console.log(p.__proto__ === Person.prototype) // true
```

### class定义

```js
var names = ["abc", "cba", "nba"]

class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
    this._address = "广州市"
  }

  // 普通的实例方法
  // 创建出来的对象进行访问
  // var p = new Person()
  // p.eating()
  eating() {
    console.log(this.name + " eating~")
  }

  running() {
    console.log(this.name + " running~")
  }

  // 类的访问器方法
  get address() {
    console.log("拦截访问操作")
    return this._address
  }

  set address(newAddress) {
    console.log("拦截设置操作")
    this._address = newAddress
  }

  // 类的静态方法(类方法)
  // Person.createPerson()
  static randomPerson() {
    var nameIndex = Math.floor(Math.random() * names.length)
    var name = names[nameIndex]
    var age = Math.floor(Math.random() * 100)
    return new Person(name, age)
  }
}

var p = new Person("why", 18)
p.eating()
p.running()

console.log(p.address)
p.address = "北京市"
console.log(p.address)

// console.log(Object.getOwnPropertyDescriptors(Person.prototype))

for (var i = 0; i < 50; i++) {
  console.log(Person.randomPerson())
}
```

### class继承

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  running() {
    console.log(this.name + " running~")
  }

  eating() {
    console.log(this.name + " eating~")
  }

  personMethod() {
    console.log("处理逻辑1")
    console.log("处理逻辑2")
    console.log("处理逻辑3")
  }

  static staticMethod() {
    console.log("PersonStaticMethod")
  }
}

// Student称之为子类(派生类)
class Student extends Person {
  // JS引擎在解析子类的时候就有要求, 如果我们有实现继承
  // 那么子类的构造方法中, 在使用this之前
  constructor(name, age, sno) {
    super(name, age)
    this.sno = sno
  }

  studying() {
    console.log(this.name + " studying~")
  }

  // 类对父类的方法的重写
  running() {
    console.log("student " + this.name + " running")
  }

  // 重写personMethod方法
  personMethod() {
    // 复用父类中的处理逻辑
    super.personMethod()

    console.log("处理逻辑4")
    console.log("处理逻辑5")
    console.log("处理逻辑6")
  }

  // 重写静态方法
  static staticMethod() {
    super.staticMethod()
    console.log("StudentStaticMethod")
  }
}

var stu = new Student("why", 18, 111)
console.log(stu)

// console.log(Object.getOwnPropertyDescriptors(stu.__proto__))
// console.log(Object.getOwnPropertyDescriptors(stu.__proto__.__proto__))

stu.eating()
stu.running()

stu.personMethod()

Student.staticMethod()

console.log(Object.getOwnPropertyDescriptors(Person))
```

### 创建类继承自内置类

```js
class HYArray extends Array {
  firstItem() {
    return this[0]
  }

  lastItem() {
    return this[this.length-1]
  }
}

var arr = new HYArray(1, 2, 3)
console.log(arr.firstItem())
console.log(arr.lastItem())
```

### 类的混入mixin

```js
class Person {

}

function mixinRunner(BaseClass) {
  class NewClass extends BaseClass {
    running() {
      console.log("running~")
    }
  }
  return NewClass
}

function mixinEater(BaseClass) {
  return class extends BaseClass {
    eating() {
      console.log("eating~")
    }
  }
}

// 在JS中类只能有一个父类: 单继承
class Student extends Person {

}

var NewStudent = mixinEater(mixinRunner(Student))
var ns = new NewStudent()
ns.running()
ns.eating()
```

::: tip

但是这样是有弊端的: 即无法传参

在react中的高阶组件：redux有封装mixins

:::

### JavaScript中的多态

- 面向对象的三大特性：封装、继承、多态。

- 传统的面向对象多态是有三个前提:

  - 必须有继承(是多态的前提)
  - 必须有重写(子类重写父类的方法)
  - 必须有父类引用指向子类对象

- 维基百科对多态的定义：

  - **多态**（英语：polymorphism）指为不同数据类型的实体提供统一的接口，或使用一 个单一的符号来表示多个不同的类型。

- 总结

  - 不同的数据类型进行同一个操作，表现出不同的行为，就是多态的体现。

  那么从上面的定义来看，JavaScript是一定存在多态的。

  ```js
  function sum(m, n) {
    return m + n
  }
  
  sum(20, 30)
  sum("abc", "cba")
  ```

ts中的多态

```typescript
// Shape形状
class Shape {
  getArea() {}
}

class Rectangle extends Shape {
  getArea() {
    return 100
  }
}

class Circle extends Shape {
  getArea() {
    return 200
  }
}

var r = new Rectangle()
var c = new Circle()

// 多态: 当对不同的数据类型执行同一个操作时, 如果表现出来的行为(形态)不一样, 那么就是多态的体现.
function calcArea(shape: Shape) {
  console.log(shape.getArea())
}

calcArea(r)
calcArea(c)

export {}
```



### 内部执行步骤

当我们通过new关键字操作类的时候，会调用这个constructor函数，并且执行如下操作：

- 在内存中创建一个新的对象（空对象）；
- 这个对象内部的[[prototype]]属性会被赋值为该类的prototype属性；
- 构造函数内部的this，会指向创建出来的新对象；
- 构造函数内部的this，会指向创建出来的新对象；
- 如果构造函数没有返回非空对象，则返回创建出来的新对象；

## 构造函数、实例对象、原型对象的关系

::: tip
**构造函数** 和 **实例对象** 
:::

::: tip
构造函数通过关键字 `new` **创建实例**对象

实例对象中都会有 `constructor` 属性**指向他的构造函数**
:::

::: tip
**构造函数** 和 **原型对象** 
:::

::: tip
每个函数都有一个 `prototype` 属性**指向他的原型对象**

定义在原型对象上的**属性和方法**都会**被实例对象所继承**
:::

::: tip
**实例对象** 和 **原型对象**
:::

::: tip
实例对象的 `__proto__` 指向他构造函数的原型对象
:::



## 原型链

::: tip
原型链 => 主要用于继承

**原型链最顶层的原型对象就是Object的原型对象**

:::

::: tip
每个普通对象都会有  `__proto__`  属性指向他构造函数的原型对象

当访问对象的属性和方法时，会先在当前对象内部查找，

不存在则沿着__proto__属性向上一级查找直到找到 `null` 为止
:::

## `new` 操作符干了啥事？

::: tip
每个普通对象都有一个 `__proto__` 属性，指向谁  就可以继承谁上面的属性和方法

同时 指向他构造函数的原型对象；普通对象的  `__proto__` 指向Object

**普通对象和实例对象没有prototype**
:::

```js
var p = {};
p.__proto__ = Person.prototype; //公用 继承 把属性和方法继承给p对象
Person.call(p); //私有
```

如果一个函数被使用new操作符调用了，那么它会执行如下操作：

- 在内存中创建一个新的对象（空对象）；
- 该构造函数的`prototype`属性会 赋值给 这个对象内部的`__proto__`属性；
- 构造函数内部的this，会指向创建出来的新对象；
- 执行函数的内部代码（函数体代码）；
- 如果构造函数没有返回非空对象，则返回创建出来的新对象；