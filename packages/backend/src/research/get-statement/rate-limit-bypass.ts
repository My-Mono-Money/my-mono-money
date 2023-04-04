import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { getDataForYear, dateNow } from './formulas';
dotenv.config();

const tokenMono = process.env.MMM_TOKEN;
const accountId = +process.env.MMM_ACCOUNT_ID;
async function bypass(monobankToken: string, accountId = 0) {
  const filePathStatement = `${__dirname}/../data/bypass-statement-${dateNow()}.json`;
  const filePathReport = `${__dirname}/../data/bypass-report-${dateNow()}.json`;
  try {
    if (!fs.existsSync('../data/')) {
      fs.mkdirSync('../data/');
    }
    let currentYear = new Date().getFullYear();
    const yearsData = [];
    let estimatedTime = 8;
    let successful = false;
    let endTimestamp;

    const isFollow = false;

    const startDate = new Date();
    const startTimestamp = Math.floor(startDate.getTime() / 1000);

    while (true) {
      console.log(currentYear);

      const res = await getDataForYear(
        monobankToken,
        accountId,
        currentYear.toString(),
        isFollow,
      );
      console.log(`Loading... estimated waiting time: ${estimatedTime} min`);
      if (res.errorDescription) {
        if (res.errorDescription === "Value field 'to' out of bounds") {
          console.log(
            'Requests complited, fin part res count: ',
            res.requestData.length,
          );
          yearsData.push(...res.requestData);
          successful = true;
          const endDate = new Date();
          endTimestamp = Math.floor(endDate.getTime() / 1000);
          break;
        } else {
          console.log('error ', res.errorDescription);

          break;
        }
      }

      currentYear = currentYear - 1;
      estimatedTime = estimatedTime - 2 <= 0 ? 1 : estimatedTime - 2;

      yearsData.push(...res);
    }
    const jsonStatementData = JSON.stringify(
      yearsData.sort((a, b) => a.time - b.time),
    );
    fs.writeFile(filePathStatement, jsonStatementData, (err) => {
      if (err) {
        console.error(`Error saving file ${filePathStatement}:`, err);
      } else {
        console.log(`File saved at ${filePathStatement}`);
      }
    });

    const durationInSeconds = endTimestamp - startTimestamp;
    const durationInMs = durationInSeconds * 1000;
    const duration = new Date(durationInMs).toISOString().substr(11, 8);

    const jsonReportData = JSON.stringify({
      startTimestamp,
      endTimestamp,
      successful,
      duration,
    });
    fs.writeFile(filePathReport, jsonReportData, (err) => {
      if (err) {
        console.error(`Error saving file ${filePathReport}:`, err);
      } else {
        console.log(`File saved at ${filePathReport}`);
      }
    });
  } catch (err) {
    console.error(`Error fetch`, err);
  }
}

bypass(tokenMono, accountId);
