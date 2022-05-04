import React, { useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import Media from 'pages/dashboard/components/Media';
import AttendanceAnalysisByDayChart from 'pages/dashboard/components/chart/AttendanceAnalysisByDayChart';
import AttendanceAnalysisByWeekChart from 'pages/dashboard/components/chart/AttendanceAnalysisByWeekChart';

import { useDispatch, useSelector } from 'react-redux';
import { getDashboards } from 'pages/dashboard/actions/dashboard';

const headers = [
  {
    title: 'Tổng thành viên',
    icon: 'body',
    accessor: 'tongSoNhanVien',
    route: '/management/employee/list',
  },
  {
    title: 'Các bài viết',
    icon: 'dock-top',
    accessor: '',
    route: '/management/time-off',
  },
]

const Dashboard = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { dashboard, getDashboardLoading } = useSelector((state) => state.dashboard);

  const nodeHeaderReport = useMemo(() => {
    return (
      <Row className="mb-3">
        {(headers || []).map((o, i) => (
          <Col xs="3" key={`header_report_${i}`}>
            <Media
              loading={getDashboardLoading}
              icon={o.icon}
              title={o.title}
              data={dashboard[o.accessor] || 0}
              onClick={() => history.push(o.route)}
            />
          </Col>
        ))}
      </Row>
    );
  }, [dashboard, getDashboardLoading]);

  const getData = useCallback(() => {
    dispatch(getDashboards());
  }, [dispatch]);
  useEffect(getData, [getData]);

  return (
    <div className="page-content">
      <Container fluid>
        {nodeHeaderReport}
        <Row className="mb-3">
          <Col xs="4">
            <AttendanceAnalysisByDayChart />
          </Col>
          <Col xs="8">
            <AttendanceAnalysisByWeekChart />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;