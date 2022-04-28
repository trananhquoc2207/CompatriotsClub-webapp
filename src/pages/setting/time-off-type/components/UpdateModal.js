import React, { useEffect } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import {
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Input, Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import { notify } from 'utils/helpers';
import apiLinks from 'utils/api-links';
import httpClient from 'utils/http-client';
import timeOffTypeApi from 'api/timeOffTypeApi';

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

const UpdateModal = ({ data, onClose, onRefresh }) => {
  const {
    errors,
    watch,
    reset,
    trigger,
    register,
    setValue,
    handleSubmit,
  } = useForm();

  const disabled = !!errors.tenLoaiPhep || !!errors.guid;

  const onSubmit = async (d) => {
    const requestData = {
      id: data.id,
      tenLoaiPhep: d.tenLoaiPhep,
      soNgayNghi: parseInt(d.soNgayNghi),
    }
    try {
      await timeOffTypeApi.put(data.id, requestData);
      onClose();
      notify('success', 'Đã cập nhật.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Đã xảy ra lỗi.');
    }
  };

  useEffect(() => {
    register('tenLoaiPhep', { required: 'Chưa nhập lý do' });
    register('soNgayNghi', { required: 'Chưa nhập số ngày nghỉ phép' });
  }, [register]);
  useEffect(() => {
    reset(data);
  }, [data]);

  return (
    <StyledModal size="md" isOpen={Boolean(data)}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          Cập nhật
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs="12">
              <FormGroup>
                <Label className={classnames('required', { 'error__label': !!errors.tenLoaiPhep })}>Lý do xin nghỉ phép?</Label>
                <Input
                  placeholder="Nhập tên lý do"
                  defaultValue={watch('tenLoaiPhep') || ''}
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
                  defaultValue={watch('soNgayNghi') || ''}
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
};

export default UpdateModal;
