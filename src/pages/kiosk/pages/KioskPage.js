import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import DataTable from 'components/data-table';
import SearchBar from 'components/SearchBar';
import CreateKioskModal from 'pages/kiosk/components/CreateKioskModal';
import UpdateKioskModal from 'pages/kiosk/components/UpdateKioskModal';
import DeleteKioskModal from 'pages/kiosk/components/DeleteKioskModal';

import { useDispatch, useSelector } from 'react-redux';
import { getKiosks } from 'pages/kiosk/actions/kiosk';

const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
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
    name: 'tenKios',
    align: 'left',
    label: 'Tên kiosk',
  },
  {
    name: 'guid',
    align: 'left',
    label: 'Guid',
  },
];

const KioskPage = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({});

  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(undefined);
  const [modalDelete, setModalDelete] = useState(undefined);

  const dispatch = useDispatch();
  const {
    kiosks,
    getKiosksLoading,
  } = useSelector((state) => state.kiosk);
  const { data: kiosList, totalCount } = kiosks;

  const handleRefresh = () => {
    let payload = {
      page_number: pageIndex,
      page_size: pageSize,
      ...filter,
    };
    dispatch(getKiosks(payload));
  };
  useEffect(() => {
    handleRefresh();
  }, [filter, pageIndex, pageSize]);

  return (
    <div className="page-content">
      <DataTable
        loading={getKiosksLoading}
        title="Danh sách Kiosk"
        columns={columns}
        data={
          (kiosList || [])
            .map((o, i) => ({ ...o, index: (i + 1) + ((pageIndex - 1) * pageSize) }))
        }
        totalRows={totalCount}
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
            name: 'detail',
            label: 'Thêm',
            color: 'success',
            icon: 'plus',
            action: () => setModalCreate(true),
          }
        ]}
        rowActions={[
          {
            name: 'edit',
            label: 'Sửa',
            icon: 'pencil',
            color: 'warning',
            action: (d) => setModalUpdate(d),
          },
          {
            name: 'delete',
            label: 'Xóa',
            color: 'danger',
            icon: 'trash-alt',
            action: (d) => setModalDelete(d),
          }
        ]}
      />

      <CreateKioskModal
        open={modalCreate}
        onRefresh={handleRefresh}
        onClose={() => setModalCreate(false)}
      />
      <UpdateKioskModal
        data={modalUpdate}
        onRefresh={handleRefresh}
        onClose={() => setModalUpdate(undefined)}
      />
      <DeleteKioskModal
        data={modalDelete}
        onRefresh={handleRefresh}
        onClose={() => setModalDelete(undefined)}
      />
    </div>
  );
}

export default KioskPage;