import React, { useState, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dayJS from 'dayjs';

import {
  ButtonGroup, ButtonDropdown, Button,
  DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import {
  WeekPicker,
  MonthPicker,
  QuarterPicker,
  YearPicker,
} from 'components/date-picker';

import { useDispatch } from 'react-redux';
import { setKpiDetailFilter } from 'pages/kpi/actions/kpi';
import { getDaysOfWeek } from 'utils/helpers';

const StyledButtonGroup = styled(ButtonGroup)`
  & .btn {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.2;
    text-align: left;
  }
  & .dropdown-item {
    font-size: 15px;
  }
  & .button__date-picker {
    background-color: inherit !important;
    color: black !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    & i {
      position: absolute;
      top: 7px;
      font-size: 20px;
    }
    & .from {
      margin-right: 5px;
    }
    & .to {
      margin-left: 25px;
    }
  }
`;

const quarters = 'Quý 0_Quý 1_Quý 2_Quý 3_Quý 4'.split('_');

const KPIDetailsFilter = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filter, setFilter] = useState({
    time: new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
    picker: 0,
  });

  const dispatch = useDispatch();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const onChange = (object) => {
    const merge = { ...filter, ...object };
    const payload =
      Object
        .keys(merge)
        .reduce((result, key) => {
          if (merge[key]) {
            // eslint-disable-next-line no-param-reassign
            result[key] = merge[key];
          }
          return result;
        }, {});
    setFilter(payload);
    dispatch(setKpiDetailFilter(payload));
  };

  const DatePickerButton = forwardRef((props, ref) => {
    const {
      value,
      isWeek,
      isMonth,
      isQuarter,
      isYear,
      ...rest
    } = props;
    const render = (d) => {
      if (isWeek) {
        const date = d !== '' ? new Date(d) : new Date();
        const week = getDaysOfWeek(date);
        return (
          <>
            <span className="from">{dayJS(week[0]).format('DD-MM-YYYY')}</span>
            <i className="bx bx-right-arrow-alt" />
            <span className="to">{dayJS(week[6]).format('DD-MM-YYYY')}</span>
          </>
        );
      } if (isMonth) {
        const date = d !== '' ? new Date(d) : new Date();
        return `Tháng ${date.getMonth() + 1} - Năm ${date.getFullYear()}`;
      } if (isQuarter) {
        const date = d !== '' ? new Date(d) : new Date();
        return `${quarters[Math.floor((date.getMonth() + 3) / 3)]} - Năm ${date.getFullYear()}`;
      } if (isYear) {
        const date = d !== '' ? new Date(d) : new Date();
        return `Năm ${date.getFullYear()}`;
      }
      return d;
    };

    return (
      <Button
        innerRef={ref}
        {...rest}
        className="button__date-picker"
      >
        {value && render(value)}
        {!value && 'Thời gian'}
      </Button>
    );
  });

  const options = useMemo(() => ([
    {
      label: 'Theo tuần',
      component: (
        <WeekPicker
          range
          format
          customInput={<DatePickerButton isWeek />}
          onChange={(f) => onChange({ time: f })}
        />
      ),
    },
    {
      label: 'Theo tháng',
      component: (
        <MonthPicker
          range
          format
          customInput={<DatePickerButton isMonth />}
          onChange={(f) => onChange({ time: f })}
        />
      ),
    },
    {
      label: 'Theo quí',
      component: (
        <QuarterPicker
          range
          format
          customInput={<DatePickerButton isQuarter />}
          onChange={(f) => onChange({ time: f })}
        />
      ),
    },
    {
      label: 'Theo năm',
      component: (
        <YearPicker
          range
          format
          customInput={<DatePickerButton isYear />}
          onChange={(f) => onChange({ time: f })}
        />
      ),
    },
  ]), [filter]);

  return (
    <>
      <StyledButtonGroup>
        <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
          <DropdownToggle caret>
            {options[(filter?.picker ?? 0)].label}
          </DropdownToggle>
          <DropdownMenu>
            {(options || []).map((o, i) => (
              <DropdownItem key={`option_${i}`} onClick={() => onChange({ picker: i })}>{o?.label ?? ''}</DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
        {(options || []).find((_, i) => i === (filter?.picker ?? 0)).component}
      </StyledButtonGroup>

    </>

  );
};

KPIDetailsFilter.defaultType = {
  onChange: () => { },
};

KPIDetailsFilter.propTypes = {
  onChange: PropTypes.func,
};

export default KPIDetailsFilter;
