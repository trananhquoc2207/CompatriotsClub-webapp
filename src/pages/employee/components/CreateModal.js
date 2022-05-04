import React, { useState, useEffect, useCallback } from "react";
import classnames from "classnames";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import dayJS from "dayjs";
import {
  Row,
  Col,
  Form,
  FormGroup,
  FormFeedback,
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
} from "reactstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import employeeApi from "api/employeeApi";
import { notify } from "utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import genders from "assets/mocks/genders.json";


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
    background-color: #fcfcfc;
  }
  .title {
    font-size: 0.9rem;
    font-weight: 700;
    transition: all 0.4s;
    &::after {
      content: "\\ed35";
      font-family: "boxicons" !important;
      display: block;
      float: right;
      transition: transform 0.2s;
    }
    &__active {
      &::after {
        transform: rotate(90deg);
      }
    }
  }
  .error {
    &__label {
      color: #f46a6a;
    }
    &__card {
      color: #f46a6a;
      border: 1px solid #f46a6a;
      border-radius: 3px;
    }
  }
  .disabled {
    display: none;
  }
  .invalid-feedback {
    display: block;
  }
`;

const CreateModal = ({ open, onClose, onRefresh }) => {
  const { errors, watch, trigger, register, setValue,handleSubmit} =
    useForm();
  const dispatch = useDispatch();
  const informationErrors =
    !!errors.familyId ||
    !!errors.groupId ||
    !!errors.name ||
    !!errors.birth ||
    !!errors.gender ||
    !!errors.joinDate ||
    !!errors.idcard ||
    !!errors.notes ||
    !!errors.addres ||
    !!errors.email ||
    !!errors.phoneNumber ||
    !!errors.word;

  const [accordionInfomation, setAccordionInfomation] = useState(true);

  const isAvailableCode = useCallback(
    async (p) => {
      try {
        const { data } = await employeeApi.getCode(p);
        return Boolean(data);
      } catch (err) {}
      return false;
    },
    [employeeApi]
  );




  const onSubmit = async (d) => {
    //d.preventDefault()
    console.log(d);
    try {
      await employeeApi.post({
        ...d,
      });
      onClose();
      notify("success", "Đã thêm.");
      onRefresh();
    } catch (error) {
      await employeeApi.post({
        ...d,
      });
      // notify(
      //   "danger",
      //   error?.response?.error_message ??
      //     error?.message ??
      //     "Lỗi không thể xác định."
      // );
    }
  };
  useEffect(() => {
    register("code", {
      required: "Bắt buộc phải nhập mã thành viên"
      // validate: (p) =>
      //   isAvailableCode(p).then((r) => (r ? "Mã nhân viên đã dăng kí" : true)),
    });

    register("name", { required: "Bắt buộc phải nhập tên nhân viên" });
    register("birth", { required: "Bắt buộc phải nhập ngày sinh" });
    register("joinDate", new Date());
    //setValue('gender', { required: 'Bắt buộc phải nhập tên nhân viên' });
    register("gender", { required: "Bắt buộc phải chọn giới tính" });
    register("notes", { required: "Bắt buộc phải nhập tên nhân viên" });
    // register('addres', { required: 'Bắt buộc phải nhập tên nhân viên' });
    register("email", { required: "Bắt buộc phải nhập tên nhân viên" });
    register("phoneNumber", { required: "Bắt buộc phải nhập tên nhân viên" });
    register("word", { required: "Bắt buộc phải nhập tên nhân viên" });
    register("idcard", { required: "Bắt buộc phải nhập cmnd" });
    setValue("birth", new Date());
    setValue("joinDate", new Date());

    setValue("gender", 
      0
    );
  }, [register, setValue]);

  return (
     <StyledModal size="lg" isOpen={open}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={onClose}>
          Thêm mới
        </ModalHeader>
        <ModalBody>
          <StyledCard>
            <CardHeader className={classnames({ 'error__card': informationErrors })} onClick={() => setAccordionInfomation(!accordionInfomation)}>
              <span className={classnames('title', { 'title__active': accordionInfomation })}>Thông tin cá nhân</span>
            </CardHeader>
            <CardBody className={classnames({ 'disabled': !accordionInfomation })}>
              <Row>
                <Col xs={4}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.name })}>Tên hội viên</Label>
                    <Input
                      placeholder="Nhập họ tên hội viên"
                      className={classnames('form-control', { 'is-invalid': !!errors.name })}
                      defaultValue={watch('name') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('name', value);
                        trigger('name');
                      }}
                    />
                    {(errors?.name ?? false) && <FormFeedback>{(errors?.name?.message ?? '')}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.birth })}>Ngày sinh</Label>
                    <DatePicker
                      autoComplete="off"
                      locale="vi"
                      dateFormat={'dd/MM/yyyy'}
                      className={classnames('form-control', { 'is-invalid': !!errors.birth })}
                      selected={watch('birth') || undefined}
                      onChange={time => {
                        setValue('birth', time);
                        trigger('birth');
                      }}
                    />
                    {(errors?.birth ?? false) && <FormFeedback>{errors?.birth?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={4}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.gender })}>Giới tính</Label>
                    {/* <Select
                      styles={{
                        control: (base, state) => (
                          errors.gender
                            ?
                            {
                              ...base,
                              boxShadow: state.isFocused ? null : null,
                              borderColor: '#F46A6A',
                              '&:hover': {
                                borderColor: '#F46A6A'
                              }
                            }
                            :
                            {
                              ...base,
                              boxShadow: state.isFocused ? null : null,
                              borderColor: '#CED4DA',
                              '&:hover': {
                                borderColor: '#2684FF'
                              }
                            }
                        )
                      }}
                      value={watch('gender') || undefined}
                      options={Object.keys(genders || {}).map((key) => ({
                        value: key,
                        label: genders[key],
                      }))}
                      onChange={(value) => {
                        setValue('gender', value);
                        trigger('gender');
                      }}
                    /> */}
                    {(errors?.gender ?? false) && <FormFeedback>{errors?.gender?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={4}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.joinDate })}>Ngày tham gia</Label>
                    <DatePicker
                      autoComplete="off"
                      locale="vi"
                      dateFormat={'dd/MM/yyyy'}
                      className={classnames('form-control', { 'is-invalid': !!errors.joinDate })}
                      selected={watch('joinDate') || undefined}
                      onChange={time => {
                        setValue('joinDate', time);
                        trigger('joinDate');
                      }}
                    />
                    {(errors?.joinDate ?? false) && <FormFeedback>{errors?.joinDate?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>

              </Row>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.idcard })}>Căn cước công dân</Label>
                    <Input
                      placeholder="Nhập căn cước công dân"
                      className={classnames('form-control', { 'is-invalid': !!errors.idcard })}
                      defaultValue={watch('idcard') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('idcard', value);
                        trigger('idcard');
                      }}
                    />
                    {(errors?.idcard ?? false) && <FormFeedback>{errors?.idcard?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.notes })}>Ghi chú</Label>
                    <Input
                      placeholder="Ghi chú"
                      className={classnames('form-control', { 'is-invalid': !!errors.notes })}
                      defaultValue={watch('notes') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('notes', value );
                        trigger('notes');
                      }}
                    />
                    {(errors?.notes ?? false) && <FormFeedback>{errors?.notes?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
              </Row>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.email })}>Email</Label>
                    <Input
                      placeholder="Nhập email"
                      className={classnames('form-control', { 'is-invalid': !!errors.email })}
                      defaultValue={watch('email') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('email', value);
                        trigger('email');
                      }}
                    />
                    {(errors?.email ?? false) && <FormFeedback>{errors?.email?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.phoneNumber })}>Số điện thoại</Label>
                    <Input
                      placeholder="Nhập số điện thoại"
                      className={classnames('form-control', { 'is-invalid': !!errors.phoneNumber })}
                      defaultValue={watch('phoneNumber') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('phoneNumber', value);
                        trigger('phoneNumber');
                      }}
                    />
                    {(errors?.phoneNumber ?? false) && <FormFeedback>{errors?.phoneNumber?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.word })}>Công việc</Label>
                    <Input
                      placeholder="Nhập công việc"
                      className={classnames('form-control', { 'is-invalid': !!errors.word })}
                      defaultValue={watch('word') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('word', value);
                        trigger('word');
                      }}
                    />
                    {(errors?.word ?? false) && <FormFeedback>{errors?.word?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </StyledCard>

        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="success">Xác nhận</Button>
        </ModalFooter>
      </Form>
    </StyledModal>
  )
};

export default CreateModal;
