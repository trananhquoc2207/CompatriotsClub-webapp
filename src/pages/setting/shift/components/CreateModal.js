import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import dayJS from 'dayjs';
import {
  Row, Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardBody,
  NavLink,
  FormFeedback,
  NavItem,
  TabContent,
  Nav,
  TabPane,
  CardTitle,
} from 'reactstrap';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-datepicker';
import certificateApi from 'api/certificateApi';
import departmentApi from 'api/departmentApi';
import positionApi from 'api/positionApi';
import contractTypeApi from 'api/contractTypeApi';
import siteApi from 'api/siteApi';
import { notify } from 'utils/helpers';
import genders from 'assets/mocks/genders.json';
import materialStatuses from 'assets/mocks/material-status.json';
import insurancePaymentTerm from 'assets/mocks/insurance-payment-term.json';
import taskApi from 'api/taskApi';
import employeeApi from 'api/employeeApi';

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


const CreateModal = ({ open, onClose, onRefresh }) => {
  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    handleSubmit,
  } = useForm();

  const [modalAdd, setModalAdd] = useState({
    page: 1,
    add: false,
    isShow: false
  });
  const [activeTab, setActiveTab] = useState(1);
  const getEmployees = useCallback(async (p) => {
    const { success, data } = await employeeApi.get({ q: p });
    if (success) {
      return data.slice(0, 10).map((o) => ({ value: o.id, label: o.tenNV }));
    }
  }, [employeeApi]);


  const onSubmit = async (d) => {
    try {
      await taskApi.post({
        ...d,
        projectID: projectID,
        beginDate: dayJS(d.beginDate).format('YYYY-MM-DD'),
        endDate: dayJS(d.endDate).format('YYYY-MM-DD'),
        member: d.member?.value ?? 0,
        comment: [],
      });
      onClose();
      notify('success', 'Đã thêm.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    }
  };

  useEffect(() => {
    register('title', { required: 'Bắt buộc nhập tiêu đề công việc' });
    register('content', { required: 'Bắt buộc nhập mô tả dự án' });
    register('member', { required: 'Bắt buộc chọn thành viên phụ trách' });
    register('beginDate');
    register('endDate');
    setValue('beginDate', new Date());
    setValue('endDate', new Date());
  }, [register, setValue]);

  return (
    <StyledModal size="md" isOpen={open}>

      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
        <div className="twitter-bs-wizard">
          <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified" style={{ borderRadius: '0.4rem' }}>
            <NavItem>
              <NavLink className={classNames({ active: modalAdd.page === 1 })} style={{ fontWeight: '700', color: '#495057!important' }} onClick={() => { setModalAdd({ ...modalAdd, page: 1 }) }}>
                <span className="step-number mr-2">01</span>
                Ca làm việc
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classNames({ active: modalAdd.page === 2 })} style={{ fontWeight: '700', color: '#495057!important' }} onClick={() => { setModalAdd({ ...modalAdd, page: 2 }) }}>
                <span className="step-number mr-2">02</span>
                Chi tiết ca làm
              </NavLink>
            </NavItem>
          </ul>
          <TabContent activeTab={modalAdd.page} className="twitter-bs-wizard-tab-content">
            <TabPane tabId={1}>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label className={classnames({ 'error': !!errors.title })}>Tên công việc</Label>
                    <Input
                      placeholder="Nhập tên công việc"
                      defaultValue={watch('title') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('title', value);
                        trigger('title');
                      }}
                    />
                    {(errors?.title ?? false) && <FormFeedback>{errors?.title?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId={2}>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label className={classnames({ 'error': !!errors.title })}>Tên công </Label>
                    <Input
                      placeholder="Nhập tên công việc"
                      defaultValue={watch('title') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('title', value);
                        trigger('title');
                      }}
                    />
                    {(errors?.title ?? false) && <FormFeedback>{errors?.title?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
          <div className="pager wizard twitter-bs-wizard-pager-link">
            <span className={(modalAdd.page === 1) ? 'btn btn-info waves-effect waves-light float-left disabled' : 'btn btn-info waves-effect waves-light float-left'} size="md" onClick={() => toggleTab(1)}>{props.t('Previous')}</span>
            <span className={(modalAdd.page === 2) ? 'btn btn-info waves-effect waves-light float-right disabled' : 'btn btn-info waves-effect waves-light float-right'} size="md" onClick={() => { toggleTab(2) }}>{props.t('Next')}</span>
            {modalAdd.page !== 2 ? null : <button className="btn btn-success waves-effect waves-light float-right mr-3" type="submit">{props.t('Add')}</button>}
          </div>
        </div>
      </Form>
    </StyledModal>
  );
}

export default CreateModal;