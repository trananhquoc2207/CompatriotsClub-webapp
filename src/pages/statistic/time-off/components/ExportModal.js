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
import { API_URL } from 'utils/contants';
const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
  }
`;
const ToolbarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
`;
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
`;
const StyleWeekPicker = styled(ButtonGroup)`
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

// const exportType = [
//   { value: 0, label: 'Lịch sử chấm công chi tiết' },
//   { value: 1, label: 'Báo cáo chấm công chi tiết' },
//   { value: 2, label: 'Báo cáo chấm công tổng hợp' },
// ];

const ExportModal = ({ onChange: onChangeProps, from, to, unitId }) => {
  const [dropdownUnitTypeOpen, setDropdownUnitTypeOpen] = useState(false);
  const [dropdownUnitOpen, setDropdownUnitOpen] = useState(false);

  const [type, setType] = useState(undefined);
  const toggleUnitTypeDropdown = () => setDropdownUnitTypeOpen(!dropdownUnitTypeOpen);
  const toggleUnitDropdown = () => setDropdownUnitOpen(!dropdownUnitOpen);

  const handleExport = () => {
    window.open(`${API_URL}​/api/Exports/Absents/StatisticByEmployee?fromDate=${from}&toDate=${to}`)
  }

  return (
    <>
      <ToolbarWrapper>
        <StyledButtonGroup className="mr-2" >
          <ButtonDropdown direction='left' isOpen={dropdownUnitTypeOpen} toggle={toggleUnitTypeDropdown}>
            <StyledDropdownToggle caret color="success">
              <div onClick={() => handleExport()}><i className={`bx bx-cloud-download`}  ></i><span className='ml-2'>Xuất báo cáo nghỉ vắng</span></div>
            </StyledDropdownToggle>
          </ButtonDropdown>
        </StyledButtonGroup>
      </ToolbarWrapper>
    </>
  );
};

export default ExportModal;
