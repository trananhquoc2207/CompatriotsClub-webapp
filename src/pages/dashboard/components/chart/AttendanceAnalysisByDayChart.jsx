import styled from 'styled-components';
import Loader from 'components/Loader';
import React from 'react';
const Wrapper = styled.div`
  position: relative;
  & .content {
    margin-top: 0 !important;
  }
  & .wrapper {
    min-height: 361px;
  }
  & .header {
    display: flex;
    & .title {
      cursor: pointer;
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 16px;    
    }
    & .action {
      margin-left: auto;
    }
  }
`;

const AttendanceAnalysisByDayChart = () => {
  return (
    <Wrapper>
      <Loader  />
      <div className="wrapper">
        <div className="header">
          <div className="title">
            Thống kê thành viên truy cập
          </div>
        </div>
        {/* <div className="body">
          <ReactEcharts
            style={{ height: '400px' }}
          />
        </div> */}
      </div>
    </Wrapper>
  );
};

export default AttendanceAnalysisByDayChart;
