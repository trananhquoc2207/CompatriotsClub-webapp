import React, { useState, useEffect, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import dayJS from 'dayjs';
import {
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Input, Button,
  Modal, ModalHeader, ModalBody, ModalFooter, NavLink,
  NavItem,
  TabContent,
  Nav,
  TabPane,
  CardTitle,
  Card, CardHeader, CardBody,
} from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-datepicker';
import employeeApi from 'api/employeeApi';
import siteApi from 'api/siteApi';
import { notify } from 'utils/helpers';
import daysOfWeek from 'assets/mocks/daysOfWeek.json';
import projectApi from 'api/projectApi';
import departmentApi from 'api/departmentApi';
import unitApi from 'api/unitApi';
import shiftApi from 'api/shiftApi';
import unitType from 'assets/mocks/unitType.json';
import { useDispatch, useSelector } from 'react-redux';
import shiftGroupApi from 'api/shiftGroupApi';
import { ErrorMessage } from '@hookform/error-message';
import httpClient from 'utils/http-client';
import apiLinks from 'utils/api-links';

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
const AddScheduleLoopModal = ({ data, onClose, onRefresh }) => {
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
  const [isCloseSelect, setIsCloseSelect] = useState(false);
  const [inputFields, setInputFields] = useState([
    { id: uuidv4(), caLamViecId: undefined, lichLamViecTrongTuan: undefined },
  ]);
  const handleChangeInput = (id, payload, type) => {
    const newInputFields = inputFields.map(item => {
      if (id === item.id) {
        item[type] = payload;
      }
      return item;
    })
    setInputFields(newInputFields);
  }

  const handleAddFields = () => {
    setInputFields([...inputFields, { id: uuidv4(), caLamViecId: undefined, lichLamViecTrongTuan: undefined }])
  }
  const handleRemoveFields = id => {
    const values = [...inputFields];
    values.splice(values.findIndex(value => value.id === id), 1);
    setInputFields(values);
  }
  const getShifts = async (p) => {
    const params = { code: p };
    const { data: { data } } =
      await httpClient.callApi({
        method: 'GET',
        url: apiLinks.shift.get,
        params,
      });
    if (data) {
      return data.slice(0, 10).map((o) => ({ value: o.id, label: `${o.code} | ${o.name} (${o.timeBegin} - ${o.timeEnd})` }));
    }
  };
  const onSubmit = async (d) => {
    const requestData = {
      beginDate: dayJS(d.beginDate).format('YYYY-MM-DD'),
      scheduleLoops: inputFields.map((o, idx) => ({
        order: idx,
        shiftId: o.caLamViecId,
        dayOfWeek: o.lichLamViecTrongTuan[0]?.value === 'all' ? [0, 1, 2, 3, 4, 5, 6] : o.lichLamViecTrongTuan.map((i) => (i.value))
      }))
    }
    try {
      await httpClient.callApi({
        method: 'POST',
        url: apiLinks.scheduleGroup.addScheduleLoop(data.id),
        data: requestData,
      });
      onClose();
      notify('success', 'Đã bổ sung ca làm việc.');
      onRefresh();
      setInputFields([{ id: uuidv4(), caLamViecId: undefined, lichLamViecTrongTuan: undefined }]);
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    }
  };

  useEffect(() => {
    register('beginDate', { required: 'Chưa nhập ngày bắt đầu' });
    setValue('beginDate', new Date());
  }, [register, setValue]);

  return (
    <StyledModal size="lg" isOpen={Boolean(data)}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          Bổ sung ca làm việc
        </ModalHeader>
        <ModalBody>

          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.beginDate })}>Ngày bắt đầu</Label>
                <DatePicker
                  autoComplete="off"
                  locale="vi"
                  dateFormat="dd/MM/yyyy"
                  minDate={watch('beginDate')}
                  className={classnames('form-control', { 'is-invalid': !!errors.beginDate })}
                  selected={watch('beginDate') || undefined}
                  onChange={(time) => {
                    setValue('beginDate', time);
                    trigger('beginDate');
                  }}
                />
                {(errors?.beginDate ?? false) && <FormFeedback>{errors?.beginDate?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>

          {inputFields.map(inputField => (
            <Row key={inputField.id} className='d-flex justify-content-center'>
              <Col xs={5}>
                <FormGroup>
                  <Label className={classnames({ error: !!errors.caLamViecId })}>Ca làm việc</Label>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    name={`caLamViecId_${inputField.id}`}
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
                    onChange={(payload) => {
                      handleChangeInput(inputField.id, payload.value, 'caLamViecId');
                    }}
                  />
                  <ErrorMessage name={`caLamViecId_${inputField.id}`} errors={errors} render={({ message }) => <FormFeedback>{'message'}</FormFeedback>} />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <Label className={classnames({ error: !!errors.lichLamViecTrongTuan })}>Ngày làm việc trong tuần</Label>
                  <Select
                    isMulti
                    cacheOptions
                    name={`lichLamViecTrongTuan_${inputField.id}`}
                    closeMenuOnSelect={isCloseSelect}
                    placeholder="Chọn ngày làm việc trong tuần"
                    styles={{
                      control: (base, state) => (
                        errors.lichLamViecTrongTuan
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
                    options={Object.keys(daysOfWeek || {}).map((key) => ({
                      value: key,
                      label: daysOfWeek[key],
                    }))}
                    onChange={(payload) => {
                      handleChangeInput(inputField.id, payload, 'lichLamViecTrongTuan');
                    }}
                  />
                  <ErrorMessage name={`lichLamViecTrongTuan_${inputField.id}`} errors={errors} render={({ message }) => <FormFeedback>{'message'}</FormFeedback>} />
                </FormGroup>
              </Col>

              <Col xs={1}>
                <div className='d-flex' style={{ marginTop: '30px' }}>
                  <Button
                    style={{ verticalAlign: 'middle', marginLeft: '10px', padding: '4px 6px' }} color="danger"
                    disabled={inputFields.length === 0}
                    onClick={() => handleRemoveFields(inputField.id)}
                  >
                    <i className="bx bx-x"></i>
                  </Button>
                </div>
              </Col>
            </Row>
          ))}
          <Row className='mt-1 mb-2'>
            <Button
              style={{ marginLeft: '20px' }}
              color="primary"
              onClick={handleAddFields}
            >
              <i className="bx bx-plus"></i>
            </Button>
          </Row>

        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="success">Xác nhận</Button>
        </ModalFooter>
      </Form>
    </StyledModal>
  );
};

export default AddScheduleLoopModal;
