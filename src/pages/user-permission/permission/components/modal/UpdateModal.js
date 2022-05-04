import React, {  useEffect } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import {  useForm } from 'react-hook-form';

import {
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Input, Button,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { notify } from 'utils/helpers';
import httpClient from 'utils/http-client';
import apiLinks from 'utils/api-links';

const StyledModal = styled(Modal)`
    .modal-title {
        font-weight: 700;
        font-size: 1.5em;
    }
`;

const UpdateModal = ({ data, onClose, onRefresh }) => {
  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = async (d) => {
    const requestData = {
      ...d,
    };
    try {
      await httpClient.callApi({
        method: 'PUT',
        url: apiLinks.permission.put(data.id),
        data: requestData,
      });
      onClose();
      notify('success', 'Đã cập nhật.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Đã xảy ra lỗi.');
    }
  };
  useEffect(() => {
    register('code', { required: 'Chưa nhập tên vai trò' });
    register('description');
  }, [register, setValue]);
  useEffect(() => {
    reset({
      ...data,
    });
  }, [data]);
  return (
    <StyledModal size="lg" isOpen={Boolean(data)}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          Cập nhật
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.code })}>Mã quyền</Label>
                <Input
                  placeholder="Nhập mã quyền"
                  defaultValue={watch('code') || ''}
                  onBlur={({ target: { value } }) => {
                    setValue('code', value);
                    trigger('code');
                  }}
                />
                {(errors?.code ?? false) && <FormFeedback>{errors?.code?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.description })}>Mô tả</Label>
                <Input
                  defaultValue={watch('description') || ''}
                  onBlur={({ target: { value } }) => {
                    setValue('description', value);
                    trigger('description');
                  }}
                />
                {(errors?.description ?? false) && <FormFeedback>{errors?.description?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="success">Xác nhận</Button>
        </ModalFooter>
      </Form>
    </StyledModal>
  );
};

export default UpdateModal;
