# 使用技巧

## 设置目录结构

瓦雀支持通过 summary.md 文件来设置知识库的目录结构，在文档目录下创建 `summary.md` 即可，以本文档为例：

```markdown
- [开始使用](getting-started)
- [配置说明](configuration)
- [更新日志](changelog)
```

## 使用 layout

如果想在每个文档里都插入同样的内容，可以在目录下新建 layout.md 文件，也可以通过配置文件指定。内容如下：

```markdown
{{ content | safe }}

这里的公共的内容
```

layout 里同样可以使用 nunjucks 模板语法，除了可以访问在配置文件中设置的变量以外，还可以访问下面这些文档相关的变量：

| 变量名 | 说明 |
| ----- | ---- |
| filename | 文件名 |
| path | 文件路径 |
| slug | 文档 URL |
| title | 文档标题 |
| content | 文档内容 |
| public | 是否私密 |

## 使用 git hook 自动同步文档

通过 `husk` 和 `lint-staged` 这两个工具的组合，你还可以只同步当前 commit 修改过的文档

```bash
$ npm i husky lint-staged --save-dev
```

然后在 `package.json` 里加入以下配置：

```json
"scripts": {
  "precommit": "lint-staged"
},
"lint-staged": {
  "**/*.md": [
    "waque upload"
  ]
}
```

配置好后瓦雀会自动更新每次 commit 修改过的文档。
