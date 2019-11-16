import * as path from 'path';
import slash from 'slash2';

export function resolve(id: string) {
  return slash(path.resolve(id));
}

export function join(...segments: string[]) {
  return slash(path.join(...segments));
}

export const basename = path.basename;
