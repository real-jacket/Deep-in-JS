import { execSync } from 'child_process';
import path from 'path';

const paths = path.resolve();
const cwd = process.cwd();
const pkgs: any[] = [];

const { version: lernaVersion } = require('lerna/package.json');
const lernaMainVersion = Number(lernaVersion.split('.')[0]);
if (lernaMainVersion >= 3) {
  const lernaList = JSON.parse(
    execSync(`${path.join(cwd, 'node_modules/.bin/lerna')} ls --json --all`, {
      stdio: 'pipe',
      // fix: 修复windows环境下有多余输出导致JSON.parse报错的问题
    })
      .toString()
      .replace(/([\r\n]\])[^]*$/, '$1')
  );
  lernaList.forEach((pkg: any) => {
    pkgs.push([pkg.name, pkg.location]);
  });

  console.log('lernaList: ', lernaList);
} else if (require.resolve('lerna/lib/PackageUtilities', { paths: [cwd] })) {
  // reference: https://github.com/azz/lerna-get-packages/blob/master/index.js
  const PackageUtilities = require(require.resolve(
    'lerna/lib/PackageUtilities',
    {
      paths: [cwd],
    }
  ));
  const Repository = require(require.resolve('lerna/lib/Repository', {
    paths: [cwd],
  }));

  PackageUtilities.getPackages(new Repository(cwd)).forEach((pkg: any) => {
    pkgs.push([pkg._package.name, pkg._location]);
  });
}

console.log('pkgs:', pkgs);
