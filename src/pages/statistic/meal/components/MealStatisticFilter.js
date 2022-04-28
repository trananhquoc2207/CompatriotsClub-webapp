/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import React, { useState, forwardRef } from 'react';
import styled from 'styled-components';
import dayJS from 'dayjs';
import {
  ButtonGroup,
  Row, Col, FormGroup, Label,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button,
} from 'reactstrap';
import Select from 'components/Select';
import SearchBar from 'components/SearchBar';
import { DatePicker } from 'components/date-picker';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { setMealStatisticFilter } from '../actions/meal';

const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
  }
`;
const ToolbarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  margin-bottom: 5px;
`;
const StyleDatePicker = styled(ButtonGroup)`
  margin-left: 5px;
  & .btn {
    background-color: #529bea;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.2;
    text-align: left;
    margin-right: -1px;
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

const unitType = [
  { value: 0, label: 'Khối' },
  { value: 1, label: 'Phòng ban' },
  { value: 2, label: 'Bộ phận' },
];

const MealStatisticFilter = ({ onChange: onChangeProps }) => {
  const [filter, setFilter] = useState({ Ngay: moment().format('YYYY-MM-DD') });

  const dispatch = useDispatch();

  const DatePickerButton = forwardRef((props, ref) => {
    const {
      value,
      ...rest
    } = props;
    const render = (d) => {
      const date = d !== '' ? new Date(d) : new Date();
      return (
        <>
          <span className="from">{dayJS(date).format('DD-MM-YYYY')}</span>
        </>
      );
    };
    return (
      <Button
        innerRef={ref}
        className="button__date-picker"
        {...rest}
      >
        {value && render(value)}
        {!value && 'Thời gian'}
      </Button>
    );
  });

  const handleChange = (object) => {
    const merge = { ...filter, ...object };
    const payload =
      Object
        .keys(merge)
        .reduce((obj, key) => {
          if (typeof merge[key] !== 'undefined') {
            obj[key] = merge[key];
          }
          return obj;
        }, {});
    setFilter(payload);
    dispatch(setMealStatisticFilter(payload));
    if (onChangeProps) {
      onChangeProps(payload);
    }
  };

  return (
    <>
      <SearchBarWrapper>
        <SearchBar text="Nhập mã đơn vị để tìm kiếm" onChange={(k) => handleChange({ MaDonVi: k })} type="maDonVi">
          <Row>
            <Col>
              <FormGroup>
                <Label>Cấp bậc đơn vị</Label>
                <Select
                  isClearable
                  options={unitType}
                  onChange={(o) => handleChange({ LoaiDonVi: o.value })}
                />
              </FormGroup>
            </Col>
          </Row>
        </SearchBar>
      </SearchBarWrapper>
      <ToolbarWrapper>
        <StyleDatePicker>
          <Button color="secondary">
            <i className="bx bx-calendar" />
          </Button>
          <DatePicker
            range
            value={new Date(filter?.Ngay) || new Date()}
            customInput={<DatePickerButton />}
            onChange={(d) => handleChange({ Ngay: dayJS(d).format('YYYY-MM-DD') })}
          />
        </StyleDatePicker>
      </ToolbarWrapper>
    </>
  );
};

export default MealStatisticFilter;
