import React, { useEffect, forwardRef, useState } from 'react';
import styled from 'styled-components';
import dayJS from 'dayjs';
import {
  ButtonGroup,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, ButtonDropdown,
} from 'reactstrap';
import SearchBar from 'components/SearchBar';
import { WeekPicker } from 'components/date-picker';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartments } from 'pages/setting/department/actions/deparment';
import { getUnitGroup } from 'pages/unit/actions/unit';

const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
  }
`;

const ShiftGroupFilter = ({ onChange: onChangeProps }) => {
  // const { department, getDepartmentsLoading } = useSelector((state) => state.department);
  // const { data: departmentList } = department;
  const [filter, setFilter] = useState();

  const [type, setType] = useState(undefined);
  const dispatch = useDispatch();

  const handleChange = (object) => {
    const merge = { ...filter, ...object };
    const payload =
      Object
        .keys(merge)
        .reduce((object, key) => {
          if (merge[key]) {
            object[key] = merge[key];
          }
          return object;
        }, {});
    setFilter(payload);
    if (onChangeProps) {
      onChangeProps(payload);
    }
  };
  /* useEffect(() => {
    if (departmentList.length === 0) {
      dispatch(getDepartments({}));
    }
  }, [department]); */

  return (
    <>
      <SearchBarWrapper>
        <SearchBar text='Nhập mã hoặc tên nhóm để tìm kiếm' onChange={(k) => handleChange({ keyword: k })} />
      </SearchBarWrapper>
    </>
  );
};

export default ShiftGroupFilter;
