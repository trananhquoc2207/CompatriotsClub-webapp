import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import dayJS from 'dayjs';
import {
  Spinner,
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Input, Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Card, CardHeader, CardBody,
} from 'reactstrap';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-datepicker';
import employeeApi from 'api/employeeApi';
import siteApi from 'api/siteApi';
import { notify } from 'utils/helpers';

import projectApi from 'api/projectApi';
import departmentApi from 'api/departmentApi';
import unitApi from 'api/unitApi';
import shiftApi from 'api/shiftApi';
import scheduleApi from 'api/scheduleApi';
import unitType from 'assets/mocks/unitType.json';
import { useDispatch, useSelector } from 'react-redux';
import { getScheduleGroup } from 'pages/ShiftGroup/actions/ShiftGroup';
import httpClient from 'utils/http-client';
import apiLinks from 'utils/api-links';

const StyledModal = styled(Modal)`
  .modal-title {
    font-weight: 700;
    font-size: 1.5em;
  }
`;

const ScheduleGroupModal = ({ unit, data, open, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);

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

  const getScheduleGroup = async (p) => {
    const params = { keyword: p };
    const { data: { data } } =
      await httpClient.callApi({
        method: 'GET',
        url: apiLinks.scheduleGroup.get,
        params,
      });
    if (data) {
      return data.slice(0, 50).map((o) => ({ value: o.employeeIds, label: `${o.code} | ${o.name} ` }));
    }
  };
  const getShifts = useCallback(async (p) => {
    const { success, data } = await shiftApi.get({ tuKhoa: p, page_number: 0, page_size: 50 });
    if (success) {
      return data.slice(0, 50).map((o) => ({ value: o.id, label: `${o.maCa} | ${o.tenCa} (${o.gioVaoCa} - ${o.gioRaCa})` }));
    }
  }, [shiftApi]);
  const onSubmit = async (d) => {
    setLoading(false);
    try {
      await scheduleApi.postForEmployee({
        ...d,
        tuNgay: dayJS(d.tuNgay).format('YYYY-MM-DD'),
        denNgay: dayJS(d.denNgay).format('YYYY-MM-DD'),
        nhanVienIds: d.nhanVienIds.value,
        caLamViecId: d.caLamViecId?.value ?? 0,
      });
      onClose();
      notify('success', 'Đã thêm lịch làm việc.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    register('nhanVienIds', { required: 'Chưa chọn nhân viên' });
    register('caLamViecId', { required: 'Chưa chọn ca làm việc' });
    register('tuNgay');
    register('denNgay');
  }, [register, setValue]);

  return (
    <StyledModal size="lg" isOpen={open}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          <div style={{ fontSize: '18px', color: '#24c311' }}>
            Tạo lịch làm việc
          </div>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.nhanVienIds })}>Nhóm đi ca</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={getScheduleGroup}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  placeholder="Chọn nhóm đi ca"
                  styles={{
                    control: (base, state) => (
                      errors.nhanVienIds
                        ?
                        {
                          ...base,
                          boxShadow: state.isFocused ? null : null,
                          borderColor: '#F46A6A',
                          '&:hover': {
                            borderColor: '#F46A6A',
                          },
                        }
                        :
                        {
                          ...base,
                          boxShadow: state.isFocused ? null : null,
                          borderColor: '#CED4DA',
                          '&:hover': {
                            borderColor: '#2684FF',
                          },
                        }
                    ),
                  }}
                  onChange={(value) => {
                    setValue('nhanVienIds', value);
                    trigger('nhanVienIds');
                  }}
                />
                {(errors?.nhanVienIds ?? false) && <FormFeedback>{errors?.nhanVienIds?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.caLamViecId })}>Ca làm việc</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={getShifts}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  placeholder="Chọn ca làm việc"
                  styles={{
                    control: (base, state) => (
                      errors.caLamViecId
                        ?
                        {
                          ...base,
                          boxShadow: state.isFocused ? null : null,
                          borderColor: '#F46A6A',
                          '&:hover': {
                            borderColor: '#F46A6A',
                          },
                        }
                        :
                        {
                          ...base,
                          boxShadow: state.isFocused ? null : null,
                          borderColor: '#CED4DA',
                          '&:hover': {
                            borderColor: '#2684FF',
                          },
                        }
                    ),
                  }}
                  onChange={(value) => {
                    setValue('caLamViecId', value);
                    trigger('caLamViecId');
                  }}
                />
                {(errors?.caLamViecId ?? false) && <FormFeedback>{errors?.caLamViecId?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.tuNgay })}>Ngày bắt đầu</Label>
                <DatePicker
                  autoComplete="off"
                  locale="vi"
                  dateFormat="dd/MM/yyyy"
                  className={classnames('form-control', { 'is-invalid': !!errors.tuNgay })}
                  selected={watch('tuNgay') || undefined}
                  onChange={(time) => {
                    setValue('tuNgay', time);
                    trigger('tuNgay');
                  }}
                />
                {(errors?.tuNgay ?? false) && <FormFeedback>{errors?.tuNgay?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.denNgay })}>Ngày kết thúc</Label>
                <DatePicker
                  autoComplete="off"
                  locale="vi"
                  dateFormat="dd/MM/yyyy"
                  className={classnames('form-control', { 'is-invalid': !!errors.denNgay })}
                  selected={watch('denNgay') || undefined}
                  onChange={(time) => {
                    setValue('denNgay', time);
                    trigger('denNgay');
                  }}
                />
                {(errors?.denNgay ?? false) && <FormFeedback>{errors?.denNgay?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button disabled={loading} type="submit" color="success">
            {loading ? <Spinner size="sm" color="white" /> : 'Xác nhận'}
          </Button>
        </ModalFooter>
      </Form>
    </StyledModal>
  );
};

export default ScheduleGroupModal;
