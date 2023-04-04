//ADD .xls file to this folder and rename to report.xls
/* eslint-disable @typescript-eslint/no-var-requires */
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const excelFilePath = './src/research/get-statement/report.xls';

const result = excelToJson({
  sourceFile: excelFilePath,
});
async function saveExcelJson() {
  const newArray = result[Object.keys(result)[0]]
    .slice(15, result[Object.keys(result)[0]].length)
    .map((obj) => ({
      time:
        Date.parse(obj.A.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')) /
        1000,
      description: obj.B,
      mcc: parseInt(obj.C),
      originalMcc: parseInt(obj.C),
      amount: -obj.D,
      operationAmount: -obj.D,
      currencyCode: parseInt(obj.F),
      commissionRate: 0,
      cashbackAmount: obj.J / 100,
      balance: obj.E,
      hold: false,
    }))
    .sort((a, b) => a.time - b.time);
  const convertedData = JSON.stringify(newArray);
  console.log('Xls count: ', newArray.length);
  const filePath = `${__dirname}/../data/convertedExcel.json`;
  fs.writeFile(filePath, convertedData, (err) => {
    if (err) {
      console.error(`Error saving file ${filePath}:`, err);
    } else {
      console.log(`File saved at ${filePath}`);
    }
  });
}
saveExcelJson();
