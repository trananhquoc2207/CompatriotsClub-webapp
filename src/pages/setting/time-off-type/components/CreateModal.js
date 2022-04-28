import React, { useEffect } from 'react';
import timeOffTypeApi from 'api/timeOffTypeApi';
import classnames from 'classnames';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import {
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Input, Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import kioskApi from 'api/kioskApi';
import { notify } from 'utils/helpers';
import httpClient from 'utils/http-client';
import apiLinks from 'utils/api-links';

const StyledModal = styled(Modal)`
  & .modal-title {
    font-weight: 700;
    font-size: 1.5em;
  }

  & .error {
    &__label {
      color: #f46a6a;
    }
  }

  & .invalid-feedback {
    display: block;
  }
`;

const CreateModal = ({ open, onClose, onRefresh }) => {
  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    handleSubmit,
  } = useForm();

  const disabled = !!errors.tenLoaiPhep || !!errors.guid;

  const onSubmit = async (d) => {
    const requestData = {
      tenLoaiPhep: d.tenLoaiPhep,
      soNgayNghi: parseInt(d.soNgayNghi),
    }
    try {
      await timeOffTypeApi.post(requestData);
      onClose();
      notify('success', 'Đã thêm.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Đã xảy ra lỗi.');
    }
  };
  useEffect(() => {
    register('tenLoaiPhep', { required: 'Chưa nhập lý do' });
    register('soNgayNghi', { required: 'Chưa nhập lý do' });
  }, [register]);
  return (
    <StyledModal size="md" isOpen={open}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          Thêm mới
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs="12">
              <FormGroup>
                <Label className={classnames('required', { 'error__label': !!errors.tenLoaiPhep })}>Lý do nghỉ phép?</Label>
                <Input
                  placeholder="Nhập tên lý do"
                  onBlur={({ target: { value } }) => {
                    setValue('tenLoaiPhep', value);
                    trigger('tenLoaiPhep');
                  }}
                />
                {(errors?.tenLoaiPhep ?? false) && <FormFeedback>{(errors?.tenLoaiPhep?.message ?? '')}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <FormGroup>
                <Label className={classnames('required', { 'error__label': !!errors.soNgayNghi })}>Số ngày được nghỉ?</Label>
                <Input
                  placeholder="Nhập số ngày nghỉ được nghỉ"
                  onBlur={({ target: { value } }) => {
                    setValue('soNgayNghi', value);
                    trigger('soNgayNghi');
                  }}
                />
                {(errors?.soNgayNghi ?? false) && <FormFeedback>{(errors?.soNgayNghi?.message ?? '')}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={disabled}
            type="submit"
            color="success"
          >
            Xác nhận
          </Button>
        </ModalFooter>
      </Form>
    </StyledModal>
  );
}

export default CreateModal;