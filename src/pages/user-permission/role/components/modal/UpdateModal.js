import React, { useEffect } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import {
  Row,
  Col,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
} from 'reactstrap';
import { notify } from 'utils/helpers';
import { useDispatch } from 'react-redux';
import httpClient from 'utils/http-client';
import apiLinks from 'utils/api-links';

const StyledModal = styled(Modal)`
    .modal-title {
        font-weight: 700;
        font-size: 1.5em;
    }
`;

const StyledCard = styled(Card)`
    border-radius: 3px;
    margin-bottom: 4px;

    .card-body {
        padding: 1rem;
        background-color: #FCFCFC;
    }

    .title {
        font-size: .9rem;
        font-weight: 700;
        transition: all .4s;

        &::after {
            content: '\\ed35';
            font-family: 'boxicons' !important;
            display: block;
            float: right;
            transition: transform .2s;
        }

        &__active {
            &::after {
                transform: rotate(90deg);
            }
        }
    }

    .error {
        color: #f46a6a;
    }

    .disabled {
        display: none;
    }

    .invalid-feedback {
        display: block;
    }
`;
const UpdateModal = ({ data, onClose, onRefresh }) => {
  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    control,
    getValues,
    handleSubmit,
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const onSubmit = async (d) => {
    const requestData = {
      ...d,
    };
    try {
      await httpClient.callApi({
        method: 'PUT',
        url: apiLinks.role.put(data.id),
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
    register('name', { required: 'Chưa nhập tên vai trò' });

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
                <Label className={classnames({ error: !!errors.name })}>Tên vai trò</Label>
                <Input
                  placeholder="Nhập tên vai trò"
                  defaultValue={watch('name') || ''}
                  onBlur={({ target: { value } }) => {
                    setValue('name', value);
                    trigger('name');
                  }}
                />
                {(errors?.name ?? false) && <FormFeedback>{errors?.name?.message ?? ''}</FormFeedback>}
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
