import React, { useState, useEffect, useCallback, useMemo } from 'react';
import moment from 'moment';

import DataTable from 'components/data-table';
import MealStatisticFilter from 'pages/statistic/meal/components/MealStatisticFilter';

import { useDispatch, useSelector } from 'react-redux';
import { exportExcel } from 'actions/global';
import apiLinks from 'utils/api-links';
import { getMealStatistic } from '../actions/meal';

const MealStatisticPage = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch();
  const {
    mealStatisticFilter: filter,
    mealStatistic: { data, totalSizes },
    getMealStatisticLoading,
  } = useSelector((state) => state.mealStatistic);
  const { exportLoading } = useSelector((state) => state.global);

  const loading = exportLoading || getMealStatisticLoading;
  const columns = useMemo(() => ([
    {
      name: 'index',
      label: '#',
      align: 'center',
      style: {
        width: '20px',
      },
    },
    {
      name: 'maBoPhan',
      align: 'left',
      label: 'Mã',
      render: (r) => r?.maBoPhan ?? '',
    },
    {
      name: 'tenBoPhan',
      align: 'left',
      label:
        typeof filter.LoaiDonVi !== 'undefined'
          ? filter.LoaiDonVi === 0
            ? 'Khối'
            : filter.LoaiDonVi === 1
              ? 'Phòng ban'
              : filter.LoaiDonVi === 2
                ? 'Bộ phận'
                : ''
          : 'Khối',
      render: (r) => r?.tenBoPhan ?? '',
    },
    {
      name: 'ca1',
      label: 'Ca Ngày',
      align: 'center',
      render: (r) => (
        <span>
          Mặn:
          {' '}
          {r?.caNgay?.comMan ?? 0}
          {' '}
          phần, chay:
          {' '}
          {r?.caNgay?.comChay ?? 0}
          {' '}
          phần
        </span>
      ),
    },
    {
      name: 'tCa1',
      label: 'Tăng ca ngày',
      align: 'center',
      render: (r) => (
        <span>
          Mặn:
          {' '}
          {r?.tangCaNGay?.comMan ?? 0}
          {' '}
          phần, chay:
          {' '}
          {r?.tCa1?.comChay ?? 0}
          {' '}
          phần
        </span>
      ),
    },
    {
      name: 'ca3',
      label: 'Ca đêm',
      align: 'center',
      render: (r) => (
        <span>
          Mặn:
          {' '}
          {r?.caDem?.comMan ?? 0}
          {' '}
          phần, chay:
          {' '}
          {r?.tangCaDem?.comChay ?? 0}
          {' '}
          phần
        </span>
      ),
    },
    {
      name: 'tCa2',
      label: 'Tăng ca đêm',
      align: 'center',
      render: (r) => (
        <span>
          Mặn:
          {' '}
          {r?.tCa2?.comMan ?? 0}
          {' '}
          phần, chay:
          {' '}
          {r?.tCa2?.comChay ?? 0}
          {' '}
          phần
        </span>
      ),
    },
    {
      name: 'tongNCC',
      label: 'Tổng',
      align: 'center',
      render: (r) => `${r?.tongNCC ?? 0} phần`,
    },
  ]), [filter]);

  const exportReport = useCallback((url, fileName) => {
    dispatch(exportExcel({
      method: 'GET',
      url,
      params: {
        Ngay: filter?.Ngay ?? moment().format('YYYY-MM-DD'),
        TuNgay: filter?.TuNgay ?? moment().startOf('month').format('YYYY-MM-DD'),
        DenNgay: filter?.DenNgay ?? moment().endOf('month').format('YYYY-MM-DD'),
        LoaiDonVi: filter?.LoaiDonVi ?? 0,
      },
      fileName,
    }));
  }, [filter]);

  const getData = useCallback(() => {
    dispatch(getMealStatistic({
      page_number: pageIndex,
      page_size: pageSize,
      Ngay: filter.Ngay ?? moment().format('YYYY-MM-DD'),
      ...filter,
    }));
  }, [dispatch, filter, pageIndex, pageSize]);
  useEffect(getData, [getData]);

  return (
    <div className="page-content">
      <MealStatisticFilter />
      <DataTable
        loading={loading}
        title={`Thống kê đăng kí cơm ngày ${moment(filter.Ngay).format('DD-MM-YYYY') || moment().format('DD-MM-YYYY')}`}
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
        tableActions={[
          {
            name: 'export',
            label: 'Xuất báo cáo',
            icon: 'export',
            color: 'success',
            dropdown: true,
            dropdownActions: [
              {
                name: 'exportStatisticMealByDay',
                label: 'Xuất báo cáo đăng ký cơm theo ngày',
                onClick: () => exportReport(apiLinks.export.statisticMealByDay, 'Xuất báo cáo đăng ký cơm theo ngày'),
              },
              {
                name: 'exportStatisticMealByMonth',
                label: 'Xuất báo cáo đăng ký cơm theo tháng',
                onClick: () => exportReport(apiLinks.export.statisticMealByMonth, 'Xuất báo cáo đăng ký cơm theo tháng'),
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default MealStatisticPage;
