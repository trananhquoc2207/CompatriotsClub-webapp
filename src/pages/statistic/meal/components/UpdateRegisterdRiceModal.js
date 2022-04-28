import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  FormFeedback,
  Form,
  ModalFooter,
} from 'reactstrap';
import AsyncSelect from 'react-select/async';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import apiLinks from 'utils/api-links';
import httpClient from 'utils/http-client';
import { notify } from 'utils/helpers';
import { RICE_TYPES_LIST } from 'utils/contants';
import Select from 'react-select';
import { getTypeRegisteredMeal } from 'pages/statistic/meal/actions/meal';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';

const ServingTypeSelectStyles = {
  control: (styles, { selectProps: { menuIsOpen } }) => ({
    ...styles,
    boxShadow: 'none',
    border: menuIsOpen ? '1px solid #96c8da' : '1px solid hsl(0,0%,80%)',
    borderBottom: menuIsOpen ? 0 : '1px solid hsl(0,0%,80%)',
    borderBottomLeftRadius: menuIsOpen ? 0 : '4px',
    borderBottomRightRadius: menuIsOpen ? 0 : '4px',
    ':hover': {
      border: '1px solid #96c8da',
      borderBottom: menuIsOpen ? 0 : '1px solid #96c8da',
    },
  }),
  menu: (styles) => ({
    ...styles,
    marginTop: 0,
    boxShadow: 'none',
    border: '1px solid #96c8da',
    borderTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  }),
  option: (styles, { data, isFocused, isSelected }) => ({
    ...styles,
    display: 'flex',
    alignItems: 'center',
    background: isFocused || isSelected ? 'rgba(0,0,0,.03)' : '#ffffff',
    color: isSelected ? 'rgba(0,0,0,.95)' : '#000000',
    fontSize: '15px',
    ':before': {
      backgroundColor: typeof data.value !== 'undefined' ? RICE_TYPES_LIST[data.value].color : '#cccccc',
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  }),
  singleValue: (styles, { data, selectProps: { menuIsOpen } }) => ({
    ...styles,
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
    color: menuIsOpen ? 'hsla(0,0%,74.9%,.87)' : '#0000000',
    ':before': {
      backgroundColor: menuIsOpen ? 'hsla(0,0%,74.9%,.87)' : typeof data.value !== 'undefined' ? RICE_TYPES_LIST[data.value].color : '#cccccc',
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  }),
};

const StyledModal = styled(Modal)`
  .modal-title {
    font-weight: 700;
    font-size: 1.5em;
  }
`;

const UpdateRegisterdRiceModal = ({ selectedEmployees, open, onClose }) => {
  const dispatch = useDispatch();
  const {
    mealTypeList,
    getMealTypeLoading,
  } = useSelector((state) => state.mealStatistic);
  const [selectedRiceType, setSelectedRiceType] = useState(0);
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
    const params = {
      date: moment(new Date()).format('YYYY-MM-DD'),
      riceRegisterType: d.idComTheoCa?.value,
    };
    const data = {
      employeeIds: selectedEmployees,
      ngayDangKy: moment(new Date()).format('YYYY-MM-DD'),
      idComTheoCa: d.idComTheoCa?.value,
      loaiCom: selectedRiceType,
    };
    try {
      await httpClient.callApi({
        method: 'PUT',
        url: apiLinks.statistic.updateRegistedRice(params),
        data,
      });
      onClose();
      notify('success', 'Đã cập nhật đăng ký cơm');
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Đã xảy ra lỗi.');
    }
  };
  const getMealType = () => {
    dispatch(getTypeRegisteredMeal({
      page_number: 1,
      page_size: 20,
    }));
  };
  useEffect(getMealType, []);
  useEffect(() => {
    register('idComTheoCa',
      { required: 'Chưa loại đăng kí cơm' },
    );
  }, [register, setValue]);
  return (
    <>
      <StyledModal
        size="md"
        isOpen={open}
      >
        <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
          <ModalHeader toggle={onClose}>
            <span className="font-weight-bold">
              Cập nhật đăng ký cơm
            </span>
          </ModalHeader>
          <ModalBody>
            <Row className="mb-2">
              <Col>
                <FormGroup>
                  <Label className={classNames({ error: !!errors.idComTheoCa })}>Đổi sang loại cơm?</Label>
                  <Select
                    styles={ServingTypeSelectStyles}
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
                    cacheOptions
                    defaultOptions={(mealTypeList?.data ?? []).map((o) => ({ value: o?.id, label: o?.tenLoaiDangKyCom }))}
                    // loadOptions={getPermission}
                    loadingMessage={() => 'Đang lấy dữ liệu...'}
                    noOptionsMessage={() => 'Không có dữ liệu'}
                    placeholder="Chọn ca"
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

export default UpdateRegisterdRiceModal;
