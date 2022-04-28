import React, { useState, useEffect, useMemo, useCallback } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import {
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import AsyncSelect from 'react-select/async';
import { notify } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, getUserWithoutDispatch } from 'pages/user-permission/user/actions/user';
import httpClient from 'utils/http-client';
import apiLinks from 'utils/api-links';

const StyledModal = styled(Modal)`
  .modal-title {
    font-weight: 700;
    font-size: 1.5em;
  }
`;

const AddUserModal = ({ data, onClose, onRefresh }) => {
  const [filter, setFilter] = useState({});
  const {
    errors,
    trigger,
    register,
    setValue,
    handleSubmit,
  } = useForm();

  const dispatch = useDispatch();
  const {
    userData: { data: userList },
  } = useSelector((state) => state.user);

  const userOptions = useMemo(() =>
    userList.reduce((r, u) => ([
      ...r, {
        value: u.id,
        label: `${u?.username} | ${u?.fullname}`,
      },
    ]), [{
      value: 'all',
      label: 'Tất cả',
    }]),
    [userList]);

  const onSubmit = async (d) => {
    try {
      await httpClient.callApi({
        method: 'POST',
        url: apiLinks.role.addUser(data),
        data: {
          ids:
            d.ids.find((_) => _.value === 'all')
              ? userList.map((u) => u.id)
              : d.ids.map((u) => u.value),
        },
      });
      onClose();
      onRefresh();
      notify('success', 'Đã thêm.');
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Đã xảy ra lỗi.');
    }
  };

  const handleFilter = useCallback(async (p) => {
    const { data: userData } = await getUserWithoutDispatch(p);
    return userData.reduce((r, u) => ([
      ...r, {
        value: u.id,
        label: `${u?.username} | ${u?.fullname}`,
      },
    ]), [{
      value: 'all',
      label: 'Tất cả',
    }]);
  });

  const getData = useCallback(() => {
    dispatch(getUsers(filter));
  }, [filter]);
  useEffect(getData, [getData]);

  useEffect(() => {
    register('ids',
      { required: 'Chưa chọn tài khoản' },
    );
  }, [register, setValue]);

  return (
    <StyledModal size="lg" isOpen={Boolean(data)}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          Thêm tài khoản vào nhóm
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.ids })}>Chọn tài khoản</Label>
                <AsyncSelect
                  isMulti
                  cacheOptions
                  closeMenuOnSelect={false}
                  defaultOptions={userOptions}
                  loadOptions={(p) => handleFilter({ keyword: p })}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  placeholder="Nhập tài khoản"
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

export default AddUserModal;
