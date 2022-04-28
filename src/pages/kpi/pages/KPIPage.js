import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import DataTable from 'components/data-table';
import KPIFilter from 'pages/kpi/components/KPIFilter';

import { useDispatch, useSelector } from 'react-redux';
import { getEmployees } from 'pages/employee/actions/employee';

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
  },
  {
    name: 'tenNV',
    align: 'left',
    label: 'Tên nhân viên',
  },

  {
    name: 'chucVu',
    align: 'left',
    label: 'Chức vụ',
    render: (r) => r.chucVu?.tenChucVu ?? '',
  },
  {
    name: 'donVi',
    align: 'left',
    label: 'Đơn vị',
    render: (r) => r.donVi?.tenDonVi ?? '',
  },
];

const KpiPage = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const history = useHistory();
  const dispatch = useDispatch();
  const {
    kpiFilter,
    employees: { data, totalSizes },
    getEmployeesLoading,
  } = useSelector((state) => state.employee);

  const getData = useCallback(() => {
    dispatch(getEmployees({
      page_number: pageIndex,
      page_size: pageSize,
      ...kpiFilter,
    }));
  }, [dispatch, kpiFilter, pageIndex, pageSize]);
  useEffect(getData, [getData]);

  return (
    <div className="page-content">
      <KPIFilter />
      <DataTable
        loading={getEmployeesLoading}
        title="Danh sách nhân viên"
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
            color: 'info',
            action: (d) => history.push(`/kpi/${d.id}`, { from: history.location.pathname }),
          },
        ]}
      />
    </div>
  );
};

export default KpiPage;
