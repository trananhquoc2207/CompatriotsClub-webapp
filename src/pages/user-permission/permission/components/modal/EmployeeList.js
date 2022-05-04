import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Form, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { notify } from 'utils/helpers';


const StyledModal = styled(Modal)`
    .modal-title {
        font-weight: 700;
        font-size: 1.5em;
    }
`;


const EmployeeList = ({ data, open, onClose, onRefresh }) => {
  const {
    register,
    setValue,
    reset,
    handleSubmit,
  } = useForm();

  const onSubmit = async (d) => {
    try {

      onClose();
      notify('success', 'Đã cập nhật.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    }
  };

  useEffect(() => {
    register('tenDonVi', { required: 'Chưa nhập tên đơn vị' });
    register('caLamViecId', { required: 'Chưa chọn ca làm việc' });
    register('loaiDonVi', { required: 'Chưa chọn loại đơn vị tổ chức' });
    register('phuCap', { required: 'Chưa nhập phụ cấp' });
    register('idDonViCha', { required: 'Chưa chọn đơn vị trực thuộc' });
  }, [register, setValue]);
  useEffect(() => {
    reset({
      ...data,
      caLamViecId: {
        value: data?.caLamViec?.id ?? 0,
        label: (data?.caLamViec?.gioVaoCa.slice(0, 5) + ' - ' + data?.caLamViec?.gioRaCa.slice(0, 5)) ?? '--:--',
      },
      idDonViCha: {
        value: data?.donViCha?.id ?? 0,
        label: data?.donViCha?.tenDonVi ?? ''
      },
    });
  }, [data]);
  return (

    <StyledModal size="md" isOpen={Boolean(data)}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          Cập nhật
        </ModalHeader>
        <ModalBody>

        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="success">Xác nhận</Button>
        </ModalFooter>
      </Form>
    </StyledModal>
  );
};

export default EmployeeList;
