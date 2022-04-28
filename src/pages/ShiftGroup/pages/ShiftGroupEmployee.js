import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import DataTable from 'components/data-table';

import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeDetails } from 'pages/employee/actions/employee';
import { getScheduleGroupDetail } from '../actions/ShiftGroup';
import SearchBar from 'components/SearchBar';
import DeleteScheduleLoopModal from '../components/modal/DeleteScheduleLoopModal';
import AddScheduleLoopModal from '../components/modal/AddScheduleLoopModal';
import DeleteEmployeeModal from '../components/group-detail/DeleteEmployeeModal';
import AddEmployeeModal from 'pages/ShiftGroup/components/group-detail/AddEmployeeModal';

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
    label: 'Mã nhân viên',
  },
  {
    name: 'name',
    align: 'left',
    label: 'Tên nhân viên',
  },

];

const ShiftGroupEmployee = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [filter, setFilter] = useState(undefined);
  const [modalCreate, setModalCreate] = useState(undefined);
  const [modalUpdate, setModalUpdate] = useState(undefined);
  const [modalDelete, setModalDelete] = useState(undefined);
  const [modalDeleteEmployee, setModalDeleteEmployee] = useState(undefined);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10)
  const {
    scheduleGroupDetail: { data },
    getScheduleGroupDetailLoading,
  } = useSelector((state) => state.shiftGroup);
  const handleRefresh = () => {
    dispatch(getScheduleGroupDetail(id));
  };
  const handleDataTable = (arr) => {
    if (pageIndex !== 0 && pageSize !== 10) {
      return arr?.slice(pageSize * (pageIndex / 10), pageSize * (pageIndex / 10) + pageSize);
    }
    else
      return arr?.slice(pageSize !== 10 ? 0 : pageIndex, pageSize !== 10 ? pageSize : (pageIndex + 10));
  }
  useEffect(() => {
    if (id) {
      handleRefresh();
    }
    if (filter) {
      setPageIndex(0);
    }
  }, [id, filter]);

  return (
    <div className="page-content">
      <Wrapper>
        <div className="header">
          {(history.location?.state?.from ?? '') === '/shift-group' && (
            <div className="back" onClick={() => history.push('/shift-group')}>
              <i className="bx bx-arrow-back" />
              Quay lại
            </div>
          )}
        </div>
        <div>
          <SearchBarWrapper>
            <SearchBar
              text='Nhập mã nhân viên để tìm kiếm'
              onChange={(code) => setTimeout(() => setFilter(code), 1500)} />
          </SearchBarWrapper>
          <DataTable
            loading={getScheduleGroupDetailLoading}
            title={`Nhóm đi ca: ${data?.code} - ${data?.name}`}
            columns={columns}
            data={
              (handleDataTable(filter ? data?.employees.filter(o => o.code === filter) : data?.employees) || [])
                .map((o, i) => ({ ...o, index: (pageIndex !== 0 && pageSize !== 10) ? (pageSize * (pageIndex / 10) + i + 1) : (pageIndex + i + 1) }))
            }
            //pageSize x pageIndex + pageSize
            totalRows={data?.employees?.length}
            onPageChange={(index, size) => {
              if (index !== pageIndex) {
                if (pageSize != 10) {
                  setPageIndex(0);
                }
                else {
                  setPageIndex((index - 1) * 10);
                }
                setPageIndex((index - 1) * 10);
              }
              if (size !== pageSize) {
                if (pageSize !== 0) {
                  setPageIndex(0);
                }
                setPageSize(size);
              }
            }}
            rowActions={[
              {
                name: 'delete',
                label: 'Xóa',
                icon: 'trash-alt',
                color: 'danger',
                action: (d) => setModalDeleteEmployee({ scheduleGroup: data, employee: d?.id }),
              },
            ]}
            tableActions={[
              {
                name: 'detail',
                label: 'Bổ sung ca làm việc',
                color: 'warning',
                icon: 'plus',
                style: { display: data?.scheduleLoopConfigurationId ? 'none' : '' },
                action: (d) => setModalUpdate(data),
              },
              {
                name: 'detail',
                label: 'Xóa lịch làm việc hiện tại',
                color: 'danger',
                icon: 'trash-alt',
                style: { display: data?.scheduleLoopConfigurationId ? '' : 'none' },
                action: (d) => setModalDelete(data),
              },
              {
                name: 'detail',
                label: 'Thêm nhân viên',
                color: 'success',
                icon: 'plus',
                action: (d) => setModalCreate(data),
              },
            ]}
          />
        </div>
      </Wrapper>
      <AddEmployeeModal
        data={modalCreate}
        onRefresh={handleRefresh}
        onClose={() => setModalCreate(false)}
      />
      <AddScheduleLoopModal
        data={modalUpdate}
        onRefresh={handleRefresh}
        onClose={() => setModalUpdate(false)}
      />
      <DeleteEmployeeModal
        data={modalDeleteEmployee}
        onRefresh={handleRefresh}
        onClose={() => setModalDeleteEmployee(undefined)}
      />
      <DeleteScheduleLoopModal
        data={modalDelete}
        onRefresh={handleRefresh}
        onClose={() => setModalDelete(undefined)}
      />
    </div>
  );
};

export default ShiftGroupEmployee;
