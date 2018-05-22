import {Command, flags} from '@oclif/command';
import User from './User';
import { load } from './Config';

export default abstract class extends Command {
  static flags = {
    token: flags.string({
      char: 't',
      env: 'YUQUE_TOKEN',
      required: true,
    }),
  };

  flags?: {
    env: 'yuque';
    token: string;
  };

  args?: {
    [key: string]: string;
  };

  config: any;

  async init() {
    // do some initialization
    const { args, flags } = this.parse();
    this.flags = flags;
    this.args = args;
    if (this.id !== 'login') {
      await this.loadUser();
    }
    if (['export', 'upload'].includes(this.id!)) {
      this.loadConfig();
    }
  }

  loadConfig() {
    this.config.lark = load();
  }

  async loadUser() {
    const user = new User(this.config, this.flags!.token);
    await user.load();
    this.config.currentUser = user;
  }
}
