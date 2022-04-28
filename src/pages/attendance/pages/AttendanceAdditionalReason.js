import React, { useState, useEffect } from 'react';

import DataTable from 'components/data-table';
import CreateModal from 'pages/attendance/components/AttendanceReason/CreateModal';
import UpdateModal from 'pages/attendance/components/AttendanceReason/UpdateModal';
import DeleteModal from 'pages/attendance/components/AttendanceReason/DeleteModal';

import { useDispatch, useSelector } from 'react-redux';
import { getAttendanceAdditionalReason } from '../actions/attendance';

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
    name: 'reason',
    align: 'left',
    label: 'Lý do',
  },
];

const AttendanceAdditionalReasonPage = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(undefined);
  const [modalDelete, setModalDelete] = useState(undefined);

  const dispatch = useDispatch();
  const {
    attendanceAdditionalReason: { data, totalCounts },
    getAttendanceAdditionalReasonLoading,
  } = useSelector((state) => state.attendance);
  const handleRefresh = () => {
    const payload = {
      pageIndex,
      pageSize,
    };
    dispatch(getAttendanceAdditionalReason(payload));
  };
  useEffect(() => {
    handleRefresh();
  }, [pageIndex, pageSize]);

  return (
    <div className="page-content">
      <DataTable
        loading={getAttendanceAdditionalReasonLoading}
        title="Lý do bổ sung giờ chấm công"
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
        tableActions={[
          {
            name: 'detail',
            label: 'Thêm',
            color: 'success',
            icon: 'plus',
            action: () => setModalCreate(true),
          },
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
          },
        ]}
      />
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
    </div>
  );
};

export default AttendanceAdditionalReasonPage;
