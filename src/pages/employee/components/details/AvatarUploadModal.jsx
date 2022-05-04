import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';
import { v4 as uuid } from 'uuid';

import {
  Button,
  Row, Col, Card,
  Modal, ModalHeader, ModalBody,
} from 'reactstrap';
import Dropzone from 'react-dropzone';
import Loader from 'components/Loader';

import axiosClient from 'api/axiosClient';
import apiLinks from 'utils/api-links';
import { notify, formatBytes } from 'utils/helpers';

const StyledModalHeader = styled(ModalHeader)`
  & .modal-title {
    font-weight: 700 !important;
  }
`;
const StyledModalBody = styled(ModalBody)`
  position: relative;
  & .dropzone {
    border: 1px dashed black;
    border-radius: 3px;
    margin-bottom: 1rem;
  }
`;

const UPLOAD_IMAGE_ERROR = {
  EMPLOYEE_UPLOAD_FILE_EXTENTION_ERROR: 'Lỗi định dạng tệp tin hình ảnh tải lên',
  EMPLOYEE_REGISTER_ERROR: 'Lỗi đăng kí nhân viên',
  EMPLOYEE_REMOVE_ERROR: 'Lỗi xóa nhân viên',
  EMPLOYEE_IS_EXISTS: 'Nhân viên này đã đăng kí hình ảnh',
  EMPLOYEE_REGISTER_IMG_INVALID_ERROR: 'Lỗi hình ảnh không đạt yêu cầu',
  EMPLOYEE_REGISTER_IMG_DUPLICATE_ERROR: 'Lỗi hình ảnh đã đăng ký bởi nhân viên khác',
};

const AvatarUploadModal = (props) => {
  const { open, data, onRefresh, onClose } = props;

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const uploadAvatar = useCallback(async () => {
    if (selectedFile) {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', selectedFile, `${uuid()}.${selectedFile.type.split('/')[1]}`);

      await axiosClient
        .put(apiLinks.employee.uploadImage(data?.id), formData, {})
        .then((response) => {
          notify('success', 'Đã cập nhật ảnh đại diện thành công');
          onClose();
          onRefresh();
        })
        .catch((error) => {
          const { status, data: content } = error.response;
          if (status === 400) {
            setErrorMessage(UPLOAD_IMAGE_ERROR[content]);
            // notify('warning', UPLOAD_IMAGE_ERROR[content]);
            return;
          }
          notify('danger', error);
        });
      setLoading(false);
      setSelectedFile(undefined);
    }
  }, [selectedFile]);
  const handleClose = () => {
    onClose();
    setErrorMessage(undefined);
  };

  return (
    <Modal isOpen={open || Boolean(data?.id)} toggle={handleClose}>
      <StyledModalHeader>
        Thay đổi ảnh đại diện
      </StyledModalHeader>
      <StyledModalBody>
        <div className={classNames('alert alert-warning font-size-16', { 'd-none': !errorMessage })} role="alert">
          {errorMessage}
        </div>
        <Loader inverted active={loading} />
        <Dropzone onDrop={(files) => files[0] ? setSelectedFile(files[0]) : undefined}>
          {({ getRootProps, getInputProps }) => (
            <div className="dropzone">
              <div className="dz-message needsclick mt-2" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="mb-3 text-center">
                  <i className="display-4 text-muted bx bxs-cloud-upload" />
                </div>
                <h5 className="text-center">Click hoặc kéo thả ảnh vào khu vực này để chọn ảnh</h5>
              </div>
            </div>
          )}
        </Dropzone>
        {selectedFile && (
          <Row className="mb-3">
            <Col>
              <Card className="mt-1 mb-0 p-2 shadow-none border dz-processing dz-image-preview dz-success dz-complete">
                <Row>
                  <Col md="1">
                    <i className="bx bx-sm bx-file-blank" />
                  </Col>
                  <Col md="10" style={{ padding: '.2rem' }}>
                    <span className="text-mute">{selectedFile.name}</span>
                    &nbsp;-&nbsp;
                    <strong>{formatBytes(selectedFile.size)}</strong>
                  </Col>
                  <Col md="1" className="pl-0 text-center">
                    <i className="bx bx-trash-alt font-size-18 mt-1" style={{ cursor: 'pointer' }} onClick={() => setSelectedFile(undefined)} />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}
        <Button
          color={selectedFile ? 'primary' : 'secondary'}
          className="w-100 font-size-14 font-weight-bold"
          onClick={() => { selectedFile ? uploadAvatar() : onClose(); setErrorMessage(undefined); }}
        >
          {selectedFile ? ' Xác nhận' : 'Đóng'}
        </Button>
      </StyledModalBody>
    </Modal>
  );
};

AvatarUploadModal.defaultProps = {
  open: false,
  data: undefined,
  onRefresh: () => { },
  onClose: () => { },
};

AvatarUploadModal.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  onRefresh: PropTypes.func,
  onClose: PropTypes.func,
};

export default AvatarUploadModal;
