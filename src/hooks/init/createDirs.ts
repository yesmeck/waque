import { existsSync } from 'fs';
import * as mkdirp from 'mkdirp';

export default function (options: any) {
  if (!existsSync(options.config.cacheDir)) {
    mkdirp.sync(options.config.cacheDir);
  }
}
