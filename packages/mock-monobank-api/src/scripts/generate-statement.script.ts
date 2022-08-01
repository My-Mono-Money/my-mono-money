import fs from 'fs';
import chance from 'chance';
import path from 'path';
import { subMonths, getUnixTime } from 'date-fns';
import mccCcodes from '../mcc-codes/mcc-codes.json';
import clientInfoData from '../api/client-info/client-info.data.json';

const PATH_TO_FILE = path.resolve(
  __dirname,
  '../api/statement/statement.data.json',
);

const uahCurrencyCode = 980;

const cardIssuedMonthsAgo = chance().natural({ min: 10, max: 30 });

const countTransactionInMonth = (countMonth) => {
  const result = [];

  for (let i = 0; i < countMonth; i++) {
    const i = chance().natural({ min: 3, max: 100 });
    result.push(i);
  }

  return result;
};

const generateTimestamp = (min, max) => {
  return chance().natural({
    min,
    max,
  });
};

const subMonth = () => {
  const result = subMonths(new Date(), cardIssuedMonthsAgo);
  return getUnixTime(result);
};

const getMccCode = () => {
  return Number(
    mccCcodes[chance().natural({ min: 0, max: mccCcodes.length - 1 })].mcc,
  );
};

const getAmount = () => {
  const plusOrMinus = chance().character({ pool: '-+' });
  const randomAmount = chance().natural({
    min: 1,
    max: clientInfoData.accounts[0].balance,
  });
  return Number(`${plusOrMinus}${randomAmount}`);
};

const generationSymbols = () => {
  return chance().string({
    length: 4,
    alpha: true,
    numeric: true,
    casing: 'upper',
  });
};

const generateNumberString = (length) => {
  return chance().string({
    length: length,
    numeric: true,
  });
};

const generateReceiptId = () => {
  return `${generationSymbols()}-${generationSymbols()}-${generationSymbols()}-${generationSymbols()}`;
};

const generateTransaction = () => {
  const amount = getAmount();
  const mcc = getMccCode();
  return {
    id: chance().string({ length: 16, alpha: true, numeric: true }),
    time: generateTimestamp(subMonth(), getUnixTime(new Date())),
    description: chance().sentence({
      words: chance().natural({ min: 1, max: 7 }),
    }),
    mcc: mcc,
    originalMcc: mcc,
    hold: chance().bool(),
    amount: amount,
    operationAmount: amount,
    currencyCode: uahCurrencyCode,
    commissionRate: 0,
    cashbackAmount: 0,
    comment: chance().sentence({ words: chance().natural({ min: 1, max: 3 }) }),
    receiptId: generateReceiptId(),
    invoiceId: `${generateNumberString(4)}.в.${generateNumberString(2)}`,
    counterEdrpou: `${generateNumberString(10)}`,
    counterIban: `UA${generateNumberString(27)}`,
  };
};

const generateStatement = (countTransaction, initialBalance) => {
  const statement = countTransaction
    .map((item) => Array.from({ length: item }, generateTransaction))
    .flat()
    .sort(function (a, b) {
      return b.time - a.time;
    });

  statement[0].balance = initialBalance;

  for (let i = 0; i < statement.length - 1; i++) {
    statement[i + 1].balance = statement[i].balance + statement[i].amount;
  }

  return statement;
};

const generateStatementForAllCards = () => ({
  statementsByCard: [
    {
      cardId: clientInfoData.accounts[0].id,
      items: generateStatement(
        countTransactionInMonth(cardIssuedMonthsAgo),
        clientInfoData.accounts[0].balance,
      ),
    },
    {
      cardId: clientInfoData.accounts[1].id,
      items: generateStatement(
        countTransactionInMonth(cardIssuedMonthsAgo),
        clientInfoData.accounts[1].balance,
      ),
    },
  ],
});

fs.writeFileSync(
  PATH_TO_FILE,
  JSON.stringify(generateStatementForAllCards(), null, 2),
);
