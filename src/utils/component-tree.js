/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import i18n from 'i18n';

import { Link } from 'react-router-dom';

const GroupKey = {
  DASHBOARD: 'DASHBOARD',
  STATISTIC: 'STATISTIC',
  COMPANY_MANAGEMENT: 'COMPANY_MANAGEMENT',
  MEMBER_MANAGEMENT: 'MEMBER_MANAGEMENT',
  PERMISSION_MANAGEMENT: 'PERMISSION_MANAGEMENT',

  // EMPLOYEE_DETAIL: 'EMPLOYEE_DETAIL',
  // TIME_OFF_DETAIL: 'TIME_OFF_DETAIL',
  // DEDUCTION_DETAIL: 'DEDUCTION_DETAIL',
  // SALARY_DETAIL: 'SALARY_DETAIL',
};

const componentTree = [
  {
    index: 0,
    code: GroupKey.DASHBOARD,
    component: (
      <>
        <Link to="/dashboard">
          <i className="bx bx-home" />
          {' '}
          <span>{i18n.t('Dashboard')}</span>
        </Link>
      </>
    ),
  },
  {
    index: 1,
    code: GroupKey.STATISTIC,
    component: (
      <>
        <Link to="/#" className="has-arrow waves-effect">
          <i className="bx bx-chart" />&nbsp;<span>{i18n.t('Thống kê')}</span>
        </Link>
        <ul className="sub-menu" aria-expanded="false">
          <li><Link to="">{i18n.t('Bài viết')}</Link></li>
          <li><Link to="">{i18n.t('Tương tác')}</Link></li>
        </ul>
      </>
    ),

  },
  {
    index: 3,
    code: GroupKey.MEMBER_MANAGEMENT,
    component: (
      <>
        <Link to="/#" className="has-arrow waves-effect">
          <i className="bx bx-user" />&nbsp;<span>{i18n.t('Personnel management')}</span>
        </Link>
        <ul className="sub-menu" aria-expanded="false">
          <li><Link to="/member">Hội viên</Link></li>
          <li><Link to="/family">Gia đình</Link></li>
          <li><Link to="/management/contract/list">Hội</Link></li>
          <li><Link to="/contact">Ban Liên lạc</Link></li>
        </ul>
      </>
    ),
  },
  {
    index: 13,
    code: GroupKey.PERMISSION_MANAGEMENT,
    component: (
      <>
        <Link to="/#" className="has-arrow waves-effect">
          <i className="bx bx-cog" />&nbsp;<span>Phân quyền</span>
        </Link>
        <ul className="sub-menu" aria-expanded="false">
          <li><Link to="/role">Vai trò</Link></li>
          <li><Link to="/permission">Quyền chức năng</Link></li>
          <li><Link to="/permission">Quản lý tài khoản</Link></li>
        </ul>
      </>
    ),
  },
];

export { GroupKey, componentTree };
