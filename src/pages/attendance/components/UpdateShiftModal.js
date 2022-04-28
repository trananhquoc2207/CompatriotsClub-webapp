import React, { useEffect, useCallback } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import {
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import AsyncSelect from 'react-select/async';

import { notify } from 'utils/helpers';

import shiftApi from 'api/shiftApi';
import scheduleApi from 'api/scheduleApi';

const StyledModal = styled(Modal)`
    .modal-title {
        font-weight: 700;
        font-size: 1.5em;
    }
`;

const UpdataShiftModal = ({ data, onClose, onRefresh }) => {
  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    reset,
    handleSubmit,
  } = useForm();

  const getShifts = useCallback(async (p) => {
    const { data: shiftData } = await shiftApi.get({ tuKhoa: p, page_number: 1, page_size: 2147483647 });
    return (shiftData || []).map((o) => ({ value: o.id, label: `${o.tenCa} (${o.gioVaoCa} - ${o.gioRaCa})` }));
  }, [shiftApi]);
  const onSubmit = async (d) => {
    try {
      await scheduleApi.put({
        id: data.idLichLamViec,
        idNhanVien: data.idNhanVien,
        idCaLamViec: d.idCa?.value ?? 0,
        ngay: data?.ngay ?? 0,
      });
      onClose();
      onRefresh();
      notify('success', 'Đã cập nhật.');
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    }
  };

  useEffect(() => {
    register('idCa', { required: 'Chưa chọn ca làm việc' });
  }, [register, setValue]);

  useEffect(() => {
    reset({
      ...data,
      idCa: {
        value: data?.idCa ?? 0,
        label: data?.tenCa ?? '-',
      },
    });
  }, [data]);

  return (
    <StyledModal size="md" isOpen={Boolean(data)}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          Đổi ca làm việc
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.idCa })}>Ca làm việc</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={getShifts}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  defaultValue={watch('idCa') || undefined}
                  placeholder="Chọn ca làm việc"
                  styles={{
                    control: (base, state) => (
                      errors.idCa
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
                    setValue('idCa', value);
                    trigger('idCa');
                  }}
                />
                {(errors?.idCa ?? false) && <FormFeedback>{errors?.idCa?.message ?? ''}</FormFeedback>}
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

export default UpdataShiftModal;
