---
title: ts笔记
date: 2022-05-28
sidebar: 'auto'
tags:
 - 笔记
 - ts
categories:
 -  typescript
---

::: tip
![img](/images/23.png)
:::
<!-- more -->

## 数据类型
> 定义数组

```typescript
let array: number[] = [1, 2, 3]
泛型: let array: Array<number> = [1, 2, 3]
```

> 元组 
跟数组一样 就是规定了类型以及长度

```typescript
let tuple: [type1, type2, type3] = [val1, val2, val3];
// 可以通过push pop操作
```

> 枚举 ：用一组标识 来 代替 某个值；方便程序猿调解
也可以不加值  默认就是下标

```typescript
enum Gender {
  Boy = 1,
  Girl = 2,
  Unknown = 3
}
```

> never : 代表不存在的值 不会有返回 常用作为抛出异常或者无限循环的 函数的返回类型

  补充：never是ts中的底部类型，所有类型都是never的父类， 所以never类型可以赋值给 任意类型的 变量

```typescript
function test() : never {
    throw new Error("err")
}
```

> 字面类型

锁死变量的一个范围

```typescript
let a = 100|200;
// 那么这个a只能等于 100 或者 200
a = 100;
let b = string|number // 也可以是类型
```

> any 与 unknown

```typescript
let a:any; // 2.如果吧any换成unknown  再把a赋值给b就会报错
a = 1; a = '2'; a = true;
let b:string;
b = a // 1.这个时候a的值是true，类型是Boolean，但是还是成功赋值给了b  ---b应是string的 莫名变成了Boolean了
```

## never  类型

> ts将使用 never 类型来表示不应该存在的状态

```typescript
// 返回never的函数必须存在无法达到的终点
// 因为必定抛出异常，所以 error 将不会有返回值
function error(message: string): never {
  throw new Error(message);
}

// 因为存在死循环，所以 loop 将不会有返回值
function loop(): never {
  while (true) {
  }
}
```

> never 与 `void` 的差异

```typescript
//void类型只是没有返回值 但本身不会出错
function Void():void {
  console.log();
}

//只会抛出异常没有返回值
function Never():never {
  throw new Error('aaa')
}
```

### never 类型的一个应用场景

```typescript
interface A {
  type: "foo"
}

interface B {
  type: "bar"
}
type All = A | B ;
function handleValue(val: All) {
  switch (val.type) {
    case 'foo':
      break;
    case 'bar':
      break
    default:
      //兜底逻辑 一般是不会进入这儿如果进来了就是程序异常了
      const exhaustiveCheck:never = val;
      break
  }
}
```

比如新来了一个同事他新增了一个C接口，我们必须手动找到所有 switch 代码并处理，否则将有可能引入 BUG 。

而且这将是一个“隐蔽型”的BUG，如果回归面不够广，很难发现此类BUG。

那 TS 有没有办法帮助我们在类型检查阶段发现这个问题呢？

```typescript
interface A {
  type: "foo"
}

interface B {
  type: "bar"
}
interface C {
  type: "bizz"
}
type All = A | B | C;
function handleValue(val: All) {
  switch (val.type) {
    case 'foo':
      break;
    case 'bar':
      break
    // case 'bizz': 要加上 否则会报错 ps：不加的话就进入 兜底逻辑 中了， 会有程序异常
      // break
    default:
      //兜底逻辑 一般是不会进入这儿如果进来了就是程序异常了

      const exhaustiveCheck: never = val; // error ts提示报错 必须为case加一个判断 接口 C 的
      break
  }
}
```

## 元组

**元组（Tuple）是固定数量的不同类型的元素的组合**。

```typescript
let arr:[number,string] = [1,'string']
 
let arr2: readonly [number,boolean,string,undefined] = [1,true,'sring',undefined]
```

```typescript
let arr:[number,string] = [1,'string'] 
 
arr.push(true)//error
```

**应用场景 例如定义excel返回的数据**

```typescript
let excel: [string, string, number, string][] = [
    ['title', 'name', 1, '123'],
    ['title', 'name', 1, '123'],
    ['title', 'name', 1, '123'],
    ['title', 'name', 1, '123'],
    ['title', 'name', 1, '123'],
]
```



## 类型断言

> 语法: `值 as 类型　　或　　<类型>值  value as string  <string>value`

```typescript
interface Foo {
  bar: number;
  bas: string;
}

const foo = {} as Foo;
foo.bar = 123;
foo.bas = 'hello';

// 另一种形式（由于这种形式和jsx容易混淆，建议使用as关键字）
const bar = <Foo>{};
```

```typescript
interface A {
  run: string
}

interface B {
  build: string
}

const fn = (type: A | B): string => {
  return (type as A).run
	// 或者 return (<A>type).run
}
//可以使用类型断言来推断他传入的是A接口的值
```

> 使用any临时断言

```typescript
window.abc = 123
//这样写会报错因为window没有abc这个东西

(window as any).abc = 123
//可以使用any临时断言在 any 类型的变量上，访问任何属性都是允许的。
```

> `as const`

```typescript
const names = '小满'
names = 'aa' //无法修改
 
let names2 = '小满' as const
names2 = 'aa' //无法修改

// 与普通const是有区别的
// 数组
let a1 = [10, 20] as const;
const a2 = [10, 20];
 
a1.unshift(30); // 错误，此时已经断言字面量为[10, 20],数据无法做任何修改
a2.unshift(30); // 通过，没有修改指针
```

## 泛型

### 函数泛型

我写了两个函数一个是数字类型的函数，另一个是string类型的函数,其实就是类型不同，

实现的功能是一样的，这时候我们就可以使用泛型来优化

```typescript
function num (a:number,b:number) : Array<number> {
  return [a ,b];
}
num(1,2)
function str (a:string,b:string) : Array<string> {
  return [a ,b];
}
str('独孤','求败')
```

泛型优化

```typescript
function Add<T>(a: T, b: T): Array<T>  {
  return [a,b]
}

Add<number>(1,2)
Add<string>('1','2')
```

也可以使用不同的泛型参数名，只要在数量上和使用方式上能对应上就可以。

```typescript
function Sub<T,U>(a:T,b:U):Array<T|U> {
  const params:Array<T|U> = [a,b]
  return params
}
Sub<Boolean,number>(false,1)
```

### 定义泛型接口

声明接口的时候 在名字后面加一个 <参数>

使用的时候传递类型

```typescript
interface MyInter<T> {
  (arg: T): T
}
function fn<T>(arg: T): T {
  return arg
}
let result: MyInter<number> = fn

result(123)
```

### 对象字面量泛型

```typescript
let foo: { <T>(arg: T): T }

foo = function <T>(arg:T):T {
  return arg
}
foo(123)
```

### 泛型约束

我们期望在一个泛型的变量上面，获取其`length`参数，但是，有的数据类型是没有`length`属性的

```typescript
function getLegnth<T>(arg:T) {
  return arg.length // err
}
```

于是，我们就得对使用的泛型进行约束，我们约束其为具有`length`属性的类型，这里我们会用到`interface`,代码如下

```typescript
interface Len {
   length:number
}
 
function getLegnth<T extends Len>(arg:T) {
  return arg.length
}
 
getLegnth<string>('123')
```

### 使用keyof 约束对象

其中使用了TS泛型和泛型约束。首先定义了T类型并使用extends关键字继承object类型的子类型，然后使用keyof操作符获取T类型的所有键，它的返回类型是 联合类型，最后利用extends关键字约束 K类型必须为keyof T联合类型的子类型

```typescript
function prop<T, K extends keyof T>(obj: T, key: K) {
   return obj[key]
}
 
let o = { a: 1, b: 2, c: 3 }
 
prop(o, 'a') 
prop(o, 'd') // err 没有 d 这个key
```

### 泛型类

声明方法跟函数类似名称后面定义<类型>

使用的时候确定类型`new Sub<number>()`

```typescript
class Sub<T>{
  attr: T[] = [];
  add (a:T):T[] {
    return [a]
  }
}

let s = new Sub<number>()
s.attr = [1,2,3]
s.add(123)

let str = new Sub<string>()
str.attr = ['1','2','3']
str.add('123')
```



## 函数
> 定义函数需要设置返回值类型 并且传参的长度 与 类型 都要跟形参 一致

```typescript
function func(a: 'hhh'): string {
  return a
}
```

> 可选参数 与 默认值： 加上问号 为可选；设置了默认值 也是可选的

```typescript
function func(a ?: 'hhh', b: string = '666'): string {
  return a
}
```

## 枚举

**使用枚举 通过enum关键字定义我们的枚举**

### 1.数字枚举

```typescript
例如 红绿蓝 Red = 0 Green = 1 Blue= 2 分别代表红色0 绿色为1 蓝色为2

enum Types{
  Red = 0,
  Green = 1,
  BLue = 2
}
//默认就是从0开始的 可以不写值
```

> 增长枚举

```typescript
enum Types{
  Red = 1,
  Green,
  BLue
}
//如上，我们定义了一个数字枚举， Red使用初始化为 1。 其余的成员会从 1开始自动增长。 换句话说， Type.Red的值为 1， Green为 2， Blue为 3。
```

### 2.字符串枚举

```typescript
enum Types{
  Red = 'red',
  Green = 'green',
  BLue = 'blue'
}
```

### 3.异构枚举

```typescript
// 枚举可以混合字符串和数字成员
enum Types{
  No = "No",
  Yes = 1,
}
```

### 4.接口枚举

定义一个枚举Types 定义一个接口A 他有一个属性red 值为Types.yyds

```typescript
enum Types {
  yyds,// 默认是 0
  dddd
}
interface A {
  red:Types.yyds
}
let obj:A = {
  red:Types.yyds
}
```

### 5.`const`枚举

`const` 声明的枚举会被编译成常量

```typescript
const enum Types{
  No = "No",
  Yes = 1,
}
// 编译为
console.log(1 /* Yes */);
console.log("No" /* No */);
```

普通声明的枚举编译完后是个对象

```typescript
var Types;
(function (Types) {
  Types["No"] = "No";
  Types[Types["Yes"] = 1] = "Yes";
})(Types || (Types = {}));
console.log(Types.Yes);
console.log(Types.No);
```

### 6.反向映射

它包含了正向映射（ `name` -> `value`）和反向映射（ `value` -> `name`）

要注意的是 *不会*为字符串枚举成员生成反向映射。

```typescript
enum Enum {
  fall
}
let a = Enum.fall;
console.log(a); //0
let nameOfA = Enum[a]; 
console.log(nameOfA); //fall
```

## interface & type

### type

> 类型合并

```typescript
type a = {
  a: string
}
type b = a & {b: number}
const data: b = {
  a: '1',
  b: 1
}
```

> 定义函数别名

```typescript
type str = () => string
let s: str = () => "666"
console.log(s);
```

> 联合类型别名

```typescript
type str = string | number
let s: str = 123
let s2: str = '123'

console.log(s,s2);
```

> 定义值的别名

```typescript
type value = boolean | 0 | '213'
 
let s:value = true
//变量s的值  只能是上面value定义的值
```

### interface

> 声明合并

```typescript
interface a {
  a: string
}
interface a {
  b: number
}
const data: a = {
  a: '1',
  b: 1
}
```

> 接口继承

```typescript
interface a {
  a: string
}
interface aa extends a {
  b: number,
}
const data: aa = {
  a: '1',
  b: 1
}
```

> 接口限定 class类

```typescript
interface cl {
  name: string,
  move(): void
}
  // 可以多写 不能少写
class D implements cl {
  name: string = '1'
  move(): void {}
}
```

## 类

```typescript
abstract class Ani { // 抽象类
  name: string
  constructor(name: string) {
    this.name = name
  }
  move(distance: number):void {
    console.log(this.name + '移动了' + distance + 'M');
  }
  abstract test(a: string):void  // 抽象方法 -- 告知子类重新定义这个 ps：必须是抽象类才可以使用 抽象方法在派生类实现
}

class Dog extends Ani {
  constructor() {
    super('小狗')
  }
  move(distance: number) {
    console.log(this.name + '奔跑了...');
    super.move(distance)
  }
  test(a: string) { // 重新定义抽象方法
  	console.log(a)    
  }
}

const dog = new Dog();
dog.move(20)

```

> 类的修饰符

```typescript
public // 公共的 当前类与子类 外部类都可以访问
protected // 受保护的 当前类与子类
readonly // 私有的 当前类
static // 静态的 须通过 类名调用  不可以this
abstract // 抽象类 或 方法
	// 抽象的类 不可以进行实例化
```

## tsconfig.json配置文件

生成tsconfig.json 文件

这个文件是通过`tsc --init`命令生成的

> 配置详解

```json
"compilerOptions": {
  "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
  "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
  "diagnostics": true, // 打印诊断信息 
  "target": "ES5", // 目标语言的版本
  "module": "CommonJS", // 生成代码的模板标准
  "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
  "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
  "allowJS": true, // 允许编译器编译JS，JSX文件
  "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
  "outDir": "./dist", // 指定输出目录
  "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
  "declaration": true, // 生成声明文件，开启后会自动生成声明文件
  "declarationDir": "./file", // 指定生成声明文件存放目录
  "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
  "sourceMap": true, // 生成目标文件的sourceMap文件
  "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
  "declarationMap": true, // 为声明文件生成sourceMap
  "typeRoots": [], // 声明文件目录，默认时node_modules/@types
  "types": [], // 加载的声明文件包
  "removeComments":true, // 删除注释 
  "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
  "noEmitOnError": true, // 发送错误时不输出任何文件
  "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
  "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
  "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
  "strict": true, // 开启所有严格的类型检查
  "alwaysStrict": true, // 在代码中注入'use strict'
  "noImplicitAny": true, // 不允许隐式的any类型
  "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
  "strictFunctionTypes": true, // 不允许函数参数双向协变
  "strictPropertyInitialization": true, // 类的实例属性必须初始化
  "strictBindCallApply": true, // 严格的bind/call/apply检查
  "noImplicitThis": true, // 不允许this有隐式的any类型
  "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
  "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
  "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
  "noImplicitReturns": true, //每个分支都会有返回值
  "esModuleInterop": true, // 允许export=导出，由import from 导入
  "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
  "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
  "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
  "paths": { // 路径映射，相对于baseUrl
    // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
    "jquery": ["node_modules/jquery/dist/jquery.min.js"]
  },
  "rootDirs": ["src","out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
  "listEmittedFiles": true, // 打印输出文件
  "listFiles": true// 打印编译的文件(包括引用的声明文件)
}
 
// 指定一个匹配列表（属于自动指定该路径下的所有ts相关文件）
"include": [
   "src/**/*"
],
// 指定一个排除列表（include的反向操作）
 "exclude": [
   "demo.ts"
],
// 指定哪些文件使用该配置（属于手动一个个指定文件）
 "files": [
   "demo.ts"
]
```

> 常用的

```txt
1.include
指定编译文件默认是编译当前目录下所有的ts文件

2.exclude
指定排除的文件

3.target
指定编译js 的版本例如es5  es6

4.allowJS
是否允许编译js文件

5.removeComments
是否在编译过程中删除文件中的注释

6.rootDir
编译文件的目录

7.outDir
输出的目录

8.sourceMap
代码源文件

9.strict
严格模式

10.module
默认common.js  可选es6模式 amd  umd 等
```

## 三斜线指令

三斜线指令是包含单个XML标签的单行注释。 注释的内容会做为编译器指令使用。

三斜线指令仅可放在包含它的文件的最顶端。 一个三斜线指令的前面只能出现单行或多行注释，这包括其它的三斜线指令。 如果它们出现在一个语句或声明之后，那么它们会被当做普通的单行注释，并且不具有特殊的涵义。

```typescript
/// <reference path="..." /> 指令是三斜线指令中最常见的一种。 它用于声明文件间的 依赖。
```

三斜线引用告诉编译器在编译过程中要引入的额外的文件。

你也可以把它理解能import，它可以告诉编译器在编译过程中要引入的额外的文件

> 例如a.ts

```typescript
namespace A { // 命名空间
  export const fn = () => 'a'
}
```

> b.ts

```typescript
namespace A {
  export const fn2 = () => 'b'
}
```

> index.ts

```typescript
///<reference path="./index2.ts" />
///<reference path="./index3.ts" />

// 引入之后直接可以使用变量A
console.log(A);
```

### 声明文件引入

例如，把 `/// <reference types="node" />`引入到声明文件，表明这个文件使用了 `@types/node/index.d.ts`里面声明的名字； 

并且，这个包需要在编译阶段与声明文件一起被包含进来。

> 仅当在你需要写一个`d.ts`文件时才使用这个指令。

```typescript
///<reference types="node" />
```

::: warning 

注意事项：

​		如果你在配置文件 配置了noResolve 或者自身调用自身文件会报错

:::



## 声明文件d.ts

声明文件 declare

当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。

```typescript
declare var 声明全局变量
declare function 声明全局方法
declare class 声明全局类
declare enum 声明全局枚举类型
declare namespace 声明（含有子属性的）全局对象
interface 和 type 声明全局类型
/// <reference /> 三斜线指令
```

例如 我们有一个express 和 axios

index.ts

```typescript
import axios from 'axios'
import express from 'express' // err
```

 发现express 报错了

让我们去下载他的声明文件

npm install @types/node -D

那为什么axios 没有报错

我们可以去node_modules 下面去找axios 的package.json



发现axios已经指定了声明文件 所以没有报错可以直接用

通过语法declare 暴露我们声明的axios 对象

declare  const axios: AxiosStatic;

如果有一些第三方包确实没有声明文件我们可以自己去定义

名称.d.ts 创建一个文件去声明

例如express.d.ts

declare  const express: ()=> any;

关于这些第三发的声明文件包都收录到了 npm.js

## Mixins混入

ts 混入 Mixins 其实vue也有mixins这个东西 你可以把他看作为合并

### 1.对象混入

可以使用ES6的Object.assign 合并多个对象

此时 people 会被推断成一个交差类型 **Name & Age & sex**;

```typescript
interface Name {
  name: string
}
interface Age {
  age: number
}
interface Sex {
  sex: number
}

let people1: Name = { name: "小满" }
let people2: Age = { age: 20 }
let people3: Sex = { sex: 1 }

const people = Object.assign(people1,people2,people3)
```

### 2.类的混入

首先声明两个mixins类 （严格模式要关闭不然编译不过）

```typescript
class A {
  type: boolean = false;
  changeType() {
    this.type = !this.type
  }
}

class B {
  name: string = '张三';
  getName(): string {
    return this.name;
  }
}
```

下面创建一个类，结合了这两个mixins

首先应该注意到的是，没使用extends而是使用implements。 把类当成了接口

我们可以这么做来达到目的，为将要mixin进来的属性方法创建出占位属性。 这告诉编译器这些成员在运行时是可用的。 这样就能使用mixin带来的便利，虽说需要提前定义一些占位属性

```typescript
class C implements A,B{
  type:boolean
  changeType:()=>void;
  name: string;
  getName:()=> string
}
```

最后，创建这个帮助函数，帮我们做混入操作。 它会遍历mixins上的所有属性，并复制到目标上去，把之前的占位属性替换成真正的实现代码

**`Object.getOwnPropertyNames()`可以获取对象自身的属性，除去他继承来的属性，**
**对它所有的属性遍历，它是一个数组，遍历一下它所有的属性名**

```typescript
Mixins(C, [A, B])
function Mixins(curCls: any, itemCls: any[]) {
  itemCls.forEach(item => {
    Object.getOwnPropertyNames(item.prototype).forEach(name => {
      curCls.prototype[name] = item.prototype[name]
    })
  })
}
```

## 装饰器Decorator

它们不仅增加了代码的可读性，清晰地表达了意图，而且提供一种方便的手段，增加或修改类的功能

若要启用实验性的装饰器特性，你必须在命令行或`tsconfig.json`里启用编辑器选项 experimentalDecorators

###  装饰器

装饰器是一种特殊类型的声明，它能够被附加到[类声明](https://www.tslang.cn/docs/handbook/decorators.html#class-decorators)，[方法](https://www.tslang.cn/docs/handbook/decorators.html#method-decorators)， [访问符](https://www.tslang.cn/docs/handbook/decorators.html#accessor-decorators)，[属性](https://www.tslang.cn/docs/handbook/decorators.html#property-decorators)或[参数](https://www.tslang.cn/docs/handbook/decorators.html#parameter-decorators)上。 

首先定义一个类

```typescript
class A {
  constructor() {

  }
}
```

定义一个类装饰器函数 他会把Class A的[构造函数](https://so.csdn.net/so/search?q=构造函数&spm=1001.2101.3001.7020)传入你的watcher函数当做第一个参数

```typescript
const watcher: ClassDecorator = (target: Function) => {
  target.prototype.getParams = <T>(params: T):T => {
    return params
  }
}
```

使用的时候 直接通过@函数名使用

```typescript
@watcher
class A {
  constructor() {

  }
}
```

```typescript
const a = new A();
console.log((a as any).getParams('123')); // 123
```

### 装饰器工厂

其实就是一个高阶函数 外层的函数接受值 里层的函数最终接受类的构造函数

```typescript
const watcher = (name: string): ClassDecorator => {
  return (target: Function) => {
    target.prototype.getParams = <T>(params: T): T => {
      return params
    }
    target.prototype.getOptions = (): string => {
      return name
    }
  }
}

@watcher('name')
class A {
  constructor() {

  }
}

const a = new A();
console.log((a as any).getParams('123'));
```

### 装饰器组合

可以使用多个装饰器

```typescript
const watcher = (name: string): ClassDecorator => {
  return (target: Function) => {
    target.prototype.getParams = <T>(params: T): T => {
      return params
    }
    target.prototype.getOptions = (): string => {
      return name
    }
  }
}
const watcher2 = (name: string): ClassDecorator => {
  return (target: Function) => {
    target.prototype.getNames = ():string => {
      return name
    }
  }
}

@watcher2('name2')
@watcher('name')
class A {
  constructor() {

  }
}


const a = new A();
console.log((a as any).getOptions());
console.log((a as any).getNames());
```

### 方法装饰器

返回三个参数

1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。
3. 成员的*属性描述符*。

```js
[
  {},
  'setParasm',
  {
    value: [Function: setParasm],
    writable: true,
    enumerable: false,
    configurable: true
  }
]
```

示例

```typescript
const met:MethodDecorator = (...args) => {
  console.log(args);
}

class A {
  constructor() {

  }
  @met
  getName ():string {
    return '666'
  }
}

const a = new A();
```

### 属性装饰器

返回两个参数

1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 属性的名字。

```js
[ {}, 'name', undefined ]
```

示例

```typescript
const met:PropertyDecorator = (...args) => {
  console.log(args);
}

class A {
  @met
  name:string
  constructor() {

  }

}

const a = new A();
```

## 参数装饰器

返回三个参数

1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。
3. 参数在函数参数列表中的索引。

```js
[ {}, 'setParasm', 0 ]
```

示例

```typescript
const met:ParameterDecorator = (...args) => {
  console.log(args);
}

class A {
  constructor() {

  }
  setParasm (@met name:string = '213') {

  }
}

const a = new A();
```

## 实战TS编写发布订阅模式

什么是发布订阅模式，其实我们已经用到了发布订阅模式例如addEventListener，Vue evnetBus都属于发布订阅模式

### 具体代码

on订阅/监听

emit 发布/注册

once 只执行一次

once 只执行一次

off解除绑定

```typescript
interface EventFace {
  on: (name: string, callback: Function) => void,
  emit: (name: string, ...args: Array<any>) => void,
  off: (name: string, fn: Function) => void,
  once: (name: string, fn: Function) => void
}

interface List {
  [key: string]: Array<Function>,
}
class Dispatch implements EventFace {
  list: List
  constructor() {
    this.list = {}
  }
  on(name: string, callback: Function) {
    const callbackList: Array<Function> = this.list[name] || [];
    callbackList.push(callback)
    this.list[name] = callbackList
  }
  emit(name: string, ...args: Array<any>) {
    let evnetName = this.list[name]
    if (evnetName) {
      evnetName.forEach(fn => {
        fn.apply(this, args)
      })
    } else {
      console.error('该事件未监听');
    }
  }
  off(name: string, fn: Function) {
    let evnetName = this.list[name]
    if (evnetName && fn) {
      let index = evnetName.findIndex(fns => fns === fn)
      evnetName.splice(index, 1)
    } else {
      console.error('该事件未监听');
    }
  }
  once(name: string, fn: Function) {
    let decor = (...args: Array<any>) => {
      fn.apply(this, args)
      this.off(name, decor)
    }
    this.on(name, decor)
  }
}
const o = new Dispatch()

o.on('abc', (...arg: Array<any>) => {
  console.log(arg, 1);
})

o.once('abc', (...arg: Array<any>) => {
  console.log(arg, 'once');
})
// let fn = (...arg: Array<any>) => {
//     console.log(arg, 2);
// }
// o.on('abc', fn)
// o.on('ddd', (aaaa: string) => {
//     console.log(aaaa);
// })
//o.off('abc', fn)

o.emit('abc', 1, true, '小满')

o.emit('abc', 2, true, '小满')

// o.emit('ddd', 'addddddddd')
```

## TS进阶用法proxy & Reflect

**Proxy** 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）

​	target

​		要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。

​	handler

​		一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。

​		handler.get() 本次使用的get属性读取操作的捕捉器。

​		handler.set() 本次使用的set属性设置操作的捕捉器。

**Reflect** 与大多数全局对象不同Reflect并非一个构造函数，所以不能通过new运算符对其进行调用，或者将Reflect对象作为一个函数来调用。Reflect的所有属性和方法都是静态的（就像Math对象）

​		Reflect.get(target, name, receiver) 
​		Reflect.get方法查找并返回target对象的name属性，如果没有该属性返回undefined

​		Reflect.set(target, name,value, receiver) 
​		Reflect.set方法设置target对象的name属性等于value。

```typescript
type Person = {
  name: string,
  age: number,
  text: string
}

const proxy = (object: any, key: any) => {
  return new Proxy(object, {
    get(target, prop, receiver) {
      console.log(`get key======>${key}`);
      return Reflect.get(target, prop, receiver)
    },

    set(target, prop, value, receiver) {
      console.log(`set key======>${key}`);

      return Reflect.set(target, prop, value, receiver)
    }
  })
}

const logAccess = <T>(object: T, key: keyof T): T => {
  return proxy(object, key)
}

let man: Person = logAccess({
  name: "小满",
  age: 20,
  text: "我的很小"
}, 'age')

let man2 = logAccess({
  id:1,
  name:"小满2"
}, 'name')

man.age = 30

console.log(man);
```

## TS进阶用法Partial & Pick

**内置高级类型Partial Pick** 

### Partial 

源码

```typescript
/**
 * Make all properties in T optional
  将T中的所有属性设置为可选
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
};

/*
	1 keyof 将一个接口对象的全部属性取出来变成联合类型

  2 in 可以理解成for in P 就是key 遍历  keyof T  就是联合类型的每一项

  3 ？这个操作就是将每一个属性变成可选项

  4 T[P] 索引访问操作符，与 JavaScript 种访问属性值的操作类似
*/
```

使用前

```typescript
type Person = {
  name:string,
  age:number
}

type p = Partial<Person>
```

转换后全部转为了可选

```typescript
type p = {
    name?: string | undefined;
    age?: number | undefined;
}
```

### **Pick** 

从类型定义Person的属性中，选取指定一组属性，返回一个新的类型定义。

```typescript
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

```typescript
type Person = {
  name:string,
  age:number,
  text:string
  address:string
}

type Ex = "text" | "age"

type A = Pick<Person,Ex>
```

## TS进阶用法Record & Readonly

### Readonly 

跟上面的`Partial`很像  只是把? 替换成了 readonly

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### Record

做到了约束 对象的key 同时约束了 value

```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

1 keyof any 返回 string number symbol 的联合类型

2 in 我们可以理解成for in P 就是key 遍历 keyof any 就是string number symbol类型的每一项

3 extends来约束我们的类型

4 T 直接返回类型
```

```typescript
type Person = {
  name:string,
  age:number,
}

type K = 'a' | 'b'

type A = Record<K,Person>

const obj: A = {
  a: {name: 'a', age: 18},
  b: {name: 'b', age: 18},
}
```

## TS进阶用法infer

infer 是 ts 新增到的关键字 充当占位符

实现一个条件类型推断的例子

定义一个类型 如果是数组类型 就返回 数组元素的类型 否则 就传入什么类型 就返回什么类型

```typescript
type Infer<T> = T extends Array<any> ? T[number] : T

type A = Infer<(boolean | string)[]>

type B = Infer<null>
```

使用inter 修改

```typescript
type Infer<T> = T extends Array<infer U> ? U : T
 
type A = Infer<(string | Symbol)[]>
```

例子2配合**tuple** 转换 **union** 联合类型

```typescript
type TupleToUni<T> = T extends Array<infer E> ? E : never
 
type TTuple = [string, number];
 
type ToUnion = TupleToUni<TTuple>; // string | number
```