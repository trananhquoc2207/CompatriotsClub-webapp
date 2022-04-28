import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import DataTable from 'components/data-table';
import DeleteModal from 'pages/statistic/meal/components/DeleteModal';

import { useDispatch, useSelector } from 'react-redux';
import { getRiceRegisteredOfEmployee, updateMealType } from 'pages/statistic/meal/actions/meal';
import { RICE_TYPES } from 'utils/contants';
import { notify } from 'utils/helpers';

const StyledModal = styled(Modal)`
  .modal-title {
    font-weight: 700;
    font-size: 1.5em;
  }
`;

const RiceRegisteredOfEmployeeModal = ({ data, onRefresh, onClose }) => {
  const [modalDelete, setModalDelete] = useState(undefined);

  const dispatch = useDispatch();
  const {
    mealStatisticFilter: filter,
    riceRegisteredOfEmployee: { riceStatistics },
    getRiceRegisteredOfEmployeeLoading,
    updateMealTypeLoading,
  } = useSelector((state) => state.mealStatistic);

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
      name: 'tenLoaiDangKyCom',
      align: 'left',
      label: 'Ca đăng ký',
      render: (r) => r?.tenLoaiDangKyCom ?? '',
    },
    {
      name: 'loaiCom',
      label: 'Loại cơm',
      align: 'center',
      render: (r) => `${RICE_TYPES[r?.loaiCom ?? 0]}`,
    },
  ];

  const getData = useCallback(() => {
    dispatch(getRiceRegisteredOfEmployee(data?.id, {
      registrationDate:
        filter?.Ngay ? moment(filter.Ngay).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
    }));
  }, [data, filter, dispatch]);
  useEffect(getData, [getData]);

  const handleUpdateMealType = async (d) => {
    const payload = {
      idLoaiDangKyCom: d.idLoaiDangKyCom,
      loaiCom: d.loaiCom === 0 ? 1 : 0,
    };
    try {
      await dispatch(updateMealType(d?.id, payload));
      notify('success', 'Đã cập nhật phần cơm');
      getData();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Đã xảy ra lỗi.');
    }
  };

  return (
    <>
      <StyledModal size="lg" isOpen={Boolean(data?.id)}>
        <ModalHeader toggle={() => { onClose(); onRefresh(); }}>
          {`Lịch sử đăng kí cơm của ${data?.tenNV} (${filter?.Ngay ? moment(filter.Ngay).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY')})`}
        </ModalHeader>
        <ModalBody style={{ paddingBottom: '0' }}>
          <Row>
            <Col>
              <DataTable
                columns={columns}
                data={riceStatistics}
                loading={getRiceRegisteredOfEmployeeLoading || updateMealTypeLoading}
                rowActions={[
                  {
                    name: 'sync',
                    label: 'Đổi loại cơm',
                    color: 'warning',
                    icon: 'sync',
                    action: (d) => handleUpdateMealType(d),
                  },
                  {
                    name: 'trash',
                    label: 'Xoá',
                    color: 'danger',
                    icon: 'trash',
                    action: (d) => setModalDelete(d?.id),
                  },
                ]}
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="button" className="ml-2" color="danger" onClick={() => { onClose(); onRefresh(); }}>Đóng</Button>
        </ModalFooter>
      </StyledModal>
      <DeleteModal
        data={modalDelete}
        onRefresh={getData}
        onClose={() => setModalDelete(undefined)}
      />
    </>
  );
};

export default RiceRegisteredOfEmployeeModal;
