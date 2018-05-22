import * as fs from 'fs-extra';
import axios from 'axios';

async function run(name: string, file: string, version: string, registry: string) {
  await fs.outputJSON(file, {current: version}); // touch file with current version to prevent multiple updates
  const { data } = await axios.get(`${registry}/${name.replace('/', '%2f')}`, {timeout: 5000});
  await fs.outputJSON(file, {...data['dist-tags'], current: version});
  process.exit(0);
}

run(process.argv[2], process.argv[3], process.argv[4], process.argv[5])
.catch(require('@oclif/errors/handle'));
