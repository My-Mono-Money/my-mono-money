export function dateNowForLogs() {
  const now = new Date();

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const day = now.getDate().toString().padStart(2, '0');
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const formattedDateTime = `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;

  return ' - ' + formattedDateTime + ' - ';
}
