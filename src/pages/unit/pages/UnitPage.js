import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import CustomToolTip from 'components/CustomToolTip';
import Filter from 'pages/employee/components/EmployeeFilter';
import DataTable from 'components/data-table';

import { useDispatch, useSelector } from 'react-redux';
import CreateModal from '../components/CreateModal';
import UpdateModal from '../components/UpdateModal';
import DeleteModal from '../components/DeleteModal';
import { getUnits } from '../actions/unit';
import UnitFilter from '../components/UnitFilter';

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
    name: 'maDonVi',
    align: 'left',
    label: 'Mã đơn vị',
  },
  {
    name: 'tenDonVi',
    align: 'left',
    label: 'Tên đơn vị',
  },
  {
    name: 'tenDonVi',
    align: 'left',
    label: 'Đơn vị trực thuộc',
    render: (r) => r?.donViCha?.tenDonVi ?? '-',
  },

];

const UnitPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(undefined);
  const [modalDelete, setModalDelete] = useState(undefined);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(1);
  const [filter, setFilter] = useState({});

  const dispatch = useDispatch();
  const { units, getUnitsLoading } = useSelector((s) => s.unit);
  const { data: unitList, totalSizes } = units;

  const handleRefresh = () => {
    const payload = {
      page_number: pageIndex,
      page_size: pageSize,
      ...filter,
    };
    dispatch(getUnits(payload));
  };
  useEffect(() => {
    handleRefresh();
  }, [filter, pageIndex, pageSize]);

  return (
    <>
      <div className="page-content">
        <UnitFilter onChange={(f) => setFilter(f)} />
        <DataTable
          loading={getUnitsLoading}
          title="Đơn vị"
          columns={columns}
          data={
            (unitList || [])
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
              name: 'edit',
              label: 'Sửa',
              color: 'warning',
              icon: 'pencil',
              action: (d) => setModalUpdate(d),
            },
            {
              name: 'delete',
              label: 'Xóa',
              color: 'danger',
              icon: 'trash-alt',
              action: (d) => setModalDelete(d),
            },
          ]}
          tableActions={[
            {
              name: 'detail',
              label: 'Thêm',
              color: 'success',
              icon: 'plus',
              action: () => setModalCreate(true),
            },
          ]}
        />
      </div>
      <CreateModal
        open={modalCreate}
        onRefresh={handleRefresh}
        onClose={() => setModalCreate(false)}
      />
      <UpdateModal
        data={modalUpdate}
        onRefresh={handleRefresh}
        onClose={() => setModalUpdate(undefined)}
      />
      <DeleteModal
        data={modalDelete}
        onRefresh={handleRefresh}
        onClose={() => setModalDelete(undefined)}
      />
    </>
  );
};

export default UnitPage;
