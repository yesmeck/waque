import { readFileSync } from 'fs';
import * as yamlFront from 'yaml-front-matter';
import * as nunjucks from 'nunjucks';
import pinyin from "pinyin";
import { IConfig } from './Config';
import LarkClient from './LarkClient';
import { basename, resolve } from './path';

const ASSETS_BEGIN = '[comment]: <> (waque assets)';
const ASSETS_END = '[comment]: <> (waque assets end)';

export interface DocumentConfig {
  url?: string;
  public?: number;
  template?: boolean;
  __content: string;
}

export default class Document {
  filename: string;
  config: IConfig;
  body!: string;
  title!: string;
  slug!: string;
  public?: number;
  template?: boolean;
  lark: LarkClient;
  raw: string;
  rendered?: string;
  assets: {
    hash: string;
    url: string;
  }[];
  larkDocs: any;
  id?: number;

  constructor(larkDocs: any, lark: LarkClient, config: IConfig, filename: string) {
    this.larkDocs = larkDocs;
    this.lark = lark;
    this.config = config;
    this.filename = filename// encodeURIComponent(filename);
    this.assets = [];
    this.raw = readFileSync(resolve(this.filename)).toString();
  }

  async createDoc(layout?: string) {
    // load config
    this.loadConfig();
    // set id
    const larkDoc: any = this.larkDocs.find((ld: any) => ld.slug === this.slug);
    if (larkDoc) {
      this.id = larkDoc.id;
    }
    // render template
    this.renderTemplate();

    let title = '';
    let body: any = [];
    let prevLine = '';
    const lines = this.rendered!.split('\n');
    for (const line of lines) {
      if (!title) {
        if (line.startsWith('# ')) {
          title = line.replace('# ', '');
          continue;
        }
        if (line.startsWith('====')) {
          title = prevLine;
          body.shift();
          continue;
        }
      }
      prevLine = line;
      body.push(line);
    }
    if (this.assets.length > 0) {
      body.push('');
      body.push(ASSETS_BEGIN);
      this.assets.forEach(asset => body.push(`[comment]: <> (${asset.hash}: ${asset.url})`));
      body.push(ASSETS_END);
    }

    body = body.join('\n').trim();

    this.title = title.trim();
    this.body = body;
    this.applyLayout(layout);

    if (this.config.promote) {
      this.body = this.body + this.signature();
    }

    return this;
  }

  signature() {
    return '\n\n---\n <sub>本文档由[瓦雀](https://www.yuque.com/waquehq)创建</sub>';
  }

  applyLayout(layout?: string) {
    if (!layout) {
      return;
    }
    let variables = {
      slug: this.slug,
      title: this.title,
      content: this.body,
      public: this.public,
      filename: basename(this.filename),
      path: this.filename.replace(process.cwd(), ''),
    };
    let tags;
    if (this.config.template) {
      variables = {
        ...variables,
        ...(this.config.template as any).variables
      };
      tags = (this.config.template as any).tags;
    }
    const env = nunjucks.configure({ tags });
    this.body = env.renderString(readFileSync(resolve(layout)).toString(), variables);
  }

  getTemplate() {
    if (this.template === false) {
      return false;
    }
    if (this.template === true || this.config.template) {
      return {
        variables: (this.config.template as any).variables || {},
        tags: (this.config.template as any).tags
      };
    }
    return false;
  }

  renderTemplate() {
    const template = this.getTemplate();
    if (template) {
      const env = nunjucks.configure({ tags: template.tags });
      this.rendered = env.renderString(this.rendered!, template.variables);
    }
  }

  loadConfig() {
    const config: DocumentConfig = yamlFront.loadFront(this.raw);
    this.slug =
      config.url ||
      basename(this.filename, '.md')
        .toLowerCase()
        .replace(/\s/g, '-');
    this.template = config.template;
    this.rendered = config.__content;
    this.public = config.public;
  }

  dump() {
    return {
      slug: pinyin(this.slug, {
        style: pinyin.STYLE_NORMAL,
        heteronym: false
      }).join('-'),
      title: this.title,
      body: this.body,
      public: this.public
    };
  }

  validate() {
    const result: {
      valid: boolean;
      messages: string[];
    } = {
      valid: true,
      messages: [],
    };
    if (!this.title) {
      result.valid = false;
      result.messages.push('缺少文章标题');
    }
    // if (!/\w+/.test(this.slug)) {
    //   result.valid = false;
    //   result.messages.push('文件名只能是字母、数字、_和-');
    // }
    return result;
  }
}
