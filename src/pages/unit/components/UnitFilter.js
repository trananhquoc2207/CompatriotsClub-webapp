import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import SearchBar from 'components/SearchBar';

const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
  }
`;
const ToolbarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;
const StyledDropdownToggle = styled(DropdownToggle)`
    font-size: 15px;
    font-weight: 600;
    line-height: 1.2;
    text-align: left;
    text-overflow: ellipsis;
`;
const StyledDropdownMenu = styled(DropdownMenu)`
    height: 150px;
    overflow-x: hidden;
    overflow-y: auto;
    text-overflow: ellipsis;
`;
const StyledDropdownItem = styled(DropdownItem)`
    font-size: 15px;
`;

const unitType = [
  { value: 0, label: 'Khối' },
  { value: 1, label: 'Phòng ban' },
  { value: 2, label: 'Bộ phận' },
  { value: 3, label: 'Nhóm' },
];
const UnitFilter = ({ onChange: onChangeProps }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filter, setFilter] = useState();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleChange = (object) => {
    const merge = { ...filter, ...object };
    const payload =
      Object
        .keys(merge)
        .reduce((_object, key) => {
          if (merge[key]) {
            // eslint-disable-next-line
            _object[key] = merge[key];
          }
          return _object;
        }, {});
    setFilter(payload);
    if (onChangeProps) {
      onChangeProps(payload);
    }
  };
  return (
    <>
      <SearchBarWrapper>
        <SearchBar text='Nhập mã đơn vị để tìm kiếm' onChange={(k) => handleChange({ TenDonVi: k })} />
      </SearchBarWrapper>
      <ToolbarWrapper>
        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="mr-2">
          <StyledDropdownToggle caret color="warning">
            {filter?.LoaiDonVi
              ? (unitType).find((o) => o.value === filter.LoaiDonVi).label
              : 'Tất cả đơn vị'
            }
          </StyledDropdownToggle>
          <StyledDropdownMenu>
            <StyledDropdownItem onClick={() => handleChange({ LoaiDonVi: undefined })}>Tất cả</StyledDropdownItem>
            {(unitType).map((o) => (
              <StyledDropdownItem
                key={`unit_${o?.value}`}
                onClick={() => handleChange({ LoaiDonVi: (o?.value) })}
              >
                {o?.label}
              </StyledDropdownItem>
            ))}
          </StyledDropdownMenu>
        </Dropdown>
      </ToolbarWrapper>
    </>
  );
};

export default UnitFilter;
