import React, { useState, useEffect, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import dayJS from 'dayjs';
import {
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Input, Button,
  Modal, ModalHeader, ModalBody, ModalFooter, NavLink,
  NavItem,
  TabContent,
  Nav,
  TabPane,
  CardTitle,
  Card, CardHeader, CardBody,
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
