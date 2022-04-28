/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';

import DataTable from 'components/data-table';
import AttendancesFilter from 'pages/attendance/components/AttendancesFilter';

import { useDispatch, useSelector } from 'react-redux';
import { exportExcel } from 'actions/global';
import { getAttendances } from 'pages/attendance/actions/attendance';
import { getScheduleGroup } from 'pages/ShiftGroup/actions/ShiftGroup';
import { TOKEN } from 'utils/contants';
import apiLinks from 'utils/api-links';
import SyncAttendanceStatisticModal from '../components/SyncAttendanceStatisticModal';

const BackWrapper = styled.div`
  position: absolute;
  cursor: pointer;
  top: 2px;
  font-size: 20px;
  z-index: 1000;
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
    name: 'code',
    align: 'left',
    label: 'Mã nhân viên',
  },
  {
    name: 'name',
    align: 'left',
    label: 'Tên nhân viên',
  },
  {
    name: 'position',
    label: 'Chức vụ',
    align: 'left',
  },
  {
    name: 'hoursWork',
    label: 'Số giờ làm',
    align: 'center',
    render: (r) => `${r.hoursWork.toFixed(2)} giờ`,
  },
];

const columnForScheduleGroup = [
  {
    name: 'index',
    label: '#',
    align: 'center',
    style: {
      width: '20px',
    },
  },
  {
    name: 'code',
    align: 'left',
    label: 'Mã nhóm',
  },
  {
    name: 'name',
    align: 'left',
    label: 'Tên nhóm',
  },
  {
    name: 'leader',
    align: 'left',
    label: 'Nhân viên quản lý',
    render: (r) => (`${r?.leader?.code} - ${r?.leader?.name}`) ?? '-',
  },
  {
    name: 'employeeIds',
    align: 'center',
    label: 'Số lượng nhân viên',
    render: (r) => (r.employeeIds.length) ?? '-',
  },
];

const AttendancesPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const profile = localStorage.getItem(TOKEN) ? JSON.parse(localStorage.getItem(TOKEN)) : null;

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isGroupByScheduleGroup, setIsGroupByScheduleGroup] = useState(false);
  const [selectedScheduleGroup, setSelectedScheduleGroup] = useState(undefined);
  const [syncAttendanceModal, setSyncAttendanceModal] = useState(false);

  const { exportLoading } = useSelector((state) => state.global);
  const {
    attendanceFilter: filter,
    attendances,
    getAttendancesLoading,
  } = useSelector((state) => state.attendance);
  const {
    scheduleGroups,
    getScheduleGroupLoading,
  } = useSelector((state) => state.shiftGroup);

  const { data, totalSizes } = attendances;
  const loading = exportLoading || getAttendancesLoading || getScheduleGroupLoading;

  const exportReport = useCallback((url, fileName) => {
    dispatch(exportExcel({
      method: 'GET',
      url,
      params: {
        fromDate: filter?.TuNgay ?? moment().startOf('month').format('YYYY-MM-DDT00:00:00'),
        toDate: filter?.DenNgay ?? moment().endOf('month').format('YYYY-MM-DDT23:59:59'),
        unitId: filter?.idDonVi,
        scheduleGroupId: selectedScheduleGroup?.id,
      },
      fileName,
    }));
  }, [filter, selectedScheduleGroup]);

  const getScheduleGroupData = useCallback(() => {
    const payload = {
      pageIndex: pageIndex > 0 ? pageIndex - 1 : 0,
      pageSize,
      scheduleGroupLeaderId:
        profile.roleName !== 'ADMIN'
        ? profile?.idNhanVien ?? undefined
        : undefined,
    };

    dispatch(getScheduleGroup(payload));
  }, [dispatch]);
  useEffect(getScheduleGroupData, [getScheduleGroupData]);

  const getData = useCallback(() => {
    dispatch(getAttendances({
      ...filter,
      idNhomDiCa: selectedScheduleGroup?.id,
      page_number: pageIndex,
      page_size: pageSize,
    }));
  }, [dispatch, filter, selectedScheduleGroup, pageIndex, pageSize]);
  useEffect(getData, [getData]);

  useEffect(() => {
    if (!isGroupByScheduleGroup) {
      setSelectedScheduleGroup(undefined);
    }
  }, [isGroupByScheduleGroup]);

  return (
    <div className="page-content">
      <AttendancesFilter setIsGroupByScheduleGroup={setIsGroupByScheduleGroup} />
      {
        !isGroupByScheduleGroup || selectedScheduleGroup?.id
          ?
            <DataTable
              loading={loading}
              title={
                selectedScheduleGroup?.id
                ? (
                  <>
                    <BackWrapper>
                      <i
                        className="bx bx-arrow-back"
                        onClick={() => {
                          setSelectedScheduleGroup(undefined);
                        }}
                      />
                    </BackWrapper>
                    <div style={{ marginLeft: '28px' }}>{`Nhóm đi ca ${selectedScheduleGroup.name}`}</div>
                  </>
                )
                : `Bảng chấm công tháng ${filter?.TuNgay ? moment(filter.TuNgay).format('MM') : moment().format('MM')}`
              }
              columns={columns}
              data={data.map((employee, index) => ({
                index: (index + 1) + ((pageIndex - 1) * pageSize),
                id: employee?.idNhanVien ?? 0,
                code: employee?.maNV ?? '',
                name: employee?.tenNV ?? '',
                position: employee?.chucVu ?? '',
                hoursWork: (employee?.ngayChamCong ?? []).reduce((total, attendance) => total + (attendance?.soGioLam ?? 0), 0),
              }))}
              totalRows={totalSizes}
              onPageChange={(index, size) => {
                if (index !== pageIndex) {
                  setPageIndex(index);
                }
                if (size !== pageSize) {
                  setPageSize(size);
                }
              }}
              rowActions={[
                {
                  name: 'detail',
                  label: 'Chi tiết',
                  icon: 'detail',
                  color: 'info',
                  action: (d) => window.open(`/attendance/${d.id}`, '_blank'),
                },
              ]}
              tableActions={[
                {
                  name: 'sync',
                  label: 'Đồng bộ',
                  icon: 'sync',
                  color: 'warning',
                  action: () => setSyncAttendanceModal(true),
                },
                {
                  name: 'export',
                  label: 'Xuất báo cáo',
                  icon: 'export',
                  color: 'success',
                  dropdown: true,
                  dropdownActions: [
                    {
                      name: 'exportHistoryAttendances',
                      label: 'Xuất báo cáo lịch sử chấm công',
                      onClick: () => exportReport(apiLinks.export.historyAttendances, 'Xuất báo cáo lịch xử chấm công'),
                    },
                    {
                      name: 'exportStatisticAttendances',
                      label: 'Xuất báo cáo thống kê chi tiết chấm công',
                      onClick: () => exportReport(apiLinks.export.statisticAttendances, 'Xuất báo cáo thống kê chi tiết chấm công'),
                    },
                    {
                      name: 'exportSynthenticStatisticAttendances',
                      label: 'Xuất báo cáo thống kê tổng hợp chấm công',
                      onClick: () => exportReport(apiLinks.export.synthenticStatisticAttendances, 'Xuất báo cáo thống kê tổng hợp chấm công'),
                    },
                  ],
                },
              ]}
            />
          :
            <DataTable
              loading={loading}
              title="Nhóm đi ca"
              columns={columnForScheduleGroup}
              data={
                (scheduleGroups.data || [])
                  .map((o, i) => ({ ...o, index: (i + 1) + ((pageIndex - 1) * pageSize) }))
              }
              totalRows={scheduleGroups?.totalCounts}
              onPageChange={(index, size) => {
                if (size !== pageSize) {
                  if (size === 10) {
                    setPageSize(size);
                  } else {
                    setPageIndex(0);
                    setPageSize(size);
                  }
                } else {
                  setPageIndex(index);
                }
              }}
              rowActions={[
                {
                  name: 'detail',
                  label: 'Chi tiết',
                  icon: 'detail',
                  color: 'info',
                  action: (r) => {
                    setPageIndex(1);
                    setSelectedScheduleGroup(r);
                  },
                },
              ]}
            />
      }

      <SyncAttendanceStatisticModal
        open={syncAttendanceModal}
        onClose={() => setSyncAttendanceModal(false)}
      />
    </div>
  );
};

export default AttendancesPage;
