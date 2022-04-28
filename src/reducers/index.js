import global from 'reducers/global';
import dashboard from 'pages/dashboard/reducers/dashboard';
import employee from 'pages/employee/reducers/employee';
import kpi from 'pages/kpi/reducers/kpi';
import attendance from 'pages/attendance/reducers/attendance';
import schedule from 'pages/schedule/reducers/schedule';
import shiftGroup from 'pages/ShiftGroup/reducers/ShiftGroup';
import shift from 'pages/shift/reducers/shift';
import department from 'pages/setting/department/reducers/department';
import kiosk from 'pages/kiosk/reducers/kiosk';
import unit from 'pages/unit/reducers/unit';
import ratedTemperature from 'pages/setting/rated-temperature/reducers/temperature';
import statistic from 'pages/statistic/temperature/reducers/statistic';
import absentStatistic from 'pages/statistic/time-off/reducers/TimeOff';
import mealStatistic from 'pages/statistic/meal/reducers/meal';
import role from 'pages/user-permission/role/reducers/Role';
import permission from 'pages/user-permission/permission/reducers/Permission';
import user from 'pages/user-permission/user/reducers/user';
import timeOffType from 'pages/setting/time-off-type/reducers/TimeOffType';
import scheduleGroup from 'pages/schedule-group/reducers/schedule-group';

export default {
  global,
  dashboard,
  employee,
  kpi,
  attendance,
  schedule,
  shift,
  department,
  kiosk,
  unit,
  ratedTemperature,
  statistic,
  shiftGroup,
  absentStatistic,
  mealStatistic,
  role,
  permission,
  user,
  timeOffType,
  scheduleGroup,
};
