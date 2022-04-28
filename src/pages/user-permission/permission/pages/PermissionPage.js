import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import CustomToolTip from 'components/CustomToolTip';
import DataTable from 'components/data-table';

import { useDispatch, useSelector } from 'react-redux';
import { TOKEN } from 'utils/contants';
import CreateModal from '../components/modal/CreateModal';
import UpdateModal from '../components/modal/UpdateModal';
import DeleteModal from '../components/modal/DeleteModal';
import { getPermission, getRole, getScheduleGroup } from '../actions/Permission';
import EmployeeList from '../components/modal/EmployeeList';

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
    label: 'Mã quyền',
  },
  {
    name: 'description',
    align: 'left',
    label: 'Mô tả',
  },
];

const PermissionPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(undefined);
  const [modalDetail, setModalDetail] = useState(undefined);
  const [modalDelete, setModalDelete] = useState(undefined);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(1);

  const dispatch = useDispatch();
  const {
    permissionList: { data, totalCounts },
    getPermissionLoading,
  } = useSelector((state) => state.permission);
  const handleRefresh = () => {
    const payload = {
      pageIndex,
      pageSize,
    };
    dispatch(getPermission(payload));
  };
  useEffect(() => {
    handleRefresh();
  }, [pageIndex, pageSize]);

  return (
    <>
      <div className="page-content">
        <DataTable
          loading={getPermissionLoading}
          title="Danh sách quyền"
          columns={columns}
          data={
            (data || [])
              .map((o, i) => ({ ...o, index: (i + 1) + ((pageIndex) * pageSize) }))
          }
          totalRows={totalCounts}
          onPageChange={(index, size) => {
            if (index !== pageIndex + 1) {
              setPageIndex(index - 1);
            }
            if (size !== pageSize) {
              if (size === 10) {
                setPageSize(size)
              }
              else {
                setPageIndex(0);
                setPageSize(size);
              }
            }
          }}
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
              icon: 'trash-alt',
              color: 'danger',
              action: (d) => setModalDelete(d),
            },
          ]}
          tableActions={[
            {
              name: 'detail',
              label: 'Thêm quyền mới',
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

export default PermissionPage;
