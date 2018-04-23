// @flow

import moment from 'moment';

class DateUtils {
  static getPostedAtDateString(date: string): string {
    const utcDate = moment.utc(date);
    const now = moment.utc();
    const days = now.diff(utcDate, 'days');
    const hours = now.diff(utcDate, 'hours');
    const minutes = now.diff(utcDate, 'minutes');

    if (minutes < 60) {
      return 'Vor kurzem';
    } else if (hours < 24) {
      return hours === 1 ? 'Vor einer Stunde' : `Vor ${hours} Stunden`;
    } else if (days < 30) {
      return days === 1 ? 'Vor einem Tag' : `Vor ${days} Tagen`;
    }

    return `Am ${utcDate.format('LL')}`;
  }
}

export default DateUtils;
