---
title: mac下载工具遇到的问题
date: 2022-09-14
sidebar: 'auto'
tags:
 - 资料
categories:
 -  随笔
---

## Homebrew安装（国内地址）

苹果电脑 常规安装脚本（推荐 完全体 几分钟安装完成）：

```zsh
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

苹果电脑 卸载脚本：

```zsh
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/HomebrewUninstall.sh)"
```

[原文](https://zhuanlan.zhihu.com/p/111014448)

### brew遇到的问题：

**使用`homebrew` 的时候失败`fatal: not in a git directory Error: Command failed with exit 128: git`**

解决办法：

执行`brew -v` 查看提示，`homebrew-core`和`homebrew-cask`目录 被git认为不是一个安全的目录，需要两行命令添加。

根据提示执行命令即可

```zsh
huayuhao@tqbx-mbp ~ % brew -v
Homebrew 3.4.11-53-g34dd8e3
fatal: unsafe repository ('/opt/homebrew/Library/Taps/homebrew/homebrew-core' is owned by someone else)
To add an exception for this directory, call:

	git config --global --add safe.directory /opt/homebrew/Library/Taps/homebrew/homebrew-core
Homebrew/homebrew-core (no Git repository)
fatal: unsafe repository ('/opt/homebrew/Library/Taps/homebrew/homebrew-cask' is owned by someone else)
To add an exception for this directory, call:

	git config --global --add safe.directory /opt/homebrew/Library/Taps/homebrew/homebrew-cask
Homebrew/homebrew-cask (no Git repository)
```

**如何解决类似` curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused` 的问题**

[原文](https://github.com/hawtim/hawtim.github.io/issues/10)

### brew常用命令

```zsh
查看帮助
	brew -help
安装
	brew install [package]
卸载
	brew uninstall [package]
搜索
	brew search [package]
显示已安装包
	brew list
更新brew
	把所有的Formula⽬录更新，并且会对本机已经安装并有更新的软件⽤*标明。
	brew update
	更新所有
		brew upgrade
	更新某个包
		brew upgrade [package]
查看那些已安装的程序需要更新
	brew outdated
清理旧版本
	清理所有包的旧版本
		brew cleanup
	清理指定包的旧版本
		brew cleanup [package]
	查看可清理的旧版本包，不执⾏实际操作
		brew cleanup -n
查看包信息
	brew info [package]
浏览器打开
	brew home
显示包依赖
	brew deps [package]
	显示包的依赖树
		brew deps --installed --tree
启动web服务器
	brew server
```

## nvm常用命令

```
nvm list     //查看已安装的nodejs版本
nvm on      // 启用node.js版本管理
nvm off   // 禁用node.js版本管理(不卸载任何东西)
nvm install <version>       // 安装node.js的命名 version是版本号 例如：nvm install 8.12.0
nvm use <version>      //使用某一version的nodejs
nvm uninstall <version>   // 卸载指定版本的nodejs
```

