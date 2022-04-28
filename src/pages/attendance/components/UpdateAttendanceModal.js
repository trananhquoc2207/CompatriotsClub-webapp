import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import moment from 'moment';

import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import {
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Button,
  Modal, ModalHeader, ModalBody, ModalFooter, Input,
} from 'reactstrap';
import AsyncSelect from 'react-select/async';
import { KeyboardDateTimePicker } from 'components/date-picker';

import { useAuth } from 'hooks';
import apiLinks from 'utils/api-links';
import { notify } from 'utils/helpers';
import httpClient from 'utils/http-client';

const StyledModal = styled(Modal)`
  .modal-title {
    font-weight: 700;
    font-size: 1.5em;
  }
`;

const UpdateAttendanceModal = ({ data, onClose, onRefresh }) => {
  const [changed, setChanged] = useState([]);

  const {
    errors,
    register,
    setValue,
    reset,
    control,
    handleSubmit,
  } = useForm();

  const { isAdmin } = useAuth();

  const onSubmit = async (d) => {
    const payload = {
      employeeId: data?.employeeId,
      note: d?.note,
      checkInTime:
        changed.includes('timeIn')
        ? isAdmin() || !data.realTime?.from ? moment(d.timeIn).format('YYYY-MM-DDTHH:mm:ss') : undefined
        : data?.realTime?.detail?.from ? data.realTime.detail.from : undefined,
      checkOutTime:
        changed.includes('timeOut')
        ? isAdmin() || !data.realTime?.to ? moment(d.timeOut).format('YYYY-MM-DDTHH:mm:ss') : undefined
        : data?.realTime?.detail?.to ? data.realTime.detail.to : undefined,
    };

    try {
      await httpClient.callApi({
        method: !isAdmin() ? 'POST' : 'PUT',
        url: !isAdmin() ? apiLinks.attendance.attendanceByManual : apiLinks.attendance.updateAttendanceByManual,
        data: payload,
      });
      onClose();
      onRefresh();
      notify('success', 'Đã cập nhật.');
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    }
  };
  useEffect(() => {
    register('timeIn', { required: 'Chưa nhập giờ vào' });
    register('timeOut', { required: 'Chưa nhập giờ ra' });
    register('note', { required: 'Chưa nhập ghi chú' });
  }, [register, setValue]);
  useEffect(() => {
    reset({
      timeIn: data?.realTime?.detail?.from ? moment(data.realTime.detail.from).toDate() : undefined,
      timeOut: data?.realTime?.detail?.to ? moment(data.realTime.detail.to).toDate() : undefined,
    });
  }, [data]);

  return (
    <StyledModal size="md" isOpen={Boolean(data)}>
      <Form>
        <ModalHeader toggle={onClose}>
          {isAdmin() ? 'Sửa chấm công' : 'Bổ sung chấm công'}
        </ModalHeader>
        <ModalBody>
          <Row className="mb-3">
            <Col style={{ display: data?.realTime?.from && !isAdmin() ? 'none' : 'block' }}>
              <Label for="timeIn">Giờ vào</Label>
              <Controller
                name="timeIn"
                control={control}
                valueName="selected"
                render={({ onChange, value }) => (
                  <KeyboardDateTimePicker
                    isHavingTime
                    value={value}
                    onChange={(v) => {
                      setChanged((state) => ([...state, 'timeIn']));
                      onChange(v);
                    }}
                  />
                )}
              />
              <ErrorMessage name="timeIn" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col style={{ display: data?.realTime?.to && !isAdmin() ? 'none' : 'block' }}>
              <Label for="timeOut">Giờ ra</Label>
              <Controller
                name="timeOut"
                control={control}
                valueName="selected"
                render={({ onChange, value }) => (
                  <KeyboardDateTimePicker
                    isHavingTime
                    value={value}
                    onChange={(v) => {
                      setChanged((state) => ([...state, 'timeOut']));
                      onChange(v);
                    }}
                  />
                )}
              />
              <ErrorMessage name="timeOut" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <Label for="note">Ghi chú</Label>
              <Controller
                name="note"
                control={control}
                render={({ onChange, value }) => (
                  <Input
                    type="textarea"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <ErrorMessage name="note" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleSubmit((d) => onSubmit(d))}>Xác nhận</Button>
        </ModalFooter>
      </Form>
    </StyledModal>
  );
};

export default UpdateAttendanceModal;
