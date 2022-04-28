import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import dayJS from 'dayjs';
import {
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Input, Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Card, CardHeader, CardBody
} from 'reactstrap';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-datepicker';
import employeeApi from 'api/employeeApi';
import siteApi from 'api/siteApi';
import { notify } from 'utils/helpers';

import projectApi from 'api/projectApi';

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


const UpdateModal = ({ data, open, onClose, onRefresh }) => {
  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    handleSubmit,
  } = useForm();

  const [accordionInfomation, setAccordionInfomation] = useState(true);
  const [accordionContract, setAccordionContract] = useState(false);
  const [accordionPosition, setAccordionPosition] = useState(false);


  const getEmployees = useCallback(async (p) => {
    const { success, data } = await employeeApi.get({ q: p });
    if (success) {
      return data.slice(0, 10).map((o) => ({ value: o.id, label: o.tenNV }));
    }
  }, [employeeApi]);

  const onSubmit = async (d) => {
    try {
      await projectApi.put(data.id, {
        ...d,
        id: data.id,
        beginDate: dayJS(d.beginDate).format('YYYY-MM-DD'),
        endDate: dayJS(d.endDate).format('YYYY-MM-DD'),

        /* idPhongBan: d.idPhongBan?.value ?? 0, */

      });
      onClose();
      notify('success', 'Đã cập nhật.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    }
  };
  useEffect(() => {
    register('name', { required: 'Bắt buộc phải nhập tên dự án' });
    register('description', { required: 'Bắt buộc phải nhập mô tả dự án' });
    register('beginDate', { required: 'Bắt buộc nhập thời gian bắt đầu dự án' });
    register('endDate', { required: 'Bắt buộc nhập thời gian kết thúc dự án' });
    setValue('beginDate', new Date());
    setValue('endDate', new Date());
  }, [register, setValue]);

  return (
    <StyledModal size="md" isOpen={Boolean(data)}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          Cập nhật
        </ModalHeader>
        <ModalBody>
          <StyledCard>
            <CardHeader onClick={() => setAccordionInfomation(!accordionInfomation)}>
              <span className={classnames('title', { 'title__active': accordionInfomation })}>Thông tin dự án</span>
            </CardHeader>
            <CardBody className={classnames({ 'disabled': !accordionInfomation })}>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label className={classnames({ 'error': !!errors.name })}>Tên dự án</Label>
                    <Input
                      placeholder="Nhập mã dự án"
                      defaultValue={watch('name') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('name', value);
                        trigger('name');
                      }}
                    />
                    {(errors?.name ?? false) && <FormFeedback>{errors?.name?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <Label className={classnames({ 'error': !!errors.description })}>Mô tả dự án</Label>
                    <Input
                      placeholder="Nhập mô tả dự án"
                      className={classnames('form-control', { 'is-invalid': !!errors.description })}
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
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label className={classnames({ 'error': !!errors.beginDate })}>Ngày bắt đầu</Label>
                    <DatePicker
                      autoComplete="off"
                      locale="vi"
                      dateFormat={'dd/MM/yyyy'}
                      className={classnames('form-control', { 'is-invalid': !!errors.beginDate })}
                      selected={watch('beginDate') || undefined}
                      onChange={time => {
                        setValue('beginDate', time);
                        trigger('beginDate');
                      }}
                    />
                    {(errors?.beginDate ?? false) && <FormFeedback>{errors?.beginDate?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <Label className={classnames({ 'error': !!errors.endDate })}>Ngày kết thúc</Label>
                    <DatePicker
                      autoComplete="off"
                      locale="vi"
                      dateFormat={'dd/MM/yyyy'}
                      className={classnames('form-control', { 'is-invalid': !!errors.endDate })}
                      selected={watch('endDate') || undefined}
                      onChange={time => {
                        setValue('endDate', time);
                        trigger('endDate');
                      }}
                    />
                    {(errors?.endDate ?? false) && <FormFeedback>{errors?.endDate?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </StyledCard>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="success">Xác nhận</Button>
        </ModalFooter>
      </Form>
    </StyledModal>
  );
}

export default UpdateModal;