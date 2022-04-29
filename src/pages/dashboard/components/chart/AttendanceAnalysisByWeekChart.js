import React, { useState, useEffect, useMemo, useCallback, forwardRef } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import dayJS from 'dayjs';

import { Button } from 'reactstrap';
import ReactEcharts from 'echarts-for-react';
import Loader from 'components/Loader';
import { WeekPicker } from 'components/date-picker';


const Wrapper = styled.div`
  position: relative;
  & .content {
    margin-top: 0 !important;
  }
  & .wrapper {
    min-height: 330px;
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
      margin-right: 40px;
    }
  }
  & .body {
    & .echarts-for-react {
      max-height: 270px;
    }
    & .btn {
      max-height: 30px;
      margin-left: 10px;
      margin-top: auto !important; 
      margin-bottom: auto !important;
      padding-top: .3em !important;
    }
  }
`;
const StyledButton = styled(Button)`
  padding: 4px 10px !important;
  background-color: inherit !important;
  color: black !important;
  font-weight: 600;
  & i {
    position: absolute;
    top: 4px;
    font-size: 20px;
  }
  & .from {
    margin-right: 5px;
  }
  & .to {
    margin-left: 25px;
  }
`;
const AttendanceAnalysisByWeekChart = () => {
  return (
    <Wrapper>
      <Loader />
      <div className="wrapper">
        <div className="header">
          <div className="title">
            Thống kê chấm công theo tuần
          </div>
        </div>
        <div className="body">
          <div className="my-2 d-flex">
            <WeekPicker
              initial
              range
              format
              maxDate={new Date()}
            />
            <Button color="primary" className="btn">Tuần này</Button>
          </div>
          {/* <ReactEcharts
            style={{ minHeight: '355px' }}
          /> */}
        </div>
      </div>
    </Wrapper>
  );
};

export default AttendanceAnalysisByWeekChart;
