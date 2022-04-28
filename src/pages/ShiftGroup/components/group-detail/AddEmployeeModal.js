import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import dayJS from 'dayjs';
import {
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Input, Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Card, CardHeader, CardBody,
} from 'reactstrap';
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
import { getUnitGroup } from 'pages/unit/actions/unit';
import { getEmployees } from 'pages/employee/actions/employee';
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

const AddEmployeeModal = ({ data, onClose, onRefresh }) => {
  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    getValues,
    handleSubmit,
  } = useForm();

  const [type, setType] = useState(0);
  const [unitID, setUnitID] = useState(0);
  const [isCloseSelect, setIsCloseSelect] = useState(false);
  const dispatch = useDispatch();
  const {
    employeeFilter,
    employees,
    getEmployeesLoading,
  } = useSelector((state) => state.employee);
  const { data: employeeList } = employees;
  const getShifts = useCallback(async (p) => {
    const { success, data } = await shiftApi.get({ Ma: p });
    if (success) {
      return data.slice(0, 10).map((o) => ({ value: o.id, label: `${o.tenCa} (${o.gioVaoCa} - ${o.gioRaCa})` }));
    }
  }, [shiftApi]);
  const handleFilterEmployee = useCallback(async (p) => {
    const { success, data } = await employeeApi.get({ maNV: p, isEmployeeAdditional: true });
    if (success) {
      return data.slice(0, 10).map((o) => ({ value: o.id, label: `${o.maNV} - ${o?.maNV} - ${o.tenNV} | ${o?.donVi.tenDonVi} | ${o?.chucVu.tenChucVu}` }));
    }
  }, [employeeApi]);
  const onSubmit = async (d) => {
    const presentEmployees = data.employees.map((o) => o.id);
    const requestData = {
      code: data.code,
      name: data.name,
      additionalLeaderIds: data.additionalLeaders[0]?.id ? [data.additionalLeaders[0]?.id] : [],
      leaderId: data.leader.id,
      employeeIds: presentEmployees.concat(d.employeeIds[0]?.value === 'all' ? employeeList.map((o, i) => (o?.id)) : d.employeeIds.map((o, i) => (parseInt(o.value)))),
    };
    try {
      await httpClient.callApi({
        method: 'PUT',
        url: apiLinks.scheduleGroup.put(data.id),
        data: requestData,
      });
      onClose();
      notify('success', 'Đã thêm.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    }
  };
  const fetchEmployee = () => {
    const payload = {
      IDDonVi: unitID,
      page_numbe: 1,
      page_size: 700,
    };
    dispatch(getEmployees(payload));
  };
  useEffect(() => {
    fetchEmployee();
  }, [unitID]);

  const fetchUnit = () => {
    const payload = {
      LoaiDonVi: type,
    };
    dispatch(getUnitGroup(payload));
  };
  useEffect(() => {
    fetchUnit();
  }, [type]);
  useEffect(() => {
    register('employeeIds',
      { required: 'Chưa chọn nhân viên' },
    );
  }, [register, setValue]);

  return (
    <StyledModal size="lg" isOpen={Boolean(data)}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          Thêm nhân viên vào nhóm
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.employeeIds })}>Chọn Nhân viên</Label>
                <AsyncSelect
                  isMulti
                  cacheOptions
                  closeMenuOnSelect={isCloseSelect}
                  defaultOptions={[{ value: 'all', label: 'Tất cả nhân viên' }].concat(employeeList.map((o, i) => ({ value: o?.id, label: `${o?.maNV} - ${o.tenNV} | ${o?.donVi.tenDonVi} | ${o?.chucVu.tenChucVu}` })))}
                  loadOptions={handleFilterEmployee}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  placeholder="Nhập mã nhân viên"
                  styles={{
                    control: (base, state) => (
                      errors.employeeIds
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
                    setValue('employeeIds', value);
                    trigger('employeeIds');
                  }}
                />
                {(errors?.employeeIds ?? false) && <FormFeedback>{errors?.employeeIds?.message ?? ''}</FormFeedback>}
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

export default AddEmployeeModal;
