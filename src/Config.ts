import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { resolve } from 'path';

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

export function load(configFile: string) {
  const defaultConfig: Partial<IConfig> = {
    pattern: '**/*.md',
    ignore: 'node_modules/**/*',
    summary: 'summary.md',
    promote: true,
    template: false,
  };

  let userConfig = safeLoad(readFileSync(resolve(process.cwd(), configFile), 'utf8')) as UserConfig;

  const config = { ...defaultConfig, ...userConfig };

  return config;
}
