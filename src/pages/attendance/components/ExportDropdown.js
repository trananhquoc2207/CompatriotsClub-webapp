import React, { useEffect, forwardRef, useState, useCallback } from 'react';
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
import attendanceApi from 'api/attendanceApi';
import { notify } from 'utils/helpers';
import { exportExcel, getAttendances } from '../actions/attendance';
import WarningExportModal from './WarningExportModal';

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
    height: 130px;
    overflow-x: hidden;
    overflow-y: auto;
    text-overflow: ellipsis;
`;
const StyledDropdownItem = styled(DropdownItem)`
    font-size: 15px;
`;

const exportType = [
  { value: 0, label: 'Lịch sử chấm công chi tiết' },
  { value: 1, label: 'Báo cáo chấm công chi tiết' },
  { value: 2, label: 'Báo cáo chấm công tổng hợp' },
];
const exportUrl = [
  'xuatLichSuChamCongChiTiet',
  'xuatBaoCaoChamCongChiTiet',
  'xuatBaoCaoChamCongTongHop',
];
const ExportDropdown = ({ onChange: onChangeProps, from, to, unitId }) => {
  const dispatch = useDispatch();

  const [dropdownUnitTypeOpen, setDropdownUnitTypeOpen] = useState(false);
  const [dropdownUnitOpen, setDropdownUnitOpen] = useState(false);
  const [type, setType] = useState(undefined);
  const toggleUnitTypeDropdown = () => setDropdownUnitTypeOpen(!dropdownUnitTypeOpen);
  const toggleUnitDropdown = () => setDropdownUnitOpen(!dropdownUnitOpen);
  const [modalWarning, setModalWarning] = useState(undefined);

  const handleCheckData = useCallback(async () => {
    const params = {
      page_number: 1,
      page_size: 10,
      TuNgay: from,
      DenNgay: to,
      attendanceType: 3,
      idDonVi: unitId,
    };
    const { success, data } = await attendanceApi.get(params);
    if (success) {
      return data;
    }
  }, [attendanceApi]);

  const handleExport = async (typeExport) => {
    const params = {
      fromDate: from,
      toDate: to,
      donViId: unitId ?? '',
    };
    const requestPayload = {
      method: 'GET',
      url: `${API_URL}​/v1/ChamCong/${exportUrl[typeExport]}`,
      params,
    };
    const isMissAttendance = await handleCheckData();
    if (isMissAttendance.length > 0) {
      const data = {
        from,
        to,
        unitId,
        typeExport,
      };
      setModalWarning(data);
    } else {
      dispatch(exportExcel(requestPayload))
        .then(() => notify('success', 'Xuất báo cáo thành công.'))
        .catch(() => notify('danger', 'Xuất báo cáo bị lỗi.'));
    }
  };

  return (
    <>
      <ToolbarWrapper>
        <StyledButtonGroup className="mr-2">
          <ButtonDropdown direction="left" isOpen={dropdownUnitTypeOpen} toggle={toggleUnitTypeDropdown}>
            <StyledDropdownToggle caret color="success">
              {type
                ? (exportType).find((o) => o.value === type).label
                : (
                  <div>
                    <i className="bx bx-cloud-download" />
                    <span className="ml-2">Xuất báo cáo</span>
                  </div>
                )
              }
            </StyledDropdownToggle>
            <StyledDropdownMenu>
              <StyledDropdownItem onClick={() => setType(undefined)} />
              {(exportType).map((o) => (
                <StyledDropdownItem
                  key={`unit_${o?.value}`}
                  onClick={() => handleExport(o?.value)}
                >
                  {o?.label}
                </StyledDropdownItem>
              ))}
            </StyledDropdownMenu>
          </ButtonDropdown>
        </StyledButtonGroup>
      </ToolbarWrapper>
      <WarningExportModal
        data={modalWarning}
        onClose={() => setModalWarning(undefined)}
      />
    </>
  );
};

export default ExportDropdown;
