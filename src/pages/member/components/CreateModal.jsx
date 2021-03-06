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
  !!errors.code ||
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
    try {
      await employeeApi.post({
        ...d,
        gender: parseInt(d.gender?.value ?? 0, 10),
      });
      onClose();
      notify("success", "???? th??m.");
      onRefresh();
    } catch (error) {
      await employeeApi.post({
        ...d,
      });
      // notify(
      //   "danger",
      //   error?.response?.error_message ??
      //     error?.message ??
      //     "L???i kh??ng th??? x??c ?????nh."
      // );
    }
  };
  useEffect(() => {
    register("code", {
      required: "B???t bu???c ph???i nh???p m?? th??nh vi??n"
    });

    register("name", { required: "B???t bu???c ph???i nh???p t??n nh??n vi??n" });
    register("birth", { required: "B???t bu???c ph???i nh???p ng??y sinh" });
    register("joinDate", new Date());
    register("gender", { required: "B???t bu???c ph???i ch???n gi???i t??nh" });
    register("notes", { required: "B???t bu???c ph???i nh???p t??n nh??n vi??n" });
    register("email", { required: "B???t bu???c ph???i nh???p t??n nh??n vi??n" });
    register("phoneNumber", { required: "B???t bu???c ph???i nh???p t??n nh??n vi??n" });
    register("word", { required: "B???t bu???c ph???i nh???p t??n nh??n vi??n" });
    register("idcard", { required: "B???t bu???c ph???i nh???p cmnd" });
    setValue("birth", new Date());
    setValue("joinDate", new Date());

    // setValue('gender', {
    //   value: Object.keys(genders)[0],
    //   label: genders[Object.keys(genders)[0]]
    // });
  }, [register, setValue]);

  return (
     <StyledModal size="lg" isOpen={open}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={onClose}>
          Th??m m???i
        </ModalHeader>
        <ModalBody>
          <StyledCard>
            <CardHeader className={classnames({ 'error__card': informationErrors })} onClick={() => setAccordionInfomation(!accordionInfomation)}>
              <span className={classnames('title', { 'title__active': accordionInfomation })}>Th??ng tin c?? nh??n</span>
            </CardHeader>
            <CardBody className={classnames({ 'disabled': !accordionInfomation })}>
              <Row>
              <Col xs={4}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.code })}>M?? h???i vi??n</Label>
                    <Input
                      placeholder="Nh???p m?? h???i vi??n"
                      className={classnames('form-control', { 'is-invalid': !!errors.code })}
                      defaultValue={watch('code') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('code', value);
                        trigger('code');
                      }}
                    />
                    {(errors?.email ?? false) && <FormFeedback>{errors?.email?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={4}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.name })}>T??n h???i vi??n</Label>
                    <Input
                      placeholder="Nh???p h??? t??n h???i vi??n"
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
                    <Label className={classnames({ 'error__label': !!errors.birth })}>Ng??y sinh</Label>
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
                    <Label className={classnames({ 'error__label': !!errors.gender })}>Gi???i t??nh</Label>
                    <Select
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
                    />
                    {(errors?.gender ?? false) && <FormFeedback>{errors?.gender?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={4}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.joinDate })}>Ng??y tham gia</Label>
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
                    <Label className={classnames({ 'error__label': !!errors.idcard })}>C??n c?????c c??ng d??n</Label>
                    <Input
                      placeholder="Nh???p c??n c?????c c??ng d??n"
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
              </Row>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.email })}>Email</Label>
                    <Input
                      placeholder="Nh???p email"
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
                    <Label className={classnames({ 'error__label': !!errors.phoneNumber })}>S??? ??i???n tho???i</Label>
                    <Input
                      placeholder="Nh???p s??? ??i???n tho???i"
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
                    <Label className={classnames({ 'error__label': !!errors.word })}>C??ng vi???c</Label>
                    <Input
                      placeholder="Nh???p c??ng vi???c"
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
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.notes })}>Ghi ch??</Label>
                    <Input
                      placeholder="Ghi ch??"
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
            </CardBody>
          </StyledCard>
          <StyledCard>
          <CardHeader className={classnames({ 'error__card': informationErrors })} onClick={() => setAccordionInfomation(!accordionInfomation)}>
              <span className={classnames('title', { 'title__active': accordionInfomation })}>?????a ch???</span>
            </CardHeader>
            <CardBody className={classnames({ 'disabled': !accordionInfomation })}>
            <Row>
              <Col xs={4}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.code })}>Nh???p t???nh</Label>
                    <Input
                      placeholder="Nh???p t???nh"
                      className={classnames('form-control')}
                    />
                  </FormGroup>
                </Col>
                <Col xs={4}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.code })}>Nh???p qu???n/huy???n</Label>
                    <Input
                      placeholder="Nh???p qu???n/huy???n"
                      className={classnames('form-control')}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </StyledCard>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="success">X??c nh???n</Button>
        </ModalFooter>
      </Form>
    </StyledModal>
  )
};

export default CreateModal;
