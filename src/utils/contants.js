const url = window.location.href;
const isDev =
  url.indexOf('systemkul') > -1 || process.env.NODE_ENV === 'development';

export const TOKEN = 'CompatriotsClub';
//export const API_URL = isDev ? 'https://api-vietthang.systemkul.com' : 'https://api-vietthang.titkulhr.com';
export const API_URL = 'https://localhost:7029';
export const PROJECT_NAME = 'Compatriots Club';
export const PROJECT_DESCRIPTION = '';
