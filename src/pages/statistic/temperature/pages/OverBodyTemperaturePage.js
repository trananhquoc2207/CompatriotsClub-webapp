import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import DataTable from 'components/data-table';
import OverBodyTemperatureFilter from 'pages/statistic/temperature/components/temperature/OverBodyTemperatureFilter';

import { useDispatch, useSelector } from 'react-redux';
import { getOverBodyTemperatures } from 'pages/statistic/temperature/actions/statistic';
import genders from 'assets/mocks/genders.json';

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
    name: 'maNV',
    align: 'left',
    label: 'Mã nhân viên',
    render: (r) => r?.Employee?.maNV ?? '',
  },
  {
    name: 'tenNV',
    align: 'left',
    label: 'Tên nhân viên',
    render: (r) => r?.Employee?.tenNV ?? '',
  },
  {
    name: 'gioiTinh',
    label: 'Giới tính',
    align: 'left',
    render: (r) => genders[r?.Employee?.gioiTinh || 0],
  },
  {
    name: 'nhietdo',
    label: 'Nhiệt độ',
    align: 'center',
    render: (r) => `${r?.MaximumBodyTemperature?.MaximumTemperature ?? 0} ℃`,
  },
];

const OverBodyTemperaturePage = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const history = useHistory();
  const dispatch = useDispatch();
  const {
    overBodyTemperatureFilter,
    overBodyTemperatures: { data, totalSizes },
    getOverBodyTemperatureLoading,
  } = useSelector((state) => state.statistic);

  const getData = useCallback(() => {
    dispatch(getOverBodyTemperatures({
      page_number: pageIndex,
      page_size: pageSize,
      FromDate: moment().format('YYYY-MM-DD'),
      ToDate: moment().format('YYYY-MM-DD'),
      ...overBodyTemperatureFilter,
    }));
  }, [dispatch, overBodyTemperatureFilter, pageIndex, pageSize]);
  useEffect(getData, [getData]);

  return (
    <div className="page-content">
      <OverBodyTemperatureFilter />
      <DataTable
        loading={getOverBodyTemperatureLoading}
        title="Danh sách nhân viên có thân nhiệt vượt quy định"
        columns={columns}
        data={
          (data || [])
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
        rowActions={[
          {
            name: 'detail',
            label: 'Chi tiết',
            icon: 'detail',
            action: (d) => history.push(`/employee/${d.id}`, { from: history.location.pathname }),
          },
        ]}
      />
    </div>
  );
};

export default OverBodyTemperaturePage;
