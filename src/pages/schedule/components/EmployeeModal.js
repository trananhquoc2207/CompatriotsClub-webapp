import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import dayJS from 'dayjs';
import {
  Spinner,
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import employeeApi from 'api/employeeApi';
import { notify } from 'utils/helpers';

import shiftApi from 'api/shiftApi';
import scheduleApi from 'api/scheduleApi';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployees } from 'pages/employee/actions/employee';

const StyledModal = styled(Modal)`
  .modal-title {
    font-weight: 700;
    font-size: 1.5em;
  }
`;

const EmployeeModal = ({ unit, open, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    handleSubmit,
  } = useForm();
  const dispatch = useDispatch();

  const {
    employees,
  } = useSelector((state) => state.employee);
  const { data: employeeList } = employees;

  const getShifts = useCallback(async (p) => {
    const { success, data } = await shiftApi.get({ tuKhoa: p, page_number: 0, page_size: 50 });
    if (success) {
      return data.slice(0, 50).map((o) => ({ value: o.id, label: `${o.maCa} | ${o.tenCa} (${o.gioVaoCa} - ${o.gioRaCa})` }));
    }
  }, [shiftApi]);

  const handleFilterEmployee = useCallback(async (p) => {
    const { success, data } = await employeeApi.get({ maNV: p });
    if (success) {
      return data.slice(0, 10).map((o) => ({ value: o.id, label: `${o.maNV} - ${o.tenNV}` }));
    }
  }, [employeeApi]);

  const onSubmit = async (d) => {
    setLoading(true);
    try {
      await scheduleApi.postForEmployee({
        ...d,
        tuNgay: dayJS(d.tuNgay).format('YYYY-MM-DD'),
        denNgay: dayJS(d.denNgay).format('YYYY-MM-DD'),
        nhanVienIds:
          d.nhanVienIds[0]?.value === 'all'
          ? employeeList.map((e) => e.id)
          : d.nhanVienIds.map((e) => e.value),
        caLamViecId: d.caLamViecId?.value ?? 0,
      });
      notify('success', 'Đã thêm lịch làm việc.');
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    const payload = {
      page_number: 0,
      page_size: 700,
    };
    dispatch(getEmployees(payload));
  };

  useEffect(() => {
    handleRefresh();
  }, [unit]);

  useEffect(() => {
    register('nhanVienIds', { required: 'Chưa chọn nhân viên' });
    register('caLamViecId', { required: 'Chưa chọn ca làm việc' });
    register('tuNgay');
    register('denNgay');
  }, [register, setValue]);

  return (
    <StyledModal size="lg" isOpen={open} onClose={() => { onClose(); onRefresh(); }}>
      <Form>
        <ModalHeader toggle={onClose}>
          <div style={{ fontSize: '18px', color: '#24c311' }}>
            Tạo lịch làm việc
          </div>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.nhanVienIds })}>Nhân viên</Label>
                <AsyncSelect
                  isMulti
                  cacheOptions
                  closeMenuOnSelect={false}
                  defaultOptions={[{ value: 'all', label: 'Tất cả nhân viên' }].concat(employeeList.map((o, i) => ({ value: o?.id, label: `${o?.maNV} - ${o?.tenNV}` })))}
                  loadOptions={handleFilterEmployee}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  placeholder="Chọn nhân viên"
                  styles={{
                    control: (base, state) => (
                      errors.nhanVienIds
                        ?
                        {
                          ...base,
                          minHeight: '60px',
                          boxShadow: state.isFocused ? null : null,
                          borderColor: '#F46A6A',
                          '&:hover': {
                            borderColor: '#F46A6A',
                          },
                        }
                        :
                        {
                          ...base,
                          minHeight: '60px',
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
          <Button disabled={loading} color="success" onClick={handleSubmit((d) => onSubmit(d))}>
            {loading ? <Spinner size="sm" color="white" /> : 'Xác nhận'}
          </Button>
          <Button disabled={loading} color="danger" onClick={() => { onClose(); onRefresh(); }}>Đóng</Button>
        </ModalFooter>
      </Form>
    </StyledModal>
  );
};

export default EmployeeModal;
