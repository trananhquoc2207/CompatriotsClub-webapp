import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  Row, Col,
  FormGroup, Label,
} from 'reactstrap';
import Select from 'react-select';
import SearchBar from 'components/SearchBar';

import { useDispatch, useSelector } from 'react-redux';
import {
  getLevelOneByUnit,
  getLevelTwoByUnit,
  getLevelThreeByUnit,
  getLevelFourByUnit,
} from 'pages/unit/actions/unit';
import { setEmployeeFilter } from 'pages/employee/actions/employee';
import { getScheduleGroups } from 'pages/schedule-group/actions/schedule-group';

import { IMAGE_STATUS, LEAVING_STATUS } from 'pages/employee/utils/contants';

const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
  }
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
      backgroundColor: data?.value ? IMAGE_STATUS[data.value].color : '#cccccc',
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
      backgroundColor: menuIsOpen ? 'hsla(0,0%,74.9%,.87)' : data?.value ? IMAGE_STATUS[data.value].color : '#cccccc',
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  }),
};
const LeftStatusSelectStyles = {
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
      backgroundColor: data?.value ? LEAVING_STATUS[data.value].color : '#cccccc',
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
      backgroundColor: menuIsOpen ? 'hsla(0,0%,74.9%,.87)' : data?.value ? LEAVING_STATUS[data.value].color : '#cccccc',
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  }),
};

const scheduleGroupOptions = [
  {
    value: 'hasNoScheduleGroup',
    label: 'Không có nhóm đi ca',
  },
  {
    value: 'hasScheduleGroup',
    label: 'Có nhóm đi ca',
  },
];

const EmployeeFilter = () => {
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
  } = useSelector((state) => state.unit);
  const {
    attendanceHistoryFilter,
  } = useSelector((state) => state.attendance);
  const {
    scheduleGroups: { data: scheduleGroupList },
    getScheduleGroupLoading,
  } = useSelector((state) => state.scheduleGroup);

  const onChange = (object) => {
    const merge = { ...filter, ...object };
    const payload =
      Object
        .keys(merge)
        .reduce((_object, key) => {
          if (typeof merge[key] !== 'undefined') {
            // eslint-disable-next-line
            _object[key] = merge[key];
          }
          return _object;
        }, {});
    setFilter(payload);
    dispatch(setEmployeeFilter(payload));
  };

  const loading = getLevelOneByUnitLoading || getLevelTwoByUnitLoading || getLevelThreeByUnitLoading;

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
    if (scheduleGroupList.length === 0) {
      dispatch(getScheduleGroups({}));
    }
    if (attendanceHistoryFilter) {
      setFilter(attendanceHistoryFilter);
    }
  }, []);

  return (
    <>
      <SearchBarWrapper>
        <SearchBar text="Nhập mã nhân viên để tìm kiếm" onChange={(k) => onChange({ q: k })}>
          <Row>
            <Col>
              <FormGroup>
                <Label>Trạng thái lấy khuôn mặt</Label>
                <Select
                  isClearable
                  placeholder=""
                  styles={StatusSelectStyles}
                  value={Object.keys(IMAGE_STATUS).reduce((object, option) => {
                    // eslint-disable-next-line
                    if (filter?.FaceIdStatus && option == filter.FaceIdStatus) {
                      return {
                        key: option,
                        value: option,
                        label: IMAGE_STATUS[option].label,
                      };
                    }
                    return object;
                  }, null)}
                  options={Object.keys(IMAGE_STATUS).map((o) => ({
                    key: o,
                    value: o,
                    label: IMAGE_STATUS[o].label,
                  }))}
                  onChange={(o) => onChange({ FaceIdStatus: o?.value ?? undefined })}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Trạng thái làm việc</Label>
                <Select
                  isClearable
                  placeholder=""
                  styles={LeftStatusSelectStyles}
                  value={Object.keys(LEAVING_STATUS).reduce((object, option) => {
                    // eslint-disable-next-line
                    if (filter?.isLeft && option == filter.isLeft) {
                      return {
                        key: option,
                        value: option,
                        label: LEAVING_STATUS[option].label,
                      };
                    }
                    return object;
                  }, null)}
                  options={Object.keys(LEAVING_STATUS).map((o) => ({
                    key: o,
                    value: o,
                    label: LEAVING_STATUS[o].label,
                  }))}
                  onChange={(o) => onChange({ isLeft: o?.value ?? undefined })}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Nhóm đi ca</Label>
                <Select
                  isClearable
                  isLoading={getScheduleGroupLoading}
                  placeholder="Chọn nhóm đi ca"
                  styles={SelectStyles}
                  // value={}
                  options={
                    (scheduleGroupList || []).reduce((options, scheduleGroup) =>
                      ([...options, { value: scheduleGroup.id, label: `${scheduleGroup.code} | ${scheduleGroup.name}` }]),
                    scheduleGroupOptions)
                  }
                  onChange={(option) => {
                    if (!option) {
                      onChange({ hasScheduleGroup: undefined, scheduleGroupId: undefined });
                      return;
                    }

                    if (option.value.includes('hasNoScheduleGroup')) {
                      onChange({ hasScheduleGroup: false, scheduleGroupId: undefined });
                    } else if (option.value.includes('hasScheduleGroup')) {
                      onChange({ hasScheduleGroup: true, scheduleGroupId: undefined });
                    } else {
                      onChange({ hasScheduleGroup: undefined, scheduleGroupId: option.value });
                    }
                  }}
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
                    // eslint-disable-next-line
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
                  onChange={(o) => onChange({ idDonVi: o?.value ?? undefined, loaiDonVi: 0 })}
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
                    // eslint-disable-next-line
                    if (filter?.idDonVi && option.id == filter.idDonVi) {
                      return {
                        key: option.id,
                        value: option.id,
                        label: option.tenDonVi,
                      };
                    }
                    return object;
                  }, null)}
                  options={(filter?.idDonVi && filter?.loaiDonVi < 1 ? levelTwoByUnitList.filter((o) => o.idDonViCha == filter?.idDonVi) : levelTwoByUnitList || []).map((o) => ({
                    key: o.id,
                    value: o.id,
                    label: o.tenDonVi,
                  }))}
                  onChange={(o) => onChange({ idDonVi: o?.value ?? undefined, loaiDonVi: 1 })}
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
                    // eslint-disable-next-line
                    if (filter?.idDonVi && option.id == filter.idDonVi) {
                      return {
                        key: option.id,
                        value: option.id,
                        label: option.tenDonVi,
                      };
                    }
                    return object;
                  }, null)}
                  options={(filter?.idDonVi && filter?.loaiDonVi < 2 ? levelThreeByUnitList.filter((o) => o.idDonViCha == filter?.idDonVi) : levelThreeByUnitList || []).map((o) => ({
                    key: o.id,
                    value: o.id,
                    label: o.tenDonVi,
                  }))}
                  onChange={(o) => onChange({ idDonVi: o?.value ?? undefined, loaiDonVi: 2 })}
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
                  options={(filter?.idDonVi && filter?.loaiDonVi !== 3 ? levelFourByUnitList.filter((o) => o.idDonViCha == filter?.idDonVi) : levelFourByUnitList || []).map((o) => ({
                    key: o.id,
                    value: o.id,
                    label: o.tenDonVi,
                  }))}
                  onChange={(o) => onChange({ idDonVi: o?.value ?? undefined, loaiDonVi: 3 })}
                />
              </FormGroup>
            </Col>
          </Row>
        </SearchBar>
      </SearchBarWrapper>
    </>
  );
};

export default EmployeeFilter;
