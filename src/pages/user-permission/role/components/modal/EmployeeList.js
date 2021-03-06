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
import { notify } from 'utils/helpers';

import { useDispatch, useSelector } from 'react-redux';

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

const EmployeeList = ({ data, open, onClose, onRefresh }) => {
  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    getValues,
    reset,
    handleSubmit,
  } = useForm();

  const [type, setType] = useState(2);
  const dispatch = useDispatch();
  const { unitGroup, getUnitGroupLoading } = useSelector((s) => s.unit);
  const { data: unitList, totalSizes } = unitGroup;

  const onSubmit = async (d) => {
    try {
      // await unitApi.put({
      //   ...d,
      //   id: data.id,
      //   idDonViCha: d.idDonViCha?.value ?? 0,
      //   caLamViecId: d.caLamViecId?.value ?? 0,
      //   loaiDonVi: parseInt(d.loaiDonVi?.value) ?? 0,
      //   phuCap: parseFloat(d?.phuCap),

      // });
      onClose();
      notify('success', '???? c???p nh???t.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'L???i kh??ng th??? x??c ?????nh.');
    }
  };

  useEffect(() => {
    register('tenDonVi', { required: 'Ch??a nh???p t??n ????n v???' });
    register('caLamViecId', { required: 'Ch??a ch???n ca l??m vi???c' });
    register('loaiDonVi', { required: 'Ch??a ch???n lo???i ????n v??? t??? ch???c' });
    register('phuCap', { required: 'Ch??a nh???p ph??? c???p' });
    register('idDonViCha', { required: 'Ch??a ch???n ????n v??? tr???c thu???c' });
  }, [register, setValue]);
  useEffect(() => {
    reset({
      ...data,
    
      caLamViecId: {
        value: data?.caLamViec?.id ?? 0,
        label: (data?.caLamViec?.gioVaoCa.slice(0, 5) + ' - ' + data?.caLamViec?.gioRaCa.slice(0, 5)) ?? '--:--',
      },
      idDonViCha: {
        value: data?.donViCha?.id ?? 0,
        label: data?.donViCha?.tenDonVi ?? ''
      },
    });
  }, [data]);
  return (

    <StyledModal size="md" isOpen={Boolean(data)}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <ModalHeader toggle={onClose}>
          C???p nh???t
        </ModalHeader>
        <ModalBody>

        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="success">X??c nh???n</Button>
        </ModalFooter>
      </Form>
    </StyledModal>
  );
};

export default EmployeeList;
