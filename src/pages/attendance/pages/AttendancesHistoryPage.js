/* eslint-disable prefer-destructuring */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import DataTable from 'components/data-table';
import AttendancesHistoryFilter from 'pages/attendance/components/AttendancesHistoryFilter';

import { useDispatch, useSelector } from 'react-redux';
import { getAttendanceHistory } from 'pages/attendance/actions/attendance';
import { ATTENDANCE_STATUS } from 'pages/attendance/utils/contants';
import moment from 'moment';

const AttendanceStatusWrapper = styled.div`
  & span {
    display: inline-block;
    padding: 0.25em 0.4em;
    color: ${(props) => props.color};
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
    border: 1px solid ${(props) => props.color};
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
`;

const columns = [
  {
    name: 'index',
    label: '#',
    align: 'center',
    style: {
      width: '20px',
    },
  },
  {
    name: 'maNhanVien',
    align: 'left',
    label: 'Mã nhân viên',
  },
  {
    name: 'tenNhanVien',
    align: 'left',
    label: 'Tên nhân viên',
  },
  {
    name: 'chucVu',
    align: 'left',
    label: 'Chức vụ',
  },
  {
    name: 'status',
    align: 'center',
    label: 'Trạng thái',
    render: (r) => {
      const index =
        r?.status
          ? r.status.length > 0
            ? r.status[0]
            : 0
          : 0;
      const { label } = ATTENDANCE_STATUS[index] || {};
      const { color } = ATTENDANCE_STATUS[index] || {};

      return (
        <AttendanceStatusWrapper color={color}>
          <span id={`attendance-status_${r.index}`}>{label}</span>
        </AttendanceStatusWrapper>
      );
    },
  },
];

const AttendancesHistoryPage = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch();
  const {
    attendanceHistoryFilter,
    attendanceHistory,
    getAttendanceHistoryLoading,
  } = useSelector((state) => state.attendance);
  const { data: attendanceHistoryList, totalSizes } = attendanceHistory;

  const handleRefresh = () => {
    const payload = {
      page_number: pageIndex,
      page_size: pageSize,
      ...attendanceHistoryFilter,
    };
    if (!attendanceHistoryFilter?.Ngay) {
      payload.Ngay = new Date().toISOString().split('T')[0];
    }
    dispatch(getAttendanceHistory(payload));
  };

  useEffect(() => {
    handleRefresh();
  }, [attendanceHistoryFilter, pageIndex, pageSize]);

  return (
    <div className="page-content">
      <AttendancesHistoryFilter />
      <DataTable
        loading={getAttendanceHistoryLoading}
        title={`Lịch sử chấm công - ngày ${moment(attendanceHistoryFilter.Ngay).format('DD/MM/YYYY')}`}
        columns={columns}
        data={
          (attendanceHistoryList || [])
            .map((o, i) => ({ ...o, index: (i + 1) + ((pageIndex - 1) * pageSize) }))
        }
        totalRows={totalSizes}
        onPageChange={(index, size) => {
          if (index !== pageIndex) {
            setPageIndex(index);
          }
          if (size !== pageSize) {
            setPageSize(size);
          }
        }}
      />
    </div>
  );
};

export default AttendancesHistoryPage;
