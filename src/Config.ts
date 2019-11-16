import { safeLoad } from 'js-yaml';
import { join } from './path';
import { readFileSync } from 'fs';
import slash from 'slash2';

export interface IConfig {
  pattern: string;
  ignore: string;
  repo: string;
  promote: boolean;
  summary: string;
  template:
    | boolean
    | {
        variables: { [key: string]: any };
      };
}

export type UserConfig = IConfig;

export function load() {
  const defaultConfig: Partial<IConfig> = {
    pattern: '**/*.md',
    ignore: 'node_modules/**/*',
    summary: 'summary.md',
    promote: true,
    template: false,
  };

  let userConfig = safeLoad(readFileSync(join(process.cwd(), 'yuque.yml'), 'utf8')) as UserConfig;

  const config = { ...defaultConfig, ...userConfig };

  return config;
}
