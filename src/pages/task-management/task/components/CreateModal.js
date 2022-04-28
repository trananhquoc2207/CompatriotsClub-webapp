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
import certificateApi from 'api/certificateApi';
import departmentApi from 'api/departmentApi';
import positionApi from 'api/positionApi';
import contractTypeApi from 'api/contractTypeApi';
import siteApi from 'api/siteApi';
import { notify } from 'utils/helpers';
import genders from 'assets/mocks/genders.json';
import materialStatuses from 'assets/mocks/material-status.json';
import insurancePaymentTerm from 'assets/mocks/insurance-payment-term.json';
import taskApi from 'api/taskApi';
import employeeApi from 'api/employeeApi';

const StyledModal = styled(Modal)`
    .modal-title {
        font-weight: 700;
        font-size: 1.5em;
    }
`;

const CreateModal = ({ open, onClose, onRefresh, projectID }) => {
  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    handleSubmit,
  } = useForm();

  const getEmployees = useCallback(async (p) => {
    const { success, data } = await employeeApi.get({ q: p });
    if (success) {
      return data.slice(0, 10).map((o) => ({ value: o.id, label: o.tenNV }));
    }
  }, [employeeApi]);


  const onSubmit = async (d) => {
    try {
      await taskApi.post({
        ...d,
        projectID: projectID,
        beginDate: dayJS(d.beginDate).format('YYYY-MM-DD'),
        endDate: dayJS(d.endDate).format('YYYY-MM-DD'),
        member: d.member?.value ?? 0,
        comment: [],
      });
      onClose();
      notify('success', 'Đã thêm.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    }
  };

  useEffect(() => {
    register('title', { required: 'Bắt buộc nhập tiêu đề công việc' });
    register('content', { required: 'Bắt buộc nhập mô tả dự án' });
    register('member', { required: 'Bắt buộc chọn thành viên phụ trách' });
    register('beginDate');
    register('endDate');
    setValue('beginDate', new Date());
    setValue('endDate', new Date());
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
                <Label className={classnames({ 'error': !!errors.title })}>Tên công việc</Label>
                <Input
                  placeholder="Nhập tên công việc"
                  defaultValue={watch('title') || ''}
                  onBlur={({ target: { value } }) => {
                    setValue('title', value);
                    trigger('title');
                  }}
                />
                {(errors?.title ?? false) && <FormFeedback>{errors?.title?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ 'error': !!errors.content })}>Mô tả</Label>
                <Input
                  placeholder="Nhập mô tả"
                  className={classnames('form-control', { 'is-invalid': !!errors.content })}
                  defaultValue={watch('content') || ''}
                  onBlur={({ target: { value } }) => {
                    setValue('content', value);
                    trigger('content');
                  }}
                />
                {(errors?.content ?? false) && <FormFeedback>{errors?.content?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ 'error': !!errors.beginDate })}>Ngày bắt đầu</Label>
                <DatePicker
                  placeholder="Ngày bắt đầu"
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
          </Row>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ 'error': !!errors.endDate })}>Ngày kết thúc</Label>
                <DatePicker
                  placeholder="Ngày kết thúc"
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
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ 'error': !!errors.member })}>Nhân viên phụ trách</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={getEmployees}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  placeholder="Chọn nhân viên phụ trách"
                  styles={{
                    control: (base, state) => (
                      errors.member
                        ?
                        {
                          ...base,
                          boxShadow: state.isFocused ? null : null,
                          borderColor: '#F46A6A',
                          '&:hover': {
                            borderColor: '#F46A6A'
                          }
                        }
                        :
                        {
                          ...base,
                          boxShadow: state.isFocused ? null : null,
                          borderColor: '#CED4DA',
                          '&:hover': {
                            borderColor: '#2684FF'
                          }
                        }
                    )
                  }}
                  onChange={(value) => {
                    setValue('member', value);
                    trigger('member');
                  }}
                />
                {(errors?.member ?? false) && <FormFeedback>{errors?.member?.message ?? ''}</FormFeedback>}
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
}

export default CreateModal;