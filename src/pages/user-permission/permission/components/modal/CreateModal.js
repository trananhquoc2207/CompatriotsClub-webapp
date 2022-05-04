import React, { useState, useEffect, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import {
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Input, Button,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { notify } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import httpClient from 'utils/http-client';
import apiLinks from 'utils/api-links';

const StyledModal = styled(Modal)`
    .modal-title {
        font-weight: 700;
        font-size: 1.5em;
    }
`;
const CreateModal = ({ open, onClose, onRefresh }) => {
  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    getValues,
    handleSubmit,
  } = useForm();
  const dispatch = useDispatch();
  const [isCloseSelect, setIsCloseSelect] = useState(false);
  const onSubmit = async (d) => {
    try {
      await httpClient.callApi({
        method: 'POST',
        url: apiLinks.permission.post,
        data: d,
      });
      onClose();
      notify('success', 'Đã thêm.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Đã xảy ra lỗi.');
    }
  };

  useEffect(() => {
    register('code', { required: 'Chưa nhập mã quyền' });
    register('description');
  }, [register, setValue]);

  return (
    <StyledModal size="md" isOpen={open}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          Thêm mới
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

export default CreateModal;
