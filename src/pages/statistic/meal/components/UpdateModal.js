import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
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
import DataTable from 'components/data-table';
import AsyncSelect from 'react-select/async';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import apiLinks from 'utils/api-links';
import httpClient from 'utils/http-client';
import { notify } from 'utils/helpers';
import { RICE_TYPES_LIST } from 'utils/contants';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import { getTypeRegisteredMeal } from '../actions/meal';

const StyledModal = styled(Modal)`
  .modal-title {
    font-weight: 700;
    font-size: 1.5em;
  }
`;

const UpdateRegisterRiceModal = ({ data, onRefresh, onClose }) => {
  const { id, loaiCom } = data || {};

  const dispatch = useDispatch();
  const {
    mealTypeList,
  } = useSelector((state) => state.mealStatistic);
  const [selectedRiceType, setSelectedRiceType] = useState(undefined);
  const [mealTypes, setMealTypes] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState(undefined);
  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    getValues,
    handleSubmit,
  } = useForm();

  const onSubmit = async (d) => {
    const data = {
      idComTheoCa: 1,
      loaiCom: selectedRiceType,
    };
    try {
      await httpClient.callApi({
        method: 'PUT',
        url: apiLinks.statistic.updateMealRegisteredOfEmployee(id),
        data,
      });
      onClose();
      notify('success', 'Đã cập nhật phần cơm');
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Đã xảy ra lỗi.');
    }
  };
  const getMealType = useCallback(() => {
    dispatch(getTypeRegisteredMeal({
      page_number: 1,
      page_size: 20,
    }));
  }, [dispatch]);
  useEffect(getMealType, [getMealType]);

  useEffect(() => {
    setSelectedRiceType(loaiCom);
    register('idComTheoCa',
      { required: 'Chưa loại đăng kí cơm' },
    );
  }, [register, setValue, loaiCom]);

  return (
    <>
      <StyledModal
        size="md"
        isOpen={Boolean(data)}
      >
        <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
          <ModalHeader toggle={onClose}>
            <span className="font-weight-bold">
              Cập nhật đăng kí cơm
            </span>
          </ModalHeader>
          <ModalBody>
            <Row className="mb-2">
              <Col>
                <FormGroup>
                  <Select
                    value={RICE_TYPES_LIST[selectedRiceType]}
                    options={RICE_TYPES_LIST}
                    onChange={(e) => setSelectedRiceType(e.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <FormGroup>
                  <Label className={classNames({ error: !!errors.idComTheoCa })}>Đăng ký cho Ca?</Label>
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    closeMenuOnSelect={false}
                    defaultOptions={[{ value: 'all', label: 'Tất cả ca' }].concat((mealTypeList?.data ?? []).map((o, i) => ({ value: o?.id, label: o?.tenLoaiDangKyCom })))}
                    // loadOptions={getPermission}
                    loadingMessage={() => 'Đang lấy dữ liệu...'}
                    noOptionsMessage={() => 'Không có dữ liệu'}
                    placeholder="Chọn quyền"
                    styles={{
                      control: (base, state) => (
                        errors.idComTheoCa
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
                      setValue('idComTheoCa', value);
                      trigger('idComTheoCa');
                    }}
                  />
                  {(errors?.idComTheoCa ?? false) && <FormFeedback>{errors?.idComTheoCa?.message ?? ''}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="success" className="ml-2">Xác nhận</Button>
            <Button type="button" className="ml-2" color="secondary" onClick={onClose}>Thoát</Button>
          </ModalFooter>
        </Form>

      </StyledModal>
    </>
  );
};

export default UpdateRegisterRiceModal;
