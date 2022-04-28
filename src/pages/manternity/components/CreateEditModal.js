import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';

import {
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Input, Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import Loader from 'components/Loader';

import employeeApi from 'api/employeeApi';
import manternityApi from 'api/manternityApi';

const StyledModal = styled(Modal)`
  & .modal-content {
    border: 0 !important;
  }
`;

const ManternityModal = (props) => {
  const {
    open,
    data,
    onClose,
    onRefresh,
  } = props;

  const {
    errors,
    watch,
    reset,
    trigger,
    register,
    setValue,
    getValues,
    handleSubmit,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const error = !!errors.idNhanVien || !!errors.ngayBatDauThaiSan || !!errors.soNgayNghiThaiSan;

  const getEmployees = useCallback(async (p) => {
    const { success, data } = await employeeApi.get({ maNV: p });
    if (success) {
      return data.slice(0, 10).map((o) => ({ value: o.id, label: `${o.maNV} - ${o.tenNV}` }));
    }
  }, [employeeApi])

  const onSubmit = async () => {
    if (!error) {
      const d = getValues();
      try {
        setLoading(true);
        if (data?.id) {
          await manternityApi.put({
            ...d,
            id: data?.id ?? '',
            idNhanVien: d?.idNhanVien?.value ?? '',
          });
        }
      } catch (error) {

      } finally {
        setLoading(false);
        onClose();
        onRefresh();
      }
    }
  };

  useEffect(() => {
    register('idNhanVien', { required: 'Bắt buộc phải chọn nhân viên' });
    register('ngayBatDauThaiSan', { reguired: 'Bắt buộc phải nhập ngày bắt đầu nghỉ' });
    register('soNgayNghiThaiSan', { required: 'Bắt buôc phải nhập số ngày nghỉ' });
  }, [register]);
  useEffect(() => {
    if (data?.id) {
      reset({
        idNhanVien: {
          value: data?.idNhanVien ?? '',
          label: data?.nhanVien?.tenNV ?? '',
        },
        ngayBatDauThaiSan: (data?.ngayBatDauThaiSan ?? '') !== '' ? new Date(data.ngayBatDauThaiSan) : new Date(),
        soNgayNghiThaiSan: data?.soNgayNghiThaiSan ?? 0,
      });
    } else {
      setValue('ngayBatDauThaiSan', new Date());
      setValue('soNgayNghiThaiSan', 0);
    }
  }, [data]);
  return (
    <StyledModal size="md" isOpen={open || Boolean(data?.id)}>
      <ModalHeader toggle={onClose}>
        {data?.id ? 'Cập nhập nghỉ thai sản của nhân viên' : 'Thêm nhân viên nghỉ thai sản'}
      </ModalHeader>
      <ModalBody>
        <Loader inverted active={loading} />
        <Form>
          <Row>
            <Col xs="12">
              <FormGroup>
                <Label className={classnames({ error: !!errors.idNhanVien })}>Nhân viên</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={getEmployees}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  placeholder="Chọn nhân viên"
                  styles={{
                    control: (base, state) => (
                      errors.idBangCap
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
                  defaultValue={watch('idNhanVien') || undefined}
                  onChange={(value) => {
                    setValue('idNhanVien', value);
                    trigger('idNhanVien');
                  }}
                />
                {(errors?.idNhanVien ?? false) && <FormFeedback>{errors?.idNhanVien?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <FormGroup>
                <Label className={classnames({ error: !!errors.ngayBatDauThaiSan })}>Ngày bắt đầu nghỉ</Label>
                <DatePicker
                  autoComplete="off"
                  locale="vi"
                  dateFormat="dd/MM/yyyy"
                  className={classnames('form-control', { 'is-invalid': !!errors.soNgayNghiThaiSan })}
                  selected={watch('ngayBatDauThaiSan') || undefined}
                  onChange={(time) => {
                    setValue('ngayBatDauThaiSan', time);
                    trigger('ngayBatDauThaiSan');
                  }}
                />
                {(errors?.ngayBatDauThaiSan ?? false) && <FormFeedback>{errors?.ngayBatDauThaiSan?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <FormGroup>
                <Label className={classnames({ error: !!errors.soNgayNghiThaiSan })}>Số ngày nghỉ</Label>
                <Input
                  type="number"
                  placeholder="Nhập số ngày nghỉ"
                  className={classnames('form-control', { 'is-invalid': !!errors.soNgayNghiThaiSan })}
                  defaultValue={watch('soNgayNghiThaiSan') || ''}
                  onChange={({ target: { value } }) => {
                    setValue('soNgayNghiThaiSan', value);
                    trigger('soNgayNghiThaiSan');
                  }}
                />
                {(errors?.soNgayNghiThaiSan ?? false) && <FormFeedback>{errors?.soNgayNghiThaiSan?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          type="submit"
          color="success"
          disabled={error || loading}
          onClick={() => onSubmit()}
        >
          Xác nhận
        </Button>
      </ModalFooter>
    </StyledModal>
  );
};

ManternityModal.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.shape({}),
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
};

ManternityModal.defaultTypes = {
  open: false,
  data: {},
  onClose: () => { },
  onRefresh: () => { },
};

export default ManternityModal;
