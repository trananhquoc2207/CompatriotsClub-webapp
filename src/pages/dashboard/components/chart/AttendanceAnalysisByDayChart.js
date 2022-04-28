import React, { useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import dayJS from 'dayjs';

import ReactEcharts from 'echarts-for-react';
import Loader from 'components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getAttendanceAnalysisByDay, setAttendanceHistoryFilter } from 'pages/attendance/actions/attendance';
import { ATTENDANCE_STATUS } from 'pages/attendance/utils/contants';

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
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    attendanceAnalysisByDay,
    getAttendanceAnalysisByDayLoading,
  } = useSelector((state) => state.attendance);

  const data = useMemo(() =>
    (attendanceAnalysisByDay?.statuses ?? []).reduce((array, { status, count }) => {
      if (ATTENDANCE_STATUS[status]) {
        return [...array, {
          key: status,
          value: count,
          name: ATTENDANCE_STATUS[status].label,
          color: ATTENDANCE_STATUS[status].color,
        }];
      }
      return array;
    }, []),
    [attendanceAnalysisByDay]);
  const options = useMemo(() => ({
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'horizontal',
      left: 'right',
      bottom: '-30',
    },
    color: data.map((a) => a.color),
    series: [{
      id: 'attendance_analysis_today',
      type: 'pie',
      radius: '65%',
      center: ['50%', '45%'],
      emphasis: {
        focus: 'data',
      },
      animation: false,
      label: {
        formatter: '{d}%',
      },
      data,
    }],
  }), [data]);

  const handleClick = ({ data }) => {
    dispatch(setAttendanceHistoryFilter({
      trangthai: data.key,
      Ngay: new Date().toISOString().split('T')[0],
    }));
    history.push('/attendance/history');
  };

  const getAnalysisToday = useCallback(() => {
    dispatch(getAttendanceAnalysisByDay({
      TuNgay: dayJS().format('YYYY-MM-DD'),
      DenNgay: dayJS().format('YYYY-MM-DD'),
    }));
  }, [dispatch]);
  useEffect(getAnalysisToday, [getAnalysisToday]);

  return (
    <Wrapper>
      <Loader inverted active={getAttendanceAnalysisByDayLoading} />
      <div className="wrapper">
        <div className="header">
          <div className="title">
            Thống kê chấm công hôm nay
          </div>
        </div>
        <div className="body">
          <ReactEcharts
            option={options}
            style={{ height: '400px' }}
            onEvents={{ click: handleClick }}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default AttendanceAnalysisByDayChart;
