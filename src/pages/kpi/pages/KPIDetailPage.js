import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import KPIDetailsFilter from 'pages/kpi/components/details/Filter';
import KPIDetailsChart from 'pages/kpi/components/details/Chart';

import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeDetails } from 'pages/employee/actions/employee';

const Wrapper = styled.div`
  position: relative;
  min-height: 400px;
  & .header {
    display: flex;
    margin-bottom: 10px;
    & .back {
      font-size: 20px;
      margin-right: 12px;
      & i {
        cursor: pointer;
        padding: 16px 0;
        line-height: none;
      }
    }
    & .title {
      font-size: 20px;
      font-weight: 700;
    }
    & .description {
      font-style: italic;
    }
  }
  & .filter {
    margin-bottom: 10px;
  }
`;

const KPIDetailsPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { employeeDetails } = useSelector((state) => state.employee);

  const handleRefresh = () => {
    dispatch(getEmployeeDetails(id));
  };
  useEffect(() => {
    if (id) {
      handleRefresh();
    }
  }, [id]);

  return (
    <div className="page-content">
      <Wrapper>
        <div className="header">
          {(history.location?.state?.from ?? '') === '/kpi' && (
            <div className="back" onClick={() => history.push('/kpi')}>
              <i className="bx bx-arrow-back" />
            </div>
          )}
          <div>
            <div className="title">Đánh giá KPI</div>
            <div className="description">
              Nhân viên
              {' '}
              {employeeDetails?.tenNV ?? ''}
            </div>
          </div>
        </div>
        <div className="filter">
          <KPIDetailsFilter />
        </div>
        <div className="body">
          <KPIDetailsChart />
        </div>
      </Wrapper>
    </div>
  );
};

export default KPIDetailsPage;
