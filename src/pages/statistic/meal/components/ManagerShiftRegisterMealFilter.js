/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
import React, { useEffect, forwardRef, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import dayJS from 'dayjs';

import {
  ButtonGroup, Col, Row, FormGroup, Button,
  Label, Input,
} from 'reactstrap';
import SearchBar from 'components/SearchBar';
import { DatePicker } from 'components/date-picker';

import { useDispatch, useSelector } from 'react-redux';
import {
  getUnitGroup,
  getLevelOneByUnit,
  getLevelTwoByUnit,
  getLevelThreeByUnit,
  getLevelFourByUnit,
} from 'pages/unit/actions/unit';

import Select from 'components/Select';
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

const ManagerShiftRegisterMealFilter = ({ onChange: onChangeProps, setIsGroupByScheduleGroup }) => {
  const [type, setType] = useState(undefined);
  const [filter, setFilter] = useState({ Ngay: moment().format('YYYY-MM-DD'), hasAttendance: true });

  const dispatch = useDispatch();
  const {
    levelOneByUnit: { data: levelOneByUnitList },
    levelTwoByUnit: { data: levelTwoByUnitList },
    levelThreeByUnit: { data: levelThreeByUnitList },
    levelFourByUnit: { data: levelFourByUnitList },
    getLevelOneByUnitLoading,
    getLevelTwoByUnitLoading,
    getLevelThreeByUnitLoading,
    getLevelFourByUnitLoading,
  } = useSelector((state) => state.unit);

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
      <Button innerRef={ref} className="button__date-picker" {...rest}>
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

  const loading = getLevelOneByUnitLoading || getLevelTwoByUnitLoading || getLevelThreeByUnitLoading || getLevelFourByUnitLoading;

  const handleRefresh = () => {
    if (type !== undefined) {
      const payload = {
        LoaiDonVi: type,
      };

      dispatch(getUnitGroup(payload));
    } else dispatch(getUnitGroup());
  };

  useEffect(() => {
    handleRefresh();
  }, [type]);

  useEffect(() => {
    if (levelOneByUnitList.length === 0) {
      dispatch(getLevelOneByUnit());
    }
    if (levelTwoByUnitList.length === 0) {
      dispatch(getLevelTwoByUnit());
    }
    if (levelThreeByUnitList.length === 0) {
      dispatch(getLevelThreeByUnit());
    }
    if (levelFourByUnitList.length === 0) {
      dispatch(getLevelFourByUnit());
    }
  }, []);

  return (
    <>
      <SearchBarWrapper>
        <SearchBar text="Nhập mã nhân viên để tìm kiếm" onChange={(k) => handleChange({ code: k })}>
          <Row>
            <Col>
              <FormGroup>
                <Label>Khối</Label>
                <Select
                  isClearable
                  isLoading={loading}
                  value={(levelOneByUnitList || []).reduce((object, option) => {
                    if (filter?.unitId && option.id === filter.unitId) {
                      return {
                        key: option.id,
                        value: option.id,
                        label: option.tenDonVi,
                      };
                    }
                    return object;
                  }, null)}
                  options={(levelOneByUnitList || []).map((o) => ({
                    key: o.id,
                    value: o.id,
                    label: o.tenDonVi,
                  }))}
                  onChange={(o) => handleChange({ unitId: o?.value ?? undefined })}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Phòng</Label>
                <Select
                  isClearable
                  isLoading={loading}
                  value={(levelTwoByUnitList || []).reduce((object, option) => {
                    if (filter?.unitId && option.id === filter.unitId) {
                      return {
                        key: option.id,
                        value: option.id,
                        label: option.tenDonVi,
                      };
                    }
                    return object;
                  }, null)}
                  options={(levelTwoByUnitList || []).map((o) => ({
                    key: o.id,
                    value: o.id,
                    label: o.tenDonVi,
                  }))}
                  onChange={(o) => handleChange({ unitId: o?.value ?? undefined })}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Bộ phận</Label>
                <Select
                  isClearable
                  isLoading={loading}
                  value={(levelThreeByUnitList || []).reduce((object, option) => {
                    if (filter?.unitId && option.id === filter.unitId) {
                      return {
                        key: option.id,
                        value: option.id,
                        label: option.tenDonVi,
                      };
                    }
                    return object;
                  }, null)}
                  options={(levelThreeByUnitList || []).map((o) => ({
                    key: o.id,
                    value: o.id,
                    label: o.tenDonVi,
                  }))}
                  onChange={(o) => handleChange({ unitId: o?.value ?? undefined })}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Nhóm</Label>
                <Select
                  isClearable
                  isLoading={loading}
                  placeholder=""
                  value={(levelFourByUnitList || []).reduce((object, option) => {
                    if (filter?.unitId && option.id === filter.unitId) {
                      return {
                        key: option.id,
                        value: option.id,
                        label: option.tenDonVi,
                      };
                    }
                    return object;
                  }, null)}
                  options={(levelFourByUnitList || []).map((o) => ({
                    key: o.id,
                    value: o.id,
                    label: o.tenDonVi,
                  }))}
                  onChange={(o) => handleChange({ unitId: o?.value ?? undefined })}
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
        <div className="ml-2 mt-2 custom-control custom-checkbox">
          <Input
            type="checkbox"
            id="hasAttendance"
            className="custom-control-input"
            checked={filter?.hasAttendance}
            onChange={(d) => handleChange({ hasAttendance: d.target.checked })}
          />
          <Label className="custom-control-label" htmlFor="hasAttendance">Chỉ hiện nhân viên có mặt</Label>
        </div>
        <div className="ml-2 mt-2 custom-control custom-checkbox">
          <Input
            type="checkbox"
            id="groupByScheduleGroup"
            className="custom-control-input"
            onChange={(d) => setIsGroupByScheduleGroup(d.target.checked)}
          />
          <Label className="custom-control-label" htmlFor="groupByScheduleGroup">Hiển thị theo nhóm đi ca</Label>
        </div>
      </ToolbarWrapper>
    </>
  );
};

export default ManagerShiftRegisterMealFilter;
