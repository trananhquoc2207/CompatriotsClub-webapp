import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import DataTable from 'components/data-table';
import OverBodyTemperatureFilter from 'pages/statistic/temperature/components/temperature/OverBodyTemperatureFilter';

import { useDispatch, useSelector } from 'react-redux';
import { getAbsentStatistic } from 'pages/statistic/time-off/actions/TimeOff';
import genders from 'assets/mocks/genders.json';
import TimeOffStatisticFilter from '../components/TimeOffStatisticFilter';
import ExportModal from '../components/ExportModal';

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
    name: 'employeeCode',
    align: 'left',
    label: 'Mã nhân viên',
    render: (r) => r?.employeeCode ?? '',
  },
  {
    name: 'employeeName',
    align: 'left',
    label: 'Tên nhân viên',
    render: (r) => r?.employeeName ?? '',
  },
  {
    name: 'unit',
    label: 'Đơn vị',
    align: 'left',
    render: (r) => r?.unit?.name ?? '',
  },
  {
    name: 'totalDays',
    label: 'Số ngày đã nghỉ',
    align: 'center',
    render: (r) => `${r?.totalDays ?? 0} ngày`,
  },
];

const TimeOffStatisticPage = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const present = new Date();
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    absentStatisticFilter: filter,
    absentStatistic: { data, totalCounts },
    getAbsentStatisticLoading,
  } = useSelector((state) => state.absentStatistic);
  const exportAction = useMemo(() => {
    return (
      <ExportModal
        from={(filter?.TuNgay ?? `01/${present.getMonth() + 1}/${present.getFullYear()}`).split('/').reverse().join('-')}
        to={(filter?.DenNgay ?? `${new Date(present.getFullYear(), present.getMonth() + 1, 0).getDate()}/${present.getMonth() + 1}/${present.getFullYear()}`).split('/').reverse().join('-')}
        unitId={filter?.idDonVi}
      />
    )
  }, [filter])
  const getData = useCallback(() => {
    dispatch(getAbsentStatistic({
      pageIndex,
      pageSize,
      ...filter,
    }));
  }, [dispatch, filter, pageIndex, pageSize]);
  useEffect(getData, [getData]);

  return (
    <div className="page-content">
      <TimeOffStatisticFilter />
      <DataTable
        loading={getAbsentStatisticLoading}
        title="Danh sách nhân viên nghỉ vắng"
        columns={columns}
        data={
          (data || [])
            .map((o, i) => ({ ...o, index: (i + 1) + ((pageIndex - 1) * pageSize) }))
        }
        totalRows={totalCounts}
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
            action: (d) => history.push(`/management/time-off/${d.employeeId}`, { from: history.location.pathname }),
          },
        ]}
        tableDropdownAction={exportAction}
      />
    </div>
  );
};

export default TimeOffStatisticPage;
