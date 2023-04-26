import { Typography } from '@mui/material';
import React from 'react';

const labels: Array<string> = [
  '1. Перейдіть на сайт api.monobank.ua',
  '2. Відкрийте застосунок monobank',
  '3. Перейдіть до розділу Ще та оберіть сканер QR - коду',
  '4. Відскануйте QR - код на сайті',
  '5. Підтвердіть авторизацію',
  '6. Скопіюйте токен з сайту та вставте в поле нижче',
  '7. Готово!',
];

const InstructionAddToken: React.FC = () => {
  return (
    <>
      {labels.map((label, i) => {
        return (
          <Typography key={i} variant="h5">
            {i === 0 ? (
              <>
                1. Перейдіть на сайт{' '}
                <a
                  href="https://api.monobank.ua"
                  target="_blank"
                  rel="noreferrer"
                >
                  api.monobank.ua
                </a>
              </>
            ) : (
              <>{label}</>
            )}
          </Typography>
        );
      })}
    </>
  );
};

export default InstructionAddToken;
