---
title: excel的导入与导出
date: 2022-02-15
sidebar: 'auto'
tags: 
 - learn
categories:
 - 随笔
---

::: tip

安装

`npm i element-plus xlsx@0.17.5 file-saver`

`npm i script-loader -D`

:::

## 目录结构

```js
--common
	--readFile.js
--vendor
	--Blob.js
	--Export2Excel.js
--App.vue

//main.js
import {
  createApp
} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App)
  .use(ElementPlus)
  .mount('#app')
```

::: tip

## template

:::

```html
<template>
  <el-upload
             class="upload-demo"
             action=""
             drag
             :auto-upload="false"
             :on-change="uploadChange"
             :limit="1"
             >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  </el-upload>
  <el-button @click="exportData">点我下载</el-button>

  <el-table :data="data" style="width: 100%">
    <el-table-column label="姓名" prop="姓名" />
    <el-table-column label="成绩" prop="成绩" />
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="搜索内容" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index,scope.column, scope.row)"
                   >编辑</el-button
          >
        <el-button
                   size="small"
                   type="danger"
                   @click="handleDelete(scope.$index, scope.row)"
                   >Delete</el-button
          >
      </template>
    </el-table-column>
  </el-table>
</template>
```

::: tip

## script

:::

```js{26}
<script>
import xlsx from "xlsx";
import { readFile } from "./common/readFile"; //下文有该文件代码
import { export_json_to_excel } from "./vendor/Export2Excel";
export default {
  name: "upload",
  data() {
    return {
      data: [],
      search: "",
    };
  },
  methods: {
    //element 的 删除
    handleDelete(index, row) {
      console.log(index, row);
    },
    //element 的 编辑
    handleEdit(index, column, row) {
      console.log(index, column, row);
    },
    //当传输文件触发
    async uploadChange(file) {
      let dataBinary = await readFile(file.raw);
      let workBook = xlsx.read(dataBinary, { type: "binary", cellDates: true });
      let workSheet = workBook.Sheets[workBook.SheetNames[0]];
      //处理完data就可以渲染了
      this.data = xlsx.utils.sheet_to_json(workSheet);
      //json_to_sheet
      var sheet = xlsx.utils.json_to_sheet(this.data);
    },
    //以下为导出
    exportData() {
      const tHeader = ["姓名", "成绩"];//视文件定义
      const filterVal = ["姓名", "成绩"];//视文件定义
      const list = this.data;
      const data = this.formatJson(filterVal, list);
      export_json_to_excel(tHeader, data, "fileName");
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
  },
};
```

::: warning

有的excel文件中都会分有其他sheet

可以在第 **26** 行的 `SheetNames` 中选择sheet进行渲染

:::

## 下载

<a href="/file/js.zip" download="js">点我下载🥰</a>