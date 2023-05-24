const fs = require('fs');

const rootPackageJson = JSON.parse(fs.readFileSync('root-package.json', 'utf8'));
const packageJson = JSON.parse(fs.readFileSync('main-package.json', 'utf8'));

packageJson.dependencies = { ...rootPackageJson.dependencies, ...packageJson.dependencies };

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));