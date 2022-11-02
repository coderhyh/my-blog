---
title: 项目搭建
date: 2022-11-02
sidebar: 'auto'
tags:
 - 资料
categories:
 - 随笔
---

## 一. 代码规范

### 1.1. 集成editorconfig配置

EditorConfig 有助于为不同 IDE 编辑器上处理同一项目的多个开发人员维护一致的编码风格。

```yaml
# http://editorconfig.org

root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
end_of_line = lf # 控制换行类型(lf | cr | crlf)
trim_trailing_whitespace = true # 去除行首的任意空白字符
insert_final_newline = true # 始终在文件末尾插入一个新行

[*.md] # 表示仅 md 文件适用以下规则
max_line_length = off
trim_trailing_whitespace = false
```



VSCode需要安装一个插件：EditorConfig for VS Code

### 1.2. 使用prettier工具

Prettier 是一款强大的代码格式化工具，支持 JavaScript、TypeScript、CSS、SCSS、Less、JSX、Angular、Vue、GraphQL、JSON、Markdown 等语言，基本上前端能用到的文件格式它都可以搞定，是当下最流行的代码格式化工具。

1.安装prettier

```shell
npm install prettier -D
```

2.配置.prettierrc文件：

* useTabs：使用tab缩进还是空格缩进，选择false；
* tabWidth：tab是空格的情况下，是几个空格，选择2个；
* printWidth：当行字符的长度，推荐80，也有人喜欢100或者120；
* singleQuote：使用单引号还是双引号，选择true，使用单引号；
* trailingComma：在多行输入的尾逗号是否添加，设置为 `none`；
* semi：语句末尾是否要加分号，默认值true，选择false表示不加；

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": true,
  "trailingComma": "none",
  "semi": false
}
```

3.创建.prettierignore忽略文件

```
/dist/*
.local
.output.js
/node_modules/**

**/*.svg
**/*.sh

/public/*
```

4.VSCode需要安装prettier的插件

5.测试prettier是否生效

* 测试一：在代码中保存代码；
* 测试二：配置一次性修改的命令；

在package.json中配置一个scripts：

```json
    "prettier": "prettier --write ."
```



### 1.3. 使用ESLint检测

1.在前面创建项目的时候，我们就选择了ESLint，所以Vue会默认帮助我们配置需要的ESLint环境。

2.VSCode需要安装ESLint插件：

3.解决eslint和prettier冲突的问题：

安装插件：

```shell
eslint
eslint-config-prettier
eslint-plugin-import
eslint-plugin-prettier
eslint-plugin-simple-import-sort
eslint-plugin-vue
@typescript-eslint/eslint-plugin
@typescript-eslint/parser
@vue/eslint-config-prettier
@vue/eslint-config-typescript
```

package添加脚本

```
"lint": "eslint --ext .vue --ext .js --ext .ts src/ --fix"
```

添加prettier插件：

```json
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    '.eslintrc-auto-import.json',
    '.eslintrc-auto-import-types.json'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  // eslint-plugin-vue @typescript-eslint/eslint-plugin eslint-plugin-prettier的缩写
  plugins: ['vue', '@typescript-eslint', 'prettier', 'import', 'simple-import-sort'],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'vue/no-multiple-template-root': 'off', // 解决template中最顶层只能返回一个元素的检测报错
    'import/no-unresolved': [
      // 解决无法识别问题
      2,
      {
        ignore: ['./']
      }
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }], // 解决依赖问题
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-var': 'error',
    'prettier/prettier': 'error',
    // 禁止出现console
    // "no-console": "warn",
    // 禁用debugger
    // "no-debugger": "warn",
    // 禁止出现重复的 case 标签
    'no-duplicate-case': 'warn',
    // 禁止出现空语句块
    'no-empty': 'warn',
    // 禁止不必要的括号
    'no-extra-parens': 'off',
    // 禁止对 function 声明重新赋值
    'no-func-assign': 'warn',
    // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码
    'no-unreachable': 'warn',
    // 强制所有控制语句使用一致的括号风格
    // curly: 'warn',
    // 要求 switch 语句中有 default 分支
    'default-case': 'warn',
    // 强制尽可能地使用点号
    'dot-notation': 'warn',
    // 要求使用 === 和 !==
    eqeqeq: 'warn',
    // 禁止 if 语句中 return 语句之后有 else 块
    'no-else-return': 'warn',
    // 禁止出现空函数
    'no-empty-function': 'warn',
    // 禁用不必要的嵌套块
    'no-lone-blocks': 'warn',
    // 禁止使用多个空格
    'no-multi-spaces': 'warn',
    // 禁止多次声明同一变量
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error'],
    // 禁止在 return 语句中使用赋值语句
    'no-return-assign': 'warn',
    // 禁用不必要的 return await
    'no-return-await': 'warn',
    // 禁止自我赋值
    'no-self-assign': 'warn',
    // 禁止自身比较
    'no-self-compare': 'warn',
    // 禁止不必要的 catch 子句
    'no-useless-catch': 'warn',
    // 禁止多余的 return 语句
    'no-useless-return': 'warn',
    // 禁止变量声明与外层作用域的变量同名
    'no-shadow': 'off',
    // 允许delete变量
    'no-delete-var': 'off',
    // 强制数组方括号中使用一致的空格
    'array-bracket-spacing': 'warn',
    // 强制在代码块中使用一致的大括号风格
    'brace-style': 'warn',
    // 强制使用骆驼拼写法命名约定
    // camelcase: 'warn',
    // 强制使用一致的缩进
    indent: 'off',
    // 强制在 JSX 属性中一致地使用双引号或单引号
    // 'jsx-quotes': 'warn',
    // 强制可嵌套的块的最大深度4
    'max-depth': 'warn',
    // 强制最大行数 300
    // "max-lines": ["warn", { "max": 1200 }],
    // 强制函数最大代码行数 50
    // 'max-lines-per-function': ['warn', { max: 70 }],
    // 强制函数块最多允许的的语句数量20
    'max-statements': ['warn', 100],
    // 强制回调函数最大嵌套深度
    'max-nested-callbacks': ['warn', 3],
    // 强制函数定义中最多允许的参数数量
    'max-params': ['warn', 3],
    // 强制每一行中所允许的最大语句数量
    'max-statements-per-line': ['warn', { max: 1 }],
    // 禁用要求方法链中每个调用都有一个换行符
    'newline-per-chained-call': 'off',
    // 禁止 if 作为唯一的语句出现在 else 语句中
    'no-lonely-if': 'warn',
    // 禁止空格和 tab 的混合缩进
    'no-mixed-spaces-and-tabs': 'warn',
    // 禁止出现多行空行
    'no-multiple-empty-lines': 'warn',
    // 禁止出现;
    semi: ['warn', 'never'],
    // 强制在块之前使用一致的空格
    'space-before-blocks': 'warn',
    // 强制在 function的左括号之前使用一致的空格
    // 'space-before-function-paren': ['warn', 'never'],
    // 强制在圆括号内使用一致的空格
    'space-in-parens': 'warn',
    // 要求操作符周围有空格
    'space-infix-ops': 'warn',
    // 强制在一元操作符前后使用一致的空格
    'space-unary-ops': 'warn',
    // 强制在注释中 // 或 /* 使用一致的空格
    // "spaced-comment": "warn",
    // 强制在 switch 的冒号左右有空格
    'switch-colon-spacing': 'warn',
    // 强制箭头函数的箭头前后使用一致的空格
    'arrow-spacing': 'warn',
    'prefer-const': 'warn',
    'prefer-rest-params': 'warn',
    'no-useless-escape': 'warn',
    'no-irregular-whitespace': 'warn',
    'no-prototype-builtins': 'warn',
    'no-fallthrough': 'warn',
    'no-extra-boolean-cast': 'warn',
    'no-case-declarations': 'warn',
    'no-async-promise-executor': 'warn'
  }
}
```



### 1.4. git Husky和eslint

虽然我们已经要求项目使用eslint了，但是不能保证组员提交代码之前都将eslint中的问题解决掉了：

* 也就是我们希望保证代码仓库中的代码都是符合eslint规范的；

* 那么我们需要在组员执行 `git commit ` 命令的时候对其进行校验，如果不符合eslint规范，那么自动通过规范进行修复；

那么如何做到这一点呢？可以通过Husky工具：

* husky是一个git hook工具，可以帮助我们触发git提交的各个阶段：pre-commit、commit-msg、pre-push

如何使用husky呢？

这里我们可以使用自动配置命令：

```shell
npx husky-init && npm install
```

这里会做三件事：

1.安装husky相关的依赖：

```
"husky": "^8.0.0"
```

2.在项目目录下创建 `.husky` 文件夹：

```
npx huksy install

.husky
	_
		.gitignore
		husky
	pre-commit
```

3.在package.json中添加一个脚本：

```json
"scripts": {
	"prepare": "husky install"
}
```

接下来，我们需要去完成一个操作：在进行commit时，执行lint脚本：

```
打开pre-commit文件
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
git add .
```

这个时候我们执行git commit的时候会自动对代码进行lint校验。



### 1.5. git commit规范

#### 1.5.1. 代码提交风格

通常我们的git commit会按照统一的风格来提交，这样可以快速定位每次提交的内容，方便之后对版本进行控制。

但是如果每次手动来编写这些是比较麻烦的事情，我们可以使用一个工具：Commitizen

* Commitizen 是一个帮助我们编写规范 commit message 的工具；

1.安装Commitizen

```shell
npm install commitizen -D
```

2.安装cz-customizable, 自定义commit 

```shell
npx i cz-customizable -D
```

然后创建 `.czrc` 文件

```json
{
  "path": "node_modules/cz-customizable"
}
```

创建 `.cz-config.js`

```js
'use strict'
module.exports = {
  types: [
    { value: 'feat', name: 'feat: 一个新的特性' },
    { value: 'fix', name: 'fix: 修复一个Bug' },
    { value: 'docs', name: 'docs: 变更的只有文档' },
    { value: 'style', name: 'style: 代码样式修改' },
    { value: 'refactor', name: 'refactor: 代码重构，注意和特性、修复区分开' },
    { value: 'perf', name: 'perf: 改善性能' },
    { value: 'test', name: 'test: 添加一个测试' },
    { value: 'build', name: 'build: 修改项目构建系统配置' },
    { value: 'ci', name: 'ci: 修改项目继续集成流程' },
    { value: 'chore', name: 'chore: 改变构建流程、或者增加依赖库、工具等' },
    {
      value: 'improvement',
      name: 'improvement: 用于对当前实现进行改进而没有添加新功能或修复错误的提交'
    },
    { value: 'merge', name: 'merge: 仅进行分支合并' },
    { value: 'revert', name: 'revert: 回滚到上一个版本' }
  ],
  scopes: [
    ['components', '组件相关'],
    ['hooks', 'hook 相关'],
    ['utils', 'utils 相关'],
    ['element-plus', '对 element-plus 的调整'],
    ['style', '样式相关'],
    ['deps', '项目依赖'],
    ['auth', '对 auth 修改'],
    ['other', '其他修改']
  ].map(([value, description]) => `${value.padEnd(30)} (${description})`),
  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: 'd{1,5}',
  // 针对每一个 type 去定义对应的 scopes，例如 fix /*
  // scopeOverrides: {
  //   fix: [{ name: 'merge' }, { name: 'style' }, { name: 'e2eTest' }, { name: 'unitTest' }]
  // },
  // override the messages, defaults are as follows
  messages: {
    type: '选择一种你的提交类型:',
    scope: '选择一个scope (可选):',
    customScope: '输入自定义的scope:',
    subject: '短说明 (必选):\n',
    body: '长说明，使用"|"换行(可选): \n',
    breaking: '非兼容性说明 (可选):\n',
    footer: '关联关闭的issue, 例如: #31, #34(可选):\n',
    confirmCommit: '确定提交说明?'
  },
  // 是否允许自定义填写 scope，在 scope 选择的时候，会有 empty 和 custom 可以选择。
  allowCustomScopes: true,
  // 允许打断更改
  // allowBreakingChanges: ['feat', 'fix'],
  // 跳过
  // skipQuestions: ['customScope', 'body', 'breaking', 'footer'],
  // limit subject length
  subjectLimit: 100
}
```



这个时候我们提交代码需要使用 `npx cz`：

* 第一步是选择type，本次更新的类型

| Type     | 作用                                                         |
| -------- | ------------------------------------------------------------ |
| feat     | 新增特性 (feature)                                           |
| fix      | 修复 Bug(bug fix)                                            |
| docs     | 修改文档 (documentation)                                     |
| style    | 代码格式修改(white-space, formatting, missing semi colons, etc) |
| refactor | 代码重构(refactor)                                           |
| perf     | 改善性能(A code change that improves performance)            |
| test     | 测试(when adding missing tests)                              |
| build    | 变更项目构建或外部依赖（例如 scopes: webpack、gulp、npm 等） |
| ci       | 更改持续集成软件的配置文件和 package 中的 scripts 命令，例如 scopes: Travis, Circle 等 |
| chore    | 变更构建流程或辅助工具(比如更改测试环境)                     |
| revert   | 代码回退                                                     |

我们也可以在scripts中构建一个命令来执行 cz：

```
"commit": "git add . && cz"
```

#### 1.5.2. 代码提交验证

如果我们按照cz来规范了提交风格，但是依然有同事通过 `git commit` 按照不规范的格式提交应该怎么办呢？

* 我们可以通过commitlint来限制提交；

1.安装 @commitlint/config-conventional 和 @commitlint/cli

```shell
npm i @commitlint/config-conventional @commitlint/cli -D
```

2.在根目录创建commitlint.config.js文件，配置commitlint

```js
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

3.使用husky生成commit-msg文件，验证提交信息：

```shell
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

## 项目`.vscode`设置

settings.json

```json
{
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "stylelint.validate": ["css", "less", "vue", "html"],
  "eslint.validate": ["typescript", "vue", "html", "json", "javascript"],
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "json.format.enable": false,
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

也可以加上extensions.json 推荐项目安装的插件

```json
{
  "recommendations": ["Vue.volar", "stylelint.vscode-stylelint", "dbaeumer.vscode-eslint", "esbenp.prettier-vscode", "sdras.vue-vscode-snippets"]
}
```



## css样式自动添加浏览器头

安装 postcss-preset-env

```zsh
npm i postcss-preset-env -D
```

新建 `postcss.config.js`

```js
module.exports = {
  plugins: [
    //自动添加前缀
    require('postcss-preset-env')
  ]
}
```

##  最后附上`package` 跟 `vite.config` 的配置

package

```json
{
  "name": "coderhyh-project",
  "private": true,
  "version": "0.0.3",
  "scripts": {
    "serve": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "commit": "git add . && cz",
    "lint": "eslint --ext .vue --ext .js --ext .ts src/ --fix",
    "prettier": "prettier --write .",
    "prepare": "husky install"
  },
  "dependencies": {
    "animate.css": "^4.1.1",
    "axios": "^1.1.3",
    "element-plus": "^2.2.18",
    "nprogress": "^0.2.0",
    "pinia": "^2.0.23",
    "pinia-plugin-persist": "^1.0.0",
    "vue": "^3.2.37",
    "vue-router": "^4.1.5"
  },
  "devDependencies": {
    "@commitlint/cli": "^17.1.2",
    "@commitlint/config-conventional": "^17.1.0",
    "@types/node": "^18.11.2",
    "@types/nprogress": "^0.2.0",
    "@typescript-eslint/eslint-plugin": "^5.40.1",
    "@typescript-eslint/parser": "^5.40.1",
    "@vitejs/plugin-vue": "^3.1.0",
    "@vue/eslint-config-prettier": "6",
    "@vue/eslint-config-typescript": "^11.0.2",
    "commitizen": "4.2.4",
    "cz-customizable": "6.3.0",
    "eslint": "^8.25.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-simple-import-sort": "^8.0.0",
    "eslint-plugin-vue": "^9.6.0",
    "husky": "^8.0.0",
    "less": "^4.1.3",
    "postcss-preset-env": "^7.8.2",
    "prettier": "^2.7.1",
    "typescript": "^4.6.4",
    "unplugin-auto-import": "^0.11.2",
    "unplugin-vue-components": "^0.22.8",
    "vite": "^3.1.0",
    "vue-tsc": "^0.40.4"
  }
}
```

vite.config

```typescript
import Vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

import AutoImportTypes from './src/plugins/autoImportType'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true
    }),
    AutoImportTypes({ dtsDir: 'src/types' }),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'pinia', 'vue-router', { '~/plugins/pinia-auto-refs': ['useStore'] }],
      dts: 'src/auto-imports.d.ts',
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: 'readonly' // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      }
    }),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      dts: 'src/components.d.ts',
      dirs: ['src/components'], // 按需加载的文件夹
      resolvers: [ElementPlusResolver()]
    })
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    // Unocss(),
  ],
  resolve: { alias: { '~': resolve(__dirname, 'src') } },
  server: {
    port: 3000,
    open: true, //自动打开
    base: './ ', //生产环境路径
    hmr: true,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://echarts.apache.org/examples',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  // 打包配置
  build: {
    target: 'modules', // 设置最终构建的浏览器兼容目标。modules:支持原生 ES 模块的浏览器
    outDir: 'dist', // 指定输出路径
    sourcemap: false, // 构建后是否生成 source map 文件
    minify: 'terser', // 混淆器，terser构建后文件体积更小
    cssCodeSplit: true, // 启用/禁用 CSS 代码拆分
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }, // 去除 console debugger
    rollupOptions: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return id.toString().split('node_modules/')[1].split('/')[0].toString()
        }
      },
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      }
    } // 将打包后的资源分开
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        charset: false,
        additionalData: '@import "./src/assets/css/global.less";'
      }
    }
  }
})
```



