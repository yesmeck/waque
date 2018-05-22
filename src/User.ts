import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import LarkClient from './LarkClient';

export default class User {
  config: any;
  cacheFile: string;
  id?: string;
  token?: string;
  name?: string;
  lark: LarkClient;

  constructor(config: any, token?: string) {
    this.config = config;
    this.token = token;
    this.lark = new LarkClient(config, this);
    this.cacheFile = join(this.config.cacheDir, 'user');
  }

  async load() {
    if (this.token) {
      await this.initByToken(false);
    } else if (existsSync(this.cacheFile)) {
      const { id, token } = JSON.parse(readFileSync(this.cacheFile, 'utf-8'));
      this.token = token;
      this.id = id;
    }
    return this;
  }

  async initByToken(save = true) {
    const user = await this.lark.getUser();
    this.id = user.id;
    this.name = user.name;
    if (save) {
      this.save({ id: this.id, token: this.token });
    }
  }

  save(user: any) {
    writeFileSync(this.cacheFile, JSON.stringify(user));
  }
}
