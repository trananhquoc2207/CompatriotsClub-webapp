import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import dayJS from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import {
  Container,
  Table,
  Row,
  Col,
  Card,
  ModalFooter,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Button,
  NavLink,
  NavItem,
  TabContent,
  Nav,
  TabPane,
  CardTitle,
  Badge,
  Spinner,
} from 'reactstrap';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import certificateApi from 'api/certificateApi';
import departmentApi from 'api/departmentApi';
import positionApi from 'api/positionApi';
import contractTypeApi from 'api/contractTypeApi';
import employeeApi from 'api/employeeApi';
import siteApi from 'api/siteApi';
import { notify } from 'utils/helpers';
import genders from 'assets/mocks/genders.json';
import materialStatuses from 'assets/mocks/material-status.json';
import shiftDetailApi from 'api/shiftDetailApi';
import Loader from 'components/Loader';
import LoadingIndicator from 'components/LoadingIndicator';
// i18n
import { withNamespaces } from 'react-i18next';
import scheduleApi from 'api/scheduleApi';
import shiftApi from 'api/shiftApi';
import { getFormValues } from 'redux-form';
import schedule from '../reducers/schedule';

const StyledModal = styled(Modal)`
    .modal-title {
        font-weight: 700;
        font-size: 1.5em;
    }
`;
const StyledCard = styled(Card)`

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
const StyledRow = styled.div`
  display: flex;
  position: relative;
  font-size: 15px;
  border: 1px solid #dde0e4;
  padding: 10px 15px !important;
  .title{
    justify-content: start;
  }
  .content{
    position: absolute;
    right: 5%;
  }
  .badge{
    justify-content: end;
    background-color: #C8E5FF;
    color: black;
    font-weight: 500;
    font-size: 15px;
    padding: 3px;
  }
`;

const UpdateModal = ({ data, onClose, onRefresh, t }) => {
  const [loading, setLoading] = useState(false);

  const {
    errors,
    reset,
    watch,
    trigger,
    control,
    register,
    setValue,
    handleSubmit,
  } = useForm();
  const [selectedRow, setSelectedRow] = useState(undefined);
  const [tab, setTab] = useState(1);
  const [scheduleDetail, setScheduleDetail] = useState([]);
  const [shiftDetailUpdate, setShiftDetailUpdate] = useState([]);

  const onSubmit = async (d) => {
    setLoading(true);
    try {
      await scheduleApi.postForEmployee({
        caLamViecId: d.caLamViecId?.value ?? 0,
        tuNgay: dayJS(d.fromDate).format('YYYY-MM-DD'),
        denNgay: dayJS(d.toDate).format('YYYY-MM-DD'),
        nhanVienIds: [data.employee?.id],
      });
      onClose();
      notify('success', 'Đã cập nhật lịch làm việc.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  const getShifts = useCallback(async (p) => {
    const { success, data } = await shiftApi.get({ tuKhoa: p, page_number: 0, page_size: 50 });
    if (success) {
      return data.slice(0, 50).map((o) => ({ value: o.id, label: `${o.maCa} | ${o.tenCa} (${o.gioVaoCa} - ${o.gioRaCa})` }));
    }
  }, [shiftApi]);

  useEffect(() => {
    register('caLamViecId', { required: 'Nhập chọn ca làm việc' });
    register('fromDate', { required: 'Chưa nhập ngày bắt đầu' });
    register('toDate', { required: 'Chưa nhập ngày kết thúc' });
  }, [register]);
  useEffect(() => {
    reset({
      fromDate: data?.shift.ngay ? new Date(data?.shift.ngay) : new Date(),
      toDate: data?.shift.ngay ? new Date(data?.shift.ngay) : new Date(),
      caLamViecId: {
        value: data?.shift.idCa ?? 0,
        label: data?.shift.tenCa ?? '-',
      },
    });
  }, [data]);
  return (

    <StyledModal size="md" isOpen={Boolean(data)}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          Nhân viên
          {' '}
          {data?.employee?.tenNV ?? ''}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ error__label: !!errors?.caLamViecId })}>Ca làm việc</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={getShifts}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  defaultValue={watch('caLamViecId') || undefined}
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
                <Label className={classnames({ error__label: !!errors?.fromDate })}>Từ ngày</Label>
                <DatePicker
                  autoComplete="off"
                  locale="vi"
                  dateFormat="dd/MM/yyyy"
                  className={classnames('form-control', { 'is-invalid': !!errors.fromDate })}
                  selected={watch('fromDate') || undefined}
                  onChange={(time) => {
                    setValue('fromDate', time);
                    trigger('fromDate');
                  }}
                />
                {(errors?.fromDate ?? false) && <FormFeedback>{errors?.fromDate?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup>
                <Label className={classnames({ error__label: !!errors?.toDate })}>Đến ngày</Label>
                <DatePicker
                  autoComplete="off"
                  locale="vi"
                  dateFormat="dd/MM/yyyy"
                  className={classnames('form-control', { 'is-invalid': !!errors.toDate })}
                  selected={watch('toDate') || undefined}
                  onChange={(time) => {
                    setValue('toDate', time);
                    trigger('toDate');
                  }}
                />
                {(errors?.toDate ?? false) && <FormFeedback>{errors?.toDate?.message ?? ''}</FormFeedback>}
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

export default withNamespaces()(UpdateModal);
