import React, { useCallback } from 'react';

import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { notify } from 'utils/helpers';
import shiftGroupApi from 'api/shiftGroupApi';
import httpClient from 'utils/http-client';
import apiLinks from 'utils/api-links';
import { API_URL } from 'utils/contants';
import { useDispatch } from 'react-redux';
import { exportExcel } from '../actions/attendance';

const exportUrl = [
  'xuatLichSuChamCongChiTiet',
  'xuatBaoCaoChamCongChiTiet',
  'xuatBaoCaoChamCongTongHop',
]

const WarningExportModal = ({ data, onClose }) => {
  const { from, to, unitId, typeExport } = data || {};

  const dispatch = useDispatch();

  const handleExport = () => {
    const params = {
      fromDate: from,
      toDate: to,
      donViId: unitId ?? ''
    };
    const requestPayload = {
      method: 'GET',
      url: `${API_URL}​/v1/ChamCong/${exportUrl[typeExport]}`,
      params: params,
    };
    dispatch(exportExcel(requestPayload))
      .then(() => notify('success', 'Xuất báo cáo thành công.'))
      .catch(() => notify('danger', 'Xuất báo cáo bị lỗi.'))

  };
  return (
    <Modal size="md" isOpen={Boolean(data)} >
      <ModalHeader style={{ display: 'block', border: 'none', paddingBottom: '.5rem' }}>
        <div style={{ margin: '15px auto', textAlign: 'center' }}>
          <i className="bx bx-message-alt-minus" style={{ color: '#fba51b', fontSize: '80px' }} />
        </div>
        <span>
          <h5 style={{ display: 'block', maxWidth: '100%', margin: '0px 0px .5em', color: 'rgb(89, 89, 89)', fontSize: '1.575em', fontWeight: '600', textAlign: 'center', textTransform: 'none', overflowWrap: 'break-word' }}>
            Dữ liệu chấm công của nhân viên còn đang thiếu, vui lòng kiểm tra lại bằng bộ lọc
          </h5>
        </span>
        <p style={{ textAlign: 'center', color: '#999', whiteSpace: 'pre-line', fontSize: '14px' }}>
          Bạn có tiếp tục muốn xuất tệp tin?
        </p>
      </ModalHeader>
      <ModalBody className="justify-content-center" style={{ textAlign: 'center', paddingTop: '0', paddingBottom: '2rem' }}>
        <Button type="button" color="success" size="md" onClick={() => handleExport()}>
          Tiếp tục tải xuổng
        </Button>
        <Button type="button" className="ml-3" color="secondary" size="md" onClick={() => onClose()}>
          Hủy
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default WarningExportModal;
