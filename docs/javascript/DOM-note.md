---
title: DOM笔记
date: 2022-02-10
sidebar: 'auto'
tags:
 - 笔记
 - js
categories:
 -  javascript
---

## 页面加载事件

::: tip
load 等页面内容全部加载完毕，包含页面dom元素 图片 flash css 等等

DOMContentLoaded 是DOM 加载完毕，不包含图片 falsh css 等就可以执行 加载速度比 load更快一些
:::

```js
window.addEventListener('load', function() {
    alert(22);
})
document.addEventListener('DOMContentLoaded', function() {
    //有兼容性 IE9+
    alert(33);
})
```

::: tip
pageshow -- 页面加载 刷新 前进 后退 等都会触发 pageshow
:::

::: tip
由于火狐浏览器有个页面缓存  后退之后不会触发 load 所以使用 pageshow  就可以
:::

```js
//window 调用
window.addEventListener('pageshow', function(e) {
    // e.persisted 返回的是true 就是说如果这个页面是从缓存取过来的页面 就执行
    if(e.persisted){
        
    };
})
```

## 常用鼠标**事件** 

![img](/javascript/javascript-note/image-20210729211443698.png)

::: tip
`mouseenter`和`mouseover`的区别 鼠标经过触发事件 
:::

::: tip
`mouseover `经过自身盒子会触发    经过子元素还会触发   会冒泡

`mouseenter `经过自身盒子不会触发    不会冒泡
:::

::: tip
跟 `mouseenter` 搭配 鼠标离开 `mouseleave` 同样不会冒泡

`mousewheel`	鼠标滚动时触发
:::

::: tip
表单事件
:::

- onsubmit --- 提交时发生
- onreset --- 重置时发生



## 判断用户是否浏览当前页面

```js
//兼容性写法
var hiddenProperty = 'hidden' in document ? 'hidden' :    
'webkitHidden' in document ? 'webkitHidden' :    
'mozHidden' in document ? 'mozHidden' :    
null;
var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
var onVisibilityChange = function(){
  if (!document[hiddenProperty]) {    
    console.log('页面激活');
  }else{
    console.log('页面非激活')
  }
} 
document.addEventListener(visibilityChangeEvent, onVisibilityChange);
```

## 禁用**鼠标右键** & **选中**

::: tip
禁用鼠标右键  and  禁止鼠标选中
:::

```js
// 1. contextmenu 禁用右键菜单
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
})
// 2. 禁止选中文字 selectstart
*{
  user-select: none;
}
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
})
```

## 选择器

::: tip
getElementsByTagName("标签名") --- 标签名选择器
:::

```js
// 1.返回的是 获取过来元素对象的集合 以伪数组的形式存储的
var lis = document.getElementsByTagName('li');
// 3. 如果页面中只有一个li 返回的还是伪数组的形式  可以用索引 不可以用方法
// 4. 如果页面中没有这个元素 返回的是空的伪数组的形式

// 5. element.getElementsByTagName('标签名'); 父元素必须是指定的单个元素
// var ol = document.getElementsByTagName('ol'); // [ol]  
// console.log(ol[0].getElementsByTagName('li')); ol后面要加[0]，不然获取不到li
var ol = document.getElementById('ol');
console.log(ol.getElementsByTagName('li'));
```

::: tip
getElementsByClassName('类') --- 类名选择器
:::

```js
// 1. getElementsByClassName 根据类名获得某些元素集合
var boxs = document.getElementsByClassName('box');
```

::: tip
querySelector('标签名 or 类名 or id') --- 返回指定选择器的第一个元素对象
:::

```js
//只会返回第一个元素
var firstBox = document.querySelector('.box');
console.log(firstBox);
var nav = document.querySelector('#nav');
console.log(nav);
var li = document.querySelector('li');
console.log(li);
```

::: tip
querySelectorAll('标签名 or 类名 or id') --- 返回指定选择器的所有元素对象集合
:::

```js
var allBox = document.querySelectorAll('.box');
console.log(allBox);
var lis = document.querySelectorAll('li');
console.log(lis);
```

::: tip
querySelector与querySelectorAll 选择
:::

```js
//以下都是All 如果是querySelector 就只会选择第一个

//查找文档中共包含 "target" 属性的 <a> 标签，并为其设置边框:
var x = document.querySelectorAll("a[target]");

//查找每个父元素为 <div> 的 <p> 元素，并为其设置背景颜色:
var x = document.querySelectorAll("div > p");

//获取文档中 class="example"  <p> 元素:
document.querySelectorAll("p.example");
```

## 获取 `html`、`body` 元素

```js
// 1.获取body 元素
var bodyEle = document.body;
console.log(bodyEle);
console.dir(bodyEle);
// 2.获取html 元素
// var htmlEle = document.html; 不行
var htmlEle = document.documentElement;
console.log(htmlEle);
```

## 添加类名

::: tip
className = " " --- 给元素加类名  但是会覆盖原先的
:::

```js
//这样写就没问题了
this.className = "a b"
//也可以这样写
this.className += "b"
```

::: tip
获取css中的样式  只能获取 不能设置
:::

```js
var property = window.getComputedStyle(element, pseudoElement).属性名;
//element: 必需，要获取样式的元素。
//pseudoElement: 可选，伪类元素，当不查询伪类元素的时候可以忽略或者传入 null。
```



## 获取、设置、移除元素的属性

- 获取

  - element.属性 --- 只能获取自带的属性  无法获取自定义的属性

  - element.getAttribute('属性') --- 所有属性都可以获取

- 设置

  - element.属性= '值'  --- 只能设置自带的属性  无法设置自定义的属性
  - element.setAttribute('属性', '值') --- 所有属性都可以设置

- 移除

  - removeAttribute('属性') --- 不管是自带还是自定义 都可以移除

```js
// 1. 获取元素的属性值
// (1) element.属性
console.log(div.id);
//(2) element.getAttribute('属性')  get得到获取 attribute 属性的意思 我们程序员自己添加的属性我们称为自定义属性 index
console.log(div.getAttribute('id'));
console.log(div.getAttribute('index'));
```

## 获取、设置自定义属性 data-

::: tip
以上是没有任何兼容问题的   而dataset 只有  IE11+  才支持的

h5为了区分自定义属性  所以设置自定义属性都会加上data-
:::

```js
data-index = ""
//dataset是设置的所有自定义属性的一个集合、对象   可以通过丶来获取自定义属性
dataset.index  or  dataset['index']
```

::: tip
如果自定义属性的名字是 data-list-name = ""
:::

```js
//就要使用驼峰式命名法来获取
dataset.listName  or  dataset['listName']
```

## 父节点

::: tip
parentNode  
:::

```js
// 得到的是离元素最近的父级节点(亲爸爸) 如果找不到父节点就返回为 null
//找div的爸爸
console.log(div.parentNode);
```

## 子节点

::: tip
childNodes - 获取子节点  包括但不限于  元素节点 文本节点(空格 换行都算)     （不提倡）
:::

```js
// 1. 子节点  childNodes 所有的子节点 包含 元素节点 文本节点等等
console.log(ul.childNodes);  
```

::: tip
children - 这个就不会出现上方的问题  （提倡）
:::

```js
// 2. children 获取所有的子元素节点 也是我们实际开发常用的
console.log(ul.children);
```

## 获取首个、末尾子节点

- firstChild - 获取第一个子节点   文本节点也会被获取过来  ---  不靠谱
- lastChild - 获取最后一个子节点   一样不靠谱
- firstElementChild -  获取第一个子元素  不太靠谱  有兼容性 IE9+ 才可以
- lastElementChild - 获取最后一个子元素  同上

::: tip
解决方案 
:::

```js
//实际开发的写法  既没有兼容性问题又返回第一个子元素
//获取第一个元素
console.log(ol.children[0]);
//获取最后一个元素  div.children[父级的length-1]
console.log(ol.children[ol.children.length - 1]);
```

## 兄弟节点

- nextSibling - 下一个兄弟节点 包含元素节点或者 文本节点等等  
- previousSibling - 上一个兄弟节点 包含元素节点或者 文本节点等等   

::: tip
以上不提倡
:::

- nextElementSibling - 得到下一个兄弟元素节点
- previousElementSibling - 得到上一个兄弟元素节点

::: tip
以上就只会得到元素 不会有文本节点  但是有兼容性问题  IE9+
:::

## 创建、添加元素节点

- document.createElement('li'); - 创建元素节点
- ul.appendChild(li); - 添加元素节点  在 ul 内的子元素的后方
- insertBefore(li,第几个) - 插入ul内的子元素的前方

```js
// 1. 创建节点元素节点
var li = document.createElement('li');
// 2. 添加节点 node.appendChild(child)  node 父级  child 是子级 后面追加元素  类似于数组中的push
var ul = document.querySelector('ul');
//追加元素  在原有的后面添加
ul.appendChild(li);
// 3. 添加节点 node.insertBefore(child, 指定元素);
var lili = document.createElement('li');
//在原有的子元素前面添加   ul.children[0] ul里面的子节点中的第0个
ul.insertBefore(lili, ul.children[0]);
// 4. 我们想要页面添加一个新的元素 ： 1. 创建元素 2. 添加元素
```

::: tip
appendChild 另一种功能 
:::

```js
//获取元素节点 li标签
var li = document.querySelector("li")
//另一个新的ul
var newUl = document.querySelector("li")
//这样可以把在旧的oldUl获取的li标签添加到新的newUl里面去
//并且旧的oldUl中的li标签会被删除
newUl.appendChild(li)
```

::: tip
也就是说 可以把获取过来的元素节点删除掉  并且可以自动添加到自己定义的父级元素的里面
:::

## 替换节点

```js
var node=document.createElement("li");
node.innerHTML="新的";
// 父元素调用 替换子节点
list.replaceChild(node,list.children[0]);
// 替换当前元素
list.children[0].replaceWith(node);
```

## 删除节点

::: tip
node.removeChild(child)
:::

```js
//删除ul下面的第一个元素节点  ul.children[0]集合的第0个
ul.removeChild(ul.children[0]);	
```

## 克隆节点

::: tip
cloneNode()
:::

```js
// 1. node.cloneNode(); 括号为空或者里面是false 浅拷贝 只复制标签不复制里面的内容
// 2. node.cloneNode(true); 括号为true 深拷贝 复制标签复制里面的内容
var lili = ul.children[0].cloneNode(true); //已经克隆了 赋值给变量lili
ul.appendChild(lili);
```

## 创建元素节点

- document.write() 创建元素 如果页面文档流加载完毕，再调用这句话会导致页面重绘
- innerHTML 创建多个元素效率更高（不使用拼接字符串，采取数组方式拼接） 结构稍复杂
- document.createElement() 创建多个元素效率稍低一些  但结构清晰

::: tip
不用浏览器下  innerHTML  在采取数组拼接方式  要比createElement()更高

innerHTML采取数组拼接
:::

```js
var arr = [];
for (var i = 0; i <= 100; i++) {
    arr.push('<a href="#">百度</a>');
}
inner.innerHTML = arr.join('');
```

::: tip
document.createElement() 创建元素
:::

```js
var div = document.querySelector('div');
for (var i = 0; i <= 100; i++) {
    var a = document.createElement('a');
    d.appendChild(a);
}
```

## 注册事件监听函数

::: tip
addEventListener- 兼容性IE9+  

`addEventListener("事件",处理函数,false)`  默认值为 false, 即冒泡传递，当值为 true 时, 事件使用捕获传递。
:::

```js
// 1. 传统方式注册事件
btns[0].onclick = function() {
    alert('hi');
}
btns[0].onclick = function() {
    alert('hao a u');
}
// 2. 事件侦听注册事件 addEventListener 
// (1) 里面的事件类型是字符串 必定加引号 而且不带on
// (2) 同一个元素 同一个事件可以添加多个侦听器（事件处理程序）
btns[1].addEventListener('click', function() {
    alert(22);
})
btns[1].addEventListener('click', function() {
    alert(33);
})
```

::: tip
tips：这样做的好处是可以方便   后面删除事件 
:::

```js
divs[1].addEventListener('click', fn) // 里面的fn 不需要调用加小括号
//相当于把函数 fn() 绑定给了这个点击事件
function fn() {
    alert(22);
}

//IE9以前的版本支持的attachEvent 也一样
divs[2].attachEvent('onclick', fn1);
function fn1() {
    alert(33);
    divs[2].detachEvent('onclick', fn1);
}
```

::: tip
attachEvent - IE9以前的版本支持  同时是非标准的  （了解就行）
:::

```js
//注册事件是需要带 on  的
btns[2].attachEvent('onclick', function() {
    alert(11);
})
```

## 删除事件

::: tip
传统删除方式
:::

```js
divs.onclick = null;
```

::: tip
事件监听函数的删除方式
:::

```js
//括号里  第一个是  选中需要删除的事件  第二个是选中需要删除的事件函数
divs[1].removeEventListener('click', fn);
```

::: tip
attachEvent 的删除事件方式   IE9以前的版本支持  同时是非标准的  （了解就行）
:::

```js
//同上
divs[2].detachEvent('onclick', fn1);
```

## DOM 事件流 捕获、冒泡

```html
<div class="father">
    <div class="son">son盒子</div>
</div>
```

1. JS 代码中只能执行捕获或者冒泡其中的一个阶段。

2. onclick 和 attachEvent（ie） 只能得到冒泡阶段。

3. 捕获阶段 如果addEventListener 第三个参数是 true 那么则处于捕获阶段 document -> html -> body -> father -> son

```js
var son = document.querySelector('.son');
son.addEventListener('click', function() {
    alert('son');
}, true);
var father = document.querySelector('.father');
father.addEventListener('click', function() {
    alert('father');
}, true);
//事件捕获 从外往内捕获
```

4. 冒泡阶段 如果addEventListener 第三个参数是 false 或者 省略 那么则处于冒泡阶段 son -> father ->body -> html -> document

```js
var son = document.querySelector('.son');
son.addEventListener('click', function() {
    alert('son');
}, false);
var father = document.querySelector('.father');
father.addEventListener('click', function() {
    alert('father');
}, false);
document.addEventListener('click', function() {
    alert('document');
})
//事件冒泡 从外往内冒泡
```

## **事件对象 ** 

1. event 就是一个事件对象 写到我们侦听函数的 小括号里面 当形参来看

2. 事件对象只有有了事件才会存在，它是系统给我们自动创建的，不需要我们传递参数

  3. 事件对象 是 我们事件的一系列相关数据的集合 跟事件相关的 比如鼠标点击里面就包含了鼠标的相关信息，鼠标坐标啊，如果是键盘事件里面就包含的键盘事件的信息 比如 判断用户按下了那个键

4. 这个事件对象我们可以自己命名 比如 event 、 evt、 e

5. 事件对象也有兼容性问题 ie678 通过 window.event 兼容性的写法 e = e || window.event;

```js
// 事件对象
var div = document.querySelector('div');
div.onclick = function(e) {
    // console.log(e);
    // console.log(window.event);
    // e = e || window.event;
    console.log(e);


}
// div.addEventListener('click', function(e) {
//		console.log(e);

//})
```

## 事件对象属性 事件委托 阻止冒泡

::: tip
this  和   e.target

区别 ： 

e.target 点击了那个元素，就返回那个元素 

this 那个元素绑定了这个点击事件，那么就返回谁
:::

`e.target`的兼容性

```js
// 了解兼容性
div.onclick = function(e) {
    //判断浏览器是否兼容
    e = e || window.event;
    var target = e.target || e.srcElement;
    console.log(target);
}
```

::: tip
用事件委托点击变色
:::

```js
var div = document.querySelector("div");
div.addEventListener("click", function (e) {
    for (let i = 0; i < this.children.length; i++) {
        this.children[i].style.background = "none";
    }
    e.target.style.background = "pink";
});
```

::: tip
返回事件类型 `e.type`
:::

```js
var div = document.querySelector('div');
div.addEventListener('click', fn);
div.addEventListener('mouseover', fn);
div.addEventListener('mouseout', fn);

function fn(e) {
    //返回当前触发的事件
    console.log(e.type);
}
```

::: tip
阻止默认行为（事件） `e.preventDefault();` 让链接不跳转 或者让提交按钮不提交
:::

```js
var a = document.querySelector('a');
a.addEventListener('click', function(e) {
    //这样点击a标签 就不会跳转了 是方法 需要括号
    e.preventDefault(); //  dom 标准写法
})
```

::: tip
传统的方式   阻止默认行为（事件）
:::

```js
// 3. 传统的注册方式
a.onclick = function(e) {
    // 普通浏览器 e.preventDefault();  方法
    // 低版本浏览器 ie678  returnValue  属性
    // 我们可以利用return false 也能阻止默认行为 没有兼容性问题 
    //特点： return 后面的代码不执行了， 而且只限于传统的注册方式
    return false;
    alert(11);
}
```

::: tip
阻止冒泡行为  给需要阻止的事件添加
:::

```js
e.stopPropagation();	//正常用这个
e.cancelBubble = true; //IE6-8 使用
```

![img](/javascript/javascript-note/%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7.png)

## 鼠标**事件对象** 

![img](/javascript/javascript-note/image-20210729212852427.png)

## 键盘事件

- keyup ---- 键盘按下弹起
- keydown --- 键盘按下  可以识别功能键  ctrl shift 左右箭头等                               
- keypress --- 键盘按下  不可以识别功能键  ctrl shift 左右箭头等

::: tip
三个事件的执行顺序 keydown -- keypress -- keyup
:::

```js
document.addEventListener('keydown', function() {
    console.log('我按下了down');
})

document.addEventListener('keypress', function() {
    console.log('我按下了press');
})

document.addEventListener('keyup', function() {
    console.log('我弹起了');
})
```

::: tip
keyCode属性   可以得到相应键的ASCII码值
:::

- keyup 和keydown事件不区分字母大小写 a 和 A 得到的都是65
- keypress 事件 区分字母大小写 a 97 和 A 65
