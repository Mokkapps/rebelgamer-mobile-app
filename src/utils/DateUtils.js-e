// @flow

import moment from 'moment';

class DateUtils {
  static getPostedAtDateString(date: string): string {
    return this._getDateDifference(moment.utc(date));
  }

  static _getDateDifference(date: moment): string {
    const now = moment().utc();
    const days = now.diff(date, 'days');
    const hours = now.diff(date, 'hours');
    const minutes = now.diff(date, 'minutes');

    if (minutes < 60) {
      return 'Vor kurzem';
    } else if (hours < 24) {
      return hours === 1 ? 'Vor einer Stunde' : `Vor ${hours} Stunden`;
    } else if (days < 30) {
      return days === 1 ? 'Vor einem Tag' : `Vor ${days} Tagen`;
    }

    return `Am ${date.format('LL')}`;
  }
}

export default DateUtils;
