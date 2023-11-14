---
title: 使用session生成验证码返回给前端
date: 2023-11-14
sidebar: 'auto'
tags:
 - 笔记
 - nestjs
categories:
 - nestjs
---

## session

`Session` 是指在网络通信中，为了保持客户端和服务器之间的状态，而在客户端和服务器之间建立的一种会话（session）机制。通俗地说，它是为了跟踪用户在网站上的活动而存储的一些信息。

在 Web 开发中，`Session` 主要有两个作用：

1. **保持状态：** HTTP 协议是无状态的，即服务器不会记住之前的请求。但在很多应用场景下，我们需要保持用户在一段时间内的状态，比如用户登录后，服务器需要知道用户是谁以及其登录状态。`Session` 就是为了解决这个问题而引入的机制。服务器会为每个客户端（通常是浏览器）创建一个唯一的`Session`标识，通过这个标识来存储和获取与用户相关的信息。
2. **共享数据：** 除了保存用户的登录状态，`Session` 还可以用来在用户访问不同页面的时候传递数据。例如，用户在购物网站上将商品添加到购物车，这个购物车信息可以存储在 `Session` 中，以便用户在不同页面间共享这些信息。

`Session` 的实现通常有两种方式：

- **基于 Cookie：** 服务器将一个唯一标识符（通常是一个加密的字符串）存储在用户的浏览器中，每次用户发送请求时，服务器通过这个标识符来识别用户。这种方式的缺点是，信息存储在客户端，存在一定的安全风险。
- **基于服务器存储：** 服务器将 `Session` 数据存储在自己的存储系统中，而不是存储在客户端。这种方式相对更安全，但需要服务器维护存储和检索 `Session` 数据的逻辑。

总体来说，`Session` 是一种在 Web 开发中用于跟踪用户状态和共享数据的机制，为构建交互性强、个性化体验的应用提供了便利。



## 起步

nestjs默认框架是express 也支持express 的插件 所以就可以安装express的session

```
npm i express-session --save
npm i @types/express-session -D
```

然后在main.ts引入 注册session

```js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(session({ secret: "test", name: "test.session", rolling: true, cookie: { maxAge: null } }))
  await app.listen(3000);
}
bootstrap();
```



## 安装svg-captcha

安装验证码插件 `svg-captcha`

```js
npm install svg-captcha -S
```

## 使用

```typescript
import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import * as svgCaptcha from 'svg-captcha';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get('code')
  createCaptcha(@Req() req, @Res() res) {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 34,
      background: '#cc9966',
    })
    req.session.code = captcha.text //存储验证码记录到session
    res.type('image/svg+xml')
    res.send(captcha.data)
  }
 
  @Post('create')
  createUser(@Req() req, @Body() body) {
    console.log(req.session.code, body) // 通过session拿到这个code做对比
    if (req.session.code.toLowerCase() === body?.code?.toLowerCase()) {
      return {
        message: "验证码正确"
      }
    } else {
      return {
        message: "验证码错误"
      }
    }
 
  }
}
```



