import React, { useEffect } from 'react';
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

  const disabled = !!errors.reason || !!errors.guid;

  const onSubmit = async (d) => {
    const requestData = {
      reason: d.reason
    }
    try {
      await httpClient.callApi({
        method: 'POST',
        url: apiLinks.attendance.additionalReason,
        data: requestData,
      });
      onClose();
      notify('success', 'Đã thêm.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Đã xảy ra lỗi.');
    }
  };
  useEffect(() => {
    register('reason', { required: 'Chưa nhập lý do' });
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
                <Label className={classnames('required', { 'error__label': !!errors.reason })}>Lý do bổ sung giờ chấm công</Label>
                <Input
                  placeholder="Nhập tên lý do"
                  defaultValue={watch('reason') || ''}
                  onBlur={({ target: { value } }) => {
                    setValue('reason', value);
                    trigger('reason');
                  }}
                />
                {(errors?.reason ?? false) && <FormFeedback>{(errors?.reason?.message ?? '')}</FormFeedback>}
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