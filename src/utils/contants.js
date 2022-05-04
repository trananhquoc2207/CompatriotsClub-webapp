const url = window.location.href;
const isDev =
  url.indexOf('systemkul') > -1 || process.env.NODE_ENV === 'development';

export const TOKEN = 'CompatriotsClub';
//export const API_URL = isDev ? 'https://api-vietthang.systemkul.com' : 'https://api-vietthang.titkulhr.com';
export const API_URL = 'https://localhost:7029';
export const PROJECT_NAME = 'Compatriots Club';
export const PROJECT_DESCRIPTION = '';

export const EMPLOYEE_POST_BY_LEADER_STATUSES = [
  {
    color: '#6c757d',
    label: 'Chưa xác nhận',
  },
  {
    color: '#28a745',
    label: 'Đã xác nhận',
  },
];

export const RICE_TYPES = [
  'Cơm mặn',
  'Cơm chay',
];

export const RICE_TYPES_LIST = [
  {
    color: '#c8902b',
    label: 'Cơm mặn',
    value: 0,
  },
  {
    color: '#6bbc46',
    label: 'Cơm chay',
    value: 1,
  },
];
export const SHIFT_DETAIL_TYPES = [
  {
    label: 'Đang làm',
    color: '0',
    value: 0,
  },
  {
    label: 'Nghỉ ngắn',
    color: '1',
    value: 1,
  },
  {
    label: 'Nghỉ dài',
    color: '2',
    value: 2,
  },
  {
    label: 'Thêm giờ',
    color: '3',
    value: 3,
  },
];

export const HOUR_LIMITED_BY_FACTORS = [
  {
    label: '1.0',
    value: 1.0,
  },
  {
    label: '1.3',
    value: 1.3,
  },
  {
    label: '1.5',
    value: 1.5,
  },
  {
    label: '2.0',
    value: 2.0,
  },
  {
    label: '2.7',
    value: 2.7,
  },
  {
    label: '3.0',
    value: 3.0,
  },
  {
    label: '3.9',
    value: 3.9,
  },
];
export const SHIFT_TYPES = [
  {
    label: 'Ca bình thường',
    value: 0,
  },
  {
    label: 'Ca đêm',
    value: 1,
  },
  {
    label: 'Tăng ca',
    value: 2,
  },
];
