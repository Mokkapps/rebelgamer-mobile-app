// @flow

import moment from 'moment';

export default function getPostedAtDateString(date: string): string {
  const utcDate = moment.utc(date);
  const now = moment.utc();
  const days = now.diff(utcDate, 'days');
  const hours = now.diff(utcDate, 'hours');
  const minutes = now.diff(utcDate, 'minutes');

  if (minutes < 60) {
    return 'Vor kurzem';
  }

  if (hours < 24) {
    return hours === 1 ? 'Vor einer Stunde' : `Vor ${hours} Stunden`;
  }

  if (days < 30) {
    return days === 1 ? 'Vor einem Tag' : `Vor ${days} Tagen`;
  }

  return `Am ${utcDate.format('LL')}`;
}
