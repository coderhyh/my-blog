---
title: javascript笔记
date: 2022-02-10
sidebar: 'auto'
tags:
 - 笔记
 - js
categories:
 -  javascript
---

# JavaScript

## 获取对象 `key` 和判断是否存在某个 `key` 

::: tip
使用Object.keys
:::

Object.keys( ) 会返回一个数组，数组中是这个对象的key列表

所以只要Object.keys(a)[0]， 就可以得只包含一个键值对的key

::: tip
判断是否存在某个 `key` 
:::

```js
var obj = {
  a: 1,
  b: 2,
  c: 3
}
console.log(obj.hasOwnProperty('a')); // true
//因为当前定义对象中含有此k, 故返回值为 true
```

::: tip
获取对象长度
:::

::: tip
Object.keys(obj).length
:::

## 编码转换

```js
var name="张三?&=";
// 编码
var res1=encodeURIComponent(name);
console.log(res1);
// 解码
var res2=decodeURIComponent(res1);
```



## Boolean()  转化为假的六种情况
::: tip
Boolean()  转化之后为假的六种情况 false  ""  0  NaN  undefined  null
:::

## `isFinite()` 

::: tip
isFinite() 函数用于检查其参数是否是无穷大，也可以理解为是否为一个有限数值（finite number）。

**提示：** 如果参数是 NaN，正无穷大或者负无穷大，会返回 false，其他返回 true。
:::

```js
document.write(isFinite(123)+ "<br>");true
document.write(isFinite(-1.23)+ "<br>");true
document.write(isFinite(5-2)+ "<br>");true
document.write(isFinite(0)+ "<br>");true
document.write(isFinite("Hello")+ "<br>");false
document.write(isFinite("2005/12/12")+ "<br>");false

isFinite(Infinity);  // false
isFinite(NaN);       // false
isFinite(-Infinity); // false
 
isFinite(0);         // true
isFinite(2e64);      // true, 在更强壮的 Number.isFinite(null) 中将会得到false

isFinite("0");       // true, 在更强壮的 Number.isFinite('0') 中将会得到false
```

## `getBoundingClientRect()`

::: tip
`Element.getBoundingClientRect()`  方法返回元素的大小及其相对于视口的位置。
:::

## 随机数

```js
function rnd(n, m) {
  return parseInt(Math.random() * (m - n) + n);
}
```

## 打印

```js
// 打印我们返回的元素对象 更好的查看里面的属性和方法
//dir 目录的意思
console.dir()

/js查看代码的运行时间
console.time('global')
//要执行的代码放中间
console.timeEnd('global')
```

## 判断数据**类型** 

```js
' '.constructor == string //true 啥都能查

instanceof运算符用法
var strObj = new String("go go go, don't stop!!!");
console.log(strObj instanceof String); // true
-------------------------------------------
console.log(typeof 100 == "number")//数值类型
console.log(typeof NaN == "number")//数值类型

console.log(typeof "hello" == "string")//字符串
console.log(typeof true == "boolean") //布尔类型
console.log(typeof function(){} == "function")//函数
console.log(typeof undefined == "undefined")

// 不正常 "object"
console.log(typeof [1,2,3]);
console.log(typeof null);
console.log(typeof {});

// 验证数组和对象
console.log([1,2,3] instanceof Array);
console.log({} instanceof Object)
```

## 定时器

::: tip
setTimeout --- window.setTimeout(调用函数, 延时时间);

1.这个调用函数可以直接写函数 还可以写 函数名 还有一个写法 '函数名()'

2.页面中可能有很多的定时器，我们经常给定时器加标识符 （名字)
:::

```js
function callback() {
    console.log('爆炸了');
}
var timer1 = setTimeout(callback, 3000);
var timer2 = setTimeout(callback, 5000);
```

::: tip
setInterval --- 每 1秒 执行一次
:::

```js
setInterval(function(){},1000)
```

::: tip
clearTimeout --- 清除定时器 
:::

```js
clearTimeout(定时器名字);
```

## 立即执行函数

- 写法
  - `(function() {}) (调用); ` 
  - `(function(){} (调用));` 

```js
(function(a, b) {
    console.log(a + b);
    var num = 10;
})(1, 2); // 第二个小括号可以看做是调用函数

(function sum(a, b) {
    console.log(a + b);
    var num = 10; // 局部变量
}(2, 3));
```

::: tip
立即执行函数最大的作用就是 独立创建了一个作用域, 里面所有的变量都是局部变量 不会有命名冲突的情况
:::


## 定时器简单的封装

```js
function animate(obj, target) {
    // 当我们不断的点击按钮，这个元素的速度会越来越快，因为开启了太多的定时器
    // 解决方案就是 让我们元素只有一个定时器执行
    // 先清除以前的定时器，只保留当前的一个定时器执行
    clearInterval(obj.timer);
	//obj.timer 传输进来的是一个元素对象 给这个元素添加一个timer属性  给这个属性赋上定时器 
    //会节省空间 不同的元素调用定时器 名字也不会重复
    obj.timer = setInterval(function() {
        if (obj.offsetLeft == target) {
            // 停止动画 本质是停止定时器
            clearInterval(obj.timer);
        }
        obj.style.left = obj.offsetLeft + 1 + 'px';

    }, 30);
}
//调用
animate(div, 300);
```

## 定时器 由快到慢 缓动动画

::: tip
匀速动画 就是 盒子是当前的位置 + 固定的值 10 

缓动动画就是 盒子当前的位置 + 变化的值(目标值 - 现在的位置) / 10）
:::

```js
//目标是100 现在的是0  后面除以的值越大 速度越慢
var step = (100 - 0) / 10;
//除法取到的是有小数点的值
step = step > 0 ? Math.ceil(step) : Math.floor(step);
```

## 定时器缓动动画 自定义回调函数

```js
//obj元素对象  target最终运动距离  callback自定义回调函数
function animate(obj, target, callback) {
    代码...
    //等代码跑完执行自定义回调函数
    if(...){
       //如果callback回调函数存在
       callback&&callback();
	}
}
//调用的时候 可以把函数传输过去
animate(div,500,function(){
    alert("666");
})
```

## **表格**的便捷操作

::: tip
表格是存在thead 与 tbody的
:::

```html
<table border="1">
  <thead>
    <tr>
      <td>1</td>
      <td>2</td>
      <td>3</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>4</td>
      <td>5</td>
      <td>6</td>
    </tr>
  </tbody>
</table>
```

::: tip
js 快速选取表格内容
:::

```js
//tHead --- 获取thead表头
//tFoot --- 获取tfoot表尾
//tBodies --- 选中所有的tbody
//rows --- 选中所有的行
//cells --- 选中所有的列
//选中表格中的第一个tbody 中的第一行 中的第一列
const oTbody = document.querySelector("table");
table.tBodies[0].rows[0].cells[0]
```

## 当前页面的**表单**获取 `forms`

![img](/javascript/javascript-note/image-20210922163245773.png)

::: tip
补充：`document.forms[0].submit()` 提交的地址即对应的 `action` 地址如果想要改变，可以使用

document.forms[0].action = theUrl;
:::

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    input{
      outline: none;
    }
  </style>
</head>

<body>
  <form action="./选项卡.html" name="form1">
    <input type="text" name="userNam" placeholder="请输入用户名">
    <input type="radio" name="sex" id="nan" checked value="男"><label for="nan">男</label>
    <input type="radio" name="sex" id="nv" value="女"><label for="nv">女</label> <br>

    <input type="checkbox" name="hobby" value="唱" id="c"><label for="c">唱</label>
    <input type="checkbox" name="hobby" value="跳" id="t"><label for="t">跳</label>
    <input type="checkbox" name="hobby" value="rap" id="r"><label for="r">rap</label>
    <input type="checkbox" name="hobby" value="篮球" id="l"><label for="l">篮球</label>
    <!--1.选择一个-->
    <select name="abc">
      <option value="苹果">苹果</option>
      <option value="香蕉" selected>香蕉</option>
      <option value="榴莲">榴莲</option>
      <option value="葡萄">葡萄</option>
    </select>
    <!--2.选择多个 获取多选的值与checkbox相同-->
    <select name="aaa" multiple>
      <option value="苹果">苹果</option>
      <option value="香蕉" selected>香蕉</option>
      <option value="榴莲">榴莲</option>
      <option value="葡萄">葡萄</option>
    </select>

    <!-- 二级联动 -->
    <select name="zm">
    </select>

    <select name="city">
    </select>

    <br>
    <input type="submit" class="submit">
  </form>
  <script src="../city.js"></script>
  <script>
    window.addEventListener("load", function () {
      const newForms = document.forms["form1"]
      const submitClick = document.querySelector(".submit");
      // 二级联动
      for (const key in city) {
        newForms.zm.innerHTML += `
          <option>${key}</option>
        `;
      }
      cityList();

      function cityList() {
        newForms.city.innerHTML = ``;
        let nowCity = city[newForms.zm.value];
        nowCity.forEach(e => {
          newForms.city.innerHTML += `
          <option>${e.name}</option>
        `;
        });
      }

      newForms.zm.addEventListener("change", cityList);

      // submit
      submitClick.addEventListener("click", function (e) {
        e.preventDefault();
        let userName = newForms.userNam.value;

        if (userName.length > 6) {
          console.log(newForms.sex.value);// 性别
          console.log(getCheckedValue());// 爱好
          console.log(newForms.abc.value, newForms.abc.selectedIndex); // 单选水果
          console.log(getSelectedValue());// 多选水果
          console.log(newForms.city.value);// 城市

          // document.forms[0].submit();
        } else {
          console.log("用户名大于6位");
        }
      })
    })

    function getCheckedValue() {
      var hobbies = document.getElementsByName("hobby");
      var value = [];
      for (i = 0; i < hobbies.length; i++) {
        if (hobbies[i].checked) {
          value.push(hobbies[i].value);
        }
      }
      return value;
    }

    function getSelectedValue() {
      var obj = document.getElementsByName("aaa")[0];
      var value = [];
      for (i = 0; i < obj.children.length; i++) {
        if (obj.children[i].selected) {
          value.push(obj.children[i].value);
        }
      }
      return value;
    }
  </script>
</body>

</html>
```



## `Math` 对象

```js
// Math
//四舍五入
console.log(Math.round(-2.3));
// 向上取整
console.log(Math.ceil(-2.00001))
// 向下取整
console.log(Math.floor(2.999))

// 最大值
console.log(Math.max(1,2,3,4))
// 最小值
console.log(Math.min(1,2,3,4))

// 绝对值
console.log(Math.abs(-1))

// 幂
console.log(Math.pow(2,3));//2的3次方

// π 圆周率
console.log(Math.PI);

平方根
console.log(Math.SQRT2)//2的平方根
console.log(Math.sqrt(9))

随机数
console.log(Math.random())//0-1 包括0不包括1
console.log(Math.floor(Math.random()*3))

// 弧度   Π=180°   10文具盒 100元
console.log(Math.sin(Math.PI/6))
console.log(Math.tan(Math.PI/4))
```

## `Date` 对象

::: tip
以下的 `get` 方法都可以换为 `set` 设置时间
:::

```js
var d=new Date();//获取当前时间点的日期对象
var year=d.getFullYear();//年份
var month=d.getMonth()+1;//月份 从0-11      +1
var date=d.getDate();//日
var week=d.getDay();//星期 星期日-星期六 0-6
var hours=d.getHours(好饿s);// 时
var min=d.getMinutes(咩咧次);// 分
var sec=d.getSeconds(腮肯s);// 秒
var msec=d.getMilliseconds(miu哩腮肯s);// 毫秒

// 时间戳  1970 1 1 - 至今的毫秒数  格林威治时间
var s=d.getTime();
alert(s)

console.log(year,month,date,week,hours,min,sec,msec);
```

::: tip
获取月份的天数
:::

```js
var d=new Date();
//日设置成0 getDate 返回的上个最后一天(天数)
d.setDate(0);
console.log(d.getDate());//返回上个月的最后一天

// 想获取10月份天数
var d=new Date();
d.setMonth(10);//月份0-11	10就是11月
d.setDate(0);//获取11月的上一月的最后一天
console.log(d.getDate());//31
```


## **字符串**方法

```js
// 获取字符编码
   // 小写字母99-122 大写65-90  数字 48-57
console.log(str.charCodeAt(0))

// 检测字符串是否存在某个字符串片段
// 如果没有 则返回-1
var res=str.indexOf("h");//第一次出现的位置
res=str.lastIndexOf("b");//末次出现的位置

// 替换字符
var str="你是智障吗？";
var res=str.replace("智障","**");
let phone = "98765432101";//模糊后三位电话号码 repeat(3)重复
console.log(phone.slice(0, -3) + "*".repeat(3));

// 截取字符串片段
var str="hello";
var res=str.slice(0,3);//从0截到3 不包含3
var res=str.slice(2);//不指定末尾 则截取到字符串最后一位

var res=str.substr(1,3);//从1往后截3位
var res=str.substr(1);//不指定位数 则截取到字符串最后一位

// 大小写转换
var str="hello";
var res=str.toUpperCase();//大写
res=res.toLowerCase();//小写

 // 切割字符串 切割结果存入数组
var str="hello";
var res=str.split("");// 在字符之间切割

// str.trim() 方法 去除首尾空格

```

## **操作数组**的些许方法

`arr = ['a','b','c','d']`

::: tip
 1.push方法 --- 结尾添加元素(可以添加多个值)
:::

```js
arr.push('aaa') //a,b,c,d,aaa
```

::: tip
unshift() --- 在数组最前面添加元素(可以添加多个值)
:::

```js
arr.unshift('aaa', 'bbb') //aaa,bbb,a,b,c,d
```

::: tip
 pop() --- 删除数组中的最后一个元素
:::

```js
arr.pop() //a,b,c
```

::: tip
 shift() --- 删除数组中的第一个元素
:::

```js
arr.shift(); //b,c,d
```

::: tip
 splice(选中第几个元素， 需要删除几个元素 - 0不删除， 替换/添加的元素--可以多个)
:::

```js
arr = ['a','b','c','d']
//插入 选中下标1的(b) 删除0个 在下标1(b)之前添加aaa
arr.splice(1, 0, 'aaa','bbb') //a,aaa,bbb,b,c,d
//替换 选中下标1的(b) 删除1个(b) 下标1(b)替换为aaa（可以多个）
arr.splice(1, 1, 'aaa') //a,aaa,c,d
//删除 从第一个(b)开始 删除所有
arr.splice(1) //a
//删除 从第一个(b)开始 删除2个(b,c)
arr.splice(1, 2) //a,d
```

::: tip
 sort() --- 排序
:::

```js
arr.sort() //a,b,c,d 不能用
//进阶用法
var arr=[5,8,2,11,4];
arr.sort(function(a,b){
  // a b数组每次对比的两个元素
  if(a>b){
    return 1;//换位
  }else{
    return -1;//不换
  }
}) // 2,4,5,8,11
arr.sort((a, b) => a > b ? 1 : -1)
arr.sort((a, b) => a-b) //针对 数字 的排序方法
arr.sort((a, b) => a.charCodeAt(0)-b.charCodeAt(0)) //针对 字母 的排序方法
```

::: tip
 reverse() --- 反转
:::

```js
arr.reverse() //d,c,b,a 
```

::: tip
concat() --- 合并
:::

  ```js
var arr = ['a','b','c','d']
var arr1=["x","y","z"];
var res=arr.concat(arr1)//a,b,c,d,x,y,,z 可以合并多个数组
  ```

::: tip
slice() --- 截取
:::

```js
arr.slice(从我, 到我(不包括我))
//跟字符串一样 
```

::: tip
 注意: 通过索引值修改数组中的元素 不是**响应式**
:::

```js
arr[0] = 'bbbbbb';
```

::: tip
some --- 当前元素符合条件  即为true
:::

```js
// return true 当前元素符合条件
// 只要有一个符合 最终结果为真
let flag=arr.some(item=>item=="r"||item=="b");
console.log(flag);
```

::: tip
every --- 全部符合条件 返回true
:::

```js
// 全部符合条件 返回真
let flag=arr.every(item=>item.length==1)
console.log(flag);
```

::: tip
Vue.set(要修改的对象, 索引值, 修改后的值)
:::

```js
Vue.set(arr, 0, 'bbbbbb')
Vue.delete(arr, 0)
```

::: tip
**.toFixed( )** 字符串保留小数
:::

## 高阶函数 `filter()` `map()` `reduce()` 

::: tip
`filter()` **过滤**
语法 : array.filter(function(`currentValue`,`index`,`arr`), thisValue)
第一个：回调函数（`currentValue`：必须。**当前元素的值**，`index`：可选。**当前元素索引值**，`arr`：可选。当前元素属于的数组对象）
第二个：可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。
如果省略了 thisValue ，"this" 的值为 "undefined" 
:::

```js
const nums = [10, 20, 111, 222, 444, 40, 50]
//取出所有小于100的数字
//回调函数有一个要求: 必须返回一个boolean值
// true: 当返回true时, 函数内部会自动将这次回调的n加入到新的数组中
// false: 当返回false时, 函数内部会过滤掉这次的n
let total = nums.filter(function (n) {
  return n < 100
})
```

::: tip
`map()` **计算**

语法：array.map(function(`currentValue`,`index`,`arr`), thisValue) 

第一个：回调函数（`currentValue`：必须。**当前元素的值**，`index`：可选。**当前元素索引值**，`arr`：可选。当前元素属于的数组对象）

第二个：可选。对象作为该执行回调时使用，传递给函数，用作 "this" 的值。

如果省略了 thisValue，或者传入 null、undefined，那么回调函数的 this 为全局对象。
:::

```js
const nums = [10, 20, 111, 222, 444, 40, 50]
//将所有的数字进行转化: 全部*2
//会遍历数组中的每一个值 然后对其中的值进行计算 最后返回到新数组中
let total = nums.map(function (n) {
  return n * 2
})
```

::: tip
`reduce()` **汇总**

语法：array.reduce(function(`total`, `currentValue`, `currentIndex`, `arr`), initialValue)

第一个：回调函数（`total`：必需。*初始值*, 或者计算结束后的返回值，`currentValue`：必须。**当前元素的值**，`currentIndex`：可选。**当前元素索引值**，`arr`：可选。当前元素属于的数组对象）

第二个： 可选。传递给函数的初始值  默认是0
:::

```js
const nums = [10, 20, 111, 222, 444, 40, 50]
//将所有nums数字相加
let total = nums.reduce(function (prevValue, n) {
  //prevValue 相当于 prevValue = 0, prevValue += n;
  return prevValue + n
}, 0)
```

## 数组/字符串转换(**深拷贝**)

```js
//数组转字符串
JSON.stringify(数组)
//将json转化为js对象 / 数组
JSON.parse('{ "name":"runoob", "alexa":10000, "site":"www.runoob.com" }')
深拷贝:
	var list=[{name:"张三"},{name:"李四"}];
	console.log(JSON.parse(JSON.stringify(list)))


//eval() 函数
eval(string) //必需。要计算的字符串，其中含有要计算的 JavaScript 表达式或要执行的语句
//里面是个字符串 eval会识别js代码 转换为数组
eval("[1,2,3,4,5]")
```

## **防抖**与**节流**

### 什么是防抖(⭐⭐⭐)

防抖策略（debounce）是当事件被触发后，**延迟 n 秒后再执行回调**，如果在这 **n 秒内事件又被触发，则重新计时**。

防抖的应用场景：如淘宝搜索框，用户在输入框连续搜索一行字的时候可以通过防抖策略，知道用户把搜索内容全部打出才触发执行请求，这样可以有效减少请求的次数，节约请求资源

好处：用户在多次触发某事件的情况下只会执行最后一次     

步骤：

         1. 定义一个防抖动的 timer延时器并置空
    
         2.获取页面中input  DOM元素并绑定回车事件
    
         3.先清除延时器，确保连续多次触发但只执行最后一次定时器

示例代码：

```js
<!-- 用户要进行输入的input框 -->
 <input type="text" name="" id="inp">

// 第一步：定义一个防抖动的timer延时器并置空
var timer = null;
var count = 0;  //count用于统计被触发的次数
// 获取页面中input  DOM元素并绑定回车事件
document.querySelector('#inp').addEventListener('keyup', function() {
  // 先清除定时器，确保连续多次触发但只执行最后一次定时器
  clearInterval(timer)
  timer = setTimeout(function() {
    count++
    console.log('我被触发了' + count + '次');
  }, 1000)
})
```

### 什么是节流(⭐⭐⭐)

节流策略（throttle）可以减少一段时间内事件的触发频率。

节流的应用场景

① 鼠标连续不断地触发某事件（如点击），只在一定时间内只触发一次；

② 懒加载时要监听计算滚动条的位置，但不必每次滑动都触发，可以降低计算的频率，而不必去浪费 CPU 资源；

 效果： 图片跟随鼠标移动

示例代码：

```js
// 节流  在固定时间只执行一次(第一次)
var flag=true;
btn.onclick=function(){
  if(flag){
    flag=false;
    console.log("点击");
    setTimeout(function(){
      flag=true;
    },1000)
  }
}
```

## 封装防抖节流函数
```js
function throttle(fn, { delay = 1000, immediate = false }) {
  let timer = null;
  let isInvoke = false;

  function _throttle(...rest) {
    return new Promise((resolve, reject) => {
      resetInvoke();
      if (immediate && !isInvoke) {
        execFunctionWithCatchError();
        isInvoke = true;
      } else {
        if (timer) return;
        timer = setTimeout(() => {
          execFunctionWithCatchError();
          timer = null;
        }, delay);
      }
      function execFunctionWithCatchError() {
        try {
          resolve(fn.apply(this, rest));
        } catch (error) {
          reject(error);
        }
      }
    });
  }
  const resetInvoke = debounce(() => (isInvoke = false), { delay });
  _throttle.cancel = () => (clearTimeout(timer), (timer = null));
  return _throttle;
}

function debounce(fn, { delay = 1000, immediate = false }) {
  console.log(delay);
  let timer = null;
  let isInvoke = false;

  const _debounce = function (...rest) {
    return new Promise((resolve, reject) => {
      if (timer) clearTimeout(timer);

      if (immediate && !isInvoke) {
        execFunctionWithCatchError();
        isInvoke = true;
      } else {
        timer = setTimeout(() => {
          execFunctionWithCatchError();
          isInvoke = false;
          timer = null;
        }, delay);
      }

      function execFunctionWithCatchError() {
        try {
          resolve(fn.apply(this, rest));
        } catch (error) {
          reject(error);
        }
      }
    });
  };

  _debounce.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    isInvoke = false;
  };

  return _debounce;
}
```


## `webWorks` 多线程

由于正常js是同步的  对于**需要大量运算的代码**  后面的代码都会等着**需要大量运算的代码** 结束后才会执行  

这样大大减少了性能

所以可以用`webWorks` 来把**需要大量运算的代码**分离出去 交给其他线程处理

::: tip
主线程
:::

```js
// 找外援 交给ming.js处理
var ming = new Worker("./ming.js");
// 对应 ming.js 中的 postMessage
//监听返回数据的事件
ming.onmessage = function (e) {
  console.log(e); 
  console.log(e.data); //postMessage的参数
}
```

::: tip
ming.js 
:::

```js
var num=0;
for(var i=0;i<1000000000;i++){
  num+=i;
}
postMessage(num); // 把处理好的数据返回出去
```



## 闭包

::: tip
闭包是定义函数**内部**的函数 并被外层函数的**外部**所引用

作用：闭包可以让局部变量持久保存 模拟全局变量  变量不会冲突 

缺点：闭包会使得函数中的变量都被保存在内存中，内存消耗很大，否则会造成网页的性能问题，可能导致内存泄露。**解决方法是**，在退出函数之前，将不使用的局部变量全部删除。
:::



::: tip
封装插件
:::

```js
;(function(){
  function add(a,b){
    alert(a+b)
  }
  function reduce(a,b){};
  // 想要被外部访问的东西
  window.layui={
    add:add,
    reduce:reduce
  };
})();
```

::: tip
内存泄露 --- 养成好习惯  无用的用完后清掉
:::

```js
var btn=document.getElementById("btn");

btn.onclick=function(){
  this.parentNode.removeChild(this);
  btn=null;
}
```

