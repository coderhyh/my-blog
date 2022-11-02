---
title: 功能性函数
date: 2022-02-13
sidebar: 'auto'
tags:
 - plugin
 - js
categories:
 -  javascript
---

## 获取变量类型

```js
// 获取变量类型
function getType(el) {
  if (el === null) {
    return "null";
  } else {
    if (typeof el == "object") {
      if (el instanceof Array) {
        return "array";
      } else {
        return "object";
      }
    } else {
      return typeof el;
    }
  }
}
```

## 用户是否浏览页面

```js
function isUserExist(fn, fnEnd) {
  var hiddenProperty = 'hidden' in document ? 'hidden' :
  'webkitHidden' in document ? 'webkitHidden' :
  'mozHidden' in document ? 'mozHidden' :
  null;
  var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
  var onVisibilityChange = function () {
    if (!document[hiddenProperty]) {
      fn && fn();
    } else {
      fnEnd && fnEnd();
    }
  }
  onVisibilityChange();
  document.addEventListener(visibilityChangeEvent, onVisibilityChange);
}
```

## 运功框架

```js
/*   
startMove(obj, json, options) --- 2级运动框架
    {
      obj ele
      json{sName:iTarget,sName:iTarget}
      options	{type	time end}
        type	linear	ease-in		ease-out
        time default--700
    } 
*/

function startMove(obj, json, options) {
  options = options || {};
  options.type = options.type || 'ease-out';
  options.time = options.time || 700;
  var start = {};
  var dis = {};

  for (var name in json) {

    start[name] = parseFloat(getStyle(obj, name));
    //给真正的默认值
    if (isNaN(start[name])) {
      switch (name) {
        case 'left':
          start[name] = obj.offsetLeft;
          break;
        case 'top':
          start[name] = obj.offsetTop;
          break;
        case 'width':
          start[name] = obj.offsetWidth;
          break;
        case 'height':
          start[name] = obj.offsetHeight;
          break;
        case 'opacity':
          start[name] = 1;
          break;
        case 'borderWidth':
          start[name] = 0;
          break;
      }
    }
    dis[name] = json[name] - start[name];
  }

  var count = Math.floor(options.time / 30);
  var n = 0;
  clearInterval(obj.timer);
  obj.timer = setInterval(function () {
    n++;
    for (var name in json) {
      switch (options.type) {
        case 'linear':
          var cur = start[name] + dis[name] * n / count;
          break;
        case 'ease-in':
          var a = n / count;
          var cur = start[name] + dis[name] * Math.pow(a, 3);
          break;
        case 'ease-out':
          var a = 1 - n / count;
          var cur = start[name] + dis[name] * (1 - Math.pow(a, 3));
          break;
      }
      if (name == 'opacity') {
        obj.style.opacity = cur;
        obj.style.filter = 'alpha(opacity:' + cur * 100 + ')';
      } else {
        obj.style[name] = cur + 'px';
      }
    }

    if (n == count) {
      clearInterval(obj.timer);
      options.end && options.end();
    }
  }, 30);
}
```

## Cookie

```js
// 添加cookie
function setCookie(key, val, day) {
  if (day) {
    var date = new Date();
    var ms = date.getTime() + day * 24 * 60 * 60 * 1000;
    date.setTime(ms);
    var str = date.toGMTString();
    document.cookie = key + "=" + val + ";expires=" + str;
  } else {
    document.cookie = key + "=" + val;
  }
}

// 获取cookie
function getCookie(key) {
  var cookie = document.cookie.split("; ");
  var arr = cookie.split(/=|;\s/g);
  return arr[arr.indexOf(key) + 1];
}
```

## storage工具类封装

``` js
class HYHCache {
  constructor(isLocal = true) {
    this.storage = isLocal ? localStorage: sessionStorage
  }

  setItem(key, value) {
    if (value) {
      this.storage.setItem(key, JSON.stringify(value))
    }
  }

  getItem(key) {
    let value = this.storage.getItem(key)
    if (value) {
      value = JSON.parse(value)
      return value
    } 
  }

  removeItem(key) {
    this.storage.removeItem(key)
  }

  clear() {
    this.storage.clear()
  }

  key(index) {
    return this.storage.key(index)
  }

  length() {
    return this.storage.length
  }
}

const localCache = new HYHCache()
const sessionCache = new HYHCache(false)

export {
  localCache,
  sessionCache
}
```
## 深拷贝
```js
function isObject(value) {
  const valueType = typeof value
  return (value !== null) && (valueType === "object" || valueType === "function")
}

function deepClone(originValue, map = new WeakMap()) {
  // 判断是否是一个Set类型
  if (originValue instanceof Set) {
    return new Set([...originValue])
  }

  // 判断是否是一个Map类型
  if (originValue instanceof Map) {
    return new Map([...originValue])
  }

  // 判断如果是Symbol的value, 那么创建一个新的Symbol
  if (typeof originValue === "symbol") {
    return Symbol(originValue.description)
  }

  // 判断如果是函数类型, 那么直接使用同一个函数
  if (typeof originValue === "function") {
    return originValue
  }

  // 判断传入的originValue是否是一个对象类型
  if (!isObject(originValue)) {
    return originValue
  }
  if (map.has(originValue)) {
    return map.get(originValue)
  }

  // 判断传入的对象是数组, 还是对象
  const newObject = Array.isArray(originValue) ? []: {}
  map.set(originValue, newObject)
  for (const key in originValue) {
    newObject[key] = deepClone(originValue[key], map)
  }

  // 对Symbol的key进行特殊的处理
  const symbolKeys = Object.getOwnPropertySymbols(originValue)
  for (const sKey of symbolKeys) {
    // const newSKey = Symbol(sKey.description)
    newObject[sKey] = deepClone(originValue[sKey], map)
  }
  
  return newObject
}
```

## 简易版事件总线
```js
class HYHEventBus {
  constructor() {
    this.eventBus = {}
  }

  on(eventName, eventCallback, thisArg) {
    let handlers = this.eventBus[eventName]
    if (!handlers) {
      handlers = []
      this.eventBus[eventName] = handlers
    }
    handlers.push({
      eventCallback,
      thisArg
    })
  }

  off(eventName, eventCallback) {
    const handlers = this.eventBus[eventName]
    if (!handlers) return
    const newHandlers = [...handlers]
    for (let i = 0; i < newHandlers.length; i++) {
      const handler = newHandlers[i]
      if (handler.eventCallback === eventCallback) {
        const index = handlers.indexOf(handler)
        handlers.splice(index, 1)
      }
    }
  }

  emit(eventName, ...payload) {
    const handlers = this.eventBus[eventName]
    if (!handlers) return
    handlers.forEach(handler => {
      handler.eventCallback.apply(handler.thisArg, payload)
    })
  }
}
```

## base64转文件

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

## 点击下载文件

```js
download(content, filename) {
  var eleLink = document.createElement("a");
  eleLink.download = filename;
  eleLink.style.display = "none";
  // 字符内容转变成blob地址
  var blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
}

// use
downloadTxt() {
  this.download('content', "fileName");
}
```

## sort进阶排序

```js
onSortChange({ prop, order }) {
  this.tabelList.sort(this.compare(prop, order));
}

compare(propertyName, sort) {
  return function (obj1, obj2) {
    var value1 = obj1[propertyName];
    var value2 = obj2[propertyName];
    if (typeof value1 === "string" && typeof value2 === "string") {
      const res = value1.localeCompare(value2, "zh");
      return sort === "ascending" ? res : -res;
    } else {
      if (value1 <= value2) {
        return sort === "ascending" ? -1 : 1;
      } else if (value1 > value2) {
        return sort === "ascending" ? 1 : -1;
      }
    }
  };
}
```

