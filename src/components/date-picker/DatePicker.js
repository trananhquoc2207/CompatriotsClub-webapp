import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import vi from 'date-fns/locale/vi';

const Wrapper = styled.div`
  & .react-datepicker__month-wrapper {
    display: flex;
    min-width: 120px;
  }
  & .react-datepicker__month-text {
    padding: 0.5rem 0.5rem;
    min-width: 80px;
  }
`;

const months = 'Tháng 1_Tháng 2_Tháng 3_Tháng 4_Tháng 5_Tháng 6_Tháng 7_Tháng 8_Tháng 9_Tháng 10_Tháng 11_Tháng 12'.split('_');
const days = 'CN_T2_T3_T4_T5_T6_T7'.split('_');

const locale = {
  ...vi,
  localize: {
    ...vi.localize,
    month: n => months[n],
    day: n => days[n]
  },
}

const DatePickerRender = (props) => {
  const {
    initial,
    format,
    value,
    onChange: onChangeProps,
    ...rest
  } = props
  const [selectedValue, setSelectedValue] = useState(new Date());

  const onChange = (d) => {
    setSelectedValue(d);
    if (typeof onChangeProps === 'function') {
      onChangeProps(format ? `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` : d);
    }
  }

  useEffect(() => {
    if (value?.getMonth && typeof value.getMonth === 'function') {
      setSelectedValue(value);
    }
  }, [value]);
  useEffect(() => {
    if (initial) {
      const d = new Date();
      if (typeof onChangeProps === 'function') {
        onChangeProps(format ? `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` : d);
      }
    }
  }, []);

  return (
    <Wrapper>
      <DatePicker
        locale={locale}
        autoComplete="off"
        selected={selectedValue}
        onChange={(d) => onChange(d)}
        {...rest}
      />
    </Wrapper>
  )
};

DatePickerRender.defaultProps = {
  initial: false,
  format: false,
  value: new Date(),
  onChange: () => { },
};

DatePickerRender.propTypes = {
  initial: PropTypes.bool,
  format: PropTypes.bool,
  value: PropTypes.shape(new Date()),
  onChange: PropTypes.func,
};

export default DatePickerRender;