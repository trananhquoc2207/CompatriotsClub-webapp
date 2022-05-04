import React from 'react';
import { Redirect } from 'react-router-dom';
import { TOKEN } from 'utils/contants';

import LoginPage from 'pages/authentication/LoginPage';
import Logout from 'pages/authentication/Logout';
import ForgetPassword from 'pages/authentication/ForgetPassword';
import ResetPassword from 'pages/authentication/ResetPassword';
import NotFoundPage from 'pages/utility/NotFoundPage';

// Dashboard
import Dashboard from 'pages/dashboard/pages';

// Employee
import Employee from 'pages/employee/pages/EmployeesPage';
import EmployeeDetails from 'pages/employee/pages/EmployeeDetailsPage';

//Family
import Contact from 'pages/contact/pages/ContactPage';

//Role
import RolePage from 'pages/user-permission/role/pages/RolePage';
import PermissionPage from 'pages/user-permission/permission/pages/PermissionPage';
import RoleDetailPage from 'pages/user-permission/role/pages/RoleDetailPage';
import { GroupKey } from 'utils/component-tree';

const isDevelopment = process.env.NODE_ENV === 'development';

const userRoutes = [
  {
    path: '/dashboard',
    component: Dashboard,
    title: 'Dashboard',
  },
  {
    exact: true,
    path: '/employee',
    component: Employee,
    title: 'Employee list',
  },
  {
    exact: true,
    path: '/employee/:id',
    component: EmployeeDetails,
    title: 'Employee details',
  },

  {
    exact: true,
    path: '/contact',
    component: Contact,
    title: 'Contact list',
  },
  // user-permission
  {
    path: '/role',
    component: RolePage,
    title: 'Vai trò',
  },
  {
    exact: true,
    path: '/role-detail/:id',
    component: RoleDetailPage,
    title: 'Chi tiết vai trò',
  },
  {
    path: '/permission',
    component: PermissionPage,
    title: 'Quyền',
  },
  {
    path: '*',
    component: (props) => {
      const token = JSON.parse(localStorage.getItem(TOKEN));
      if (props.location.pathname === '/') {
        if ((token?.permissionList ?? []).includes(GroupKey.EMPLOYEE_DETAIL)) {
          return <Redirect to={`/employee/${token?.idNhanVien ?? ''}`} />;
        }
        return <Redirect to="/dashboard" />;
      }
      return <Redirect to="/not-found" />;
    },
  },
];

const authRoutes = [
  // Authentication
  { path: '/logout', component: Logout, title: 'Logout' },
  { path: '/login', component: LoginPage, title: 'Login' },
  { path: '/forget-password', component: ForgetPassword, title: 'Forget Password' },
  { path: '/reset-password', component: ResetPassword, title: 'Reset Password' },
  // Other page
  { path: '/not-found', component: NotFoundPage },
];

export { userRoutes, authRoutes };
