/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';

import {
  ButtonGroup, Button, ButtonDropdown,
  DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import { MonthPicker } from 'components/date-picker';
import SearchBar from 'components/SearchBar';

import { useAuth } from 'hooks';
import { useDispatch, useSelector } from 'react-redux';
import { exportExcel } from 'actions/global';
import { setAttendanceDetailFilter } from 'pages/attendance/actions/attendance';
import { API_URL } from 'utils/contants';

const ToolbarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;
const StyledMonthPickerButton = styled(Button)`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  text-align: left;
  margin-right: 10px;
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
const StyledDropdownToggle = styled(DropdownToggle)`
    font-size: 15px;
    font-weight: 600;
    line-height: 1.2;
    text-align: left;
    text-overflow: ellipsis;
`;
const StyledDropdownMenu = styled(DropdownMenu)`
    height: 100px;
    overflow-x: hidden;
    overflow-y: auto;
    text-overflow: ellipsis;
`;
const StyledDropdownItem = styled(DropdownItem)`
    font-size: 15px;
`;
const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
  }
`;

const exportType = [
  { value: `${API_URL}/v1/ChamCong/xuatLichSuChamCongChiTiet`, label: 'Lịch sử chấm công' },
  { value: `${API_URL}/api/Exports/Attendances/AttendanceStatisticDetailForEmployee`, label: 'Thống kê chi tiết chấm công' },
];

const AttendanceDetailToolbar = ({ data: { idNhanVien }, setUpdateAttendanceModal }) => {
  const [type, setType] = useState(undefined);
  const [dropdownUnitTypeOpen, setDropdownUnitTypeOpen] = useState(false);

  const { id } = useParams();
  const { isAdmin } = useAuth();
  const dispatch = useDispatch();
  const {
    selectedAttendance,
    attendanceDetailFilter: filter,
  } = useSelector((state) => state.attendance);

  const toggleUnitTypeDropdown = () => setDropdownUnitTypeOpen(!dropdownUnitTypeOpen);

  const onChange = (object) => {
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
    dispatch(setAttendanceDetailFilter(payload));
  };

  const exportReport = useCallback((url, fileName) => {
    dispatch(exportExcel({
      method: 'GET',
      url,
      params: {
        nhanvienId: idNhanVien || id,
        employeeId: idNhanVien || id,
        fromDate: filter?.TuNgay ?? moment().startOf('month').format('YYYY-MM-DDT00:00:00'),
        toDate: filter?.DenNgay ?? moment().endOf('month').format('YYYY-MM-DDT23:59:59'),
      },
      fileName,
    }));
  }, [filter]);

  const MonthPickerButton = forwardRef((props, ref) => {
    const {
      value,
      ...rest
    } = props;
    const render = (d) => {
      const date = d !== '' ? new Date(d) : new Date();
      return `Tháng ${date.getMonth() + 1} - ${date.getFullYear()}`;
    };

    return (
      <StyledMonthPickerButton color="warning" innerRef={ref} {...rest}>
        {value && render(value)}
        {!value && 'Thời gian'}
      </StyledMonthPickerButton>
    );
  });

  return (
    <>
      <SearchBarWrapper>
        <SearchBar onChange={(k) => onChange({ maNV: k })} />
      </SearchBarWrapper>
      <ToolbarWrapper>
        <MonthPicker
          initial
          range
          format
          value={filter?.TuNgay ? new Date(filter.TuNgay) : new Date()}
          customInput={<MonthPickerButton />}
          onChange={(f, t) => onChange({
            TuNgay: f.split('/').reverse().join('-'),
            DenNgay: t.split('/').reverse().join('-'),
          })}
        />
        {id && (
          <StyledButtonGroup className="mr-2">
            <ButtonDropdown isOpen={dropdownUnitTypeOpen} toggle={toggleUnitTypeDropdown}>
              <StyledDropdownToggle caret color="success">
                {type
                  ? (exportType).find((o) => o.value === type).label
                  : (
                    <div>
                      <i className="bx bx-cloud-download" />
                      <span className="ml-2">Xuất báo cáo nhân viên</span>
                    </div>
                  )
                }
              </StyledDropdownToggle>
              <StyledDropdownMenu>
                <StyledDropdownItem onClick={() => setType(undefined)} />
                {(exportType).map((type, index) => (
                  <StyledDropdownItem
                    key={`unit_${index}`}
                    onClick={() => exportReport(type.value, type.label)}
                  >
                    {type.label}
                  </StyledDropdownItem>
                ))}
              </StyledDropdownMenu>
            </ButtonDropdown>
          </StyledButtonGroup>
        )}
        {selectedAttendance &&
          (isAdmin() ||
            (!selectedAttendance?.realTime?.from && !selectedAttendance?.realTime?.to) ||
            (selectedAttendance?.realTime?.from && !selectedAttendance?.realTime?.to) ||
            (!selectedAttendance?.realTime?.from && selectedAttendance?.realTime?.to)
          ) ? (
            <div>
              <StyledMonthPickerButton color="info" onClick={() => setUpdateAttendanceModal(selectedAttendance)}>
                {isAdmin() ? 'Sửa chấm công' : 'Bổ sung chấm công'}
              </StyledMonthPickerButton>
            </div>
        ) : null}
      </ToolbarWrapper>
    </>
  );
};

export default AttendanceDetailToolbar;
