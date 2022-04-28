import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
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
//i18n
import { withNamespaces } from 'react-i18next';
import scheduleApi from 'api/scheduleApi';
import shiftApi from 'api/shiftApi';
import schedule from '../reducers/schedule';
import { getFormValues } from 'redux-form';
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
const StyledRow = styled.div`
  display: flex;
  position: relative;
  font-size: 15px;
  border: 1px solid #dde0e4;
  border-radius: 50px;
  margin-bottom: 20px;
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
`

const CellDetailModal = ({ data, onClose, onRefresh, t }) => {
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
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(undefined);
  const [tab, setTab] = useState(1);
  const [indexSalary, setIndexSalary] = useState([]);
  const [valueSalary, setValueSalary] = useState([])
  const [scheduleDetail, setScheduleDetail] = useState([]);
  const [shiftDetailUpdate, setShiftDetailUpdate] = useState([]);

  const [inputFields, setInputFields] = useState([

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
    setInputFields([...inputFields, { id: uuidv4(), heSo: '', tgBatDau: '', tgKetThuc: '' }])
  }

  const handleRemoveFields = id => {
    const values = [...inputFields];
    values.splice(values.findIndex(value => value.id === id), 1);
    setInputFields(values);
  }
  const onSubmit = async (d) => {
    if (d.idCa?.value) {
      try {
        await scheduleApi.postForEmployee({
          tuNgay: data.date,
          denNgay: data.date,
          nhanVienIds: [data.employee?.id],
          caLamViecId: d.idCa?.value ?? 0,
        });
        onClose();
        notify('success', 'Đã cập nhật lịch làm việc.');
        onRefresh();
      } catch (error) {
        notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
      }
    }
    else {
      onClose();
      notify('success', 'Đã cập nhật lịch làm việc.');
      onRefresh();
    }
    setInputFields([]);
    handleRefresh(data);
  };
  const handleRemove = useCallback(async (d) => {
    setLoading(true);
    try {
      await scheduleApi.delete(d);
      handleRefresh(data);
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    }
  })
  const handleChangeSchedule = async (id, shift) => {
    let params = {
      id: id,
      idNhanVien: data?.employee?.id,
      idCaLamViec: shift.value,
      ngay: data?.date,
    }
    try {
      await scheduleApi.put({
        id: id,
        idNhanVien: data?.employee?.id,
        idCaLamViec: shift.value,
        ngay: data?.date,
      });
      notify('success', 'Đã cập nhật.');
      handleRefresh(data);
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    }
    setSelectedRow(undefined);
  }
  const getScheduleDetail = useCallback(async (p) => {
    const formatTime = time => {
      const current = new Date(), parse = time.split(':');
      return new Date(current.getFullYear(), current.getMonth() + 1, current.getDate(), parse[0], parse[1], parse[2]);
    }
    try {
      const { success, data } = await scheduleApi.get(p);
      if (success)
        setScheduleDetail(data[0].LichLamViec?.map((item, index) => ({ ...item })));

    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    }
  }, [shiftDetailApi]);
  const getShifts = useCallback(async (p) => {
    const { success, data } = await shiftApi.get({ tuKhoa: p });
    if (success) {
      return data.slice(0, 10).map((o) => ({ value: o.id, label: `${o.maCa} | ${o.tenCa} (${o.gioVaoCa} - ${o.gioRaCa})` }))
    }
  }, [shiftApi])
  const handleRefresh = async (data) => {
    setLoading(true);
    let payload = {
      maNV: data?.employee?.maNV ?? '',
      TuNgay: data?.date ?? '',
      DenNgay: data?.date ?? '',
    };
    await getScheduleDetail(payload);
    setLoading(false);
  }
  useEffect(() => {
    if (data)
      handleRefresh(data);
  }, [data]);

  useEffect(() => {
    register('idCa');

  }, [register]);
  /* 	useEffect(() => {
      reset({
        ...data,
  
      });
    }, [data]); */

  return (

    <StyledModal size="md" isOpen={Boolean(data)}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          Nhân viên {data?.employee?.tenNV ?? ''}  -  ngày {dayJS(data?.date).format('DD/MM/YYYY')}
        </ModalHeader>
        <ModalBody>
          {loading ? <LoadingIndicator />
            :
            <>
              {(scheduleDetail || []).map((row, index) => (
                <div key={index} >
                  <Row className='d-flex justify-content-center ml-4'>
                    <Col xs={9}>
                      <StyledRow >
                        <div className='title'>{row?.tenCa ?? ''}</div>
                      </StyledRow>
                    </Col>
                    <Col xs={3}>
                      <div className='d-flex' style={{ marginTop: '10px' }} >
                        <Button style={{ verticalAlign: 'middle', marginLeft: '10px', padding: '2px 4px' }} color="warning"
                          onClick={() => setSelectedRow(row.idLichLamViec)}>
                          <i className="bx bx-xs bx-pencil"></i>
                        </Button>
                        <Button style={{ verticalAlign: 'middle', marginLeft: '10px', padding: '2px 4px' }} color="danger"
                          onClick={() => handleRemove(row.idLichLamViec)}>
                          <i className="bx bx-x"></i>
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: '30px', display: selectedRow === row.idLichLamViec ? 'flex' : 'none' }}>
                    <Col xs={9}>
                      <FormGroup>
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
                                  borderRadius: '50px',
                                  '&:hover': {
                                    borderColor: '#F46A6A'
                                  }
                                }
                                :
                                {
                                  ...base,
                                  boxShadow: state.isFocused ? null : null,
                                  borderColor: '#CED4DA',
                                  borderRadius: '50px',
                                  '&:hover': {
                                    borderColor: '#2684FF'
                                  }
                                }
                            )
                          }}
                          onChange={(value) => {
                            setValue('caLamViecId', value);
                            trigger('caLamViecId');
                            handleChangeSchedule(row?.idLichLamViec, value);
                          }}
                        />
                        {(errors?.caLamViecId ?? false) && <FormFeedback>{errors?.caLamViecId?.message ?? ''}</FormFeedback>}
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              ))}

              <hr />
              {inputFields.map(inputField => (
                <Row style={{ marginLeft: '30px' }}>
                  <Col xs={9}>
                    <FormGroup>
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={getShifts}
                        loadingMessage={() => 'Đang lấy dữ liệu...'}
                        noOptionsMessage={() => 'Không có dữ liệu'}
                        placeholder="Chọn ca làm việc"
                        styles={{
                          control: (base, state) => (
                            errors.idCa
                              ?
                              {
                                ...base,
                                boxShadow: state.isFocused ? null : null,
                                borderColor: '#F46A6A',
                                borderRadius: '50px',
                                '&:hover': {
                                  borderColor: '#F46A6A'
                                }
                              }
                              :
                              {
                                ...base,
                                boxShadow: state.isFocused ? null : null,
                                borderColor: '#CED4DA',
                                borderRadius: '50px',
                                '&:hover': {
                                  borderColor: '#2684FF'
                                }
                              }
                          )
                        }}
                        onChange={(value) => {
                          setValue('idCa', value);
                          trigger('idCa');
                          //handleChangeSchedule(row?.idLichLamViec, value);
                        }}
                      />
                      {(errors?.idCa ?? false) && <FormFeedback>{errors?.idCa?.message ?? ''}</FormFeedback>}
                    </FormGroup>
                  </Col>
                  <Col xs={2}>
                    <div className='d-flex' style={{ marginTop: '10px' }}>
                      <Button
                        style={{ verticalAlign: 'middle', marginLeft: '10px', padding: '2px 4px' }} color="danger"
                        disabled={inputFields.length === 0}
                        onClick={() => handleRemoveFields(inputField.id)}
                      >
                        <i className="bx bx-x"></i>
                      </Button>
                    </div>
                  </Col>
                </Row>
              ))}
              <Row className='mt-1 ml-2 mb-2' >
                <Button
                  style={{ marginLeft: '40px' }}
                  color="primary"
                  onClick={handleAddFields}
                >
                  <i className="bx bx-plus"> </i>
                  Thêm ca làm việc
                </Button>
              </Row>
            </>
          }
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="success">Lưu thay đổi</Button>
        </ModalFooter>
      </Form>

    </StyledModal>
  );
}

export default withNamespaces()(CellDetailModal);