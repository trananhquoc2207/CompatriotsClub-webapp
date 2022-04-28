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

  const disabled = !!errors.tenKios || !!errors.guid;

  const onSubmit = async (d) => {
    if (d) {
      try {
        await kioskApi.post(d);
        onClose();
        notify('success', 'Đã thêm.');
        onRefresh();
      } catch (error) {
        notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
      }  
    }
  };

  useEffect(() => {
    register('tenKios', { required: 'Bắt buộc phải nhập tên kios' });
    register('guid', { required: 'Bắt buộc phải nhập guid của kios' });
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
                <Label className={classnames('required',{ 'error__label': !!errors.tenKios })}>Tên kios</Label>
                <Input
                  placeholder="Nhập tên kios"
                  defaultValue={watch('tenKios') || ''}
                  onBlur={({ target: { value } }) => {
                    setValue('tenKios', value);
                    trigger('tenKios');
                  }}
                />
                {(errors?.tenKios ?? false) && <FormFeedback>{(errors?.tenKios?.message ?? '')}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <FormGroup>
                <Label className={classnames('required', { 'error__label': !!errors.guid })}>Guid</Label>
                <Input
                  placeholder="Nhập guid của kios"
                  defaultValue={watch('guid') || ''}
                  onBlur={({ target: { value } }) => {
                    setValue('guid', value);
                    trigger('guid');
                  }}
                />
                {(errors?.guid ?? false) && <FormFeedback>{(errors?.guid?.message ?? '')}</FormFeedback>}
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