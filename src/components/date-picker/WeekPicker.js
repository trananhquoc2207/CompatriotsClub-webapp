import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import vi from 'date-fns/locale/vi';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import moment from 'moment';

const getMondayofWeek = (time) => {
  const day = time.getDay();
  const difference = time.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(time.setDate(difference));
};

const getDaysOfWeek = (time) => {
  const current = getMondayofWeek(time);
  const days = [];
  for (let i = 1; i <= 7; i++) {
    const first = current.getDate() - current.getDay() + i;
    const day = new Date(current.setDate(first));
    days.push(day);
  }
  return days;
};

const Wrapper = styled.div`
  & .react-datepicker__week {
    &:hover {
      border-radius: 0.3rem;
      background-color: #f0f0f0;
    }
  }
`;

const months = 'Tháng 1_Tháng 2_Tháng 3_Tháng 4_Tháng 5_Tháng 6_Tháng 7_Tháng 8_Tháng 9_Tháng 10_Tháng 11_Tháng 12'.split('_');
const days = 'CN_T2_T3_T4_T5_T6_T7'.split('_');

const locale = {
  ...vi,
  localize: {
    ...vi.localize,
    month: (n) => months[n],
    day: (n) => days[n],
  },
};

const WeekPicker = (props) => {
  const {
    initial,
    format,
    range,
    value,
    onChange: onChangeProps,
    ...rest
  } = props;

  const [selectedValue, setSelectedValue] = useState(new Date());

  const onChange = (d) => {
    setSelectedValue(d);
    // const date = d !== '' ? new Date(d) : new Date();
    // const week = getDaysOfWeek(date);
    if (typeof onChangeProps === 'function') {
      const week = getDaysOfWeek(d);
      if (range) {
        onChangeProps(format ? moment(week[0]).format('YYYY-MM-DD') : week[0], format ? moment(week[6]).format('YYYY-MM-DD') : week[6]);
      } else {
        onChangeProps(format ? moment(week[0]).format('YYYY-MM-DD') : week[0]);
      }
    }
  };
  useEffect(() => {
    if (initial) {
      if (typeof onChangeProps === 'function') {
        const d = new Date();
        const week = getDaysOfWeek(d);
        if (range) {
          onChangeProps(format ? moment(week[0]).format('YYYY-MM-DD') : week[0], format ? moment(week[6]).format('YYYY-MM-DD') : week[6]);
        } else {
          onChangeProps(format ? moment(week[0]).format('YYYY-MM-DD') : week[0]);
        }
      }
    }
  }, []);
  useEffect(() => {
    if (value?.getMonth && typeof value.getMonth === 'function') {
      setSelectedValue(value);
    }
  }, [value]);

  return (
    <Wrapper>
      <DatePicker
        locale={locale}
        showWeekNumbers
        autoComplete="off"
        selected={selectedValue}
        onChange={(d) => onChange(d)}
        {...rest}
      />
    </Wrapper>
  );
};

WeekPicker.defaultProps = {
  initial: false,
  format: false,
  range: false,
  value: new Date(),
  onChange: () => { },
};

WeekPicker.propTypes = {
  initial: PropTypes.bool,
  format: PropTypes.bool,
  range: PropTypes.bool,
  value: PropTypes.shape(new Date()),
  onChange: PropTypes.func,
};

export default WeekPicker;
