import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import {
  Row,
  Col,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
} from 'reactstrap';
import AsyncSelect from 'react-select/async';
import { notify } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
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
      notify('success', '???? th??m.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? '???? x???y ra l???i.');
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
      { required: 'Ch??a ch???n quy???n' },
    );
  }, [register, setValue]);

  return (
    <StyledModal size="lg" isOpen={Boolean(data)}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          Th??m quy???n
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label className={classnames({ error: !!errors.ids })}>Ch???n quy???n c???n th??m</Label>
                <AsyncSelect
                  isMulti
                  cacheOptions
                  closeMenuOnSelect={isCloseSelect}
                  defaultOptions={[{ value: 'all', label: `T???t c??? quy???n` }].concat(permissionList?.data.map((o, i) => ({ value: o?.id, label: o?.description })))}
                  //loadOptions={getPermission}
                  loadingMessage={() => '??ang l???y d??? li???u...'}
                  noOptionsMessage={() => 'Kh??ng c?? d??? li???u'}
                  placeholder="Ch???n quy???n"
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
          <Button type="submit" color="success">X??c nh???n</Button>
        </ModalFooter>
      </Form>
    </StyledModal>
  );
};

export default AddPermissionModal;
