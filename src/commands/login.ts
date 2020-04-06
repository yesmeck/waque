import { auth } from 'yuque-auth';
import User from '../User';
import Base from '../base';

export default class Login extends Base {
  static description = 'log into lark';

  static flags = Base.flags;

  async run() {
    const res = await auth({
      clientId: '8Jy5oKMnVHpiL1ci1CRV',
      clientSecret: 'Erc2ZqUM6WAs8PeujQQbEzNalYmV1My2cQRJA9PO',
      scope: 'repo,doc,group',
    });
    const user = new User(this.config, res.access_token);
    await user.initByToken();
    this.log('登录成功，欢迎使用瓦雀。');
  }
}
