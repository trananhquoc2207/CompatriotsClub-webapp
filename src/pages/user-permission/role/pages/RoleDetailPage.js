import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import DataTable from 'components/data-table';

import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeDetails } from 'pages/employee/actions/employee';
import SearchBar from 'components/SearchBar';
import { Col, Row } from 'reactstrap';
import { getRoleDetail, getRolePermission, getScheduleGroupDetail } from '../actions/Role';
import AddUserModal from '../components/modal/AddUserModal';
import RemoveUserModal from '../components/modal/RemoveUserModal';
import RemovePermissionModal from '../components/modal/RemovePermissionModal.js';
import AddPermissionModal from '../components/modal/AddPermissionModal';

const Wrapper = styled.div`
  position: relative;
  min-height: 400px;
  & .header {
    display: flex;
    margin-bottom: 10px;
    & .back {
      cursor: pointer;
      font-size: 20px;
      margin-right: 12px;
      & i {
        padding: 16px 0;
        line-height: none;
      }
    }
    & .title {
      font-size: 20px;
      font-weight: 700;
    }
    & .description {
      font-style: italic;
    }
  }
  & .filter {
    margin-bottom: 10px;
  }
`;
const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
  }
`;
const userColumns = [

  {
    name: 'username',
    align: 'left',
    label: 'Tài khoản',
    render: (r) => r?.username ?? '',
  },
  {
    name: 'employee',
    align: 'left',
    label: 'Nhân viên',
    render: (r) => r?.employee ? `${r?.employee?.code} | ${r?.employee?.name}` : undefined,
  },

];
const permissionColumns = [
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
const RoleDetailPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [totalLoading, setTotalLoading] = useState(10);
  const [pageSize, setPageSize] = useState(10);
  const [modalCreate, setModalCreate] = useState(undefined);
  const [modalAddUser, setModalAddUser] = useState(undefined);
  const [modalAddPermission, setModalAddPermission] = useState(undefined);
  const [modalRemoveUser, setModalRemoveUser] = useState(undefined);
  const [modalRemovePermission, setModalRemovePermission] = useState(undefined);
  const {
    roleDetail,
    getRoleDetailLoading,
    rolePermission,
    getRolePermissionLoading,
  } = useSelector((state) => state.role);
  const handleRefresh = () => {
    dispatch(getRoleDetail(id));
    dispatch(getRolePermission(id));
  };
  useEffect(() => {
    if (id) {
      handleRefresh();
    }
  }, [id]);

  return (
    <div className="page-content">
      <Wrapper>
        <div className="header">
          {(history.location?.state?.from ?? '') === '/role' && (
            <div className="back" onClick={() => history.push('/role')}>
              <i className="bx bx-arrow-back" />
              <span className="ml-2" style={{ fontWeight: '600', color: '#2782e5' }}>
                {`Nhóm vai trò : ${roleDetail?.data?.name}`}
              </span>
            </div>
          )}
        </div>
        <Row>
          <Col xs={6}>
            <DataTable
              loading={getRoleDetailLoading}
              title="Danh sách nhân viên"
              columns={userColumns}
              onPageChange={(index, size) => {
                if (index > 0) {
                  setPageSize(size + 10);
                }
                if (size !== pageSize) {
                  setPageSize(size);
                  setTotalLoading(size);
                }
              }}
              data={
                totalLoading === 10
                  ? (roleDetail?.data?.users || [])?.slice(pageSize - 10, pageSize)
                  : (roleDetail?.data?.users || [])
                    .map((o, i) => ({ ...o, index: (i + 1) }))
              }
              totalRows={(roleDetail?.data?.users ?? []).length}
              rowActions={[
                {
                  name: 'delete',
                  label: 'Xóa',
                  icon: 'trash-alt',
                  color: 'danger',
                  action: (d) => setModalRemoveUser({ role: id, employee: d?.id }),
                },
              ]}
              tableActions={[
                {
                  name: 'detail',
                  color: 'success',
                  icon: 'plus',
                  action: (d) => setModalAddUser(id),
                },
              ]}
            />
          </Col>
          <Col xs={6}>
            <DataTable
              loading={getRolePermissionLoading}
              title="Bảng quyền"
              columns={permissionColumns}
              data={
                (rolePermission?.data || [])
                  .map((o, i) => ({ ...o, index: (i + 1) }))
              }
              totalRows={rolePermission.totalCounts}
              rowActions={[
                {
                  name: 'delete',
                  label: 'Xóa',
                  icon: 'trash-alt',
                  color: 'danger',
                  action: (d) => setModalRemovePermission({ role: id, permission: d?.id }),
                },
              ]}
              tableActions={[
                {
                  name: 'detail',
                  color: 'success',
                  icon: 'plus',
                  action: (d) => setModalAddPermission(id),
                },
              ]}
            />
          </Col>
        </Row>
      </Wrapper>
      <AddUserModal
        data={modalAddUser}
        onRefresh={handleRefresh}
        onClose={() => setModalAddUser(false)}
      />
      <AddPermissionModal
        data={modalAddPermission}
        onRefresh={handleRefresh}
        onClose={() => setModalAddPermission(false)}
      />
      <RemoveUserModal
        data={modalRemoveUser}
        onRefresh={handleRefresh}
        onClose={() => setModalRemoveUser(undefined)}
      />
      <RemovePermissionModal
        data={modalRemovePermission}
        onRefresh={handleRefresh}
        onClose={() => setModalRemovePermission(undefined)}
      />
      {/*  <AddScheduleLoopModal
        data={modalUpdate}
        onRefresh={handleRefresh}
        onClose={() => setModalUpdate(false)}
      />
      <DeleteScheduleLoopModal
        data={modalDelete}
        onRefresh={handleRefresh}
        onClose={() => setModalDelete(undefined)}
      /> */}
    </div>
  );
};

export default RoleDetailPage;
