import axios from 'axios';
export async function fetchData(
  from: number,
  to: number,
  idBank: string,
  account = 0,
): Promise<any> {
  const requestData = [];
  const monoUrl = 'https://api.monobank.ua/personal/statement';

  if (to - from > 2682000) {
    const data = {
      errorDescription:
        'Exceeded limit. The maximum time for which it is possible to receive an extract is 31 days + 1 hour (2682000 seconds).',
    };
    return data;
  }

  while (true) {
    console.log('requesting...');
    const reqUrl = `${monoUrl}/${account}/${from}/${to}`;
    let unknownErrCount = 5;
    try {
      const response = await axios(reqUrl, {
        method: 'GET',
        headers: {
          'X-Token': idBank,
        },
      });
      const data = await response.data;
      console.log('data fetched for current month: ', data.length);
      requestData.push(...data);
      if (data.length < 500) {
        break; // exit loop
      } else {
        to = requestData[requestData.length - 1].time; // set new from date
      }
    } catch (error) {
      const err = error.response;
      const errDescription = err.data.errorDescription;
      console.log('Error req: ', err.data);

      if (
        errDescription === "Unknown 'X-Token'" ||
        errDescription === 'invalid account'
      ) {
        return err;
      }

      if (errDescription === "Value field 'to' out of bounds") {
        return {
          errorDescription: errDescription,
          requestData: removeDuplicatesById(requestData),
        };
      }
      if (
        errDescription === "Unknown 'X-Token'" ||
        errDescription === 'invalid account'
      ) {
        return err;
      }

      if (errDescription === "Value field 'to' out of bounds") {
        return {
          errorDescription: errDescription,
          requestData: removeDuplicatesById(requestData),
        };
      }

      if (
        errDescription === 'Too many requests' ||
        errDescription === 'nirvana.datakit.client 502 html'
      ) {
        console.log(
          'Too many requests waiting 60s ' + 'to countinue fetching: ',
        );
        await new Promise((resolve) => setTimeout(resolve, 60000));
        continue; // try again
      } else {
        unknownErrCount--;
        if (unknownErrCount > 0) {
          await new Promise((resolve) => setTimeout(resolve, 60000));
          continue; // try again
        } else {
          break;
        }
      }
    }
  }

  return removeDuplicatesById(requestData);
}

//remove dublicates from array
function removeDuplicatesById(arr: any) {
  const uniqueArray: any = [];
  const ids: any = [];

  arr.forEach((obj: any) => {
    if (!ids.includes(obj.id)) {
      ids.push(obj.id);
      uniqueArray.push(obj);
    }
  });

  return uniqueArray;
}
export async function getDataForYear(
  token: string,
  account = 0,
  year: string,
  isFollow: boolean,
) {
  const data = [];

  const idBank = token; //Monobank token

  for (let i = 11; i >= 0; i--) {
    console.log('Month ', i);
    // Calculate start and end timestamps for the month
    const startOfMonth = new Date(`${year}-01-01T00:00:00`);
    startOfMonth.setMonth(i, 1);
    const endOfMonth = new Date(`${year}-01-31T23:59:59`);
    // endOfMonth.setMonth(i + 1, 0);
    endOfMonth.setMonth(i + 1, 0);
    console.log('startOfMonth', startOfMonth, 'endOfMonth', endOfMonth);
    // console.log(Date.parse(startOfMonth) / 1000, Date.parse(endOfMonth));
    const result = await fetchData(
      Date.parse(startOfMonth.toString()) / 1000,
      Date.parse(endOfMonth.toString()) / 1000,
      idBank,
      account,
    );
    if (result.errorDescription) {
      if (result.errorDescription === "Value field 'to' out of bounds") {
        data.push(...result.requestData);
        console.log('res.data count: ', data.length);
        return {
          errorDescription: result.errorDescription,
          requestData: data,
        };
      } else {
        return result;
      }
    } else {
      data.push(...result);

      if (isFollow) {
        await new Promise((resolve) => setTimeout(resolve, 60000));
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
  return data;
}

export function dateNow() {
  const now = new Date();
  const year = now.getFullYear().toString().substring(2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = `${hours}_${minutes}_${seconds}`;

  const dateTimeString = `${formattedDate}-${formattedTime}`;

  return dateTimeString;
}
