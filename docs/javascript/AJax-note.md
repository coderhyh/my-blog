---
title: AJax笔记
date: 2022-02-10
sidebar: 'auto'
tags:
 - 笔记
 - AJax
 - js
categories:
 -  javascript
---

# AJax

分为两种请求方法 ： get / post

- GET
  - 携带的数据量小
  - 速度快
  - 参数拼接在路径之后
  - 会有缓存问题
- POST
  - 对携带的数据没有限制
  - 速度慢
  - 更安全
  - 参数放在请求体中 作为send的实参传入
  - 在send之前设置请求头声明参数类型

## 传统方法

```js
// GET请求
var xhr = new XMLHttpRequest();													//true：异步 false：同步
xhr.open("GET", "http://192.168.218.20:6543/list?x=10", true);
xhr.send();
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4 && xhr.status == 200) {
    console.log(xhr.responseText);
  }
}


// post请求
var xhr=new XMLHttpRequest();
xhr.open("POST","http://192.168.218.20:6543/login");
// 设置请求头 确保后端能够成功解析参数
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");//告诉后端参数是用&形式拼接的
// 参数放在send里面
xhr.send("userName=张三&password=123456");
xhr.onreadystatechange=function(){
  if(xhr.readyState==4&&xhr.status==200){
    console.log(xhr.responseText);
  }
}

// post请求 传递json格式参数
var xhr=new XMLHttpRequest();
xhr.open("POST","http://192.168.218.20:6543/login");
// 设置请求头 确保后端能够成功解析参数
xhr.setRequestHeader("Content-Type","application/json");//告诉后端参数是json格式
// 参数放在send里面
xhr.send(JSON.stringify({
  userName:"张三",
  password:"123456"
}));
xhr.onreadystatechange=function(){
  if(xhr.readyState==4&&xhr.status==200){
    console.log(xhr.responseText);
  }
}
```

## `fetch` 方法

```js
// get请求
fetch("http://192.168.218.20:6543/list?x=100")
  .then(r=>r.json())
  .then(function(res){
  console.log(res);
})

// post
fetch("http://192.168.218.20:6543/login",{
  method:"POST",//设置请求方式
  headers:{
    "Content-Type":"application/x-www-form-urlencoded"
  },
  // 参数
  body:"userName=张三&password=123456"
})
  .then(r=>r.json())
  .then(function(res){
  console.log(res);
})

// post 的json方式
fetch("http://192.168.218.20:6543/login", {
  method: "POST", //设置请求方式
  headers: {
    "Content-Type": "application/json"
  },
  // 参数
  body: JSON.stringify({
    userName: "张三",
    password: "123456"
  })
})
  .then(r => r.json())
  .then(function (res) {
  console.log(res);
})
```

## 同源策略

```
http://www.baidu.com:80/a?page=1
  协议 http https
  域名 www.baidu.com    IP的别名	
  端口号 80  默认是80端口
  路径 /a
  参数 page=1 

同源策略  端口、域名、协议全部相同 => 才可以请求到接口的数据

ajax遵循同源策略 => 存在跨域问题

解决跨域问题
1.后端设置跨域资源共享  cors   cross origin resource share
2.设置代理服务器
3.jsonp
```

## jsonp

> jsonp 通过script发起的请求
>
> 动态创建script标签指定请求地址，返回函数的调用 并将数据作为实参传入
>
> callback=回调函数

```js
// 动态创建script标签
var node=document.createElement("script");
// 指定请求地址
node.src="https://category.vip.com/ajax/getSuggest.php?callback=f&keyword="+word.value+"&_=1638409356082";
// 插入到页面内  发起请求
document.body.appendChild(node);


// 定义回调函数
function f(res){//res数据
  console.log(res);
}
```

## axios

### 全局配置

> 为了应对有时的需求 是向不同的ip请求数据  所以不要这样写 
>
> 应当使用 **创建实例** 

```js
axios.defaults.baseURL = 'http://123.207.32.32:8000';
axios.defaults.timeout = 5000; // 超时时间
```

| 语法                                           | 解释                                                         |
| ---------------------------------------------- | ------------------------------------------------------------ |
| url: '/user',                                  | 请求地址                                                     |
| method: 'get',                                 | 请求类型                                                     |
| baseURL: 'http://www.mt.com/api',              | 请根路径                                                     |
| transformRequest:[function(data){}],           | 请求前的数据处理                                             |
| transformResponse: [function(data){}],         | 请求后的数据处理                                             |
| headers:{'x-Requested-With':'XMLHttpRequest'}, | 自定义的请求头                                               |
| params:{ id: 12 },                             | URL查询对象                                                  |
| aramsSerializer: function(params){ }           | 查询对象序列化函数                                           |
| data: { key: 'aa'},                            | request body                                                 |
| timeout: 1000,                                 | 超时设置ms                                                   |
| withCredentials: false,                        | 跨域是否带Token                                              |
| adapter: function(resolve, reject, config){},  | 自定义请求处理                                               |
| auth: { uname: '', pwd: '12'},                 | 身份验证信息                                                 |
| responseType: 'json',                          | 响应的数据格式 json / blob /document /arraybuffer / text / stream |



### 1.axios的基本使用

```js
axios({
  url: 'http://123.207.32.32:8000/home/multidata',
  // method: 'post'
}).then(res => {
  console.log(res);
})


axios({
  url: 'http://123.207.32.32:8000/home/data',
  // 专门针对get请求的参数拼接
  params: {
    type: 'pop',
    page: 1
  }
}).then(res => {
  console.log(res);
})
```

### 2.axios发送并发请求

> axios发送并发请求 --- 跟promise的 all一样

```js
axios.all([axios({
  url: 'http://123.207.32.32:8000/home/multidata'
}), axios({
  url: 'http://123.207.32.32:8000/home/data',
  params: {
    type: 'sell',
    page: 5
  }
})])
// 普通
.then(results => {
  console.log(results);
  console.log(results[0]);
  console.log(results[1]);
})
// 解构
.then(([res1, res2]) => {
  console.log(res1);
  console.log(res2);
})
// spread
.then(axios.spread((res1, res2) => {
  console.log(res1);
  console.log(res2);
}))
```

### 4.创建对应的axios的实例

```js
const instance1 = axios.create({
  baseURL: 'http://123.207.32.32:8000',
  timeout: 5000
})

instance1({
  url: '/home/multidata'
}).then(res => {
  console.log(res);
})

instance1({
  url: '/home/data',
  params: {
    type: 'pop',
    page: 1
  }
}).then(res => {
  console.log(res);
})
```

### axios封装 

```js
import axios from 'axios'

export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://123.207.32.32:8000',
    timeout: 5000
  })

  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(config => {
    // console.log(config);
    // 1.比如config中的一些信息不符合服务器的要求 防止恶意添加

    // 2.比如每次发送网络请求时, 都希望在界面中显示一个请求的图标

    // 3.某些网络请求(比如登录(token)), 必须携带一些特殊的信息 (没有携带token时  拦截跳转到其他页面  )
    return config
  }, err => {
    // console.log(err);
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    // console.log(res);
    return res.data
  }, err => {
    console.log(err);
  })

  // 3.发送真正的网络请求
  return instance(config)
}
```

```js
import {request} from "./network/request";

request({
  url: '/home/multidata'
}).then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
})
```