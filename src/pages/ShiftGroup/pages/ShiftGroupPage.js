import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import CustomToolTip from 'components/CustomToolTip';
import DataTable from 'components/data-table';

import { useDispatch, useSelector } from 'react-redux';
import { TOKEN } from 'utils/contants';
import { useAuth } from 'hooks';
import CreateModal from '../components/modal/CreateModal';
import UpdateModal from '../components/modal/UpdateModal';
import DeleteModal from '../components/modal/DeleteModal';
import { getScheduleGroup } from '../actions/ShiftGroup';
import EmployeeList from '../components/modal/EmployeeList';
import ShiftGroupFilter from '../components/filter/ShiftGroupFilter';

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
  {
    name: 'scheduleLoops',
    align: 'left',
    label: 'Lịch làm việc',
    render: (r) => ((r?.scheduleLoops || []).map((o, i) => (
      <div style={{ margin: '10px 0px' }}>{(`Lịch ${i + 1}: ${o?.shift?.timeBegin.slice(0, 5)} - ${o?.shift?.timeEnd.slice(0, 5)}`) ?? '--:--'}</div>
    ))),
  },

];

const ShiftGroupPage = () => {
  const history = useHistory();
  const { isAdmin } = useAuth();
  const profile = localStorage.getItem(TOKEN) ? JSON.parse(localStorage.getItem(TOKEN)) : null;
  const [loading, setLoading] = useState(true);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(undefined);
  const [modalDetail, setModalDetail] = useState(undefined);
  const [modalDelete, setModalDelete] = useState(undefined);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(1);
  const [filter, setFilter] = useState({});

  const dispatch = useDispatch();
  const {
    scheduleGroups: { data, totalCounts },
    getScheduleGroupLoading,
  } = useSelector((state) => state.shiftGroup);
  const handleRefresh = () => {
    const payload = profile.roleName === 'ADMIN' ? {
      pageIndex,
      pageSize,
      ...filter,
    }
      : {
        pageIndex,
        pageSize,
        ...filter,
        scheduleGroupLeaderId: profile?.idNhanVien ?? 'undefined',
      };
    dispatch(getScheduleGroup(payload));
  };
  useEffect(() => {
    handleRefresh();
  }, [filter, pageIndex, pageSize]);

  return (
    <>
      <div className="page-content">
        <ShiftGroupFilter onChange={(f) => setFilter(f)} />
        <DataTable
          loading={getScheduleGroupLoading}
          title="Nhóm đi ca"
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
                setPageSize(size);
              } else {
                setPageIndex(0);
                setPageSize(size);
              }
            }
          }}
          rowActions={[
            {
              name: 'detail',
              label: 'Chi tiết',
              icon: 'detail',
              color: 'info',
              action: (d) => history.push(`/group/${d.id}`, { from: history.location.pathname }),
            },
            {
              name: 'edit',
              label: 'Sửa',
              icon: 'pencil',
              color: 'warning',
              action: (d) => setModalUpdate(d.id),
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
              label: 'Thêm nhóm mới',
              color: 'success',
              icon: 'plus',
              style: { display: profile?.isLeaderOfScheduleGroup ? 'none' : '' },
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

export default ShiftGroupPage;
