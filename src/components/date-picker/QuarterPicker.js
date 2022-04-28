import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import vi from 'date-fns/locale/vi';

const Wrapper = styled.div`
  & .react-datepicker__quarter-wrapper {
    display: flex;
    min-width: 120px;
  }
  & .react-datepicker__quarter-text {
    padding: 0.5rem 0.5rem;
    min-width: 80px;
  }
`;

const quarters = 'Quý 0_Quý 1_Quý 2_Quý 3_Quý 4'.split('_');
const months = 'Tháng 1_Tháng 2_Tháng 3_Tháng 4_Tháng 5_Tháng 6_Tháng 7_Tháng 8_Tháng 9_Tháng 10_Tháng 11_Tháng 12'.split('_');
const days = 'CN_T2_T3_T4_T5_T6_T7'.split('_');

const locale = {
  ...vi,
  localize: {
    ...vi.localize,
    quarter: n => quarters[n],
    month: n => months[n],
    day: n => days[n],
  },
}


const QuarterPicker = (props) => {
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
    if (typeof onChangeProps === 'function') {
      if (range) {
        onChangeProps(
          format ? `${d.getFullYear()}-${d.getMonth() + 1}-01` : new Date(d.getFullYear(), d.getMonth(), 1),
          format ? `${d.getFullYear()}-${d.getMonth() + 3}-${new Date(d.getFullYear(), d.getMonth() + 3, 0).getDate()}` : new Date(d.getFullYear(), d.getMonth() + 3, 0)
        );
      } else {
        onChangeProps(format ? `${d.getFullYear()}-${d.getMonth() + 1}-01` : d);
      }
    }
  }

  useEffect(() => {
    if (initial) {
      if (typeof onChangeProps === 'function') {
        const d = new Date();
        if (range) {
          onChangeProps(
            format ? `${d.getFullYear()}-${d.getMonth() + 1}-01` : new Date(d.getFullYear(), d.getMonth(), 1),
            format ? `${d.getFullYear()}-${d.getMonth() + 3}-${new Date(d.getFullYear(), d.getMonth() + 3, 0).getDate()}` : new Date(d.getFullYear(), d.getMonth() + 3, 0)
          )
        } else {
          onChangeProps(format ? `${d.getFullYear()}-${d.getMonth() + 1}-01` : d);
        }
      }
    }
  }, []);
  useEffect(() => {
    if (value?.getMonth() && typeof value.getMonth === 'function') {
      setSelectedValue(value);
    }
  }, [value]);

  return (
    <Wrapper>
      <DatePicker
        locale={locale}
        showQuarterYearPicker
        autoComplete="off"
        selected={selectedValue}
        onChange={(d) => onChange(d)}
        {...rest}
      />
    </Wrapper>
  );
};

QuarterPicker.defaultProps = {
  initial: false,
  format: false,
  range: false,
  value: new Date(),
  onChange: () => { },
};

QuarterPicker.propTypes = {
  initial: PropTypes.bool,
  format: PropTypes.bool,
  range: PropTypes.bool,
  value: PropTypes.shape(new Date()),
  onChange: PropTypes.func,
};


export default QuarterPicker;