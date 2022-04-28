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
import { getPermission } from 'pages/user-permission/permission/actions/Permission';

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

const AddPermissionModal = ({ data, onClose, onRefresh }) => {
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
  const [isCloseSelect, setIsCloseSelect] = useState(false);
  const dispatch = useDispatch();
  const {
    permissionList,
    getPermissionLoading,
  } = useSelector((state) => state.permission);

  // const getPermission = async (p) => {
  //   const { data: { data } } =
  //     await httpClient.callApi({
  //       method: 'GET',
  //       url: apiLinks.permission.get,
  //     });
  //   if (data) {
  //     return data.slice(0, 10).map((o) => ({ value: o.id, label: o.code }));
  //   }
  // };
  const onSubmit = async (d) => {
    const requestData = {
      ids: d.ids[0]?.value === 'all' ? permissionList?.data.map((o, i) => (o?.id)) : d.ids.map((o, i) => (o.value)),
    };
    try {
      await httpClient.callApi({
        method: 'POST',
        url: apiLinks.role.addPermission(data),
        data: requestData,
      });
      onClose();
      notify('success', 'Đã thêm.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Đã xảy ra lỗi.');
    }
  };
  const fetchPermission = () => {
    dispatch(getPermission());
  };
  useEffect(() => {
    fetchPermission();
  }, []);
  useEffect(() => {
    register('ids',
      { required: 'Chưa chọn quyền' },
    );
  }, [register, setValue]);

  return (
    <StyledModal size="lg" isOpen={Boolean(data)}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          Thêm quyền
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.ids })}>Chọn quyền cần thêm</Label>
                <AsyncSelect
                  isMulti
                  cacheOptions
                  closeMenuOnSelect={isCloseSelect}
                  defaultOptions={[{ value: 'all', label: `Tất cả quyền` }].concat(permissionList?.data.map((o, i) => ({ value: o?.id, label: o?.description })))}
                  //loadOptions={getPermission}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  placeholder="Chọn quyền"
                  styles={{
                    control: (base, state) => (
                      errors.ids
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
                    setValue('ids', value);
                    trigger('ids');
                  }}
                />
                {(errors?.ids ?? false) && <FormFeedback>{errors?.ids?.message ?? ''}</FormFeedback>}
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

export default AddPermissionModal;
