---
template: false
---

# Markdown 语法扩展

瓦雀对 markdown 语法做了一些扩展：

## 文档设置

通过 markdown 前的 yaml 来设置文档，目前支持三个属性：

- **url** - 文档 url，如果不设置瓦雀默认会用文件名作为 url。
- **public** - 浏览权限，1 是公开，0 是私密。
- **template** - 是否启用模板功能，优先级高于 `yuque.yml` 中的设置。

```markdown
---
url: hello-world
public: 1
---

# Hello world
```

## 模板功能

在 Markdown 里使用 [nunjucks](nunjucks) 模板语法。

通过 `yuque.yml` 设置变量：

```yaml
template:
  variables:
    name: Tom
```

然后可以直接在文档里使用变量：

```markdown
Hello {{ name }}!
```

