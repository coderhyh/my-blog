---
title: nodejs实用方法
date: 2022-10-07
sidebar: 'auto'
tags:
 - 笔记
 - nodejs
categories:
 - nodejs
---

## global 全局对象

```js
//global是全局对象，使用它里面的属性或方法或子对象，可以不用加global
global.console.log('你好');
```

## fs

### 获得文件具体信息(判断是不是文件夹或者文件)

```js
let fs = require('fs');

//异步获取文件的具体信息

fs.stat('./1.text',(err,info)=>{
  if (err) {
    console.log();
  } else{
    // info.isFile() 判断是不是一个文件 返回结果为true
    console.log(info.isFile());
  }
})

fs.stat('./public',(err,info)=>{
  if (err) {
    console.log();
  } else{
    // info.isDirectory() 判断是不是一个文件 返回结果为true
    console.log(info.isDirectory());
  }
})
```

使用同步操作的话相对于简单

```js
let file = fs.statSync('./1.text');

if(file.isFile()){
	console.log('这是一个文件');
}else if(file.isDirectory()){
	console.log('只是一个文件夹');
}else{
	console.log('抱歉这不是一个文件或者文件夹');
}
```

### 读取文件夹里面的所有文件

```js
let fs = require('fs');

//异步读取文件夹里面的所有文件

fs.readdir('./public',(err,files)=>{
	if (err) {
		console.log(err);
	} else{
		// console.log(files); 返回的文件是个数组,可以用forEach循环输出文件名
		 files.forEach((x)=>{
			 console.log('有'+ x +'这个文件');
		 })
	}
})
```

同步获取文件夹里面的所有文件

```js
let files = fs.readdirSync('./public');
console.log(files); //返回的是一个数组
```

### 移动并可以重命名文件(剪切)

```js
let fs = require('fs');

//第二个参数如果是目录里面的文件的话他就会把文件移动
//如果单独只是文件名的话他就会把文件重命名
fs.rename('./1.text','./public/index.html',(err,data)=>{
	if (err) {
		console.log(err);
	} else{
		console.log('已经移动并更改');
	}
})

// 同步操作移动并重命名文件
fs.renameSync('./public/index.html','./index.html');
```

### 复制并重命名文件(复制)

```js
let fs = require('fs');

//异步复制并重命名文件
// fs.copyFile('./1.text','./public/index.html',(err)=>{
// 	if (err) {
// 		console.log(err);
// 	} else{
// 		console.log('已经复制并移动');
// 	}
// })

// 同步操作复制并重命名文件
fs.copyFileSync('./index.html','./public/index.html');
```

### 模块 pipe方法大文件复制

```js
var fs = require('fs');
//创建读取流
var readStream = fs.createReadStream('./1.zip');
//创建写入流
var writeStream = fs.createWriteStream('./2.zip');
//进行大文件的复制
readStream.pipe(writeStream);
```

### 递归删除文件

结合 fs path 模块 递归删除目录

```js
let fs = require('fs');
let path = require('path');

let del  = (url)=>{
	//获得所有文件
	let arr = fs.readdirSync(url);
	//循环所有文件
	arr.forEach((x)=>{
		//组合文件路径
		let fileurl = path.resolve(url,x);
		//获得文件的详细信息
		let xinxi =  fs.statSync(fileurl);
		// 判断
		if(xinxi.isFile()){
			fs.unlinkSync(fileurl);//是文件删除
		}else if(xinxi.isDirectory()){
			del(fileurl);//是文件夹递归调用
		}
	})
	//删除文件夹(如果文件夹里面有文件删除不了)
	fs.rmdirSync(url);
}
del(path.resolve(__dirname,'public.1'));
```

### 递归打印输出有规则的文件

```js
let fs = require('fs');
let path = require('path');

let del  = (url,y=0)=>{
	
	let h = '';
	for (var i = 0; i < y; i++) {
		h += '---'
	}
	//打印目录二级以后的目录
	console.log(h + url);
	
	//获得所有文件
	let arr = fs.readdirSync(url);
	//循环所有文件
	arr.forEach((x)=>{
		//组合文件路径
		let fileurl = path.resolve(url,x);
		//获得文件的详细信息
		let xinxi =  fs.statSync(fileurl);
		let f ='';
		for (let a=0;a<y+1;a++) {
			f += '---';
		}
		//输出的文件为再次加 ---- 个,(看上班for循环 d+1 )
		!xinxi.isFile(fileurl) || console.log(f + fileurl);
		!xinxi.isDirectory(fileurl) || del(fileurl,y+1);
	})

}
del(path.resolve(__dirname,'public.2'));
```

```
F:\前端学习\node\public.2
---F:\前端学习\node\public.2\06.js
---F:\前端学习\node\public.2\1.vue
---F:\前端学习\node\public.2\16.json
---F:\前端学习\node\public.2\16.vue
---F:\前端学习\node\public.2\ab
------F:\前端学习\node\public.2\ab\06.js
------F:\前端学习\node\public.2\ab\1.vue
------F:\前端学习\node\public.2\ab\16.json
------F:\前端学习\node\public.2\ab\16.vue
------F:\前端学习\node\public.2\ab\index.html
---F:\前端学习\node\public.2\index.html
```

## path

### 模块之将多个路径组合成一个路径

```js
let path = require('path');
let url = path.join('d:/www','/index','/banner/index.php');
console.log(url);

结果为：d:\www\index\banner\index.php
```

### 模块之判断是不是一个绝对路径

```js
let path = require('path');
let url = path.isAbsolute('c:/www/baidu/public/index');//绝对路径(true)
let url = path.isAbsolute('www/baidu/public/index');//相对路径(false)
console.log(url);
```

### 从后往前组合,组合成第一个绝对路径就停止

```js
let path = require('path');
//从后往前组合,组合成第一个绝对路径就停止
//若直到要第一个参数都组合不出来绝对路径,那么就会连接上当前脚本所在绝对路径,组合成一个完整的绝对路径
let url = path.resolve('c:/www','b:/res','index.php');
console.log(url)

结果为：b:\res\index.php
```

### 返回第二个参数相对于第一个参数的所在路径

```js
let path = require('path');
//返回第二个参数相对于第一个参数的所在路径
let url = path.relative('c:/a/b/c','c:/houdunren/her');
console.log(url)

结果: ..\..\..\houdunren\her
```

### 返回的是路径最后一个文件或者文件夹的所在路径

```js
let path = require('path');
//dirname() 返回的是路径最后一个文件或者文件夹的所在路径
let url = path.dirname('/var/admin/houdunren/index.php');
console.log(url)

结果: /var/admin/houdunren
```

### 返回最后一个文件名或者文件夹名

```js
let path = require('path');
//返回最后一个文件名或者文件夹名
let url = path.basename('/var/admin/houdunren/index.php');
console.log(url)

结果为：index.php
```

### 返回文件的扩展名

```js
let path = require('path');
let url = path.extname('/var/admin/houdunren/index.php');
console.log(url)

结果为：.php
```

### path 模块返回当前的分隔符

```js
let path = require('path');
//属性会返回当前的分隔符
let url = path.sep;
console.log(url)

结果为：\
```

## http

### WEB服务初始化

```js
//引入http模块相当于php的apache (node.js不像php,http模块是node.js自带的)
let http = require('http');

//初始化server服务
var server = http.createServer();

//监听端口
server.listen(3000,()=>{
	console.log('---server服务启动,端口3000---');
})

//在浏览器内在地址栏内访问   127.0.0.1:3000 或者 localhost:3000 的结果是一直转圈圈（一直在响应）
```

### 接收用户请求和返回数据

```js
//引入http模块相当于php的apache (node.js不像php,http模块是node.js自带的)
let http = require('http');

//初始化server服务
var server = http.createServer();

//监听端口
server.listen(3000,()=>{
	console.log('---server服务启动,端口3000---');
})

//监听用户请求
//req : 客户端请求的相关信息和方法
//res : 客户端相应的一些方法
server.on('request',(req,res)=>{
	//write 表示返回的信息
	//简单的输出信息,可以输出多次
	// res.write('这是服务器端返回的数据');
	// end 表示结束响应
	// res.end();
	
	// 也可以直接使用end输出
	res.end('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>你好啊;</body></html>')
})
```

### 根据访问路由返回不同信息(req.url)

```js
//引入http模块相当于php的apache (node.js不像php,http模块是node.js自带的)
let http = require('http');

//初始化server服务
var server = http.createServer();

//监听端口
server.listen(3000,()=>{
	console.log('---server服务启动,端口3000---');
})

//监听用户请求
//req : 客户端请求的相关信息和方法
//res : 客户端相应的一些方法
server.on('request',(req,res)=>{
	// console.log(req.url)
	if(req.url == '/'){
		res.end('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>这是首页;</body></html>');
	}else if(req.url == '/list'){
		res.end('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>这是列表页面;</body></html>')
	}else if(req.url == '/page'){
		res.end('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>这是内容页面;</body></html>')
	}else{
		res.end('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>404页面没找到;</body></html>')
	}
})
```

### 加载静态文件(如图片，css，js)

```js
//引入http模块相当于php的apache (node.js不像php,http模块是node.js自带的)
let http = require('http');
let fs = require('fs');

//初始化server服务
var server = http.createServer();

//监听端口
server.listen(3000,()=>{
	console.log('---server服务启动,端口3000---');
})

//监听用户请求
//req : 客户端请求的相关信息和方法
//res : 客户端相应的一些方法
server.on('request',(req,res)=>{
	if(req.url){
		// 读取这个图片 
        //'.' + req.url 实例（./1.jpg）
		fs.readFile('.' + req.url,(err,data)=>{
			if(err){
				console.log(err);
			}else{
				res.end(data);
			}
		})
	}else{
		res.end('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>404页面没找到;</body></html>');
	}
})
```

### 模板加载

```js
//引入http模块相当于php的apache (node.js不像php,http模块是node.js自带的)
let http = require('http');
let fs = require('fs');

//初始化server服务
var server = http.createServer();

//监听端口
server.listen(3000,()=>{
	console.log('---server服务启动,端口3000---');
})

//监听用户请求
//req : 客户端请求的相关信息和方法
//res : 客户端相应的一些方法
server.on('request',(req,res)=>{
	if(req.url == '/'){
		// 读取首页模版
		fs.readFile('./view/index.html',(err,data)=>{
			if(err){
				console.log(err);
			}else{
				res.end(data);
			}
		})
	}else if(req.url == '/list'){
		// 读取列表页模版
		fs.readFile('./view/list.html',(err,data)=>{
			if(err){
				console.log(err);
			}else{
				res.end(data);
			}
		})
	}else if(req.url == '/page'){
		// 读取内容页面模版
		fs.readFile('./view/page.html',(err,data)=>{
			if(err){
				console.log(err);
			}else{
				res.end(data);
			}
		})
	}else{
		res.end('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>404页面没找到;</body></html>');
	}
})
```
