import React, { useState, useEffect, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
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
import { getScheduleGroupDetail } from 'pages/ShiftGroup/actions/ShiftGroup';

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
const UpdateModal = ({ data: id, onClose, onRefresh }) => {
  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    control,
    getValues,
    handleSubmit,
    reset,
  } = useForm();
  // const {
  //   scheduleGroupDetail: { data },
  //   getScheduleGroupDetailLoading,
  // } = useSelector((state) => state.shiftGroup);
  const [data, setData] = useState(undefined);
  const handleRefresh = async (id) => {
    try {
      const response = await httpClient.callApi({
        method: 'GET',
        url: apiLinks.scheduleGroup.getDetail(id),
      });
      setData(response?.data?.data ?? {});
    } catch (error) {
      console.log(error);
    }
  };
  const dispatch = useDispatch();

  const handleClose = () => {
    setData(undefined);
    onClose();
  }
  const getEmployees = useCallback(async (p) => {
    const { success, data } = await employeeApi.get({ q: p });
    if (success) {
      return data.slice(0, 10).map((o) => ({ value: o.id, label: `${o.maNV} - ${o.tenNV}` }));
    }
  }, [employeeApi])

  const onSubmit = async (d) => {
    const requestData = {
      ...d,
      additionalLeaderIds: [d.additionalLeaderIds?.value] ?? [],
      employeeIds: data?.employees.map(o => o.id),
      leaderId: d.leaderId?.value ?? 0,
    };
    try {
      await httpClient.callApi({
        method: 'PUT',
        url: apiLinks.scheduleGroup.put(data.id),
        data: requestData,
      });
      handleClose();
      notify('success', 'Đã cập nhật.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Đã xảy ra lỗi.');
    }
  };

  useEffect(() => {
    register('code', { required: 'Chưa nhập mã nhóm đi ca' });
    register('name', { required: 'Chưa nhập tên nhóm đi ca' });
    register('leaderId', { required: 'Chưa chọn nhân viên quản lý' });
    register('additionalLeaderIds', { required: 'Chưa chọn nhân viên đồng quản lý' })

  }, [register, setValue]);
  useEffect(() => {
    reset({
      ...data,
      leaderId: {
        value: data?.leader?.id ?? 0,
        label: data?.leader?.name ?? ''
      },
      additionalLeaderIds: {
        value: data?.additionalLeaders[0]?.id ?? 0,
        label: data?.additionalLeaders[0]?.name ?? ''
      }
    });
  }, [data, id]);
  useEffect(() => {
    if (id) {
      handleRefresh(id);
    }
  }, [id]);

  return (
    <StyledModal size="lg" isOpen={Boolean(data && id)}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={handleClose}>
          Cập nhật
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={6}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.code })}>Mã nhóm đi ca</Label>
                <Input
                  placeholder="Nhập mã nhóm đi ca"
                  defaultValue={watch('code') || ''}
                  onBlur={({ target: { value } }) => {
                    setValue('code', value);
                    trigger('code');
                  }}
                />
                {(errors?.code ?? false) && <FormFeedback>{errors?.code?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.name })}>Tên nhóm đi ca</Label>
                <Input
                  placeholder="Nhập tên đơn vị"
                  defaultValue={watch('name') || ''}
                  onBlur={({ target: { value } }) => {
                    setValue('name', value);
                    trigger('name');
                  }}
                />
                {(errors?.name ?? false) && <FormFeedback>{errors?.name?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.leaderId })}>Nhân viên quản lý</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={getEmployees}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  placeholder="Chọn nhân viên quản lý"
                  styles={{
                    control: (base, state) => (
                      errors.leaderId
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
                  defaultValue={watch('leaderId') || undefined}
                  onChange={(value) => {
                    setValue('leaderId', value);
                    trigger('leaderId');
                  }}
                />
                {(errors?.leaderId ?? false) && <FormFeedback>{errors?.leaderId?.message ?? ''}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.additionalLeaderIds })}>Nhân viên đồng quản lý</Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={getEmployees}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  placeholder="Chọn nhân viên đồng quản lý"
                  styles={{
                    control: (base, state) => (
                      errors.additionalLeaderIds
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
                  defaultValue={watch('additionalLeaderIds') || undefined}
                  onChange={(value) => {
                    setValue('additionalLeaderIds', value);
                    trigger('additionalLeaderIds');
                  }}
                />
                {(errors?.additionalLeaderIds ?? false) && <FormFeedback>{errors?.additionalLeaderIds?.message ?? ''}</FormFeedback>}
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

export default UpdateModal;
