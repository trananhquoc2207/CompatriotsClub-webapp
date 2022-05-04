import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import DataTable from 'components/data-table';

import { useDispatch, useSelector } from 'react-redux';
import CreateModal from '../components/modal/CreateModal';
import UpdateModal from '../components/modal/UpdateModal';
import DeleteModal from '../components/modal/DeleteModal';
import { getRole } from '../actions/Role';

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
    name: 'name',
    align: 'left',
    label: 'Tên vai trò',
  },
  {
    name: 'description',
    align: 'left',
    label: 'Miêu tả',
  },
  // {
  //   name: 'scheduleLoops',
  //   align: 'left',
  //   label: 'Lịch làm việc',
  //   render: (r) => ((r?.scheduleLoops || []).map((o, i) => (
  //     <div style={{ margin: '10px 0px' }}>{(`Lịch ${i + 1}: ${o?.shift?.timeBegin.slice(0, 5)} - ${o?.shift?.timeEnd.slice(0, 5)}`) ?? '--:--'}</div>
  //   ))),
  // },

];

const RolePage = () => {
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
    roleList: { data, totalCounts },
    getRoleLoading,
  } = useSelector((state) => state.role);
  const handleRefresh = () => {
    const payload = {
      pageIndex,
      pageSize,
    };
    dispatch(getRole(payload));
  };
  useEffect(() => {
    handleRefresh();
  }, [pageIndex, pageSize]);

  return (
    <>
      <div className="page-content">
        <DataTable
          loading={getRoleLoading}
          title="Danh sách vai trò"
          columns={columns}
          data={
            (data || [])
              .map((o, i) => ({ ...o, index: (i + 1) }))
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
              color: 'info',
              action: (d) => history.push(`/role-detail/${d.id}`, { from: history.location.pathname }),
            },
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
              label: 'Thêm vai trò mới',
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

export default RolePage;
