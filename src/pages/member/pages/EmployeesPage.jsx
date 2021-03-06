/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import DataTable from 'components/data-table';
import EmployeeFilter from 'pages/member/components/EmployeeFilter';
import CreateModal from 'pages/member/components/CreateModal';
import UploadModal from 'pages/member/components/UploadModal';
import UpdateModal from 'pages/member/components/UpdateModal';
import DeleteModal from 'pages/member/components/DeleteModal';

import { useDispatch, useSelector } from 'react-redux';
import { exportExcel } from 'actions/global';
import { getEmployees } from 'pages/member/actions/member';
import apiLinks from 'utils/api-links';
import LeavingModal from '../components/LeavingModal';
import SwitchAdminModal from '../components/SwitchAdminModal';
import AvatarUploadModal from '../components/details/AvatarUploadModal';

const ImageStatusWrapper = styled.div`
  & span {
    display: inline-block;
    padding: 0.25em 0.4em;
    color: ${(props) => props.color};
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
    border: 1px solid ${(props) => props.color};
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    & .hover {
      &:hover {
        cursor: pointer;
        color: white;
        background-color: ${(props) => props.color};
      }
    }
  }
`;

const EmployeesPage = () => {
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(undefined);
  const [modalDelete, setModalDelete] = useState(undefined);
  const [modalLeaving, setModalLeaving] = useState(undefined);
  const [modalSwitchAdmin, setModalSwitchAdmin] = useState(undefined);
  const [modalBackToWork, setModalBackToWork] = useState(undefined);
  const [modalFaceID, setModalFaceID] = useState(undefined);
  const [modalUploadImage, setModalUploadImage] = useState(undefined);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const history = useHistory();
  const dispatch = useDispatch();
  const {
    employeeFilter,
    employees,
    getEmployeesLoading,
  } = useSelector((state) => {
    return state.employee});
  const {
    exportLoading,
  } = useSelector((state) => state.global);
  const { data: employeeList, totalSizes } = employees;
  const loading = exportLoading || getEmployeesLoading;
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
      name: 'name',
      align: 'left',
      label: 'T??n h???i vi??n',
    },
    {
      name: 'gender',
      align: 'left',
      label: 'Gi???i t??nh',
      render: (r) =>{
        if( r.gender==0)
          return 'Nam'
         return  'N???'},
    },
    {
      name: 'phoneNumber',
      label: 'S??? ??i???n tho???i',
      align: 'right',
    },
    {
      idcard: 'idcard',
      align: 'left',
      label: 'Ch???ng minh nh??n d??n',
      render: (r) => r.idcard ?? '',
    },
  ]), [setModalUploadImage]);
  const exportReport = useCallback((url, fileName) => {
    dispatch(exportExcel({
      method: 'GET',
      url,
      params: {
        ...employeeFilter,
        isLeft:
          typeof employeeFilter.isLeft !== 'undefined'
          ? !!employeeFilter.isLeft.includes('0')
          : undefined,
      },
      fileName,
    }));
  }, [employeeFilter]);

  const getData = useCallback(() => {
    dispatch(getEmployees({
      ...employeeFilter,
      PageIndex: pageIndex,
      PageSize: pageSize,
      isLeft:
        typeof employeeFilter.isLeft !== 'undefined'
        ? !!employeeFilter.isLeft.includes('0')
        : undefined,
    }));
  }, [employeeFilter, pageIndex, pageSize]);
  useEffect(getData, [getData]);
  return (
    <>
      <div className="page-content">
        <EmployeeFilter />
        <DataTable
          // loading={loading}
          title="Danh s??ch h???i vi??n"
          columns={columns}
          data={
            (employeeList || [])
              .map((o, i) => ({ ...o, index: (i + 1) + ((pageIndex) * (pageSize)) }))
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
          rowActions={ [
            {
              name: 'detail',
              label: 'Chi ti???t',
              color: 'info',
              icon: 'detail',
              action: (d) => history.push(`/member/${d.id}`, { from: history.location.pathname }),
            },
            {
              name: 'edit',
              label: 'S???a',
              color: 'warning',
              icon: 'pencil',
              action: (d) => setModalUpdate(d),
            },
            {
              name: 'delete',
              label: 'X??a h???i vi??n',
              color: 'danger',
              icon: 'exit',
              action: (d) => setModalDelete(d),
            },
            {
              name: 'switch',
              label: 'C???p nh???t quy???n cho h???i vi??n',
              color: 'secondary',
              icon: 'key',
              action: (d) => setModalSwitchAdmin(d),
            },
          ]
           
          }
          tableActions={[
            {
              name: 'detail',
              label: 'Th??m nh??n vi??n',
              color: 'success',
              icon: 'plus',
              action: () => setModalCreate(true),
            },
            // {
            //   name: 'upload',
            //   label: 'T???i t???p tin l??n',
            //   color: 'info',
            //   icon: 'cloud-upload',
            //   action: () => setModalUpload(true),
            // },
            {
              name: 'export',
              label: 'Xu???t t???p tin excel',
              color: 'warning',
              icon: 'cloud-download',
              action: () => exportReport(apiLinks.employee.export, 'Danh s??ch h???i vi??n'),
            },
          ]}
        />
      </div>
      <CreateModal
        open={modalCreate}
        onRefresh={getData}
        onClose={() => setModalCreate(false)}
      />
      <UpdateModal
        data={modalUpdate}
        onRefresh={getData}
        onClose={() => setModalUpdate(undefined)}
      />
      <DeleteModal
        data={modalDelete}
        onRefresh={getData}
        onClose={() => setModalDelete(undefined)}
      />
      <LeavingModal
        data={modalLeaving}
        onRefresh={getData}
        onClose={() => setModalLeaving(undefined)}
      />
      <SwitchAdminModal
        data={modalSwitchAdmin}
        onRefresh={getData}
        onClose={() => setModalSwitchAdmin(undefined)}
      />
      <UploadModal
        open={modalUpload}
        onRefresh={getData}
        onClose={() => setModalUpload(false)}
      />
      <AvatarUploadModal
        data={modalUploadImage}
        onClose={() => setModalUploadImage(undefined)}
        onRefresh={getData}
      />
    </>
  );
};

export default EmployeesPage;
