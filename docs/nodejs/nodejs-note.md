---
title: nodejs笔记
date: 2022-02-10
sidebar: 'auto'
tags:
 - 笔记
 - nodejs
categories:
 - nodejs
---
## Websocket

::: tip
用于页面自动更新数据

通常持续更新数据都是前端向后端请求新的数据 ，通过使用定时器来每隔一定的时间来请求一次后端数据  但是这样会发起多数的无用的请求

而使用Websocket就可以使前后端互相收发消息了  当后端数据更新了  就会自动把新数据发送给前端
:::

```js
<!-- 
  webSocket 遵循tcp协议  处理即时通信
  握手环节(自报家门)
  互相收发信息
	可用于
  		 聊天、游戏、消息通知
  -->
      
// 握手
var client = new WebSocket("ws://192.168.218.97:5000");

// 接收消息
client.onmessage = function (e) {
  console.log(e.data);
}

btn.onclick = function () {
  // 发送信息  前端发送什么 后端就会接收什么
  client.send(ipt.value);
}


guanbi.onclick = function () {
  // 关闭连接
  client.close();
  client = null;
}
```

**nodejs代码**

```js
var webSocket=require("ws");

// 创建socket服务
var wss=new webSocket.Server({port:5000})

// var clients=[];
// 监听客户端连接事件
wss.on("connection",function(client){
  // 向客户端发送信息
  client.send("服务端已连接")

  // 接收客户端消息
  client.on("message",function(msg){
    // console.log(e.data);
    client.send("接收到你发的消息:"+msg);
  })

  setInterval(function(){
    client.send(Date.now());
  },1000)

  // 监听客户端关闭连接操作
  client.on("close",function(){
    console.log("客户端关闭连接")
  })
})
```

```js
var webSocket=require("ws");

// 创建socket服务
var wss=new webSocket.Server({port:5001})

// var clients=[];
// 监听客户端连接事件
wss.on("connection",function(client){
  client.on("message",function(data){
    // 群发  广播
    // wss.clients所有的客户端对象
    wss.clients.forEach(function(item){
      item.send(data);
    })
  })
})
```



## 浏览器的js 与 nodejs

::: tip
nodejs 是运行在服务器端的js
:::

```
    浏览器js
        ecmascript
        DOM
        BOM
    nodejs
        ecmascript(语法)
        fs(文件系统)
        net(网络请求)
        database(数据库)
        os(操作系统信息)

运行nodejs脚本
    1.在文件所在目录下 按下shift点击鼠标右键 打开 powershell窗口
        node 文件名
    2.选中文件右键在集成终端打开
        node 文件名
```

## fs 模块

::: tip
引用模块

`var fs = require("fs");` 
:::

::: tip
**读取文件**
:::

```js
fs.readFile("./test.txt",function(err,data){
  if(!err){
    console.log(data.toString());
  }
})
```

::: tip
**新建文件 - 写入文件 - 修改文件**
:::

```js
fs.writeFile("./index.txt","abc",function(err){
  if(!err){
    console.log("ok")
  }
})
```


::: tip
**修改名称  ---  移动文件**
:::

```js
fs.rename("./index.txt","./test02.txt",function(err){
  if(!err){
    console.log("改名成功")
  }
})
```


::: tip
**删除文件**
:::

```js
fs.unlink("./test.txt",function(err){
  if(!err){
    console.log("删除成功")
  }
})
```

::: tip
**检测文件是否存在**
:::

```js
fs.exists("./test.txt",function(flag){
  console.log(flag?"有":"没有")
})
```

::: tip
**创建目录**
:::

```js
fs.mkdir("./css",function(err){
  if(!err){
    console.log("创建成功")
  }
})
```

::: tip
**删除目录**
:::

```js
fs.rmdir("./css", function (err) {
  if (!err) {
    console.log("删除成功")
  }
})
```

## http 模块

::: tip
get 方法请求网络
:::

```js
const https = require('https');
const fs = require('fs');

https.get("https://tengfa.souche.com/api/car/homepage/recommend.json?phone=16666666666&userTag=4ucPg33vVK", res => {
  console.log(res);
  let str = '';
  res.on("data", chunk => {
    str += chunk;
  })
  res.on("end", () => {
    fs.writeFile("tengfa.json", str, (err) => {
      if (!err) {
        console.log('成功');
      }
    })
  })
})
```

::: tip
创建server
:::

```js
const http = require('http');
const https = require('https');
const fs = require('fs');

let server = http.createServer(function (req, res) {
  if (req.url == "/list") {
    res.end(JSON.stringify(["a", "b", "c"]));
  } else if (req.url == "/home") {

    https.get("https://tengfa.souche.com/?fsb=kwxc435n&ib=kwxc435o&ibk=KEY_kwxc4325", r => {
      var str = "";
      // 接收数据
      r.on("data", function (chunk) {
        str += chunk;
      })

      r.on("end", function () {
        res.writeHead(200, {
          "Content-type": "text/html;charset=UTF-8"
        });
        res.end(str)
      })

    })
  } else {
    res.end("404 not found")
  }
}).listen(8080, '192.168.218.80')
```

## npm常用命令

```js
1.创建项目
	npm init 生成package.json(记录项目中用到的第三方模块及版本号)

2.安装模块
  npm install 模块名
  npm i 模块名
  生成 package-lock.json (记录所用的模块依赖的模块信息)
	全局安装 后面加-g

  下载指定版本
		npm i express@2.0

3.删除模块
	npm uninstall 模块名

4.项目转移时   不需要拷贝node_modules模板  npm i  (下载package.json中所记录的模块)


5.package.json > scripts (给命令起别名)
  "scripts": {
    "a":"node index"
  }
  之前运行项目 node index
  现在就可以  npm run a 

  常用的别名:  start 启动    test 测试   dev 开发环境  build 打包项目
```

## os 模块

```js
var os=require("os");
console.log(os.arch());//x64
console.log(os.platform());//win
console.log(os.cpus());
```



## 模块小集合

::: tip
淘宝镜像
:::

```js
命令行工具
npm i cnpm -g
	安转模块使用cnpm

直接更改npm镜像地址
npm config set registry https://registry.npm.taobao.org
```

::: tip
静态资源服务器  同  live server   但是不会自动刷新
:::

```js
npm i http-server -g
静态资源目录下
    http-server
```

::: tip
压缩js
:::

```js
npm i uglify-js -g
在需要压缩的文件目录下 
    uglifyjs 文件名.js
    uglifyjs index.js -o index.min.js
```

::: tip
自动  重新node  .js的文件
:::

```js
npm i nodemon -g

node index
换成
nodemon index
当前目录下文件变化时  帮你 node index
```

::: tip
自动刷新
:::

```js
npm i browser-sync -g
在前端项目目录下
    browser-sync start --server --files "**/*.*"
```

## express 服务

::: tip
GET 方式
:::

```js
var express=require("express");
var app=express();

// 当访问8080端口时 请求路径如果是/goodList 请求方式是get 则执行此回调
app.get("/goodList",function(req,res){
  // req 包含请求的相关信息  参数、请求头、cookie
  // req.query 对象 包含截取的参数
  // /goodList?page=1&pageSize=10
  // req.query={page:1,pageSize:10}
  
  
  // res 用于响应客户端请求 
  // res.send("hello") 字符串类型的内容
  // res.json([1,2,3,4]) JSON类型的数据

  res.send("hello"+req.query.page)

})
// 端口号
app.listen(8080);
```

::: tip
POST方式
:::

```js
var express=require("express");
var bodyParser=require("body-parser");
var app=express();

// 处理请求体中携带的参数    req.body
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// get req.query接收参数
app.get("/goodList",function(req,res){
    res.json(req.query);
})

// post express没有处理post请求参数  需要引入body-parser中间件 req.body
app.post("/login",function(req,res){
    console.log(req.headers);
    res.json(req.body)
})


app.listen(8080);
```

### 中间件

```js
var express = require("express");
var app = express();

// 所有请求都需要经过此中间件
app.use(function(req,res,next){
  res.send("hello");
})

/*
    每个接口都有自己的参数
    验证
    是否传递参数
*/
// 基本写法
// function checkQuery(req,res,next){
//     if(req.query.userName&&req.query.password){
//         next();
//     }else{
//         res.json({msg:"参数缺失"})
//     }
// }

function f(arr) {
  return function (req, res, next) {
    for (var i = 0; i < arr.length; i++) {
      if (!req.query[arr[i]]) {//没有
        break;
      }
     
    if (i == arr.length) {
      next();
    } else {
      res.json({ msg: "参数缺失" })
    }
  }
}

app.get("/abc", f(["userName","password"]), function (req, res) {
  res.send("abc")
})

app.get("/goodList",f(["page","pageSize"]),function(req,res){
  res.json([1,2,3])
})


app.listen(8080)
```

::: tip
中间件每个函数执行时 都可以在设置req  那么下一个函数req也是同步的
:::

```js
var express=require("express");
var app=express();
var cors=require("cors");

// 拦截   扩展请求和响应对象

app.use(cors());

app.get("/goodList",function(req,res,next){
  //设置req
  req.a="hello"
  next()
},function(req,res){
  console.log(req.a)// hello
  res.json([1,2,3,4]);
})

app.get("/abc",function(req,res){
  res.json({msg:"hello"})
})

app.listen(9090)
```

### 处理formdata中间件

::: tip
上传文件中间件 multer
:::



::: tip
connect-multiparty：nodejs后台文件上传模块儿
:::

```js
安装
npm install connect-multiparty --save

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

app.use(multipart({uploadDir:'/upload' }));//设置上传文件存放的地址

app.post('/formdata',multipartMiddleware, function (req,res) {
res.send(req.body,req.files,req.files.file.path);//分别返回body，文件属性，以及文件存放地址
```



## uuid & token

::: tip
uuid --- 生成不重复的id号
:::

```js
var uuid=require("uuid");
// var res=uuid.v1();//时间戳 推荐
var res=uuid.v4();//random 有重复的可能
console.log(res); 
```

::: tip
安装 **npm install jsonwebtoken** 
:::

::: tip
生成 token
:::

```js
var jwt = require("jsonwebtoken");
var content ={msg:"today  is  a  good  day"}； // 要生成token的主题信息

var secretOrPrivateKey="I am a goog man!" // 这是加密的key（密钥） 
var token = jwt.sign(content, secretOrPrivateKey, {
  expiresIn: 60*60*24  // 24小时过期
})；
console.log("token ：" +token )；
```

::: tip
校验 token
:::

```js
var token = rq.body.token || rq.query.token || rq.headers["x-access-token"]; 
// 从body或query或者header中获取token
jwt.verify(token, secretOrPrivateKey, function (err, decode) {
  if (err) {  //  时间失效的时候/ 伪造的token          
    rs.json({err:err})
  } else {
    rq.decode = decode; 
    console.log(decode.msg);   // today  is  a  good  day
    next();
  }
})
```

## 文件上传

::: tip
自行更改文件名
:::

```js
var express=require("express");
var app=express();
var multer=require("multer");
var fs=require("fs");
// 指定上传文件存储目录
var upload=multer({dest:"uploadImages/"})

// 上传头像
// headImg
// 告诉他帮咱处理请求中携带的名字为headImg的文件
app.post("/uploadImg",upload.single("headImg"),function(req,res){
  // req.file
  // console.log(req.file);
  // 重命名
  var houzhui=req.file.originalname.split(".")[1];
  fs.rename(req.file.path,req.file.path+"."+houzhui,function(err){
    if(!err){
      console.log("上传成功")
      res.json({msg:"上传成功"})
    }
  })
})

app.listen(6060);
```



```js
var express=require("express");
var app=express();
var multer=require("multer");
var uuid=require("uuid")
var fs=require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploadImages')
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v1()+"."+file.originalname.split(".")[1])
  }
})

var upload = multer({ storage: storage })

// 上传头像
// headImg
// 告诉他帮咱处理请求中携带的名字为headImg的文件
app.post("/uploadImg",upload.single("headImg"),function(req,res){
  // req.file
  console.log(req.file);
  res.json({msg:"上传成功"})
})



app.listen(6060);
```

## 静态资源目录

::: tip
指定了静态资源目录后   那么目录下的资源就是同源的了

都可以通过当前服务访问   public => localhost:8080
:::

```js
var express=require("express");
var app=express();

// 指定静态资源目录
    // 都可以通过当前服务访问
app.use(express.static("public"))

app.get("/goodList",function(req,res){
    res.json([1,2,3,4])
})

app.listen(5000);
```

```js
// var baseUrl="http://192.168.218.109:5000";
var baseUrl="";

// 同源状态下  可以省略端口域名协议
fetch(baseUrl+"/goodList")
.then(r=>r.json())
.then(function(res){
console.log(res);
})
```

## 代理服务器

::: tip
`npm install --save-dev http-proxy-middleware`
:::

```js
var express = require("express");
var app = express();
// 引入代理模块
var proxy = require('http-proxy-middleware').createProxyMiddleware;

var proxyFun = proxy({
  // 目标服务器地址
  target: "https://www.kuwo.cn",
  changeOrigin: true,
  // 路径改写  处理标识
  pathRewrite: {
    "^/zhangsan": ""
  },
  // 每次代理之前  可用于设置请求头
  onProxyReq: function (proxyReq, req, res) {
    proxyReq.setHeader("csrf", "CAQBBHLL57M");
    proxyReq.setHeader("Cookie", "kw_token=CAQBBHLL57M")
  }
})
// 当请求地址以/zhangsan开头时 使用此中间件
app.use("/zhangsan", proxyFun)
/*
    真实请求地址
        http://www.a.com/goodList

        target: http://www.a.com

        /a 开头的需要代理
        前端： /a/goodList
        代理：target+/a/goodList = http://www.a.com/a/goodList
*/

// 指定静态资源目录
app.use(express.static("public"))

app.get("/abc", function (req, res) {
  res.json({
    msg: "abc"
  })
})


app.listen(6060);
```

## pm2

**PM2 [Node](https://so.csdn.net/so/search?q=Node&spm=1001.2101.3001.7020) 应用进程管理器** 可以利用它来简化很多 node 应用管理的繁琐任务，如性能监控、自动重启、负载均衡等，因为在工作中遇到服务器重启后，需要一个个去重新启动每个服务，这样不仅繁琐、效率低，而且容易遗忘开启一些服务。

**PM2 的主要特性**

- 内建负载均衡（使用 Node cluster 集群模块）
- 后台运行
- 0 秒停机重载
- 具有 Ubuntu 和 CentOS 的启动脚本
- 停止不稳定的进程（避免无限循环）
- 控制台检测
- 提供 HTTP API
- 远程控制和实时的接口 API ( Nodejs 模块,允许和 PM2 进程管理器交互 )

### 安装

```
npm install -g pm2
```

### 常用命令

```
pm2 start app.js
```

**命令行参数** 

可以在最基本的启动命令后面，添加一些参数选项，去满足我们的需求，常用的参数选项如下所示：

- --watch：监听应用目录的变化，一旦发生变化，自动重启。
- -i or --instance：启用多少个实例，可用于负载均衡，如果 -i 0 或者 -i max，则根据当前机器核数确定实例数目。
- --ignore-watch：排除监听的目录或文件，可以是特定的文件名，也可以是正则。

完整的启动命令如下所示：

```
pm2 start app.js --watch -i max -n xiaoman
```

**重启命令**

```
pm2 restart app.js
```

**停止命令**

```
pm2 stop app_name | app_id
// 停止全部
pm2 stop all
```

**删除命令**

删除特定的应用，可以通过 pm2 list 先获取应用的名字或者进程的 id，然后再调用以下命令删除相应的应用；

```
pm2 delete app_name | app_id
// 删除全部
pm2 delete all
```

**查看有哪些进程**

```
pm2 list
```

### 配置文件

如果我们使用命令行参数定义一些选项，那么每次启动进程时，都需要敲上一大堆的命令，非常繁琐；

所以我们可以使用配置文件来将命令行参数进行配置，配置文件里的配置项跟命令行参数是基本一致的；

如下所示  pm2 的配置文件 pm2.json ，然后在 package.json 文件中配置启动命令 "pm2": "pm2 start pm2.json" ，

这样我们只需要运行 npm run pm2 就可以使用 pm2 启动我们的 express 项目，并且相关运行参数直接在 pm2.json 中配置好了。

相关配置项表示的意义在下面文件中都已经注释说明

```json
{
  "apps": {
    "name": "express_project", // 项目名          
    "script": "app.js", // 执行文件
    "cwd": "./", // 根目录
    "args": "", // 传递给脚本的参数
    "interpreter": "", // 指定的脚本解释器
    "interpreter_args": "", // 传递给解释器的参数
    "watch": true, // 是否监听文件变动然后重启
    "ignore_watch": [ // 不用监听的文件
      "node_modules",
      "public"
    ],
    "exec_mode": "cluster_mode", // 应用启动模式，支持 fork 和 cluster 模式
    "instances": "max", // 应用启动实例个数，仅在 cluster 模式有效 默认为 fork
    "error_file": "./logs/app-err.log", // 错误日志文件
    "out_file": "./logs/app-out.log", // 正常日志文件
    "merge_logs": true, // 设置追加日志而不是新建日志
    "log_date_format": "YYYY-MM-DD HH:mm:ss", // 指定日志文件的时间格式
    "min_uptime": "60s", // 应用运行少于时间被认为是异常启动
    "max_restarts": 30, // 最大异常重启次数
    "autorestart": true, // 默认为 true, 发生异常的情况下自动重启
    "restart_delay": "60" // 异常重启情况下，延时重启时间
    "env": {
      "NODE_ENV": "production", // 环境参数，当前指定为生产环境
      "REMOTE_ADDR": ""
    },
    "env_dev": {
      "NODE_ENV": "development", // 环境参数，当前指定为开发环境
      "REMOTE_ADDR": ""
    },
    "env_test": { // 环境参数，当前指定为测试环境
      "NODE_ENV": "test",
      "REMOTE_ADDR": ""
    }
  }
}
```

### 高阶应用

**负载均衡**

可以使用 -i 参数配置集群数，实现负载均衡，相关命令如下，可以查看 [官网章节](https://link.juejin.cn/?target=https%3A%2F%2Fpm2.keymetrics.io%2Fdocs%2Fusage%2Fcluster-mode%2F%23automatic-load-balancing)；

```
pm2 start app.js -i 3 // 开启三个进程
pm2 start app.js -i max // 根据机器CPU核数，开启对应数目的进程 
```

**日志查看**

我们可以通过打开日志文件查看日志外，还可以通过 pm2 logs 来查看实时日志，这点有对于线上问题排查；

日志查看命令如下：

```
pm2 logs
```

**监控**

我们可以使用以下命令，查看当前通过 pm2 运行的进程的状态；

```
pm2 monit
```

## crawler example 
``` typescript
import puppeteer from 'puppeteer'
import cheerio from 'cheerio'
import axios from 'axios'
import xlsx from 'node-xlsx'
import fs from 'fs'

export async function main(num: number, excelName: string) {
  const excelArr = [
    ['sdAb-DB Accession Number',
      'Antibody name',
      'Antibody source',
      'Primary target antigen',
      'Sequence',
      'Experimental Data',
      'References',
      'DOI',
      'DOI LINK']
  ]
  const browser = await puppeteer.launch({
    // headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
    timeout: 0
  })
  const page = await browser.newPage()
  await page.goto('*')
  await page.click('.w3-border-right button[class="w3-half w3-large w3-button w3-hover-blue-grey tablink"]')
  await page.click(`.w3-row button[onclick="hiddenSubmit(${num})"]`)
  next(page, excelArr)

  async function next(page: puppeteer.Page, excelArr: string[][], pageNum: number = 2) {
    try {
      const ids: string[] = await page.$$eval('.w3-hover-text-red', el => el.map(e => e.innerHTML))
      console.log(ids);
      const res: string[][] = await startId(ids)
      excelArr?.push(...res)
      await page.waitForSelector('div[class="w3-center w3-margin-top"]')
      await page.click(`div[class="w3-center w3-margin-top"] a[href="/?Search_Results&Page=${pageNum}"]`)
      console.log(`第 ${pageNum} 页`);
      // if (pageNum === 3) throw new Error(`${pageNum - 1} 页已完成`)
      next(page, excelArr, pageNum + 1)
    } catch (error) {
      console.log(error);
      createExcel(excelArr!, excelName)
      browser.close()
    }
  }
}
function sleep(time: number): Promise<void> {
  return new Promise((r, j) => {
    setTimeout(() => { r() }, time)
  })
}
function createExcel(data: string[][], excelName: string) {
  const buffer = xlsx.build([{ name: 'Sheet', data, options: {} }]);
  fs.writeFileSync(`./file/${excelName}.xlsx`, buffer)
  console.log(excelName, '创建完成');
}
// startId([])
async function startId(ids: string[]): Promise<string[][]> {
  return new Promise(async (resolve, inject) => {
    const excelArr: string[][] = []
    const url2: string = 'https://sdab-db.ca/?Display&ID='
    for (const id of ids) {
      const html = await axios.post(url2 + id).then(r => r.data)
      const $ = cheerio.load(html)
      /* summary */
      const summary = $('#Summary .w3-cell-middle p')
      const summaryArr = Array.from(summary).filter((el, i) => i % 2).map(e => $(e).html()?.replace(/<.*?>/g, ''))
      /* sequence */
      const sequence = $($('#Seq tr')[1]).children()
      const tdHtml: any = sequence.map((i, e) => $(e).html()).map((i, item) => item.toString().replace(/<.*?>/g, '')).slice(1)
      const sequenceText = Array.from(tdHtml).join(" ")
      /* Experimental Data */
      const exper = $($('#Exper tr')[1]).children()[0]
      const experimental: string | null = $(exper).html()

      /* References */
      const references_a = $('#References div[class="w3-container w3-border-bottom"] a')
      const link = references_a.attr('href')
      const text = references_a.html()
      const longText = $('#References .w3-rest:eq(1) p').html()?.trim()

      excelArr.push([
        id,
        ...summaryArr as string[],
        sequenceText,
        experimental ?? 'null',
        longText ?? 'null',
        text ?? 'null',
        link ?? 'null'
      ])
      console.log(id);
      await sleep(5000)
    }
    resolve(excelArr)
  })
}
```



## mysql

::: tip
语句
:::

```mysql
增
insert into 表名   (字段名1,字段名2) values(值1,值2)
insert into users (userName,password) values("张三","123456")
insert into users (userName,password) values("李四","abcd")

删
delete from 表名  where 字段=值
delete from users where userName="张三"

改
update 表名 set 字段=新值 where userName="李四"
update users set 字段1=值1,字段2=值2 where userName="李四"
update users set password="abcd",userName="张三" where userName="李四"

查
select * from users  （所有字段）
select userName from users  (某个字段)
select userName,password from users  (多个字段)
select * from users where userName="张三" （指定范围）
																																																																																																															
where子语句 条件    =  >  < !=  and or
select * from users where Id>2 and Id<4

获取密码和王二一致的用户信息
select * from users where password=(select password from users where userName="王二") and userName!="王二"

分页  limit 2,3  从第二条开始向后查3条 不包含第二条
page 页码   1
pageSize 一页多少条  10
select * from goods limit pageSize*(page-1),pageSize

排序  order by 字段名 desc
desc降序  asc升序
select * from goods order by price asc


in (1,2,3)
select * from book where userId in (1,2)
select * from book where userId=1 or userId=2
select * from book where userId in (select Id from users where username in ("张三","李四"))

```

