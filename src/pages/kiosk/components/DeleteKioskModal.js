import React, { useCallback } from 'react';

import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import kioskApi from 'api/kioskApi';
import { notify } from 'utils/helpers';

const DeleteKioskModal = ({ data, onRefresh, onClose }) => {
  const onSubmit = useCallback(async (d) => {
    try {
      await kioskApi.delete(d.id);
      onClose();
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    }
  })
  return (
    <Modal size={'sm'} isOpen={Boolean(data?.id)} style={{ top: '100px', maxWidth: '350px' }}>
      <ModalHeader style={{ display: 'block', border: 'none', paddingBottom: '.5rem' }}>
        <div style={{ margin: '15px auto', textAlign: 'center' }}>
          <i className="bx bxs-x-circle" style={{ color: '#f15e5e', fontSize: '80px' }}></i>
        </div>
        <span>
          <h5 style={{ display: 'block', maxWidth: '100%', margin: '0px 0px .5em', color: 'rgb(89, 89, 89)', fontSize: '1.875em', fontWeight: '600', textAlign: 'center', textTransform: 'none', overflowWrap: 'break-word' }}>
            Xác nhận
          </h5>
        </span>
        <p style={{ textAlign: 'center', color: '#999', whiteSpace: 'pre-line', fontSize: '14px' }}>
          Bạn có thật sự muốn xóa ?
        </p>
      </ModalHeader>
      <ModalBody className="justify-content-center" style={{ textAlign: 'center', paddingTop: '0', paddingBottom: '2rem' }}>
        <Button type="button" color="danger" size="md" onClick={() => onSubmit()}>
          Xác nhận
        </Button>
        <Button type="button" className="ml-3" color="secondary" size="md" onClick={() => onClose()}>
          Hủy
        </Button>
      </ModalBody>
    </Modal>
  )
};

export default DeleteKioskModal;