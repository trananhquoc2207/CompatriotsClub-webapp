import React, { useState } from 'react';
import styled from 'styled-components';

import Dropzone from 'react-dropzone';
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Card,
  Badge,
} from 'reactstrap';
import toastr from 'toastr';
import CustomToolTip from 'components/CustomToolTip';
import axiosClient from 'api/axiosClient';
import { API_URL } from 'utils/contants';

const StyledModal = styled(Modal)`
  .modal-title {
    font-weight: 700;
    font-size: 1.5em;
  }
`;

const UploadModal = ({ open, onClose, onRefresh }) => {
  const notify = (type, message) => {
    toastr.options = {
      positionClass: 'toast-bottom-right',
      timeOut: 2000,
      extendedTimeOut: 2000,
      closeButton: true,
      preventDuplicates: true
    }

    if (type === 'success')
      toastr.success(message, ('Thành công'));
    else if (type === 'info')
      toastr.info(message);
    else if (type === 'warning')
      toastr.warning(message);
    else if (type === 'danger')
      toastr.error(message, ('Thất bại'));
    else if (type === 'dangerUploadFile')
      toastr.error(message, ('Thất bại, kiểm tra lại file nhập'));
    else
      toastr.secondary(message);
  }
  const [selectedFile, setSelectedFile] = useState(null);
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0)
      return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  const handleAcceptedEmployeeFile = files => {
    setSelectedFile(files[0]);
  }
  const uploadEmployeeFile = async () => {
    if (selectedFile === null)
      return false;
    const data = new FormData();
    data.append('formFile', selectedFile);
    await axiosClient
      .post(`${API_URL}/v1/NhanVien/danhsachnhanvien/import`, data, {})
      .then(response => {
        if (response && response.success) {
          notify('success', 'Đã thêm');
          return false;
        }
        notify('danger', response.error_message);
      })
      .catch(error => {
        const { status, data: content } = error.response;
        if (status === 400) {
          return false;
        }
        notify('danger', error);
      });

    setSelectedFile(null);
    onClose();
    onRefresh();
  }
  return (
    <StyledModal size="md" isOpen={open}>
      <ModalHeader toggle={onClose}>
        <span className="font-weight-bold">{('Nhập file danh sách nhân viên')}</span>
      </ModalHeader>
      <ModalBody>
        <Row className="mb-3">
          <Col>
            {('Hãy chắc chắn tệp tin đã được định dạng theo')} <Badge id="formatFile" href="#" color="info" style={{ fontSize: '12px' }} onClick={() => { window.open(`${API_URL}/api/Templates/ImportEmployee`) }} pill>{('file mẫu')}</Badge> {('trước khi import')}
            <CustomToolTip id="formatFile" message={('Download')} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Dropzone onDrop={files => { handleAcceptedEmployeeFile(files) }}>
              {({ getRootProps, getInputProps }) => (
                <div className="dropzone">
                  <div className="dz-message needsclick mt-2" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="mb-3 text-center">
                      <i className="display-4 text-muted bx bxs-cloud-upload"></i>
                    </div>
                    <h4 className="text-center">{('Kéo thả file hoặc nhấp vô đây để upload')}</h4>
                  </div>
                </div>
              )}
            </Dropzone>
          </Col>
        </Row>

        {
          selectedFile === null ? null :
            (
              <Row className="mb-3">
                <Col>
                  <Card className="mt-1 mb-0 p-2 shadow-none border dz-processing dz-image-preview dz-success dz-complete">
                    <Row>
                      <Col md={1}>
                        <i className="bx bx-sm bx-file-blank"></i>
                      </Col>
                      <Col style={{ padding: '.2rem' }}>
                        <span className="text-mute">{selectedFile.name}</span> - <strong>{formatBytes(selectedFile.size)}</strong>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            )
        }

        <Button type="button" color="success" onClick={() => { uploadEmployeeFile() }}>{('Xác nhận')}</Button>
        <Button type="button" className="ml-2" color="secondary" onClick={onClose}>{('Hủy')}</Button>
      </ModalBody>
    </StyledModal>
  );
}

export default UploadModal;