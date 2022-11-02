---
title: js小案例
date: 2022-02-10
sidebar: 'auto'
tags:
 - 案例
 - js
categories:
 -  javascript
---

# 案例

## 瀑布流计算图片高度

::: tip
高宽比 = h / w

高度 = 宽度 * 高宽比  (计算宽度同理)
:::

## 大屏适配

::: tip
按照一定的宽高比例缩放  会有轻微的变形
:::

```js
// 会有轻微的变形
var H=window.innerHeight,W=window.innerWidth;
// 1080  540  800
box.style.transform="translate(-50%,-50%) scale("+W/1920+","+H/1080+")";
```

::: tip
通过判断**宽或高的比例** 哪一边**短** 就按照哪一边缩放

会被裁切部分边缘内容
:::

```js
// 会被裁切部分边缘内容
var H=window.innerHeight,W=window.innerWidth;
var h=1080,w=1920
// 1080  540  800
if(w/h>W/H){
  var scale=H/h;
}else{
  var scale=W/w;
}
box.style.transform="translate(-50%,-50%) scale("+scale+")";
```

::: tip
较完美  判断哪一边比例较大的来缩放

但是会有留白
:::

```js
var H = window.innerHeight,
    W = window.innerWidth;
var h = 1080,
    w = 1920
// 1080  540  800
if (w / h < W / H) {
  var scale = H / h;
} else {
  var scale = W / w;
}
box.style.transform = "translate(-50%,-50%) scale(" + scale + ")";
```

## jQuery封装原理

```js
function $(str){

  // 根据选择器字符串找到dom节点集合
  var nodeList=null;
  if(str.indexOf("#")==0){
    nodeList=[document.getElementById(str.slice(1))];
  }else if(str.indexOf(".")==0){
    nodeList=document.getElementsByClassName(str.slice(1));
  }else{
    nodeList=document.getElementsByTagName(str);
  }

  // 返回对象
  return {
    css:function(key,val){
      for(var i=0;i<nodeList.length;i++){
        nodeList[i].style[key]=val;
      }
      return this;
    },
    html:function(val){
      for(var i=0;i<nodeList.length;i++){
        nodeList[i].innerHTML=val;
      }
      return this;
    },
    click:function(cb){
      for(var i=0;i<nodeList.length;i++){
        nodeList[i].onclick=cb
      }
    }
  }

}

$("div").css("color","blue").html("哈哈哈哈").click(function(){
  console.log(this.innerHTML);
});
```



## 冰箱轮播图计算图片

```js
let leng = navLi.length;
let tool = leng / 5;
let index = !(leng % 5) ? tool - 1 : Math.floor(tool);
let num = 0;
navLeftBtn.onclick = function () {
  num--
  if (num <= 0) {
    num = 0;
    navLeftBtn.style.backgroundImage = 'url(./imgs/大于号1.png)';
  }
  if (num < index) {
    navRightBtn.style.backgroundImage = 'url(./imgs/大于号.png)';
  }
  let n = num * 5;
  navUl.style.left = -liWidth * n + 'px';
}

navRightBtn.onclick = function () {
  num++;
  let n = num * 5;
  if (num >= index) {
    num = index;
    n = leng - 5;
    navRightBtn.style.backgroundImage = 'url(./imgs/大于号1.png)';
  }
  if (num > 0) {
    navLeftBtn.style.backgroundImage = 'url(./imgs/大于号.png)';
  }
  navUl.style.left = -liWidth * n + 'px';
}
```

## **案例**: 浏览器**窗口发生改变** 隐藏/显示 div

::: tip
resize --- 当浏览器窗口发生改变的事件
:::

```js
window.addEventListener('load', function() {
    var div = document.querySelector('div');
    window.addEventListener('resize', function() {
        console.log(window.innerWidth);

        console.log('变化了');
        if (window.innerWidth <= 800) {
            div.style.display = 'none';
        } else {
            div.style.display = 'block';
        }

    })
})
```

## 京东**放大镜**效果大图片移动距离

![img](/javascript/javascript-note/image-20210731221204243.png)

::: tip
遮罩层的大小 = 大盒子宽度 / (大图片宽度 / 小图片宽度)
:::

## **倒计时**案例

```js
// 1. 获取元素 
var hour = document.querySelector('.hour'); // 小时的黑色盒子
var minute = document.querySelector('.minute'); // 分钟的黑色盒子
var second = document.querySelector('.second'); // 秒数的黑色盒子
var inputTime = +new Date('2021-7-31 12:00:00'); // 返回的是用户输入时间总的毫秒数
countDown(); // 我们先调用一次这个函数，防止第一次刷新页面有空白 
// 2. 开启定时器
setInterval(countDown, 1000);

function countDown() {
    var nowTime = +new Date(); // 返回的是当前时间总的毫秒数
    var times = (inputTime - nowTime) / 1000; // times是剩余时间总的秒数 
    var h = parseInt(times / 60 / 60 % 24); //时
    h = h < 10 ? '0' + h : h;
    hour.innerHTML = h; // 把剩余的小时给 小时黑色盒子
    var m = parseInt(times / 60 % 60); // 分
    m = m < 10 ? '0' + m : m;
    minute.innerHTML = m;
    var s = parseInt(times % 60); // 当前的秒
    s = s < 10 ? '0' + s : s;
    second.innerHTML = s;
}
```

## indexedDB数据库的使用
```js
// 打开数据(和数据库建立连接)
const dbRequest = indexedDB.open("why", 3)
dbRequest.onerror = function(err) {
  console.log("打开数据库失败~")
}
let db = null
dbRequest.onsuccess = function(event) {
  db = event.target.result
}
// 第一次打开/或者版本发生升级
dbRequest.onupgradeneeded = function(event) {
  const db = event.target.result

  console.log(db)

  // 创建一些存储对象
  db.createObjectStore("users", { keyPath: "id" })
}

class User {
  constructor(id, name, age) {
    this.id = id
    this.name = name
    this.age = age
  }
}

const users = [
  new User(100, "why", 18),
  new User(101, "kobe", 40),
  new User(102, "james", 30),
]

// 获取btns, 监听点击
const btns = document.querySelectorAll("button")
for (let i = 0; i < btns.length; i++) {
  btns[i].onclick = function() {
    const transaction = db.transaction("users", "readwrite")
    console.log(transaction)
    const store = transaction.objectStore("users")

    switch(i) {
      case 0:
        console.log("点击了新增")
        for (const user of users) {
          const request = store.add(user)
          request.onsuccess = function() {
            console.log(`${user.name}插入成功`)
          }
        }
        transaction.oncomplete = function() {
          console.log("添加操作全部完成")
        }
        break
      case 1:
        console.log("点击了查询")

        // 1.查询方式一(知道主键, 根据主键查询)
        // const request = store.get(102)
        // request.onsuccess = function(event) {
        //   console.log(event.target.result)
        // }

        // 2.查询方式二:
        const request = store.openCursor()
        request.onsuccess = function(event) {
          const cursor = event.target.result
          if (cursor) {
            if (cursor.key === 101) {
              console.log(cursor.key, cursor.value)
            } else {
              cursor.continue()
            }
          } else {
            console.log("查询完成")
          }
        }
        break
      case 2:
        console.log("点击了删除")
        const deleteRequest = store.openCursor()
        deleteRequest.onsuccess = function(event) {
          const cursor = event.target.result
          if (cursor) {
            if (cursor.key === 101) {
              cursor.delete()
            } else {
              cursor.continue()
            }
          } else {
            console.log("查询完成")
          }
        }
        break
      case 3:
        console.log("点击了修改")
        const updateRequest = store.openCursor()
        updateRequest.onsuccess = function(event) {
          const cursor = event.target.result
          if (cursor) {
            if (cursor.key === 101) {
              const value = cursor.value;
              value.name = "curry"
              cursor.update(value)
            } else {
              cursor.continue()
            }
          } else {
            console.log("查询完成")
          }
        }
        break
    }
  }
}
```