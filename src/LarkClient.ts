import axios, { AxiosInstance } from 'axios';
import User from './User';
import { join } from 'path';

require('axios-debug-log')({
  request(debug: any, config: any) {
    debug('Request ' + config.url);
  },
  response(debug: any, response: any) {
    debug(
      'Response with ' + response.status,
      'from ' + response.config.url
    );
  },
  error(debug: any, error: any) {
    debug('Boom', error);
  }
});

export default class LarkClient {
  static async login(user: any) {
    const { data } = await axios.post('/authorize', user);
    return data.data;
  }

  config: any;
  user: User;
  client: AxiosInstance;

  constructor(config: any, user: User) {
    this.config = config;
    this.user = user;

    const baseURL = 'https://www.yuque.com/api/v2';

    this.client = axios.create({
      baseURL,
      headers: {
        'X-Auth-Token': user.token
      },
    });
  }

  repoPath(path: string) {
    return join('/repos', this.config.lark.repo, path);
  }

  createDoc(doc: any) {
    return this.client.post(this.repoPath('docs'), doc) as Promise<any>;
  }

  updateDoc(id: number, doc: any) {
    return this.client.put(this.repoPath(`/docs/${id}`), doc) as Promise<any>;
  }

  async getDoc(id: number | string) {
    const { data } = await this.client.get(this.repoPath(`/docs/${id}?raw=1`));
    return data.data;
  }

  async getDocs() {
    const { data } = await this.client.get(this.repoPath('/docs'));
    return data.data;
  }

  updateRepo(repo: any) {
    this.client.put(this.repoPath('/'), repo);
  }

  async getRepo() {
    const { data } = await this.client.get(this.repoPath('/'));
    return data.data;
  }

  async getRepoToc() {
    const { data } = await this.client.get(this.repoPath('/toc'));
    return data.data;
  }

  async getRepos() {
    const { data } = await this.client.get(`/users/${this.user.id}/repos`);
    return data.data;
  }

  async getUser() {
    const { data } = await this.client.get('/user');
    return data.data;
  }
}
