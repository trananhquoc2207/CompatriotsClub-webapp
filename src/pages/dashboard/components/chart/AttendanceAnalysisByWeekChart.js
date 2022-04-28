import React, { useState, useEffect, useMemo, useCallback, forwardRef } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import dayJS from 'dayjs';

import { Button } from 'reactstrap';
import ReactEcharts from 'echarts-for-react';
import Loader from 'components/Loader';
import { WeekPicker } from 'components/date-picker';

import { useDispatch, useSelector } from 'react-redux';
import { getDaysOfWeek } from 'utils/helpers';
import { getAttendanceAnalysisByWeek, setAttendanceHistoryFilter } from 'pages/attendance/actions/attendance';
import { ATTENDANCE_STATUS } from 'pages/attendance/utils/contants';

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
  const [filter, setFilter] = useState({});
  const defaultTime = getDaysOfWeek(new Date());
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    attendanceAnalysisByWeek,
    getAttendanceAnalysisByWeekLoading,
  } = useSelector((state) => state.attendance);

  const data = useMemo(() => Object.keys(ATTENDANCE_STATUS).reduce((array, status, index) =>
    (attendanceAnalysisByWeek || []).reduce((_array, { statuses }, jndex) => {
      const found = (statuses || []).find((s) => s.status == status);
      // eslint-disable-next-line no-param-reassign
      _array[index].data[jndex] = found?.count ?? 0;
      return _array;
    }, array), Object.keys(ATTENDANCE_STATUS).map((key, jndex) => ({
      key: jndex,
      label: ATTENDANCE_STATUS[key].label,
      color: ATTENDANCE_STATUS[key].color,
      data: Array(7),
    })),
  ), [attendanceAnalysisByWeek]);

  const options = useMemo(() => ({
    grid: {
      top: 60,
      bottom: 20,
      left: 36,
      right: 8,
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {},
    xAxis: {
      type: 'category',
      data: getDaysOfWeek(filter?.TuNgay ? new Date(filter.TuNgay) : new Date()).map((d) => dayJS(d).format('DD/MM/YYYY')),
    },
    yAxis: {
      type: 'value',
    },
    color: data.map(({ color }) => color),
    series: data.map(({ key, label, data: _data }) => {
      const week = getDaysOfWeek(filter?.TuNgay ? new Date(filter.TuNgay) : new Date());
      return {
        type: 'line',
        name: label,
        smooth: true,
        data: _data.map((d, i) => ({
          key,
          value: d,
          date: week[i],
        })),
      };
    }),
  }), [data]);

  const handleClick = ({ data }) => {
    dispatch(setAttendanceHistoryFilter({
      trangthai: data.key,
      Ngay: data.date.toISOString().split('T')[0],
    }));
    history.push('/attendance/history');
  };

  const getAnalysisByWeek = useCallback(() => {
    if (filter?.TuNgay) {
      dispatch(getAttendanceAnalysisByWeek(filter));
    }
  }, [dispatch, filter]);
  useEffect(getAnalysisByWeek, [getAnalysisByWeek]);
  useEffect(() => {
    console.log(data);
  }, [data]);
  const WeekPickerButton = forwardRef((props, ref) => {
    const {
      value,
      ...rest
    } = props;
    const render = (d) => {
      const date = d !== '' ? new Date(d) : new Date();
      const week = getDaysOfWeek(date);
      // setFilter({ TuNgay: dayJS(week[0]).format('YYYY-MM-DD'), DenNgay: dayJS(week[6]).format('YYYY-MM-DD') });
      return (
        <>
          <span className="from">{dayJS(week[0]).format('DD-MM-YYYY')}</span>
          <i className="bx bx-right-arrow-alt" />
          <span className="to">{dayJS(week[6]).format('DD-MM-YYYY')}</span>
        </>
      );
    };
    return (
      <StyledButton innerRef={ref} {...rest}>
        {value && render(value)}
        {!value && 'Thời gian'}
      </StyledButton>
    );
  });

  return (
    <Wrapper>
      <Loader inverted active={getAttendanceAnalysisByWeekLoading} />
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
              value={new Date(filter?.TuNgay ?? new Date())}
              customInput={<WeekPickerButton />}
              onChange={(f, t) => setFilter({ TuNgay: f, DenNgay: t })}
            />
            <Button color="primary" className="btn" onClick={() => setFilter({ TuNgay: moment(defaultTime[0]).format('YYYY-MM-DD'), DenNgay: moment(defaultTime[6]).format('YYYY-MM-DD') })}>Tuần này</Button>
          </div>
          <ReactEcharts
            option={options}
            style={{ minHeight: '355px' }}
            onEvents={{ click: handleClick }}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default AttendanceAnalysisByWeekChart;
