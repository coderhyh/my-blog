---
title: EcmaScript笔记
date: 2022-02-10
sidebar: 'auto'
tags:
 - 笔记
 - EcmaScript
 - js
categories:
 -  javascript
---

# ecmaScript

## 变量**命名**规范

```js
使用变量前要先声明
命名规范
1.首字符必须是字母、$、_
2.其余字符必须是字母、$、_、数字
3.不能是关键字、保留字(for var if break class top async await)
4.驼峰命名  userName myParentName
```

## **函数**参数**集合**

::: tip 
  arguments
:::

## **函数**练习

::: tip 
reduce
:::

```js
var arr = [1, 2, 3, 4, 5];

function reduce(arr, fn, pre) {
  for (let i = 0; i < arr.length; i++) {
    pre = fn(pre, arr[i]);
  }
  return pre;
}

let total = reduce(arr, function(pre, num){
  return pre * num;
}, 1)
console.log(total);
```

::: tip 
 filter
:::

```js
function filter(arr,f){
  var res=[];
  for(var i=0;i<arr.length;i++){
    if(f(arr[i])){
      res.push(arr[i]);
    }
  }
  return res;
}

var res=filter([1,2,3,4,5,6],function(item){
  return item>2&&item<6;
})
console.log(res);
```

::: tip 
map
:::

```js
function map(arr, fn) {
  let newArr = [];
  arr.forEach(e => {
    newArr.push(fn(e));
  });
  return newArr;
}

let arr1 = [1, 2, 3, 4, 5];
let a = map(arr1, function (n) {
  return n * n;
});
console.log(a);
```

## **函数递归**流程控制

```js
function loop() {
  var fns = arguments;
  var i = 0;

  function a() { //调用下一个函数
    i++;
    fns[i](a);
  };

  arguments[0](a); //调用第一个函数
}

// 参数
loop(function (next) {
  console.log(1);
  next();
}, function (next) {
  console.log(2);
  next();
}, function (next) {
  console.log(3);
  next();
}, function () {
  console.log(4);
})
```

## **变量**提升

```js
// 先提升var声明的变量
console.log(f);// word函数体
function f(){
  console.log("hello")
}
function f(){
  console.log("world")
}
var f=10;

-------------

var x = 10;
function fun() {
  console.log(x); //undefined
  var x = 20;
  console.log(x);//20
}
fun();
```

## 函数**名称**

```js
function f(){//声明变量 f 也是函数的名字
  alert("hello");
}
//只要不是以上声明函数的方式
//那么就 不是变量

if(function f(){}){
  console.log(f);//报错 未定义
}
```

## 递归练习

::: tip 
九九乘法表
:::

```js
function tool1() {
  let i = 1;
  function col() {
    let j = 1;
    let str = '';
    row();
    console.log(str);
    if (++i <= 9) {
      col();
    }
    function row() {
      str += j + '*' + i + '=' + i * j + '\t';
      if (++j <= i) {
        row();
      }
    }
  }
  col();
}
tool1();
```

::: tip 
汉罗塔
:::

```js
// 汉罗塔
function move(n, a, b, c) {
  if (n == 1) {
    console.log(a + '-->' + c);
    return
  }
  move(n - 1, a, c, b)
  console.log(a + '-->' + c);
  move(n - 1, b, a, c)
}
move(1, 'A', 'B', 'C');
```


