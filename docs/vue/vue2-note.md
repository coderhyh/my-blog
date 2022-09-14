---
title: vue2笔记
date: 2022-02-10
sidebar: 'auto'
tags:
 - 笔记
 - vue
categories:
 - vue
---

# Vue2

## 简单模板

```html
<div id="app">
    {{message}}
</div>

<script src="../vue.js"></script>
<script>
    const app = new Vue({
        el: '#app',
        data: {
            message: '你好啊'
        },
      	computed:{
        		//计算属性
      	},
        methods: {
            //函数
        },
      	components: {
      			//组件
    		},
    })
</script>
```

## 指令的使用

::: tip
`.native`
:::

```js
监听组件根元素的原生事件
可以给组件添加事件
<cpn @click.nati="click"></cpn>
```

::: tip
`v-once`
:::

```html
//由于vue是响应式 即：改变了数据 页面上的内容会跟着改变
//但 有时候 不想 让数据跟着改变 就可以用 v-once 指令
<h2 v-once>{{message}}</h2>
//这样改变数据 页面上的内容就不会变了
```

::: tip
`v-html`	类似	`innerHTML`
:::

```html
//当接收到的数据是 标签 形式
url: '<a href="http://www.baidu.com">百度一下</a>'
//用 Mustache(嘛思踏七)语法 只会显示 原内容
<h2>{{url}}</h2>
//而用 v-html 则会加载标签 类似 innerHTML
<h2 v-html="url"></h2>
```

::: tip
`v-text`	类似	`innerText`
:::

```html
//功能类似 innerText 不灵活
message: '你好啊'
//正常用 Mustache(嘛思踏七)语法 直接可以这样显示
<h2>{{message}}, 哈哈哈!</h2>
//但是用了 v-text 就会直接把原来的 所有内容覆盖掉  (包括标签)
<h2 v-text="message">, 哈哈哈!</h2>
```

::: tip
`v-pre`
:::

```html
//加上v-pre vue就不会解析{{}}
//内容会原本显示出来{{message}}
<h2 v-pre>{{message}}</h2>
```

::: tip
`v-cloak`(科楼科) --- 以后会自动生成函数
:::

```html
<div id="app">
  <h2>{{message}}</h2>
</div>
message: '你好啊'
//当js代码中的 vue 延时执行了 那么浏览器就会直接打印{{message}} 并不会打印变量中的数据
//所以加上 v-cloak 浏览器不会显示{{message}}了(注1) 等到 获取到数据 才会显示变量中的数据
注:但是会显示css样式
<div id="app" v-cloak>
  <h2>{{message}}</h2>
</div>

//进阶用法
// 在vue解析之前, div中有一个属性v-cloak
// 在vue解析之后, div中的v-cloak就会被干掉

//可以在 css 加上以下 就会让属性为v-cloak的none 
//等到vue解析后 v-cloak属性会被干掉 那么以下的css就会失去作用 显示出来了
[v-cloak] {
display: none;
}
```

## 过渡

```css
.box{
  width: 200px;
  height: 200px;
  background-color: red;
  margin:0 auto;
}

/* 开始的起点   0-1  */ 
.fade-enter-from{
  opacity: 0;
  transform:translateX(- 200px)
}
/* 最后的终点  1-0*/
.fade-leave-to{
  opacity: 0;
  transform:translateX(200px)
}

.fade-enter-active,.fade-leave-active{
  transition: all 2s;
}
```

```html
<!-- 指定模板区域 -->
<div id="app">
  <!-- 在元素显示隐藏 添加移出 过程中融入一段动画过渡 -->
  <transition name="fade">
    <div class="box" v-show="flag"></div>
  </transition>
  
  <p>hello</p>

</div>
```

## nextTick DOM更新之后回调

```js
this.$nextTick(() => { //DOM更新之后
  console.log(this.$refs.list.offsetHeight)
})
```

## 动态绑定 `v-bind`:

::: tip
基本使用
:::

```html
<!-- 错误的做法: 这里不可以使用mustache(嘛思踏七)语法-->
<!--<img src="{{imgURL}}" alt="">-->

<!-- 正确的做法: 使用v-bind指令 -->
<img v-bind:src="imgURL" alt="">
<a v-bind:href="aHref">百度一下</a>

<!--语法糖的写法-->
<img :src="imgURL" alt="">
<a :href="aHref">百度一下</a>
```

## 动态绑定`class` 

- 动态绑定class --- **对象**的方式绑定 (用的较多)

  - ```html
    <!--<h2 v-bind:class="active">{{message}}</h2>-->
    
    <!--<h2 v-bind:class="{key1: value1, key2: value2}">{{message}}</h2>-->
    //可以通过对象 键是类名 值是Boolean true添加类 false删除
    <h2 v-bind:class="{active: isActive, line: isLine}">{{message}}</h2>
    
    //然后 还可以在元素中 加上必须会有的类
    //vue会自动把 v-bind中的类 与class的类合并
    <h2 class="div" v-bind:class="{active: isActive, line: isLine}">{{message}}</h2>
    ```

- 动态绑定class事件  --- `return`**对象**来绑定

  - ```html
    //由于正常写到元素中太长了 就可以用函数返回的方式 在这种里面调用是需要()的
    <h2 class="title" v-bind:class="getClasses()">{{message}}</h2>
    //这样返回的就是字典
    <script>
        getClasses: function () {
            //用的是data中的变量 是需要加this的
            return {active: this.isActive, line: this.isLine}
        }
    </script>
    ```

- 动态绑定class --- **数组**的方式绑定 (用的较少)

  - ```html
    //当不加引号的话 就是变量
    <h2 class="title" :class="[active, line]">{{message}}</h2>
    //加引号就是字符串
    <h2 class="title" :class="['active', 'line']">{{message}}</h2>
    
    
    //也可以return函数使用
    <h2 class="title" :class="getClasses()">{{message}}</h2>
    <script>
        getClasses: function () {
            return [this.active, this.line]
        }
    </script>
    ```

- 动态绑定style --- **对象**的方式绑定 

  - ```html
    <!--<h2 :style="{key(属性名): value(属性值)}">{{message}}</h2>-->
    //value值是需要加 '引号' 的, 不然vue会解析为变量 从而报错
    //同时value值是可以设置为变量的 从而动态改变
    <h2 :style="{fontSize: '100px', backgroundColor: finalColor}">{{message}}</h2>
    
    //另外 如果style 对象样式太长了  是可以写函数 return对象的
    ```

- 动态绑定style --- **数组**的方式绑定 

  - ```html
    <h2 :style="[baseStyle, baseStyle1]">{{message}}</h2>
    //通过变量的方式 来解析  
    baseStyle: {backgroundColor: 'red',color: 'pink'},
    baseStyle1: {fontSize: '100px'},
    ```

## **作业**：点击当前 li 变色

```html
<body>
    <!--作业需求: 点击列表中的哪一项, 那么该项的文字变成红色-->
    <style>
        .red {color: red;}
    </style>
    <div id="app">
        <ul>
            <li v-for="(m, index) in movies" :class="{red:index === i}" @click="onLi(index)">{{m}}</li>
        </ul>
    </div>

    <script src="../js/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                movies: ['海王', '海尔兄弟', '火影忍者', '进击的巨人'],
                i: 0
            },
            methods: {
                onLi(index) {
                    this.i = index
                    console.log(index);
                }
            }
        })
    </script>
</body>
```

## 计算属性 `computed`

::: tip
一般两个变量的拼接的 方法
:::

```html
//一般两个字符串 拼接 是这样写
<h2>{{firstName + ' ' + lastName}}</h2>
<h2>{{firstName}} {{lastName}}</h2>
//或者是 方法 return拼接后的值
<h2>{{getFullName()}}</h2>

getFullName() {
	return this.firstName + ' ' + this.lastName
}
```

::: tip
计算属性 --- vue中有专门的板块`computed`中写拼接的**方法**
:::

```html
<h2>{{fullName}}</h2>
//在 'computed' 中写入方法 然后元素中直接写 方法名 调用
//后面是不加 (括号) 的 不然报错
fullName: function () {
	return this.firstName + ' ' + this.lastName
}
```

## 计算属性的本质

```html
<script>
  const app = new Vue({
    el: '#app',
    data: {
      firstName: 'Kobe',
      lastName: 'Bryant'
    },
    computed: {
      // 计算属性一般是没有set方法, 只读属性.
      fullName: {
        set: function(newValue) {
          // console.log('-----', newValue);
          const names = newValue.split(' ');
          this.firstName = names[0];
          this.lastName = names[1];
        },
        get: function () {
          return this.firstName + ' ' + this.lastName
        }
      },
    },
  })
  app.fullName = '哈哈哈 哈哈'
</script>
```

## `computed` 与 `methods`在元素中拼接对比

::: tip
`computed` 与 `methods` 同时在元素中调用了多次

`computed` 调用一次后就会存到内部缓存中  所以**只会执行一次**

而`methods`每次调用  就会执行一次 所以**会执行多次**
:::

## **事件**监听 `v-on:`

```html
<button v-on:click="btnClick()">按钮</button>
//也可以语法糖写法
<button @click="btnClick()">按钮</button>
```

::: tip
事件函数的**参数**问题
:::

```html
//一般在调用事件函数的时候 是不需要加 (括号的)
<button @click="btn1">按钮1</button>
btn(event){
//不传参数 会自动传入事件对象
	log(event)
}

//如何传入自己的参数  又有事件对象呢？

//在传参的时候 把event前 加上$ 即可
<button @click="btn3Click(abc, $event)">按钮3</button>
btn(i, event){
	log(i, event)
}
```

::: tip
**v-on**修饰符 **冒泡 默认行为**········
:::

![img](/vue/vue-note/image-20210918102846812.png)

## vue底层对元素的复用 属性 `key=""`

::: tip
比如在用v-if 与 v-else 让一坨元素显示 隐藏

vue底层在渲染的时候  会把元素放到虚拟dom中	然后才会到页面

如果那一坨元素中有相同的元素	vue出于性能考虑	会在虚拟dom中比较	 会尽可能把相同的元素复用
:::

::: tip
如果不想复用	可以给元素加上属性 `key=""` 只有key相等的才会复用
:::

```html
<input type="text" id="username" placeholder="用户账号" key="username">

<input type="text" id="email" placeholder="用户邮箱" key="email">
```

::: tip
一般在使用 `v-for` 的是时候 最好给元素加上  `:key=""` (前面加**冒号**)     
:::

```html
//这样的好处就是 会让性能更强 
//key中的值不是随意打的 是需要遍历的数组中 唯一性 的value 
//如果key中的值不是唯一性的 是会报错的
<li v-for="item in letters" :key="item">{{item}}</li>
```

## `v-if` 与 `v-show` 元素显示区别

```html
<!--v-if: 当条件为false时, 包含v-if指令的元素, 根本就不会存在dom中-->
<h2 v-if="true" id="aaa">{{message}}</h2>
<!--v-show: 当条件为false时, v-show只是给我们的元素添加一个行内样式: display: none-->
<h2 v-show="true" id="bbb">{{message}}</h2>
```

- 开发中如何选择？
  - 当需要在显示隐藏之间切换频繁 使用 `v-show` 这样性能会更好
  - 当只有一次切换 可使用 `v-if` 

## **表单**绑定 `v-model` 

::: tip
Vue中使用`v-model`指令来实现 表单元素 和数据的**双向绑定**。
:::

- v-model其实是一个语法糖，它的背后本质上是包含两个操作：
  - 1.v-bind绑定一个value属性
  - 2.v-on指令给当前元素绑定input事件

也就是说下面的代码：等同于下面的代码：

```html
<input type="text" v-model="message">
等同于
<input type="text" v-bind:value="message" v-on:input="message = $event.target.value">
```

::: tip
功能：当表单与变量使用 `v-model` 实行双向绑定 

那么当用户输入的时候	变量也会跟着变化	(绑定一个`change`事件，把输入内容赋值给`变量`)
:::

::: tip
`v-model` 结合 **radio类型**

即：`v-model` 中的变量 与 value 双向绑定 (一方修改，另一方同时修改)
:::

```html
//sex = ''            
<input type="radio" id="male" value="男" v-model="sex">男
<input type="radio" id="female" value="女" v-model="sex">女
//当radio中使用了v-model="sex" 那么就与变量sex绑定 
//当点击了 男 就会把 value中的 男 赋值给sex;
//或者设置初始值为 男
//直接 sex = '男'
```

::: tip
`v-model` 结合 **checkbox类型** 
:::

```html
<!--1.checkbox单选框-->
<label for="agree">
  //双向绑定来判断 checked 是否选中						//变量为 boolean型
  <input type="checkbox" id="agree" v-model="isAgree">同意协议
</label>
<h2>您选择的是: {{isAgree}}</h2>
//同意了不禁用
<button :disabled="!isAgree">下一步</button>

<!--2.checkbox多选框-->								//变量为 数组
<input type="checkbox" value="篮球" v-model="hobbies">篮球
<input type="checkbox" value="足球" v-model="hobbies">足球
<input type="checkbox" value="乒乓球" v-model="hobbies">乒乓球
<input type="checkbox" value="羽毛球" v-model="hobbies">羽毛球
//接收的同样是数组
<h2>您的爱好是: {{hobbies}}</h2>
```

::: tip
`v-model` 结合 **select类型** 
:::

```html
<!--1.选择一个   变量为 字符串 接收单个的选择-->
//fruit: '香蕉' 默认选择香蕉
<select name="abc" v-model="fruit">
  <option value="苹果">苹果</option>
  <option value="香蕉">香蕉</option>
  <option value="榴莲">榴莲</option>
  <option value="葡萄">葡萄</option>
</select>
<h2>您选择的水果是: {{fruit}}</h2>

<!--2.选择多个   变量为 数组 接收多个的选择-->
<select name="abc" v-model="fruits" multiple>
  										//默认选择苹果
  <option value="苹果" selected>苹果</option>
  <option value="香蕉">香蕉</option>
  <option value="榴莲">榴莲</option>
  <option value="葡萄">葡萄</option>
</select>
<h2>您选择的水果是: {{fruits}}</h2>
```

## `v-model` 修饰符

-  `lazy` 修饰符：
   - 默认情况下，v-model默认是在input事件中**同步输入框**的数据的。
   - 也就是说，一旦有数据**发生改变**对应的data中的数据就会**自动发生**改变。
   - lazy修饰符可以让数据**在失去焦点**或者**回车**时**才会更新**：

-  `number` 修饰符：
   - 默认情况下，在输入框中无论我们输入的是**字母**还是**数字**，都会被当做**字符串类型进行处理**。
   - 但是如果我们**希望处理的是数字类型**，那么最好直接将内容当做数字处理。
   - number修饰符可以让在输入框中输入的**内容自动转成数字类型**：

-  `trim` 修饰符：
   - 如果输入的内容**首尾有很多空格**，通常我们希望将其去除
   - trim修饰符可以**过滤内容左右两边的空格**  

## **组件化** 

### 创建组件(**全局**组件)

- Vue.extend()：
  - 调用Vue.extend()创建的是一个组件构造器。 
  - 通常在创建组件构造器时，传入`template`代表我们**自定义组件的模板**。
  - 该模板就是在**使用到组件的地方**，要显示的**HTML代码**。
  - 事实上，这种写法在Vue2.x的文档中几乎**已经看不到了**，它会直接使用下面我们会讲到的**语法糖**，但是在很多资料还是会提到这种方式，而且这种方式是学习后面方式的基础。

- Vue.component()：
  - 调用Vue.component()是将刚才的**组件构造器**注册为一个**组件**，并且给它起一个**组件的标签名称**。
  - 所以需要传递两个参数：1、**注册组件的标签名** 2、**组件构造器**

- 组件必须挂载在某个Vue实例下，否则它不会生效



::: tip
 1.创建组件构造器对象
:::

```js
const cpnC = Vue.extend({
  template: `
    <div>
      <h2>我是标题</h2>
      <p>我是内容, 哈哈哈哈</p>
      <p>我是内容, 呵呵呵呵</p>
    </div>`
})
```

::: tip
2.注册组件 (全局)
:::

```js
Vue.component('my-cpn', cpnC)
```

::: tip
3.使用组件
:::

```html
<my-cpn></my-cpn>
```

### **局部**组件的创建

::: tip
 1.创建组件构造器对象
:::

```js
const cpnC = Vue.extend({
  template: `
    <div>
      <h2>我是标题</h2>
      <p>我是内容, 哈哈哈哈</p>
      <p>我是内容, 呵呵呵呵</p>
    </div>`
})
```

::: tip
2.注册组件 (实例中注册	局部)
:::

```js
const app = new Vue({
  el: '#app',
  data: {
    message: '你好啊'
  },
  components: {
    // cpn使用组件时的标签名
    cpn: cpnC
  }
})
```

::: tip
**注**：局部组件只能在**当前实例**的 `id=“app”` 中使用  其他地方使用不了
:::

### 父子组件

::: tip
1.创建第一个组件构造器(子组件)
:::

```js
const cpnC1 = Vue.extend({
  template: `
    <div>
    <h2>我是标题1</h2>
    <p>我是内容, 哈哈哈哈</p>
    </div>
	`
})
```

::: tip
2.创建第二个组件构造器(父组件) **如果子组件是全局的话 (那么可以直接找到) 也可以不用在内部创建子组件了** 
:::

```js
const cpnC2 = Vue.extend({
  template: `
    <div>
    <h2>我是标题2</h2>
    <p>我是内容, 呵呵呵呵</p>
    <cpn1></cpn1> // 在组件2(父组件)中使用组件1(子组件)
    </div>
	`,
  //在创建组件2(父组件) 的时候 
  //在组件2(父组件)中创建组件1(子组件)
  //这样就可以 父组件 中 套子组件
  components: {
    //创一个组件cpn1: cpnC1
    //也可以不写 前提是cpnC1(组件1)是全局组件              （重点）
    cpn1: cpnC1
  }
})
```

::: tip 
这样就可以在html中使用 父组件 (然后子组件在父组件中  就一起被使用了)
:::

```html
<div id="app">
  <cpn2></cpn2>
  //因为子组件 是在父组件中创建的 无法使用  如果要使用(注1)
  <!--<cpn1></cpn1>-->
</div>

<script>
	// root组件
const app = new Vue({
  el: '#app',
  data: {
  	message: '你好啊'
  },
  components: {
  	cpn2: cpnC2,
		//注1 ：在这里创建cpn1(子组件) 即可使用 
		cpn1: cpnC1,
  }
})
</script>
```

### 注册组件的**语法糖**

::: tip
**全局**组件的语法糖
:::

```js
Vue.component('cpn1', 在这里可以直接放对象 里面是组件)
Vue.component('cpn1', {
  template: `
    <div>
    <h2>我是标题1</h2>
    <p>我是内容, 哈哈哈哈</p>
    </div>
	`
})
```

::: tip
**局部**组件的语法糖
:::

```js
const app = new Vue({
  el: '#app',
  data: {
    message: '你好啊'
  },
  //组件
  components: {
    //cpn2:{可以直接在里面填入 组件}
    cpn2: {
      template: `
        <div>
        <h2>我是标题2</h2>
        <p>我是内容, 呵呵呵</p>
        </div>
      `
    }
  }
})
```

### 组件模板的**分离**写法

::: tip
1. `script` 标签  注意:类型必须是 text/x-template
:::

```html
<script type="text/x-template" id="cpn">
<div>
  <h2>我是标题</h2>
  <p>我是内容,哈哈哈</p>
</div>
</script>

// 1.注册一个全局组件
Vue.component('cpn', {
	//获取到id 就可以
	template: '#cpn'
})
```

::: tip
2. `template` 标签
:::

```html
<template id="cpn">
  <div>
    <h2>我是标题</h2>
    <p>我是内容,呵呵呵</p>
  </div>
</template>

// 1.注册一个全局组件
Vue.component('cpn', {
	//获取到id 就可以
	template: '#cpn'
})
```

### 组件中的**数据**如何**存放**

::: tip
Vue组件有自己保存数据的地方

Vue组件中的**变量数据** 是**不可以**放到**Vue实例**中的
:::

```html
<template id="cpn">
  <div>
    <h2>{{title}}</h2>
    <p>我是内容,呵呵呵</p>
  </div>
</template>

<script>
	// 1.注册一个全局组件
  Vue.component('cpn', {
    template: '#cpn',
    //这是一个方法 返回出一个对象 其中就是组件存放数据的地方
    注：1
    data() {
      return {
        title: 'abc'
      }
    }
  })
</script>
```

::: tip
注: 为什么**存放数据**的**data**是一个函数呢？

因为组件是要**重复使用**的	如果data**是一个对象**的话	那么就是**所有的变量**使用的**数据**都是**同一个data**对象的

（使用的**对象地址**都是**同一个**，但是我们开发的时候**不想这样子**）
:::

::: tip
所以Vue在开发的时候	组件中的**data** 就是一个**函数**	其中每次**return**的**对象**就是一个**新的地址(对象)**	这样就完美的解决了**重复使用组件时**，其中的**数据**都用了**同一个对象**的**问题**
:::

::: tip
如果要**使用的**就是**想同一个对象**的话	就可以：**↓** 
:::

```js
const obj = {
  counter: 0
}
//就可以在注册组件的时候	先创建一个对象
//return 的时候 就会返回这个对象
//这样的话 重复使用组件的时候	使用的数据对象就是同一个
Vue.component('cpn', {
  template: '#cpn',
  data() {
    return obj
  }
})
```

### **父组件**与**子组件**的**数据传递**

#### **父组件**向**子组件**传递数据使用	`props` 

```html
<div id="app">
  //使用 v-bind:子组件的变量="父组件的变量" 的方法
  //就可以向 子组件 成功传递数据
  <cpn v-bind:newmessage="message"></cpn>
</div>

<template id="cpn">
  <div>
    //这里可以直接使用传递后的变量
    <h2>{{newmessage}}</h2>
  </div>
</template>

<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊',
    },
    components: {
      cpn:{
        tamplate: "#cpn",
        //使用props 数组的方式传递
        //定义"newmessage" 然后通过上方v-bind:传递父组件的变量
        //props: ["newmessage"]

        //对象的方法
        props: {
          // 1.类型限制
          // cmovies: Array,
          // cmessage: String,

          // 2.提供一些默认值, 以及必传值
          newmessage: {
            type: String,
            default: 'aaaaaaaa',
            //必须要传的值 不然报错
            required: true
          },
          // 类型是对象或者数组时, 默认值必须是一个函数
          cmovies: {
            type: Array,
            //属性为数组或者对象的时候 默认值使用函数return [] 
            default() {
              return []
            }
          }
        },
      }
    }
  })
</script>
```

::: tip
支持的数据类型
:::

```js
- String - Number - Boolean - Array - Object - Date - Function - Symbol
```

![img](/vue/vue-note/image-20210924223516094.png)

::: tip
当我们有自定义构造函数时，验证也支持自定义的类型
:::

![img](/vue/vue-note/image-20210924223640232.png)

#### **子组件**向**父组件**传递使用`$emit()` 

::: tip
通过给子组件**绑定事件** 把item**传参**给click**事件函数**
:::

```html
<!--子组件模板--> 
<template id="cpn">
  <div>
    <button v-for="item in categories"
            //把数据传值给btnClick函数
            @click="btnClick(item)">
      {{item.name}}
    </button>
  </div>
</template>

methods: {
	//绑定事件接收数据
  btnClick(item) {
    // 发射事件: 自定义事件
		//把事件与数据 发送给父组件
    this.$emit('item-click', item)
  }
}
```

::: tip
父组件接收
:::

```html
<!--父组件模板-->
<div id="app">
  								//这边不用传值;	正常的事件不传值的话 默认传值是 事件对象
  								//而子组件向父组件发送事件函数	默认传值是 子组件向父组件 发送的数据
  <my-cpn @item-click="cpnClick"></my-cpn>
</div>

methods: {
	//到这里就可以接收使用了
  cpnClick(item) {
  	console.log('cpnClick', item);
  }
}
```

### 组件访问

#### 父访问子 - `$children` - `refs` 

::: tip
`$children` 

**用的少** 	如果在程序中**插入**了一个组件	那么**索引**就乱了
:::

```js
// 1.$children
//在父组件的函数中 可以直接 this.$children 访问子组件的 函数和变量
btnClick() {
  console.log(this.$children);
  for (let c of this.$children) {
    console.log(c.name);
    c.showMessage();
  }
  //可以通过下标	精确的访问
  console.log(this.$children[3].name);
}
```

::: tip
`refs` 

用的**多** 	通过给标签属性	然后直接	**.** 出名字即可精确访问
:::

```html
<div id="app">
  //给组件加一个 ref 属性	赋值一个名字 就可以精确访问了	不需要索引
  <cpn ref="aaa"></cpn>
  <button @click="btnClick">按钮</button>
</div> 

<script>
  btnClick() {
    //直接通过this.$refs.(给标签赋的值) 访问
  	console.log(this.$refs.aaa.name);
  }
</script>
```

#### 子访问父 - `$parent` - `$root` 

::: tip
`$parent` 访问父组件	`$root` 访问根组件
:::

```js
btnClick() {
  // 1.访问父组件$parent
  console.log(this.$parent);
  console.log(this.$parent.name);

  // 2.访问根组件$root
  console.log(this.$root);
  console.log(this.$root.message);
}
```

## 插槽

### 插槽的基本使用

::: tip
`<slot></slot>`
:::

```html
<!--
  1.插槽的基本使用 <slot></slot>
  2.插槽的默认值 <slot>button</slot>	如果插有值则会被替换
  3.如果有多个值, 同时放入到组件进行替换时, 则会一起作为替换元素
-->
<div id="app">
  <cpn></cpn>
  <cpn><i>呵呵呵</i></cpn>
  //输入了多个 则全部会被一起替换
  <cpn>
    <i>呵呵呵</i>
    <div>我是div元素</div>
    <p>我是p元素</p>
  </cpn>
</div>

<template id="cpn">
  <div>
    <h2>我是组件</h2>
    //插槽
    <slot><button>按钮</button></slot>
  </div>
</template>
```

### 具名插槽

::: tip
在具有**多个插槽**的时候	直接替换往往会把**全部的插槽都替换**了 那么该怎么**精确的替换**某个插槽呢？
:::

```html
<template id="cpn">
  <div>
    //可以在定义插槽的时候 取一个name属性
    <slot name="left"><span>左边</span></slot>
    <slot name="center"><span>中间</span></slot>
    <slot name="right"><span>右边</span></slot>
  </div>
</template>

<div id="app">
  //在使用的时候 取一个slot属性 来精确要替换的是哪一个插槽
  //如果没有写slot属性时	则只会替换 同样没有name的 插槽
  <cpn><span slot="center">标题</span></cpn>
  <cpn><button slot="left">返回</button></cpn>
</div>
```

### 父组件**替换子组件插槽**与**使用数据**

::: tip
一般在**子组件插槽**中**默认使用**一个**变量**	但是在**父**组件**使用子组件**的时候	**想改掉**子组件**插槽变量**的**显示方式**	这时候就要在**父**组件中**使用**子组件中的**变量**了	那么怎么在**父组件替换子组件插槽**时 ，**使用**子组件的**数据**呢？
:::

```html
<template id="cpn">
  <div>
    //在使用插槽的时候 给一个自定义属性赋值 子组件的变量
    <slot :data="pLanguages">
      <ul>
        <li v-for="item in pLanguages">{{item}}</li>
      </ul>
    </slot>
    
    <slot :newdata="myData">
      <ul>
        <li v-for="item in pLanguages">{{item}}</li>
      </ul>
    </slot>
  </div>
</template>

<div id="app">
  //不使用插槽 则显示插槽的默认内容
  <cpn></cpn>
  <cpn>
    <!--目的是获取子组件中的pLanguages-->
    //这个template标签是自定义的	使用div也成
    //添加一个属性 slot-scope="slot"
    <template slot-scope="slot">
      //在使用的时候 slot就是一个字典 (因为上面在定义子组件插槽的时候 给了自定义属性 为data)
      //那么使用的时候 就可以slot.data 来使用子组件的 数据了
      <span>{{slot.data.join(' - ')}}</span>
      //上方还有一个newdata 使用的时候slot.newdata即可
    </template>
  </cpn>
</div>
```

## 模块化

### `CommonJS` 的导入与导出

```js
//用来导出代码定义的 数据
module.exports = {
  flag: flag,
  sum: sum
  //字面增强量写法
  //flag,
  //sum
}

//用来接收另一个页面导出的数据
var {flag, sum} = require('./aaa.js')
//等同于这样接收
var aaa = require('./aaa.js')
var flag = aaa.flag;
var sum = aaa.sum;
```

### `ES6` 的导入与导出

```html
//模块化	引入时 type为module
<script src="aaa.js" type="module"></script>
<script src="bbb.js" type="module"></script>

<script>
  // 1.导出方式一:
  export {
  flag, sum//sum 是一个函数 
  }

  // 2.导出方式二:定义变量的时候就可以直接导出
  export var num1 = 1000;
  export var height = 1.88

  // 3.导出函数/类
  export function mul(num1, num2) {
    return num1 * num2
  }
  export class Person {
    run() {
      console.log('在奔跑');
    }
  }

  // 4.export default 匿名导出
  //导出的时候 是不定义名字的
  //名字由需要导入的文件自己命名
  export default address

  export default function (argument) {
    console.log(argument);
  }
  //是不需要加{}的 且default匿名导入只能有一个
  import addr from "./aaa.js";
</script>

<script>
  //另一个文件接收 就可以直接用了
  import {sum} from './aaa.js'

  // 统一全部导入
  import * as aaa from './aaa.js'

  console.log(aaa.flag);
  console.log(aaa.height);
</script>
```
