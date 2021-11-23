import {Command, flags} from '@oclif/command';
import * as signale from 'signale';
import User from './User';
import { load } from './Config';

export default abstract class extends Command {
  static flags = {
    token: flags.string({
      char: 't',
      env: 'YUQUE_TOKEN',
    }),

    config: flags.string({
      char: 'c',
      default: 'yuque.yml',
    })
  };

  flags?: {
    env: 'yuque';
    token: string;
    config: string;
    watch?: boolean;
  };

  args?: {
    [key: string]: string;
  };

  config: any;

  async init() {
    // do some initialization
    const { args, flags } = this.parse();
    this.flags = flags as any;
    this.args = args;
    if (this.id !== 'login') {
      await this.loadUser();
    }
    if (['export', 'upload'].includes(this.id!)) {
      this.loadConfig();
    }
  }

  loadConfig() {
    this.config.lark = load(this.flags!.config);
  }

  async loadUser() {
    const user = new User(this.config, this.flags!.token);
    await user.load();
    if (!user.token) {
      signale.error('请先使用 waque login 登录语雀');
      process.exit(1);
    }
    this.config.currentUser = user;
  }
}
