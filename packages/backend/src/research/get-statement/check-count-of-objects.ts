import { readdirSync } from 'fs';
import { join } from 'path';

const files = readdirSync(`${__dirname}/../data`)
  .filter((file) => file.endsWith('.json'))
  .map((file) => require(join(`${__dirname}/../data`, file)));

function checkCounts() {
  console.log('bypass count: ' + files[1].length);
  console.log('Excel count: ' + files[2].length);
  console.log('follow count: ' + files[4].length);
  if (
    files[1].length === files[2].length &&
    files[2].length === files[4].length
  ) {
    console.log(
      'follow + bypass + xls, count the same. Count: ' + files[1].length,
    );
  }
}
checkCounts();
