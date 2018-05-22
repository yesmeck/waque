# 配置说明

| 配置     | 说明                                                                 | 默认值            |
| -------- | -------------------------------------------------------------------- | ----------------- |
| repo     | 语雀文档库名，以本文档为例，repo 就是 waque/docs                     | -                 |
| pattern  | 要上传的 markdown 文件，语法参考 https://github.com/isaacs/node-glob | `**/*.md`           |
| ignore   | 要忽略的文件，语法同上                                               |  `node_modules/**/*` |
| summary  | 目录文件                                                             | `summary.md`        |
| layout   | layout 文件，详见：[使用 layout](tips#使用-layout)                     | `layout.md`         |
| template | 启用模板功能                                                         | `false`             |
| promote  | 支持瓦雀                                                             | `true`              |
