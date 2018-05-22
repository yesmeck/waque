import * as glob from 'glob';
import * as signale from 'signale';
import { basename, resolve } from 'path';
import { readFileSync, existsSync } from 'fs';
import { times, compact } from 'lodash';
import LarkClient from '../LarkClient';
import Document from '../Document';
import Base from '../base';

export default class Upload extends Base {
  static description = 'upload docs';

  static flags = Base.flags;

  static args = times(1000, Number).map(i => ({ name: `file${i}` }));

  static strict = false;

  config: any;
  lark!: LarkClient;

  async run() {
    this.lark = new LarkClient(
      this.config,
      this.config.currentUser
     );
    let pattern = this.config.lark.pattern;
    const args = compact(Object.values(this.args!));
    if (args.length === 1) {
      pattern = args[0];
    } else if (args.length > 1) {
      pattern = `{${args.join(',')}}`;
    }

    let foundSummary;
    let foundLayout = glob.sync(this.config.lark.pattern).find(f => this.isLayout(f));
    if (foundLayout) {
      signale.info('发现 layout.md');
    }

    const larkDocs = await this.lark.getDocs();

    const docs = await Promise.all(glob
        .sync(pattern, { ignore: this.config.lark.ignore })
        .filter(filename => {
          if (this.isSummary(filename)) {
            signale.info(`发现 ${filename}`);
            foundSummary = filename;
            return false;
          }
          if (this.isLayout(filename)) {
            return false;
          }
          return true;
        })
        .map(filename => {
          const doc = new Document(
            larkDocs,
            this.lark,
            this.config.lark,
            filename,
          );
          return doc.createDoc(foundLayout);
        }));

    let hasError = false;

    await Promise.all(docs.map(doc => {
      const result = doc.vaidate();
      if (!result.valid) {
        signale.error(`${doc.filename} ${result.messages.join('|')}`);
        hasError = true;
        return;
      }
      if (doc.id) {
        this.debug('Update yuque doc %s', doc.title);
        return this.lark.updateDoc(doc.id, doc.dump()).then(() => {
          signale.success(`更新 ${doc.title}[${doc.slug}]`);
        }).catch(error => {
          signale.error(`更新 ${doc.title}[${doc.slug}]`);
          hasError = true;
          this.log(error.response.data);
        });
      } else {
        this.debug('Create yuque doc %s', doc.title);
        return this.lark.createDoc(doc.dump()).then(() => {
          signale.success(`创建 ${doc.title}[${doc.slug}]`);
        }).catch(error => {
          signale.error(`创建 ${doc.title}[${doc.slug}]`);
          hasError = true;
          this.log(error.response.data);
        });
      }
    }));
    this.updateToc(foundSummary);

    if (hasError) {
      this.exit(1);
    }
  }

  updateToc(foundSummary?: string) {
    const summaryFile = foundSummary || resolve(this.config.lark.summary);
    if (existsSync(summaryFile)) {
      const summary = readFileSync(summaryFile).toString();
      this.lark.updateRepo({ toc: summary });
      signale.success('更新目录');
    }
  }

  isSummary(filename: string) {
    return basename(filename).toLowerCase() === 'summary.md';
  }

  isLayout(filename: string) {
    return basename(filename).toLowerCase() === 'layout.md';
  }
}
