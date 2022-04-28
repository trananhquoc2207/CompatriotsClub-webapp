import React, { useCallback, useEffect } from 'react';
import classnames from 'classnames';
import { Modal, ModalHeader, ModalBody, Button, Form, Row, Col, FormGroup, Label, Input, ModalFooter, FormFeedback } from 'reactstrap';
import employeeApi from 'api/employeeApi';
import { notify } from 'utils/helpers';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker'
import moment from 'moment';
import httpClient from 'utils/http-client';
import apiLinks from 'utils/api-links';

const LeavingModal = ({ data, onRefresh, onClose }) => {
  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    handleSubmit,
  } = useForm();
  const onSubmit = useCallback(async (d) => {
    const requestData = {
      reason: d.reason,
      dateLeft: moment(d.dateLeft).format('YYYY-MM-DD'),
    }
    try {
      await httpClient.callApi({
        method: 'PUT',
        url: apiLinks.employee.left(data.id),
        data: requestData,
      });
      onClose();
      notify('success', 'Đã chuyển nhân viên nghỉ việc.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Đã xảy ra lỗi.');
    }
  });
  useEffect(() => {
    register('reason', { required: 'Chưa nhập lý do nghỉ việc' });
    register('dateLeft', { required: 'Chưa nhập ngày nghỉ việc' });
  }, [register]);
  return (
    <Modal size="sm" isOpen={Boolean(data)} style={{ top: '100px', maxWidth: '350px' }}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader style={{ display: 'block', border: 'none', paddingBottom: '.5rem' }}>
          <div style={{ margin: '15px auto', textAlign: 'center' }}>
            <i className="bx bxs-x-circle" style={{ color: '#f15e5e', fontSize: '80px' }} />
          </div>
          <p style={{ textAlign: 'center', color: '#999', whiteSpace: 'pre-line', fontSize: '14px' }}>
            Xác nhận cho nhân viên này nghỉ việc?
          </p>
        </ModalHeader>
        <ModalBody className="justify-content-center">
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames('ml-1', { error: !!errors.reason })}>Lý do nghỉ việc</Label>
                <Input
                  placeholder="Nhập lý do nghỉ việc"
                  defaultValue={watch('reason') || ''}
                  onBlur={({ target: { value } }) => {
                    setValue('reason', value);
                    trigger('reason');
                  }}
                />
                {(errors?.reason ?? false) && <Label style={{ color: 'red', fontSize: '12px', margin: '5px 5px' }}>{errors?.reason?.message}</Label>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ 'ml-1': !!errors?.dateLeft })}>Ngày nghỉ việc</Label>
                <DatePicker
                  autoComplete="off"
                  locale="vi"
                  dateFormat={'dd/MM/yyyy'}
                  className={classnames('form-control', { 'is-invalid': !!errors.dateLeft })}
                  defaultValue={new Date()}
                  selected={watch('dateLeft') || undefined}
                  onChange={time => {
                    setValue('dateLeft', time);
                    trigger('dateLeft');
                  }}
                />
                {(errors?.dateLeft ?? false) && <Label style={{ color: 'red', fontSize: '12px', margin: '5px 5px' }}>{errors?.dateLeft?.message ?? ''}</Label>}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="danger" size="md">
            Xác nhận
          </Button>
          <Button type="button" className="ml-3" color="secondary" size="md" onClick={() => onClose()}>
            Hủy
          </Button>
        </ModalFooter>
      </Form>

    </Modal>
  );
};

export default LeavingModal;
