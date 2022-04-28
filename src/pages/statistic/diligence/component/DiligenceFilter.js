import React, { useState, forwardRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Card,
  Badge,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Form,
  ModalFooter,
} from 'reactstrap';
import toastr from 'toastr';
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import CustomToolTip from 'components/CustomToolTip';
import axiosClient from 'api/axiosClient';
import { API_URL } from 'utils/contants';
import { MonthPicker } from 'components/date-picker';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import unitApi from 'api/unitApi';
import positionApi from 'api/positionApi';
import { getUnits } from 'pages/unit/actions/unit';
import { useDispatch, useSelector } from 'react-redux';
import { exportExcel } from 'actions/global';

const StyledModal = styled(Modal)`
  .modal-title {
    font-weight: 700;
    font-size: 1.5em;
  }
`;
const MonthPickerInput = forwardRef((props) => {
  const {
    value,
    ...rest
  } = props;
  const render = (d) => {
    const date = d !== '' ? new Date(d) : new Date();
    return `Tháng ${date.getMonth() + 1} - ${date.getFullYear()}`;
  };

  return (
    <Input value={render(value)} {...rest} />
  );
});
const DiligenceFilter = ({ open, onClose }) => {
  const [filter, setFilter] = useState({});
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
    units,
  } = useSelector((state) => state.unit);
  const { data: unitList, totalSizes } = units;

  const fetchUnits = useCallback(async (p) => {
    const { success, data } = await unitApi.get({ MaDonVi: p, page_number: 0, page_size: 150 });
    if (success) {
      return data.slice(0, 150).map((o) => ({ value: o.id, label: `${o?.maDonVi || '-'} - ${o?.tenDonVi}` }));
    }
  }, [unitApi]);
  const handleExport = (d) => {
    const unitIds = d.unitIds[0]?.value === 'all' ? unitList.map((o, i) => (o?.id)) : d.unitIds.map((o, i) => (o.value));
    const from = moment(d.fromDate).format('YYYY-MM-DD');
    const to = moment(d.toDate).format('YYYY-MM-DD');
    const numberOfWorkingDayInMonth = d.numberOfWorkingDayInMonth;
    dispatch(exportExcel({
      method: 'POST',
      url: `${API_URL}/api/Exports/Attendances/DiligenceStatistic`,
      data: {
        unitIds: unitIds,
        numberOfWorkingDayInMonth: numberOfWorkingDayInMonth || '',
        fromDate: from,
        toDate: to,
      },
      fileName: 'Báo cáo chuyên cần nhà trọ',
    }));
  }
  useEffect(() => {
    const payload = {
      page_number: 0,
      page_size: 700,
    };
    dispatch(getUnits(payload));
  }, []);

  useEffect(() => {
    register('unitIds', { required: 'Chọn đơn vị' })
    register('numberOfWorkingDayInMonth');
    register('fromDate', { required: 'Nhập ngày bắt đầu' });
    register('toDate', { required: 'Nhập ngày kết thúc' });
  }, [register, setValue]);

  return (
    <StyledModal size="md" isOpen={open}>
      <Form onSubmit={handleSubmit((d) => handleExport(d))}>
        <ModalHeader toggle={onClose}>
          <span className="font-weight-bold">{('Xuất báo cáo chuyên cần, nhà trọ')}</span>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.unitIds })}>Đơn vị</Label>
                <AsyncSelect
                  isMulti
                  cacheOptions
                  closeMenuOnSelect={false}
                  defaultOptions={[{ value: 'all', label: 'Tất cả đơn vị' }].concat(unitList.map((o, i) => ({ value: o?.id, label: `${o?.maDonVi ?? '-'} - ${o?.tenDonVi}` })))}
                  loadOptions={fetchUnits}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  placeholder="Chọn đơn vị"
                  styles={{
                    control: (base, state) => (
                      errors.unitIds
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
                    setValue('unitIds', value);
                    trigger('unitIds');
                  }}
                />
                {(errors?.unitIds ?? false) && <FormFeedback>{errors?.unitIds?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <FormGroup>
                <Label className={classnames({ 'error__label': !!errors.numberOfWorkingDayInMonth })}>Số công chuẩn</Label>
                <Input
                  placeholder="Số công chuẩn"
                  className={classnames('form-control', { 'is-invalid': !!errors.numberOfWorkingDayInMonth })}
                  defaultValue={watch('numberOfWorkingDayInMonth') || ''}
                  onBlur={({ target: { value } }) => {
                    setValue('numberOfWorkingDayInMonth', value);
                    trigger('numberOfWorkingDayInMonth');
                  }}
                />
                {(errors?.numberOfWorkingDayInMonth ?? false) && <FormFeedback>{errors?.numberOfWorkingDayInMonth?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col xs={4}>
              <FormGroup>
                <Label className={classnames({ 'error__label': !!errors?.fromDate })}>Từ ngày</Label>
                <DatePicker
                  autoComplete="off"
                  locale="vi"
                  dateFormat={'dd/MM/yyyy'}
                  className={classnames('form-control', { 'is-invalid': !!errors.fromDate })}
                  selected={watch('fromDate') || undefined}
                  onChange={time => {
                    setValue('fromDate', time);
                    trigger('fromDate');
                  }}
                />
                {(errors?.fromDate ?? false) && <FormFeedback>{errors?.fromDate?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col xs={4}>
              <FormGroup>
                <Label className={classnames({ 'error__label': !!errors?.toDate })}>Đến ngày</Label>
                <DatePicker
                  autoComplete="off"
                  locale="vi"
                  dateFormat={'dd/MM/yyyy'}
                  className={classnames('form-control', { 'is-invalid': !!errors.toDate })}
                  selected={watch('toDate') || undefined}
                  onChange={time => {
                    setValue('toDate', time);
                    trigger('toDate');
                  }}
                />
                {(errors?.toDate ?? false) && <FormFeedback>{errors?.toDate?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <ModalFooter>
            <Button type="submit" color="success">{('Tải xuống')}</Button>
            <Button type="button" className="ml-2" color="secondary" onClick={onClose}>{('Hủy')}</Button>
          </ModalFooter>
        </ModalBody>
      </Form>
    </StyledModal>
  );
}

export default DiligenceFilter;