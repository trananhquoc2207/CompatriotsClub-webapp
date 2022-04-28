import React, { useEffect, useState, forwardRef } from 'react';
import styled from 'styled-components';

import {
  Row, Col,
  FormGroup, Label, Input,
} from 'reactstrap';
import Select from 'react-select';
import SearchBar from 'components/SearchBar';
import { DatePicker } from 'components/date-picker';

import { useDispatch, useSelector } from 'react-redux';
import {
  getLevelOneByUnit,
  getLevelTwoByUnit,
  getLevelThreeByUnit,
  getLevelFourByUnit,
} from 'pages/unit/actions/unit';
import { setAttendanceHistoryFilter } from 'pages/attendance/actions/attendance';

import { ATTENDANCE_STATUS } from 'pages/attendance/utils/contants';

const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
  }
`;
const StyledDatePickerInput = styled(Input)`
  font-size: 14px;
`;
const SelectStyles = {
  control: (styles, { selectProps: { menuIsOpen } }) => ({
    ...styles,
    boxShadow: 'none',
    border: menuIsOpen ? '1px solid #96c8da' : '1px solid hsl(0,0%,80%)',
    borderBottom: menuIsOpen ? 0 : '1px solid hsl(0,0%,80%)',
    borderBottomLeftRadius: menuIsOpen ? 0 : '4px',
    borderBottomRightRadius: menuIsOpen ? 0 : '4px',
    ':hover': {
      border: '1px solid #96c8da',
      borderBottom: menuIsOpen ? 0 : '1px solid #96c8da',
    },
  }),
  menu: (styles) => ({
    ...styles,
    marginTop: 0,
    boxShadow: 'none',
    border: '1px solid #96c8da',
    borderTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  }),
  menuList: (styles) => ({
    ...styles,
    padding: 0,
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    background: isFocused || isSelected ? 'rgba(0,0,0,.03)' : '#ffffff',
    color: isSelected ? 'rgba(0,0,0,.95)' : '#000000',
    fontSize: '15px',
  }),
  input: (styles) => ({
    ...styles,
    fontSize: '15px',
  }),
  singleValue: (styles) => ({
    ...styles,
    fontSize: '15px',
  }),
};
const StatusSelectStyles = {
  control: (styles, { selectProps: { menuIsOpen } }) => ({
    ...styles,
    boxShadow: 'none',
    border: menuIsOpen ? '1px solid #96c8da' : '1px solid hsl(0,0%,80%)',
    borderBottom: menuIsOpen ? 0 : '1px solid hsl(0,0%,80%)',
    borderBottomLeftRadius: menuIsOpen ? 0 : '4px',
    borderBottomRightRadius: menuIsOpen ? 0 : '4px',
    ':hover': {
      border: '1px solid #96c8da',
      borderBottom: menuIsOpen ? 0 : '1px solid #96c8da',
    },
  }),
  menu: (styles) => ({
    ...styles,
    marginTop: 0,
    boxShadow: 'none',
    border: '1px solid #96c8da',
    borderTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  }),
  option: (styles, { data, isFocused, isSelected }) => ({
    ...styles,
    display: 'flex',
    alignItems: 'center',
    background: isFocused || isSelected ? 'rgba(0,0,0,.03)' : '#ffffff',
    color: isSelected ? 'rgba(0,0,0,.95)' : '#000000',
    fontSize: '15px',
    ':before': {
      backgroundColor: data?.value ? ATTENDANCE_STATUS[data.value].color : '#cccccc',
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  }),
  singleValue: (styles, { data, selectProps: { menuIsOpen } }) => ({
    ...styles,
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
    color: menuIsOpen ? 'hsla(0,0%,74.9%,.87)' : '#0000000',
    ':before': {
      backgroundColor: menuIsOpen ? 'hsla(0,0%,74.9%,.87)' : data?.value ? ATTENDANCE_STATUS[data.value].color : '#cccccc',
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  }),
};

const AttendancesHistoryFilter = () => {
  const [filter, setFilter] = useState({});

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
  const {
    attendanceHistoryFilter,
  } = useSelector((state) => state.attendance);

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
    dispatch(setAttendanceHistoryFilter(payload));
  };

  const loading = getLevelOneByUnitLoading || getLevelTwoByUnitLoading || getLevelThreeByUnitLoading;

  const DatePickerInput = forwardRef((props) => {
    const {
      value,
      ...rest
    } = props;
    const render = (d) => {
      const date = d !== '' ? new Date(d) : new Date();
      return `Ngày ${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`;
    };

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <StyledDatePickerInput value={render(value)} {...rest} />
    );
  });

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
    if (attendanceHistoryFilter) {
      setFilter(attendanceHistoryFilter);
    }
    if (levelFourByUnitList.length === 0) {
      dispatch(getLevelFourByUnit());
    }
  }, []);

  return (
    <SearchBarWrapper>
      <SearchBar text="Nhập mã nhân viên để tìm kiếm" onChange={(k) => onChange({ maNV: k })}>
        <Row>
          <Col>
            <FormGroup>
              <Label>Thời gian</Label>
              <DatePicker
                format
                customInput={<DatePickerInput />}
                value={filter?.Ngay ? new Date(filter.Ngay) : new Date()}
                onChange={(d) => onChange({
                  Ngay: d.split('/').reverse().join('-'),
                })}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Trạng thái chấm công</Label>
              <Select
                isClearable
                placeholder=""
                styles={StatusSelectStyles}
                value={Object.keys(ATTENDANCE_STATUS).reduce((object, option) => {
                  // eslint-disable-next-line eqeqeq
                  if (filter?.trangthai && option == filter.trangthai) {
                    return {
                      key: option,
                      value: option,
                      label: ATTENDANCE_STATUS[option].label,
                    };
                  }
                  return object;
                }, null)}
                options={Object.keys(ATTENDANCE_STATUS).map((o) => ({
                  key: o,
                  value: o,
                  label: ATTENDANCE_STATUS[o].label,
                }))}
                onChange={(o) => onChange({ trangthai: o?.value ?? undefined })}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label>Khối</Label>
              <Select
                isClearable
                isLoading={loading}
                placeholder=""
                styles={SelectStyles}
                value={(levelOneByUnitList || []).reduce((object, option) => {
                  // eslint-disable-next-line eqeqeq
                  if (filter?.idDonVi && option.id == filter.idDonVi) {
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
                onChange={(o) => onChange({ idDonVi: o?.value ?? undefined })}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Phòng</Label>
              <Select
                isClearable
                isLoading={loading}
                placeholder=""
                styles={SelectStyles}
                value={(levelTwoByUnitList || []).reduce((object, option) => {
                  // eslint-disable-next-line eqeqeq
                  if (filter?.idDonVi && option.id == filter.idDonVi) {
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
                onChange={(o) => onChange({ idDonVi: o?.value ?? undefined })}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Bộ phận</Label>
              <Select
                isClearable
                isLoading={loading}
                placeholder=""
                styles={SelectStyles}
                value={(levelThreeByUnitList || []).reduce((object, option) => {
                  // eslint-disable-next-line eqeqeq
                  if (filter?.idDonVi && option.id == filter.idDonVi) {
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
                onChange={(o) => onChange({ idDonVi: o?.value ?? undefined })}
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
                styles={SelectStyles}
                value={(levelFourByUnitList || []).reduce((object, option) => {
                  if (filter?.idDonVi && option.id === filter.idDonVi) {
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
                onChange={(o) => onChange({ idDonVi: o?.value ?? undefined })}
              />
            </FormGroup>
          </Col>
        </Row>
      </SearchBar>
    </SearchBarWrapper>
  );
};

export default AttendancesHistoryFilter;
