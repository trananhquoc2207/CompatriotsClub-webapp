import i18n from 'i18n';
import toastr from 'toastr';

const defaultPaging = {
  data: [],
  totalCount: 0,
};

const notify = (type, message) => {
  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 2000,
    extendedTimeOut: 3000,
    closeButton: true,
    preventDuplicates: true
  }

  if (type === 'success')
    toastr.success(message, i18n.t('Success'));
  else if (type === 'info')
    toastr.info(message);
  else if (type === 'warning')
    toastr.warning(message);
  else if (type === 'danger')
    toastr.error(message, i18n.t('Failed'));
  else
    toastr.secondary(message);
};

const formatCurrency = (number, currency) => {
  return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + ' ' + currency;
}

const convertHourToSecond = (hms) => hms.split(':').reduce((total, time) => (total * 60) + (+time));

const getMondayofWeek = time => {
  const day = time.getDay();
  const difference = time.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(time.setDate(difference));
}

const getDaysOfWeek = time => {
  const current = getMondayofWeek(time);

  let days = [];
  for (let i = 1; i <= 7; i++) {
    let first = current.getDate() - current.getDay() + i;
    let day = new Date(current.setDate(first));
    days.push(day);
  }

  return days;
}

const sundaysInMonth = (day, month, year) => {
  let dayCounter = 1, counter = 0, date = new Date(year, month, dayCounter);
  while (date.getMonth() === month) {
    if (date.getDay() === 0)
      counter++;
    if (dayCounter >= day)
      break;
    dayCounter++; date = new Date(year, month, dayCounter);
  }
  return counter;
}

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0)
    return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export {
  defaultPaging,
  notify,
  formatCurrency,
  convertHourToSecond,
  getMondayofWeek,
  getDaysOfWeek,
  sundaysInMonth,
  formatBytes,
}