import fs from 'fs';
import path from 'path';
import chance from 'chance';

const PATH_TO_FILE = path.resolve(
  __dirname,
  '../api/client-info/client-info.data.json',
);

const uahCurrencyCode = 980;

const generateNumberString = (length) => {
  return chance().string({
    length: length,
    numeric: true,
  });
};

fs.writeFileSync(
  PATH_TO_FILE,
  JSON.stringify(
    {
      clientId: chance().string({ length: 10, alpha: true, numeric: true }),
      name: chance().name(),
      webHookUrl: '',
      permissions: 'psfj',
      accounts: [
        {
          id: chance().string({ length: 22, alpha: true, numeric: true }),
          sendId: chance().string({ length: 10, alpha: true, numeric: true }),
          currencyCode: uahCurrencyCode,
          cashbackType: 'UAH',
          balance: chance().natural({ min: 100000, max: 1000000 }),
          creditLimit: 0,
          maskedPan: [
            `${chance().string({
              length: 6,
              numeric: true,
            })}******${chance().string({ length: 4, numeric: true })}`,
          ],
          type: 'white',
          iban: `UA${chance().string({ length: 27, numeric: true })}`,
        },
        {
          id: chance().string({ length: 22, alpha: true, numeric: true }),
          sendId: chance().string({ length: 10, alpha: true, numeric: true }),
          currencyCode: uahCurrencyCode,
          cashbackType: 'UAH',
          balance: chance().natural({ min: 100000, max: 10000000 }),
          creditLimit:
            Math.ceil(
              chance().natural({ min: 100000, max: 10000000 }) / 100000,
            ) * 100000,
          maskedPan: [
            `${generateNumberString(6)}******${generateNumberString(4)}`,
          ],
          type: 'black',
          iban: `UA${generateNumberString(27)}`,
        },
      ],
    },
    null,
    2,
  ),
);
