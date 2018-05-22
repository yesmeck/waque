# 什么是瓦雀

> 双双瓦雀行书案，点点杨花入砚池。 —— 元 叶李《暮春即事》

瓦雀可以帮你把本地的文档（markdown）目录发布到语雀上。

如果你想要...

- 返璞归真，使用 markdown；
- 选择自己喜欢的编辑器；
- 把文档维护在 GitHub 上；

瓦雀是你居家旅行，编写文档的必备工具。

> 注：文档同步是单向的，同步的文档不能再在语雀上编辑。

## 安装瓦雀

```bash
$ npm i -g waque
```

## 登录语雀

设置环境变量 `YUQUE_TOKEN`，语雀的 token 可以在这里获取 https://www.yuque.com/settings/tokens

## 初始化配置

在文档目录下运行下面的命令生成瓦雀的配置文件 `yuque.yml`。

这个命令会要求你输入语雀知识库的名字和要上传的文档，可以参考[配置说明](configuration)来设置。

```bash
$ waque init
```

## 上传文档

使用下面的命令来上传文档，瓦雀会把文件名作为语雀上文档的 URL，所以文件名只能包含字母、数字、`_`和`-`（除非在文档里指定了 URL）。

```bash
$ waque upload
```

也可以指定文件上传。

```bash
$ waque upload foo.md bar.md
```

## 从已有仓库导出文档

如果你要把已有的仓库改用瓦雀管理，那么你可以用下面的命令先把文档导出成 markdown。

默认导出到当前目录下，如果指定目录，则目录要先存在。

```bash
$ waque export [DIR]
```

[导出再上传可能碰到的问题](faq)

## 谁在使用

- [《Ant Design 实战教程》](https://www.yuque.com/ant-design/course)
