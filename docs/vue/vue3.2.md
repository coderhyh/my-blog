---
title: vue3.2 setup语法糖
date: 2022-05-28
sidebar: 'auto'
tags:
 - 笔记
 - vue
categories:
 - vue
---

::: tip
![img](/images/20.jpeg)
:::
<!-- more -->

# Vue3.2 新特性之 —— `<script setup>`和 `<style> v-bind`

## 1 基本语法

要使用这个语法，需要将 `setup` attribute 添加到 `<script>` 代码块上：

```vue
<script setup lang="ts">
import { ref } from "vue";

const a = ref(1);
console.log('hello script setup')
</script>
```

<font color='red'>里面的代码会被编译成组件 `setup()` 函数的内容</font>。

这也就意味着与普通的 `<script>` 只在组件被首次引入的时候仅执行一次不同，`<script setup>` 中的代码会在<font color='red'>**每次组件实例被创建的时候执行**</font>。这一点非常的重要，也就是写在 `<script setup>` 中的代码，例如初始化的赋值等在组件每次实例创建时都重新执行一次。

## 2 顶层绑定将自动暴露给模板

### 2.2 基本使用

标题似乎有些不太好理解，通俗的讲就是 —— 当使用 `<script setup>` 的时候，任何在 `<script setup>` 声明的**顶层的绑定 (包括声明的变量，函数声明，以及 import 引入的内容)** 都能在模板中<font color='red'>直接使用</font>，不再需要使用 `return` 导出。

所有在 `<template>` 中使用的变量，函数，都需要在 `<script>` 中显示 `return` 导出，不仅写起来麻烦，还有种多次一举的感受，单单这一点就可以节省大量的代码：

```vue
<script setup lang='ts'>
import { ref } from "vue";

const inputValue = ref('输入测试');
</script>

<template>
  <input type="text" :value="inputValue"/>
</template>
```

#### 2.2.2 原理探究

以下为上述 SFC 编译后的 JS 代码。

可以看到，<font color='red'>编译后 `<script setup>` 语法糖变成了 `<script>` 并导出了模板 VNode 结构的函数，并且将模板中用到的值进行了引用和自动解包</font>。这就是为什么不再需要显示 `return` 的原因了。也可在 [`Vue SFC Playground`](https://sfc.vuejs.org/) 中测试。

```js
import { defineComponent as _defineComponent } from 'vue'
import { createElementVNode as _createElementVNode, unref as _unref, toDisplayString as _toDisplayString, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"
// 这些都是内部的方法，可不用在意
const _hoisted_1 = ["value"]

import { ref } from "vue";
import { capitalize } from "./capitalize";

const __sfc__ = /*#__PURE__*/_defineComponent({
  setup(__props) {  // 编译成了普通的 script
    const inputValue = ref('输入测试');
    // 可以看到，编译后 `<script setup>` 语法糖变成了<script> 并导出了模板 VNode 结构的函数，并且将模板中用到的值进行了自动解包
    return (_ctx,_cache) => {
      return (_openBlock(), _createElementBlock(_Fragment, null, [
        _createElementVNode("input", {
          type: "text",
          value: inputValue.value   // 自动解包 ref
        }, null, 8 /* PROPS */, _hoisted_1),    // 这里是对动态属性的标记，对 diff 算法的优化
        _createElementVNode("p", null, _toDisplayString(_unref(capitalize)('Hello World!!')), 1 /* TEXT */)
      ], 64 /* STABLE_FRAGMENT */))
      // 编译后的 setup 导出的模板中自动的就引用了 `capitalize` 函数
    }
  }
})
__sfc__.__file = "App.vue"
export default __sfc__
```

> 可以看到编译后的结果中包含了大量的 vue 内置方法和导出 `sfc`，这属于框架内部的执行，所以所有的 SFC 编译时都会有这些代码。
>
> ```js
> import { defineComponent as _defineComponent } from 'vue'		// defineComponent 函数
> import { createElementVNode as _createElementVNode, unref as _unref, toDisplayString as _toDisplayString, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"		// 内置函数
> 
> __sfc__.__file = "App.vue"
> export default __sfc__
> ```

## 3 组件的使用

### 3.1 自动的组件名推断

在 vue2.x options API 和使用普通的 `<script>` 的情况下，都可以为组件进行命名，以便在下面三种情况对组件进行定位或使用：

- 开发环境警告格式化
- DevTools 检查
- **递归的自引用**。

但是在 `<script setup>` 下，却并没有提供直接的方式来设置的组件的名称，因此，<font color='red'>vue 在上述情况下会依据它的**文件名**来自动推断组件名称</font>。

例如：名为 `Foo.vue` 的文件可以在模板中用 `<Foo/>` 引用它自己，在 devtools 中看到的组件名称也是 `Foo`。

```html
<div align='center'>
  <img src="./img/setup/Foo.vue.png" alt="image-20210918093055222" style="zoom:30%;" width='30%'/>
</div> 
```

**注意**，这种推断的方式比显示注册或 `import` 的组件的优先级要低，所以，当遇到注册或引入的组件和推断名称冲突你，可以对注册或引入的组件重命名以避免冲突。

那是否有办法在同时使用 `<script setup>` 的情况下可以显示的注册组件名呢？

<font color='red'>答案：</font>在 SFC 中，虽然 `<script setup>` 中无法显示定义组件名称，但是 `<script>` 是支持的，同时在一个 SFC 是支持 `<script setup>` 与 `<script>` 同时存在的，因此，可以像下述代码一样显示定义组件名称

```vue
<script lang="ts">
export default { name: 'CustomComponentsName' }
</script>

<script setup lang="ts">
// code
</script>

<template>
	<p>利用 script 自定义组件名称</p>
</template>
```

 上述代码在编译后的 js 代码如下，细细的品真的会发现很多有趣的东西，会发现 <font color='red'>普通的 `<script>` 的内容会和 `<script setup>` 的内容进行 merge，也就自然实现了自定义组件名称</font>。

```js
const __default__ = { name: 'CustomComponentsName' }		// 普通 script 的内容

function setup(__props) {		// <script setup> 的内容
  // code
  return (_ctx,_cache) => {
    return (_openBlock(), _createElementBlock("p", null, "利用 script 自定义组件名称"))
  }
}

const __sfc__ = /*#__PURE__*/_defineComponent({
  // 在这里可以看到普通的 script 的内容会和 <script setup> 的内容进行 merge，也就自然实现了自定义组件名称，细细的品真的会发现很多有趣的东西
  ...__default__,
  setup
})
```

### 3.2 普通组件的使用

`<script setup>` 中引入组件后<font color='red'>可直接在模板使用，不再需要注册了</font>。 

```vue
<script setup lang='ts'>
import SaySomething from "./Components/SaySomething.vue";
</script>

<template>
  <SaySomething />
</template>
```

跟变量和 `import`  引入的函数一样， `<script setup>` 将 `MyComponent` 看做一个变量来引用。如果你使用过 JSX，那这里的心智模型是一样的。

其 kebab-case 格式的 `<say-something>` 同样能在模板中使用。不过，强烈建议使用 PascalCase 格式作为组件标签名，以便于更好的一致性，同时也有助于区分原生的自定义元素。

上述代码编译后的 JS 代码如下，同样可以看到 `SaySomething` 被当做了变量引入

```js
import SaySomething from "./Components/SaySomething.vue";

const __sfc__ = /*#__PURE__*/_defineComponent({
	setup(__props) {
 		return (_ctx,_cache) => {
   		return (_openBlock(), _createBlock(SaySomething))
 		}		// SaySomething 当成变量引用且直接在 setup 函数导出
	}
})
```

### 3.3 动态组件

动态组件仍然是使用 `is`，相对于 vue2.x 没有变化

```vue
<script setup lang='ts'>
import { ref } from "vue";
import Bar from "./Components/Bar.vue";
import Foo from "./Components/Foo.vue";

const condition = ref(false);
setTimeout(() => condition.value = true, 2000);
</script>

<template>
  <component :is="condition ? Bar : Foo"/>
</template>
```

### 3.4 递归组件

因为自动组件名推断的缘故，一个单文件组件可以通过它的文件名被其自己所引用。例如：名为 `Foo.vue` 的组件可以在其模板中用 `<Foo/>` 引用它自己。

请注意这种方式相比于 import 导入的组件和自主注册的组件优先级更低。所有如果有命名的 import 导入和组件的推断名冲突了，可以使用 import 别名导入：

```js
import { Foo as FooChild } from './components'
```

### 3.5 命名空间组件

可以使用带点的组件标记，例如 `<Foo.Bar>` 来引用嵌套在对象属性中的组件。这在需要从单个文件中导入多个组件的时候非常有用：

`Components/index.ts` 用于导出组件

```ts
import Foo from './Foo.vue';
import Bar from './Bar.vue';

export { Foo, Bar };
```

`index.vue` 基于命名空间使用组件

```vue
<script setup lang='ts'>
import * as Form from "../Components";
</script>

<template>
  <Form.Foo />
  <Form.Bar />
</template>
```

## 4 props 的使用——defineProps

### 4.1 运行时声明和类型声明

在描述如何在 `<script setup>` 使用 props 前，让我们先了解两个概念，运行时声明和类型声明。

1. 运行时声明（runtime declaration）

   顾名思义，运行时的声明，也就是需要在运行中会生效的一种声明。

   比如在这里，对于 `props` 的运行时声明，<font color='red'>会在运行后给出提示</font>，例如： 这是 options API 的 `props` 写法，也就是运行时声明。

   ```js
   props: {
   	height: Number,
   	title: String,
   }
   ```

   运行后会检查对应传递的 `props` 类型，因此这种叫运行时声明。

2. 类型声明（type declaration）

   在这里类型声明指基于 ts 的类型检查，ts 的类型检查仅限于编译时的类型检查，编译成 js 后，就不再受类型的约束了，要使用类型声明，需要基于 ts，即 `<script setup lang="ts">`

### 4.2 Compiler Macros (编译时宏命令)

vue 官网中提到了这样的一个概念 —— Compiler Macros（翻译过来是编译器宏命令、或者编译时宏命令）

维基百科对[宏](https://zh.wikipedia.org/wiki/%E5%B7%A8%E9%9B%86)的定义如下：宏是一种批量处理的称谓。计算机科学里的宏是一种抽象，它根据一系列预定义的规则替换一定的文本模式。[解释器](https://zh.wikipedia.org/wiki/解释器)或[编译器](https://zh.wikipedia.org/wiki/编译器)在遇到宏时会自动进行这一模式替换。绝大多数情况下，“宏”这个词的使用时暗示着将小命令或动作转化为一系列指令。

如前所述，`<script setup>` 其实是普通的 `<script>` 的语法糖，在运行前会经过一个编译的过程，这个语法糖还提供了一系列的宏命令供开发者使用，在编译的阶段会进行替换。

### 4.3 props 的基本用法

为了在 `<script setup>` 中 声明 `props` ，必须使用 `defineProps` API，这是一个宏命令，不需要导入，直接可在  `<script setup>`  使用且只能在 `<script setup>` 中使用，有两种方式可以使用这个宏命令类声明 `props`，运行时声明和类型声明式，不同的方式下使用这个宏命令后 `props` 将具备不同的类型推断。

1. 使用运行时声明（runtime declaration）

   `defineProps` 运行时声明的基本用法如下，支持运行时的校验，当然，在 volar 插件下还是完美的的支持了 IDE 的校验和提示。

     ```ts
   <script setup lang='ts'>
   const props = defineProps({
     foo: String,
     bar: {
       type: Number,
       required: true
     }
   })
   </script>
     ```

   接到的 props 直接可在模板中直接使用，这与 vue2.x 是一致的。编译后的结果如下：

   ```js
   const __sfc__ = /*#__PURE__*/_defineComponent({
     props: {
       foo: String,
       bar: { type: Number, required: true }
     },
     setup(__props) {
       const props = __props
       return () => {}
     }
   }
   ```

2. 类型声明（type declaration）

   `defineProps` 类型声明的基本用法如下，在 volar 插件下还是完美的的支持了 IDE 的校验和提示。
   
   ```ts
   <script setup lang='ts'>
   const props = defineProps<{
     foo?: string
     bar: number
   }>()
   </script>
   ```
   
   编译后的结果如下：
   
   ```js
   const __sfc__ = /*#__PURE__*/_defineComponent({
     props: {
       foo: { type: String, required: false },
       bar: { type: Number, required: true }
     },
     setup(__props) {
       const props = __props 
       return () => {}
     }
   })
   ```
   
   从编译后的结果可以看到，两种方式最终都编译成了普通的 `<script>` 下的 `props` 模式，都编译成了运行时声明，并且结果几乎完全一致。不同的在于运行时声明 props 是基于 vue 提供的类型检查，仅支持 `String, Number, Array, Object` ，而 类型声明是基于 ts 的，可以支持所有类型的类型申明 `string, number, interface`，在 props 这里，除了写法外，这就是它们两者最大的不同。

### 4.4 需要注意的点

1. 不能同时使用运行时声明和类型声明

   `defineProps` 只能是要么使用运行时声明，要么使用类型声明。同时使用两种声明方式会导致编译报错

2. 使用类型声明的时候，静态分析(也就是约束的类型) 会自动生成等效的运行时声明（2.4.3-2 编译后的结果可以看到），**以确保正确的运行时行为**

   ```ts
   <script setup lang="ts">
   // import { List } from "./type";
   interface List {
     id: number,
     content: string,
     isDone: boolean,
   };
   
   const props = defineProps<{
     title: string,
     list: List[],		// ts 接口
   }>();
   </script>
   ```

   - 在开发环境下， IDE 会试着从类型声明来推断对应的运行时声明（这从 4.3 编译后的结果就可以看出）。
     - 例如这里从 `foo: string` 类型中推断出 `foo: String`。但如果类型声明使用的是对导入类型的引用(例如自定义的 `interface`)，这里的推断结果会是 `foo: null` (与 `any` 类型相等)，因为 IDE 没有外部文件的信息。因此，使用导入类型的引用的类型声明运行时是没有校验的，推断成 `null` 了
     - 在生产模式下，IDE 会生成数组格式的声明来减少打包体积 (这里的 props 会被编译成 `['foo', 'bar']`)。
     - 生成的代码仍然是有着类型的 ts 代码，它会在后续的流程中被其它工具处理。

### 4.5 运行时声明和类型声明的比较

| 类型       | 优势                                                         | 劣势                                               |
| ---------- | ------------------------------------------------------------ | -------------------------------------------------- |
| 运行时声明 | 不使用 ts 的情况下能够对 props 进行一定的、运行时的类型校验  | 1. 运行时校验<br />2. 只能进行基本类型的校验<br /> |
| 类型声明   | 完美的支持类型的校验，包括props 的完美类型约束、父组件在传 props 时的提示以及子组件在使用 props 的提示 | -                                                  |

因此，<font color='red'>强烈推荐使用类型声明的 `defineProps`</font>。

## 5 props 的默认值 —— withDefaults

`defineProps` 使用类型声明时的不足之处在于，它没有可以给 props 提供默认值的方式。为了解决这个问题，提供了 `withDefaults` 宏命令。

### 5.1 基本用法

```ts
<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string,
  list?: List.Basic[],
}>(), {
  title: 'Hello withDefaults',
  list: () => [{ id: 3, content: '3', isDone: false }],
});
</script>
```

上面代码会被编译为等价的运行时 props 的 `default` 选项，如下所示。此外，`withDefaults` 辅助函数提供了对默认值的类型检查，并确保返回的 `props` 的类型删除了已声明默认值的属性的可选标志。

```js
const __sfc__ = /*#__PURE__*/_defineComponent({
  props: {
    title: { type: String, required: false, default: 'Hello withDefaults' },
    list: { type: Array, required: false, default: () => [{ id: 3, content: '3', isDone: false }] }
  },
  setup(__props) {
    const props = __props
    return () => {}
  }
})
```

### 5.2 注意点

`widthDefaults` 是为了给 `defineProps` 使用类型声明时提供添加默认值的的方法，因此，需要注意这仅仅适用于 `<script setup lang='ts'>` 且 `defineProps` 使用类型声明。

## 6 自定义事件 —— defineEmits

在 `<script setup>` 中 声明 `emit` ，必须使用 `defineEmits` API，这也是一个宏命令。同样可采用普通写法和类型声明式，在类型声明下 `emit` 将具备完美的类型推断。

1. 普通写法

   ```js
   <script setup lang="ts">
   // 这样是没有任何的类型检查的
   const emit = defineEmits(['handleClick', 'handleChange']);
   
   const handleClick = () => emit('handleClick', Date.now()+'');
   const handleChange = () => emit('handleChange', Date.now());
   </script>
   ```

2. 类型声明式

   ```ts
   <script setup lang="ts">
   interface Click {
     id: string,
     val: number,
   }
   // 完美的类型检查
   // List.Basic 是基于 ts 自动扫描 types 文件夹以及 delcare namespace 自动导入的
   const emit = defineEmits<{
     (e: 'handleClickWithTypeDeclaration', data: Click): void,
     (e: 'handleChangeWithTypeDeclaration', data: List.Basic): void,
   }>();
   
   const handleClickWithTypeDeclaration = () => emit('handleClickWithTypeDeclaration', { id: '1', val: Date.now() });
   const handleChangeWithTypeDeclaration = () => emit('handleChangeWithTypeDeclaration', {
     id: 1,
     content: 'change',
     isDone: false,
   });
   </script>
   ```

跟 `defineProps` 一样，普通写法和类型声明式同样不可同时使用，且类型声明只能用于在 ts 环境下。

## 7 显示的暴露 —— defineExpose

### 7.1 基本使用

官方文档指出默认情况下使用 `<script setup>` 的组件是**默认关闭**的，也就是说通过模板 ref 或者 `$parent` 链获取到的组件的实例，并不会暴露任何在 `<script setup>` 中声明的绑定（变量，函数）。

为了在 `<script setup>` 组件中明确要暴露出去的属性，那么就需要使用 `defineExpose` 这个宏命令。

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

当父组件通过模板 ref 的方式获取到当前组件的实例，获取到的实例会像这样 `{ a: number, b: number }` (ref 会和在普通实例中一样被自动解包)

### 7.2 遇到的有趣的地方

原来是因为我不仅仅使用了 `<script setup>`，同时为了给组件命名，**还添加了一个普通的 `<script>` 标签**，我们都知道,当仅仅使用 `<script>` 时，是需要在 `<setup>` 函数中显示得使用 `return` 才能暴露的，但是这里为何添加了一个 普通的 `<script>` 标签后就全量的暴露了，我也检查了编译后的代码，暂未找出具体的原因，恐怕需要查看源码才能真正的看透其中奥秘了。

1. 首先，使用 ref 等方式去获取组件实例的方法或者组件属性本身就不是推荐的（vue react 官方都有提及，ref 的方式并不推荐），所以 `defineExpose` 使用的频率不高
2. 即便是要向外暴露方法或者属性，那么也并不需要暴露太多，所以 `defineExpose` 完全能满足业务需求

不过，这个实验给我们提供了一个办法，那就是当需要向外暴露很多数据或者方法时（当然，这种情况很少见，就当是钻vue 中一个有趣的空子玩玩好了），使用 `defineExpose` 这种标准的暴露方式当然是可行的，但是过多了我们又不想写，那么可以采取这种”巧妙的办法“来全量暴露，但至于这种暴露方式是否有什么缺陷，还有待验证。

## 8 `useSlots` 和 `useAttrs`

在 `<script setup>` 使用 `slots` 和 `attrs` 的情况应该是很罕见的，因为可以在模板中直接可通过 `$slots` 和 `$attrs` 来访问它们。

在那些罕见的需要使用它们的场景中，可以分别用 `useSlots` 和 `useAttrs` 两个函数来获取到对应的信息：

```vue
<script setup lang="ts">
import { useSlots, useAttrs } from "vue";

const slot = useSlots();
console.log('TestUseSlots', slot.header && slot.header());		// 获取到使用插槽的具体信息
  
const attrs = useAttrs();
console.log('TestUseAttrs', attrs);		// 获取到使用组件时传递的 attributes
</script>

<template>
  <h1> Here is slots test!!</h1>
  <slot name="header"></slot>
</template>
```

`useSlots` 和 `useAttrs` 是真实的运行时函数，它会返回与 `setupContext.slots` 和 `setupContext.attrs` 等价的值，同样也能在普通的 composition API 中使用。

## 9 与普通的 `<script>` 一起使用

`<script setup>` 可以和普通的 `<script>` 一起使用。普通的 `<script>` 在有这些需要的情况下或许会被使用到：

- 无法在 `<script setup>` 声明的选项，例如 `inheritAttrs` 或通过插件启用的自定义的选项。
- 显示定义组件的名称。
- 运行副作用或者创建只需要执行一次的对象。

```vue
<script>
// 普通 <script>, 在模块范围下执行(只执行一次)
runSideEffectOnce()

// 声明额外的选项
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// 在 setup() 作用域中执行 (对每个实例皆如此)
</script>
```

> 实验得知，如果同时使用 `<script setup>` 和 `<script>` ，那么将打破 `<script setup>` 的默认关闭（即外部无法获取组件内部的属性和方法），此时，组件内部的属性和方法都将在外部可获取到，如 `ref.xxx`

## 10 顶层 `await`

`await` 的使用必须是要在`async` 语法糖的包裹下，否者将无法执行，为了更简化代码， `<script setup>` 中可以使用顶层 `await`。

```vue
<script setup>
const post = await fetch(`/api/post/1`).then(r => r.json())
</script>
```

上述代码编译后的结果如下，可以看到编译后的结果不再是 `setup` 了，而是带有 `async` 的 `setup()`， 因此便可以直接在 `<script setup>` 中使用顶层的 `await` 了：

```js
const __sfc__ = {
  async setup(__props) {		// 不再是 setup， 而是 async setup

    let __temp, __restore
    const post = (([__temp,__restore]=_withAsyncContext(()=>(fetch(`/api/post/1`).then(r => r.json())))),__temp=await __temp,__restore(),__temp)

    return () => {}
  }
}
```

另外，await 的表达式会自动编译成在 `await` 之后保留当前组件实例上下文的格式。
<font color='red'>注意：</font> `async setup()` 必须与 `Suspense` 组合使用，`Suspense` 目前还是处于实验阶段的特性。vue 官方提到，在将来的某个发布版本中将开发完成并提供文档 - 如果你现在感兴趣，可以参照 [tests](https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/__tests__/components/Suspense.spec.ts) 看它是如何工作的。

> 如果你了解 React 的话，一定知道 React 中有一个` <Suspense>` 内置组件， 这个组件主要是在组件完成前实现 loading 效果，因为有的组件是需要等待异步结果才渲染的，所以需要一个 loading 过程，那么 vue 这里提到的 "`async setup()` 必须与 `Suspense` 组合使用" ，其思想应该是一致的，因为默认情况下 vue 会认为 `async setup()` 中一定存在顶层的 `await` 异步，为了更好的交互体验，强制添加一个 `Suspense` 组件以显示 loading。
>
> 所以，思想才是关键，做法是次要的

## 11 限制使用src 导入

SFC 的三个模块都可以通过 `src` 的方式进行导入，如下所示：

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

但是在 `<script setup> `下<font color='red'>强烈建议不使用 Src 导入</font>。

由于模块执行语义的差异，`<script setup>` 中的代码依赖单文件组件的上下文。当将其移动到外部的 `.js` 或者 `.ts` 文件中的时候，对于开发者和工具来说都会感到混乱。因而 **`<script setup>`** 不能和 `src` attribute 一起使用。

## 13 `<style> v-bind` 新特性

scoped 跟 vue2.x 的设计和使用完全是一样的，因此不再赘述。

### 13.1 style module

设计和使用上跟 Vue2.x 是一致的，。
唯一新的点是使用 `<script setup>` 时，可以使用 `useCssModule`  API 获取到 css module 对象。

```vue
<script setup lang="ts">
import { useCssModule } from "vue";
const css = useCssModule();
console.log(css);		// { blue: "_blue_13cse_5", red: "_red_13cse_2"}
</script>

<style module>
.red {
  color: red;
}
.blue {
  color: blue;
}
</style>
```

### 13.2 状态驱动的动态 CSS

#### 3.2.1 基本使用

单文件组件的 `<style>` 标签可以通过 `v-bind` 这一 CSS 函数将 CSS 的值关联到动态的组件状态上，**有了这一特性，可以将大量的动态样式通过状态来驱动了，而不是写动态的 calss 类名或者获取 dom 来动态设置了**。

```vue
<script setup lang="ts">
import { ref } from "vue";
const color = ref('red');

setTimeout(() => color.value = 'blue' , 2000);
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind(color);
}
</style>
```

实际的值会被编译成 hash 的 CSS 自定义 property，CSS 本身仍然是静态的。**自定义 property 会通过内联样式的方式应用到组件的根元素上，并且在源值变更的时候响应式更新**。

上述代码编译后的结果如下，可以看到，<font color='red'>编译后的代码会维护一份 hash 值和源值的映射，hash 值用于 css var 函数获取自定义属性，hash 映射源值并保留响应式：</font>

> 不知道你是否有使用或者听说过 css 的 var 函数，小生我是没有的，因此会在下一小节简单的描述一下

1. 编译后的 css

```css
p[data-v-f13b4d11] {
  color: var(--f13b4d11-color);		/* 通过 css 的 var 函数去获取到自定义属性的值 */
}
```

2. 编译后的 js

```js
const __sfc__ = /*#__PURE__*/_defineComponent({
  setup(__props) {
    _useCssVars(_ctx => ({
      "f13b4d11-color": (color.value)		// 可以看到，编译后的值 和 一个 hash 值映射，并且具备响应式， css 的 var 便可以获取到这个 hash 映射的值
    }))

    const color = ref('red');
    setTimeout(() => color.value = 'blue' , 2000);

    return (_ctx,_cache) => {
      return (_openBlock(), _createElementBlock("p", null, "hello"))
    }
  }
})
```
