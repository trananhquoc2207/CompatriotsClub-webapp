import React from 'react';
import { Redirect } from 'react-router-dom';
import { TOKEN } from 'utils/contants';

import LoginPage from 'pages/authentication/LoginPage';
import Logout from 'pages/authentication/Logout';
import ForgetPassword from 'pages/authentication/ForgetPassword';
import ResetPassword from 'pages/authentication/ResetPassword';
import DevelopmentPage from 'pages/utility/DevelopmentPage';
import NotFoundPage from 'pages/utility/NotFoundPage';

// Dashboard
import Dashboard from 'pages/dashboard/pages';

// Employee
import Employee from 'pages/employee/pages/EmployeesPage';
import EmployeeDetails from 'pages/employee/pages/EmployeeDetailsPage';
import KPIPage from 'pages/kpi/pages/KPIPage';
import KPIDetailsPage from 'pages/kpi/pages/KPIDetailPage';

// Contract
import Contract from 'pages/contract/List';
import ContractWarning from 'pages/contract/Warning';

// Task
import ProjectsPage from 'pages/task-management/project';
import TaskPage from 'pages/task-management/task';

// Salary
import Salary from 'pages/salary';

// Attendance
import AttendancesPage from 'pages/attendance/pages/AttendancesPage';
import AttendanceDetailsPage from 'pages/attendance/pages/AttendanceDetailPage';
import AttendancesHistoryPage from 'pages/attendance/pages/AttendancesHistoryPage';

// Time off
import TimeOff from 'pages/time-off';

// Deduction
import Deduction from 'pages/deduction';

// Shift management
import ShiftManagement from 'pages/schedule/pages/SchedulePage';

// Manternity
import Manternity from 'pages/manternity';

//Family
import Family from 'pages/family/pages/FamilyPage';
import FamilyDetails from 'pages/family/pages/FamilyDetailsPage';

// Setting
import SettingInsurance from 'pages/setting/Insurance';
import SettingCertificate from 'pages/setting/Certificate';
import SettingContractType from 'pages/setting/ContractType';
import SettingBranch from 'pages/setting/Branch';
import SettingPosition from 'pages/setting/Position';
import SettingProduct from 'pages/setting/Product';
import SettingShift from 'pages/setting/shift/page';
import SettingAccount from 'pages/setting/Account';

import SettingRecorder from 'pages/setting/Recorder';
import SettingChangePassword from 'pages/setting/ChangePassword';
import KioskPage from 'pages/kiosk/pages/KioskPage';
import UnitPage from 'pages/unit/pages/UnitPage';
import SettingRatedTemperature from 'pages/setting/rated-temperature/pages/RatedTemperaturePage';
// task-management
// import ProjectsPage from 'pages/TaskManagement/Project';

// Statistic
import ShiftGroupPage from 'pages/ShiftGroup/pages/ShiftGroupPage';
import ShiftGroupEmployee from 'pages/ShiftGroup/pages/ShiftGroupEmployee';
import OverBodyTemperaturePage from 'pages/statistic/temperature/pages/OverBodyTemperaturePage';
import TimeOffStatisticPage from 'pages/statistic/time-off/pages/TimeOffStatisticPage';
import MealStatisticPage from 'pages/statistic/meal/pages/MealStatisticPage';
import ManagerShiftRegisterMeal from 'pages/statistic/meal/pages/ManagerShiftRegisterMeal';
import DiligencePage from 'pages/statistic/diligence/page/Diligence';
import AttendanceAdditionalReasonPage from 'pages/attendance/pages/AttendanceAdditionalReason';
import RolePage from 'pages/user-permission/role/pages/RolePage';
import PermissionPage from 'pages/user-permission/permission/pages/PermissionPage';
import RoleDetailPage from 'pages/user-permission/role/pages/RoleDetailPage';
import { GroupKey } from 'utils/component-tree';
import TimeOffTypePage from 'pages/setting/time-off-type/pages/TimeOffTypePage';

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
    path: '/kpi',
    component: KPIPage,
    title: 'Employee KPI',
  },
  {
    exact: true,
    path: '/kpi/:id',
    component: KPIDetailsPage,
    title: 'Employee KPI details',
  },
  {
    exact: true,
    path: '/attendance',
    component: AttendancesPage,
    title: 'Bảng chấm công',
  },
  {
    exact: true,
    path: '/attendance/history',
    component: AttendancesHistoryPage,
    title: 'Lịch sử chấm công',
  },
  {
    exact: true,
    path: '/attendance/:id',
    component: AttendanceDetailsPage,
    title: 'Bảng chấm công chi tiết',
  },
  {
    exact: true,
    path: '/family',
    component: Family,
    title: 'Employee list',
  },
  {
    exact: true,
    path: '/family/:id',
    component: FamilyDetails,
    title: 'Employee details',
  },

  // Contract
  { path: '/management/contract/warning', component: ContractWarning, title: 'Contract warning' },
  { path: '/management/contract/list', component: Contract, title: 'Contract list' },

  {
    path: '/salary',
    component: isDevelopment ? Salary : DevelopmentPage,
    title: 'Salary',
  },
  {
    path: '/schedule',
    component: ShiftManagement,
    title: 'Quản lý lịch làm việc',
  },
  {
    path: '/shift-group',
    component: ShiftGroupPage,
    title: 'Nhóm đi ca',
  },
  {
    exact: true,
    path: '/group/:id',
    component: ShiftGroupEmployee,
    title: 'Danh sách nhân viên nhóm đi ca',
  },
  // Task management
  { path: '/management/project/list', component: ProjectsPage, title: 'Project' },
  { path: '/management/project/view', component: TaskPage, title: 'Task' },

  // Time off
  {
    exact: true,
    path: '/management/time-off',
    component: TimeOff,
    title: 'Time off',
  },
  {
    path: '/management/time-off/:idNhanVien',
    component: TimeOff,
    title: 'Time off',
  },

  // Deduction
  { path: '/management/deduction', component: Deduction, title: 'Deduction' },

  // Manternity
  { path: '/management/manternity', component: Manternity, title: 'Manternity' },

  // Setting

  // Setting Insurance
  { path: '/management/insurance', component: SettingInsurance, title: 'Setting insurance' },

  // Setting Certificate
  { path: '/management/certificate', component: SettingCertificate, title: 'Setting certificate' },

  // Setting Contract Type
  { path: '/management/contract-type', component: SettingContractType, title: 'Setting contract type' },

  // Setting Branch
  { path: '/management/branch', component: SettingBranch, title: 'Setting branch' },

  // Setting Department
  { path: '/management/unit', component: UnitPage, title: 'Unit management' },

  // Setting Position
  { path: '/management/position', component: SettingPosition, title: 'Setting position' },

  // Setting Product
  { path: '/management/product', component: SettingProduct, title: 'Setting product' },

  // Setting Shift
  { path: '/management/shift', component: SettingShift, title: 'Setting shift' },

  // Setting rated-temperature
  { path: '/management/rated-temperature', component: SettingRatedTemperature, title: 'Setting Rated Temperature' },

  // Time Recorder
  { path: '/management/recorder', component: SettingRecorder, title: 'Setting recorder' },

  // Setting Account
  { path: '/management/account', component: SettingAccount, title: 'Setting account' },

  // Statistic
  {
    path: '/statistic/time-off',
    component: TimeOffStatisticPage,
    title: 'Thống kê nghỉ vắng',
  },
  {
    path: '/statistic/meal',
    component: MealStatisticPage,
    title: 'Thống kê đặt cơm',
  },
  {
    path: '/statistic/manager-shift-register-meal',
    component: ManagerShiftRegisterMeal,
    title: 'Quản lý ca đăng ký cơm',
  },
  {
    path: '/statistic/diligence',
    component: DiligencePage,
    title: 'Thống kê chuyên cần, nhà trọ',
  },
  // Change Password
  { path: '/setting/change-password', component: SettingChangePassword, title: 'Change Password' },
  {
    path: '/unit',
    component: UnitPage,
    title: 'Quản lí đơn vị',
  },
  {
    exact: true,
    path: '/reason/time-off-type',
    component: TimeOffTypePage,
    title: 'Lý do xin nghỉ phép',
  },
  {
    exact: true,
    path: '/reason/attendance-additional',
    component: AttendanceAdditionalReasonPage,
    title: 'Lý do bổ sung giờ công',
  },

  {
    path: '/kiosk',
    component: KioskPage,
    title: 'Quản lí Kios',
  },
  {
    path: '/statistic/over-temperature',
    component: OverBodyTemperaturePage,
    title: 'Danh sách nhân viên có thân nhiệt vượt quy định',
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
