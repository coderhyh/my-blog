---
title: js其他笔记
date: 2022-02-10
sidebar: 'auto'
tags:
 - 笔记
 - js
categories:
 -  javascript
---

## 移动端

::: tip
屏幕适配
:::

```css
/*
  屏幕     size     效果图
  375      50px     750px    
  750      100px    750px

  W=window.innerWidth 窗口宽度
  html-font-size=W/375*50=W*50/375=100*100/750vw

*/

/*
  fontsize=10000/效果图宽度 vw
  量出来多少 除以100转化位rem即可
*/
```

### 事件

::: tip
按下事件
:::

```js
function tap(el, hook) {
  var time = 0;
  el.ontouchstart = function (e) {
    time = new Date().getTime();
  }
  el.ontouchend = function (e) {
    var time2 = new Date().getTime();
    if (time2 - time < 300) {
      hook.call(this, e);
    }
  }
  el.ontouchmove = function (e) {
    time -= 300
  }
}
```

::: tip
长按事件
:::

```js
function longPress(el,f){
  var timer;
  el.addEventListener("touchstart",function(e){
    timer=setTimeout(function(){
      f.call(el,e)
    },1000)
  })
  el.addEventListener("touchend",function(){
    clearTimeout(timer);
  })
}
```

## 视频 & 音频

|        tip         | method                    |
| :----------------: | ------------------------- |
|        暂停        | el.pause()                |
|        播放        | el.play()                 |
|    当前播放时间    | el.currentTime   可以赋值 |
|       总时长       | el.duration               |
| 播放时间发生变化时 | ontimeupdate              |
|     加载完毕时     | oncanplay                 |

### video.js

```html
<video controls id="vid" class="video-js vid-default-skin">
  //可以写多个source标签  以让浏览器选择合适的视频类型
  <source src="https://gd-sycdn.kuwo.cn/b7fb7b0bfdecbce09c11d5b466e46dc9/61aeffc5/resource/m2/59/7/2701626468.mp4">
</video>

<script>
  var myvid=videojs("vid",function(){//准备就绪

  });

  // 更新播放地址
  myvid.src("https://other-web-nf03-sycdn.kuwo.cn/9dee4d569805774ac415411389735936/61af020f/resource/m1/51/49/2408827443.mp4")
  //或者
  myvid.src([{
    src:"https://other-web-nf03-sycdn.kuwo.cn/9dee4d569805774ac415411389735936/61af020f/resource/m1/51/49/2408827443.mp4",
    type:"video/mp4"
  }])

  // 监听事件
  myvid.on("timeupdate",function(){
    console.log(this.currentTime(),this.duration());
  })
</script>
```

::: tip
指定 `flash` 格式
:::

```js
videojs("vid", {
  flash: {
    swf: "./videojs/video-js.swf"
  }
});
```

## 文件上传

### 生成临时地址  

::: tip
标签加上 `multiple` 可以多选
:::

```html
<label>
  <input type="file" id="myfile" style="display: none;">
  <p>选择文件</p>
</label>

<script>
  // 选择文件
  // myfile.onchange=function(){
  //     console.log(this.files);
  // }

  var files=[];
	//监听文件选择
  myfile.onchange=function(){
    // console.log()
    // 生成临时地址
    var path=URL.createObjectURL(this.files[0]);
    pic.src=path;
  }
</script>
```

::: tip
tips:  视频音频也可以预览

`vid.src=URL.createObjectURL(this.files[0]);` 
:::

### FormData

```js
// 生成对象
var formdata=new FormData();
formdata.append("userName","张三");
formdata.append("password","20");
//不用给请求头加  参数类型了
fetch("http://39.96.88.57/login",{
  method:"POST",
  body:formdata
})
  .then(r=>r.json())
  .then(function(res){
  console.log(res);
})
```

### FormData上传文件

```js
//获取到选择的文件
myfile.onchange=function(){
  file=this.files[0];
}

if (file) {
  // 上传
  var formdata = new FormData();
  formdata.append("type", "image");
  //把选择的文件append进去 即可以上传文件到服务器了
  formdata.append("file", file)

  fetch("http://192.168.218.160:4567/appendix/upload", {
    method: "POST",
    body: formdata
  })
    .then(r => r.json())
    .then(function (res) {
    console.log(res);
  })


} else {
  alert("请选择文件")
}
```

### ajax+form+formData

```html
<form id="myform">
  <input type="text" name="userName">
  <input type="text" name="password">
  <input type="text" name="password2">
  <input type="text" name="password3">
  <input type="text" name="password4">
  <input type="text" name="password5">
  <input type="text" name="password6">
  <input type="text" name="password7">
  <input type="text" name="password8">
  <input type="submit">
</form>

<script>
  myform.onsubmit=function(){

    // 提取form内包含的表单内容
    var formdata=new FormData(this);

    fetch("http://39.96.88.57/login",{
      method:"POST",
      body:formdata
    })
      .then(r=>r.json())
      .then(function(res){
      console.log(res);
    })

    return false;
  }
</script>
```

### base64转file

::: tip
工具
:::

```js
function base64toFile(dataurl, filename) {
  let arr = dataurl.split(",");
  let mime = arr[0].match(/:(.*?);/)[1];
  let suffix = mime.split("/")[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  });
}
```

```js
//调用方法即可完成转换
var myfile = base64toFile(base64, "名字");
```

### file转base64

::: tip
使用 `readAsDataURL` 
:::

```js
myfile.onchange=function(){
  // 创建文件读取器对象
  var reader=new FileReader();
  reader.readAsDataURL(this.files[0]);
  // 读取成功
  reader.onload=function(){
    console.log(reader.result);
  }
}
```

### 图片裁剪

https://gitee.com/mirrors/simplecrop/tree/master

## ES6

### 继承

```js
class Animal{
  constructor(voc){
    this.voc=voc;
    this.type="动物"
  }
  speak(a){
    alert(a);
  }
}
// 继承
class Person extends Animal{
  constructor(){
    super("哈哈哈");//对用Animal的构造函数 私有的属性
    this.type="人"
  }
}
let p=new Person();
// p.speak("hello");
console.log(p);
```

### es6新特性

::: tip
`find` --- 查找第一个符合要求的元素

`findIndex` --- 查找第一个符合要求的下标
:::

```js
let res = list.find(item => {
  // item指数组中单个元素
  return item.title == "苹果"
})

let index = list.findIndex(item => item.title == "西瓜")
```

::: tip
`Array.from` 把伪数组转化为真正的数组  节点集合 arguments
:::

```js
let btns=document.getElementsByTagName("button");

btns=Array.from(btns);
btns.shift();
console.log(btns);
```

::: tip
`includes` --- 是否包含某些元素
:::

```js
let arr = [1, 2, 3]
console.log(arr.includes(2)) // true
```

::: tip
`at` --- 索引负值
:::

```js
let arr2 = [1, 2, 3, 4, 5]
console.log(arr2.at(0)) // 1
console.log(arr2.at(-1)) // 5
```

::: tip
`Object.assign` --- 合并对象
:::

```js
function math(obj) {
  let moren = {
    x: 1,
    y: 2,
    z: 3
  }
  obj = Object.assign(moren, obj) // 值相同 obj会把moren覆盖
  console.log(obj.x + obj.y + obj.z)
}
math({x: 10}); // 15
math(); // 6
```

::: tip
`Symbol` --- 凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突
:::

```js
function Person(name, age) {
  let n = Symbol();
  let a = Symbol();
  return {
    [n]: name,
    [a]: age
  }
}
let p1 = Person("张三", 20);
console.log(p1); // {Symbol(): '张三', Symbol(): 20}
```

::: tip
`Proxy` --- 对象 代理/劫持

操作对象的时候  都要经过这一层
:::

```js
<h1 id="title">0</h1>

let obj = {
  num: 0
}
let res = new Proxy(obj, {
  // target => o
	// key num
  // val 0
  set(target, key, val) { // 当设置的对象属性时会执行此函数
    if (key == "num") {
      title.innerHTML = val;
    }
    target[key] = val;
    return true;
  },
  get(target, key) { // 当获取对象时执行的函数 返回值是响应的结果
    return target[key];
  }
})
res.num = 100 // obj.num / res.num => 100
```

### Set

::: tip
`set` --- 成员的值都是唯一的，没有重复的值。
:::

Set 结构的实例有以下属性。

- `Set.prototype.constructor`：构造函数，默认就是`Set`函数。
- `Set.prototype.size`：返回`Set`实例的成员总数。

Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。

- `Set.prototype.add(value)`：添加某个值，返回 Set 结构本身。
- `Set.prototype.delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
- `Set.prototype.has(value)`：返回一个布尔值，表示该值是否为`Set`的成员。
- `Set.prototype.clear()`：清除所有成员，没有返回值。

```js
//去重
const arr = [1,2,3,4,5,5,5,5]
console.log(new Set(arr)); // 1, 2, 3, 4, 5
```

::: tip
`Array.from `方法可以将 Set 结构转为数组。

这就提供了去除数组重复成员的另一种方法。
:::

```js
function dedupe(array) {
  return Array.from(new Set(array));
}
dedupe([1, 1, 2, 3]) // [1, 2, 3]
```

Set 结构的实例有**四个遍历**方法，可以用于遍历成员。

- `Set.prototype.keys()`：返回键名的遍历器
- `Set.prototype.values()`：返回键值的遍历器
- `Set.prototype.entries()`：返回键值对的遍历器
- `Set.prototype.forEach()`：使用回调函数遍历每个成员

```js
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]

let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9
Set 结构的键名就是键值（两者是同一个值），因此第一个参数与第二个参数的值永远都是一样的。
```





## promise

::: tip
应用
:::

```js
function getData(url) {
  return fetch(url).then(r => r.json());
}
const url1 = "http://39.96.88.57:9090/api/www/artist/artistInfo?category=0&pn=1&rn=100";
const url2 = "http://39.96.88.57:9090/api/www/artist/artistMusic?artistid=336&pn=1&rn=30";
getData(url1)
  .then(res => {
  console.log(res);
  return getData(url2)
}).then(res => {
  console.log(res);
})
```



::: tip
三种状态：`pending`（进行中）、`fulfilled`（已成功）和 `rejected`（已失败）
:::

```js
function setTime(t) {
  let p = new Promise((resolve, reject) => {
    setTimeout(() => {
      		成功时        失败时
      x ? resolve(x) : reject()
    }, t)
  })
  return p;
}

setTime(1000)
  .then(res => {
  x = 0;
  console.log('第一次', x);
  return setTime(1000)
})
  .catch(err => {
  console.log('第一次错误');
  return setTime(1000)
})
```

::: tip
异步加载图片封装
:::

```js
function loadImg(url) {
  return new Promise(resolve => {
    let img = new Image();
    img.src = url;
    img.onload = function () {
      resolve(img);
    }
  })
}

loadImg("https://imgcps.jd.com/ling4/100018640796/6auY5oCn6IO95omL5py657K-6YCJ/54iG5qy-55u06ZmN/p-5bd8253082acdd181d02f9f2/e0a9430a/cr/s/q.jpg")
  .then(img => {
  console.log("加载完毕")
})
```

### all

```js
function setTime(t,page){
  let p=new Promise(resolve=>{
    setTimeout(()=>{
      resolve("第"+page+"页内容");
    },t)
  })
  return p;
}


let p1=setTime(2000,10);
let p2=setTime(1000,5);

Promise.all([p1,p2])
  .then(([r1,r2])=>{//p1\p2全部resolve之后
  console.log(r1,r2);
})
  .catch(err=>{//任意一个reject 就会触发catch
  console.log("失败")
})
```

```js
Promise.all([
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        name: 'why',
        age: 18
      })
    }, 2000)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        name: 'kobe',
        age: 19
      })
    }, 1000)
  })
]).then(results => {
  console.log(results);
})
```



### race

```js
// 碰到第一个resolve就结束 竞速
Promise.race([p1,p2])
  .then(res=>{
  console.log(res);
})
  .catch(err=>{//任意一个reject 就会触发catch
  console.log("失败")
})
```

### finally()

::: tip
`finally()`方法用于指定不管 Promise 对象最后状态如何，都会执行的操作
:::

```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

::: tip
`finally`方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是`fulfilled`还是`rejected`。这表明，`finally`方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。
:::

### 异步函数

```js
function setTime(t){
  let p=new Promise(resolve=>{
    setTimeout(()=>{
      var x=10;
      resolve(x);
    },t)
  })
  return p;
}

btn.onclick=function(){
  ;(async function(){
    // 等后面的promise实例resolve
    let res=await setTime(1000);
    console.log(res);
    let res2=await setTime(1000);
    console.log(res2);
  }())
  this.style.color="red";
}
```

```js
async function getData(url) {
  let res = await fetch(url).then(r => r.json())
  console.log(res);
}
```
