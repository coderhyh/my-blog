---
title: git常用命令
date: 2022-02-10
sidebar: 'auto'
tags:
 - 笔记
 - git
categories:
 -  git
---

# git

```js
//克隆
git clone https://github.com/LoveCodingHyh/supermall.git

//状态
git status

//添加项目
git push

//

git init 初始化git仓库    让git管理此文件夹

//在需要备份的时候
	git add .
	git commit -m "版本说明"
//查看所有版本信息
	git log
	git reflog
//版本回退
	git reset --hard 版本标识 (直接切换) 
	git reset --soft 版本标识 (如果想把上一次commit的代码撤回到暂存区 用这个)
  
//版本撤销
	git checkout .
  
//删除文件
	git rm 文件名
	git commit -m "说明"
//忽略文件
 	仓库根目录添加以.gitignore为后缀的文件，内部书写需要忽略的文件或文件夹

// 当前分支A改过代码了。然后想改到B分支去 这时候分支A没有保存。切换不了 可以使用stash解决
git stash

// 用于选择并应用单个提交到当前分支
// 它的作用是将指定的提交（或多个提交）从一个分支复制到另一个分支
// 类似于手动合并的效果，但只复制选择的提交，而不是整个分支的历史记录。
git cherry-pick <commit-hash>
通过范围选择：可以使用 git cherry-pick <start-commit>..<end-commit>

git cherry-pick -e <commit-hash> 选项可以启用交互式模式，允许你在应用提交之前编辑提交的内容。
这样可以选择性地修改提交的文件、提交信息等内容
  
  
//连接远程库
	git remote add origin 远程库地址
		查看远程仓库信息
			git remote -v
		删除远程仓库
			git remote rm origin
		新增远程仓库地址
			git remote add origin 新的git地址
		更新远程仓库地址
			一些远程仓库分支删除了，但是本地 git branch -a 查看时，还是会显示已被删除的那个远程分支，
				所以可以通过执行下面的指令，刷新本地的远程分支信息
			git remote update origin --prune

	第一次推  git push -u origin master
	后来推 git push
	拉取 git pull origin master
	强制推 git push -f origin master
	切换完版本号 把当前版本强制推到仓库
		git push -f origin HEAD:master 
  
  ssh-keygen -t rsa -C <email>
	本地运行首次连接时的公钥认证命令： ssh -T 地址
		ssh -T git@e.coding.net

打标签
	git tag -a <tag-name> -m "项目2.0版本"
	删除标签 git tag -d <tag-name>
	切换版本 git checkout <tag-name>
  删除仓库标签 git push origin --delete <tag-name>


查看分支：git branch
创建分支：git branch <name>
切换分支：git checkout <name>
创建+切换分支：git checkout -b <name>
合并某分支到当前分支：git merge <name>
删除分支：git branch -d <name>

推送指定分支   git push origin 分支名
拉取指定分支   git pull origin 分支名
删除指定分支   git push origin :分支名

```