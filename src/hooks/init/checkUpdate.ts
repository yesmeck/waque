import {Hook} from '@oclif/config';
import Chalk from 'chalk';
import {spawn} from 'child_process';
import * as fs from 'fs-extra';
import * as semver from 'semver';
import * as path from '../../path';

const debug = require('debug')('update-check');

const hook: Hook<'init'> = async function ({config}) {
  const file = path.join(config.cacheDir, 'version');

  const checkVersion = async () => {
    try {
      const distTags = await fs.readJSON(file);
      if (config.version.includes('-')) {
        // TODO: handle channels
        return;
      }
      if (distTags && distTags.latest && semver.gt(distTags.latest.split('-')[0], config.version.split('-')[0])) {
        const chalk: typeof Chalk = require('chalk');
        this.log(`
发现新版本，运行 ${chalk.greenBright(`npm i ${config.name} -g`)} 更新瓦雀到最新版。
更新日志： https://www.yuque.com/waque/docs/changelog\n
`);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  };

  const refreshNeeded = async () => {
    try {
      const cfg = (config.pjson.oclif as any)['warn-if-update-available'] || {};
      const timeoutInDays = cfg.timeoutInDays || 0.5;
      const {mtime} = await fs.stat(file);
      const staleAt = new Date(mtime.valueOf() + 1000 * 60 * 60 * 24 * timeoutInDays);
      return staleAt < new Date();
    } catch (err) {
      debug(err);
      return true;
    }
  };

  const spawnRefresh = async () => {
    debug('spawning version refresh');
    spawn(
      process.execPath,
      [path.join(__dirname, '../../../lib/getVersion'), config.name!, file, config.version!, config.npmRegistry!],
      {
        detached: !config.windows,
        stdio: 'ignore',
      }
    ).unref();
  };

  await checkVersion();
  if (await refreshNeeded()) await spawnRefresh();
};

export default hook;
