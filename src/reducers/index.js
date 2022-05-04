import global from 'reducers/global';
import dashboard from 'pages/dashboard/reducers/dashboard';
import employee from 'pages/employee/reducers/employee';
import department from 'pages/setting/department/reducers/department';
import role from 'pages/user-permission/role/reducers/Role';
import permission from 'pages/user-permission/permission/reducers/Permission';
import user from 'pages/user-permission/user/reducers/user';
import contact from 'pages/contact/reducers/contact';
export default {
  global,
  dashboard,
  employee,
  department,
  role,
  permission,
  user,
  contact
};
