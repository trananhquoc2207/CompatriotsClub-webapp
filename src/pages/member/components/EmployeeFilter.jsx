import React, {  useState } from 'react';
import styled from 'styled-components';

import {
  Row, Col,
  FormGroup, Label,
} from 'reactstrap';
import Select from 'react-select';
import SearchBar from 'components/SearchBar';

import { useDispatch } from 'react-redux';

import { setEmployeeFilter } from 'pages/member/actions/member';

import { IMAGE_STATUS, LEAVING_STATUS } from 'pages/member/utils/contants';

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


const EmployeeFilter = () => {
  const [filter, setFilter] = useState({});

  const dispatch = useDispatch();
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

  return (
    <>
      <SearchBarWrapper>
        <SearchBar text="Nhập tên hội viên cần tìm kiếm" onChange={(k) => onChange({ Keyword: k })}>
          <Row>
            <Col>
              <FormGroup>
                <Label>Trạng thái</Label>
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
          </Row>
        </SearchBar>
      </SearchBarWrapper>
    </>
  );
};

export default EmployeeFilter;
