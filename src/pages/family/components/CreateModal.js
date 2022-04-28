import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import dayJS from 'dayjs';
import {
  Row, Col,
  Form, FormGroup, FormFeedback, Label, Input, Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Card, CardHeader, CardBody
} from 'reactstrap';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-datepicker';
import certificateApi from 'api/certificateApi';
import positionApi from 'api/positionApi';
import contractTypeApi from 'api/contractTypeApi';
import employeeApi from 'api/employeeApi';
import siteApi from 'api/siteApi';
import { notify } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import genders from 'assets/mocks/genders.json';
import materialStatuses from 'assets/mocks/material-status.json';
import insurancePaymentTerm from 'assets/mocks/insurance-payment-term.json';
import unitType from 'assets/mocks/unitType.json';
import unitApi from 'api/unitApi';

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

const bonusType = {
  "0": "Không được hưởng chế độ chuyên cần và nhà trọ",
  "1": "Chỉ được hưởng chế độ chuyên cần",
  "2": "Chỉ được hưởng chế độ nhà trọ",
  "3": "Được hưởng chế độ chuyên cần và nhà trọ",
}
const CreateModal = ({ open, onClose, onRefresh }) => {
  const {
    errors,
    watch,
    trigger,
    register,
    setValue,
    handleSubmit,
  } = useForm();
  const dispatch = useDispatch();
  const informationErrors =
    !!errors.maNV ||
    !!errors.tenNV ||
    !!errors.ngaySinh ||
    !!errors.gioiTinh ||
    !!errors.quocTich ||
    !!errors.canCuocCongDan ||
    !!errors.idBangCap ||
    !!errors.tinhTrangHonNhan ||
    !!errors.soNguoiPhuThuoc ||
    !!errors.email ||
    !!errors.soDienThoai ||
    !!errors.diaChi;
  const contractErrors =
    !!errors.soHopDong ||
    !!errors.ngayBatDau ||
    !!errors.ngayKetThuc ||
    !!errors.mucLuong;
  const positionErrors =
    !!errors.idDonVi ||
    !!errors.idChucVu ||
    !!errors.idChiNhanh;
  const diligenceErrors =
    !!errors.bonusType;

  const [acceptPayInsurance, setAcceptPayInsurance] = useState(false);
  const [accordionInfomation, setAccordionInfomation] = useState(true);
  const [accordionContract, setAccordionContract] = useState(false);
  const [accordionPosition, setAccordionPosition] = useState(false);
  const [accordionDiligence, setAccordionDiligence] = useState(false);
  const { unitGroup, getUnitGroupLoading } = useSelector((s) => s.unit);
  const { data: unitList, totalSizes } = unitGroup;
  const getCertificates = useCallback(async () => {
    const { success, data } = await certificateApi.getAll({ page_number: 0, page_size: 30 });
    if (success) {
      return data.slice(0, 30).map((o) => ({ value: o.id, label: o.tenBangCap }));
    }
  }, [certificateApi]);
  const getContractTypes = useCallback(async () => {
    const { success, data } = await contractTypeApi.getAll();
    if (success) {
      return data.slice(0, 10).map((o) => ({ value: o.id, label: o.tenLoaiHopDong }));
    }
  }, [contractTypeApi]);
  const getPositions = useCallback(async (p) => {
    const { success, data } = await positionApi.getAll({ q: p, isPaged: false });
    if (success) {
      return data.map((o) => ({ value: o.id, label: o.tenChucVu }));
    }
  }, [positionApi]);
  const getUnits = useCallback(async (p) => {
    const { success, data } = await unitApi.get({ MaDonVi: p, page_number: 0, page_size: 150 });
    if (success) {
      return data.slice(0, 150).map((o) => ({ value: o.id, label: o.tenDonVi }));
    }
  }, [positionApi]);
  const getSites = useCallback(async (p) => {
    const { success, data } = await siteApi.get({ tenCN: p });
    if (success) {
      return data.slice(0, 10).map((o) => ({ value: o.id, label: o.tenChiNhanh }));
    }
  }, [siteApi]);
  const isAvailableCode = useCallback(async (p) => {
    try {
      const { data } = await employeeApi.getCode(p);
      return Boolean(data);
    } catch (err) { }
    return false;
  }, [employeeApi]);

  const onSubmit = async (d) => {
    try {
      await employeeApi.post({
        ...d,
        ngayBatDau: dayJS(d.ngayBatDau).format('YYYY-MM-DD'),
        ngayKetThuc: dayJS(d.ngayKetThuc).format('YYYY-MM-DD'),
        ngayDongBH: dayJS(d.ngayDongBH).format('YYYY-MM-DD'),
        ngaySinh: dayJS(d.ngaySinh).format('YYYY-MM-DD'),
        gioiTinh: parseInt(d.gioiTinh?.value ?? 0, 10),
        idChiNhanh: d.idChiNhanh?.value ?? 0,
        idChucVu: d.idChucVu?.value ?? 0,
        idLoaiHopDong: d.idLoaiHopDong?.value ?? 0,
        idDonVi: d.idDonVi?.value ?? 0,
        tinhTrangHonNhan: parseInt(d.tinhTrangHonNhan?.value ?? 0, 10),
        mucLuong: parseFloat(d?.mucLuong.replace(/[^\d]/g, '') ?? '0'),
        idBangCap: d.idBangCap?.value ?? 0,
        kyHanDongBH: parseInt(d.kyHanDongBH?.value ?? 0, 10),
        bonusType: d.bonusType.value ?? 0
      });
      onClose();
      notify('success', 'Đã thêm.');
      onRefresh();
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    }
  };
  useEffect(() => {
    register('maNV', {
      required: 'Bắt buộc phải nhập mã nhân viên',
      validate: (p) => isAvailableCode(p).then((r) => r ? 'Mã nhân viên đã dăng kí' : true),
    });
    register('tenNV', { required: 'Bắt buộc phải nhập tên nhân viên' });
    register('ngaySinh', { required: 'Bắt buộc phải nhập ngày sinh' });
    register('gioiTinh', { required: 'Bắt buộc phải chọn giới tính' });
    register('quocTich', { required: 'Bắt buộc phải nhập quốc tịch' });
    register('canCuocCongDan', { required: 'Bắt buộc phải nhập căn cước công dân' });
    register('idBangCap', { required: 'Bắt buộc phải chọn bằng cấp' });
    register('tinhTrangHonNhan', { required: 'Bắt buộc phải chọn tình trạng hôn nhân' });
    register('soNguoiPhuThuoc', { required: 'Bắt buộc phải nhập số người phụ thuộc' });
    register('email');
    register('soDienThoai');
    register('diaChi', { required: 'Bắt buộc phải nhập địa chỉ' })
    register('soHopDong', { required: 'Bắt buộc phải nhập số hợp đồng' });
    register('idLoaiHopDong', { required: 'Bắt buộc phải chọn loại hợp đồng' });
    register('ngayBatDau', { required: 'Bắt buộc phải chọn ngày bắt đầu' });
    register('ngayKetThuc', { required: 'Bắt buộc phải chọn ngày kết thúc' });
    register('mucLuong', { required: 'Bắt buộc phải nhập mức lương' });
    register('dongBH');
    register('ngayDongBH', { required: 'Bắt buộc phải nhập ngày đóng bảo hiểm' });
    register('kyHanDongBH', { required: 'Bắt buộc phải nhập ngày đóng bảo hiểm' });
    register('idDonVi', { required: 'Bắt buộc phải chọn đơn vị' });
    register('idChucVu', { required: 'Bắt buộc phải chọn chức vụ' });
    register('idChiNhanh', { required: 'Bắt buộc phải chọn chi nhánh' });
    register('bonusType', { required: 'Chưa chọn chế độ chuyên cần' });

    setValue('quocTich', 'Việt Nam');
    setValue('ngaySinh', new Date());
    setValue('gioiTinh', {
      value: Object.keys(genders)[0],
      label: genders[Object.keys(genders)[0]]
    });
    setValue('tinhTrangHonNhan', {
      value: Object.keys(materialStatuses)[0],
      label: materialStatuses[Object.keys(materialStatuses)[0]]
    });
    setValue('soNguoiPhuThuoc', 0);
    setValue('ngayBatDau', new Date());
    setValue('ngayKetThuc', new Date());
    setValue('dongBH', acceptPayInsurance);
    setValue('ngayDongBH', new Date());
    setValue('kyHanDongBH', {
      value: Object.keys(insurancePaymentTerm)[0],
      label: insurancePaymentTerm[Object.keys(insurancePaymentTerm)[0]],
    })
  }, [register, setValue]);

  return (
    <StyledModal size="lg" isOpen={open}>
      <Form onSubmit={handleSubmit((d) => onSubmit(d))}>
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
                    <Label className={classnames({ 'error__label': !!errors.maNV })}>Mã nhân viên</Label>
                    <Input
                      placeholder="Nhập mã nhân viên"
                      defaultValue={watch('maNV') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('maNV', value);
                        trigger('maNV');
                      }}
                    />
                    {(errors?.maNV ?? false) && <FormFeedback>{(errors?.maNV?.message ?? '')}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={8}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.tenNV })}>Họ và tên</Label>
                    <Input
                      placeholder="Nhập họ tên nhân viên"
                      className={classnames('form-control', { 'is-invalid': !!errors.tenNV })}
                      defaultValue={watch('tenNV') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('tenNV', value);
                        trigger('tenNV');
                      }}
                    />
                    {(errors?.tenNV ?? false) && <FormFeedback>{errors?.tenNV?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.ngaySinh })}>Ngày sinh</Label>
                    <DatePicker
                      autoComplete="off"
                      locale="vi"
                      dateFormat={'dd/MM/yyyy'}
                      className={classnames('form-control', { 'is-invalid': !!errors.ngaySinh })}
                      selected={watch('ngaySinh') || undefined}
                      onChange={time => {
                        setValue('ngaySinh', time);
                        trigger('ngaySinh');
                      }}
                    />
                    {(errors?.ngaySinh ?? false) && <FormFeedback>{errors?.ngaySinh?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={4}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.gioiTinh })}>Giới tính</Label>
                    <Select
                      styles={{
                        control: (base, state) => (
                          errors.gioiTinh
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
                      value={watch('gioiTinh') || undefined}
                      options={Object.keys(genders || {}).map((key) => ({
                        value: key,
                        label: genders[key],
                      }))}
                      onChange={(value) => {
                        setValue('gioiTinh', value);
                        trigger('gioiTinh');
                      }}
                    />
                    {(errors?.gioiTinh ?? false) && <FormFeedback>{errors?.gioiTinh?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={4}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.quocTich })}>Quốc tịch</Label>
                    <Input
                      placeholder="Nhập quốc tịch"
                      className={classnames('form-control', { 'is-invalid': !!errors.quocTich })}
                      defaultValue={watch('quocTich') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('quocTich', value);
                        trigger('quocTich');
                      }}
                    />
                    {(errors?.quocTich ?? false) && <FormFeedback>{errors?.quocTich?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.canCuocCongDan })}>Căn cước công dân</Label>
                    <Input
                      placeholder="Nhập căn cước công dân"
                      className={classnames('form-control', { 'is-invalid': !!errors.canCuocCongDan })}
                      defaultValue={watch('canCuocCongDan') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('canCuocCongDan', value);
                        trigger('canCuocCongDan');
                      }}
                    />
                    {(errors?.canCuocCongDan ?? false) && <FormFeedback>{errors?.canCuocCongDan?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.tinhTrangHonNhan })}>Tình trạng hôn nhân</Label>
                    <Select
                      value={watch('tinhTrangHonNhan') || undefined}
                      options={Object.keys(materialStatuses || {}).map((key) => ({
                        value: key,
                        label: materialStatuses[key],
                      }))}
                      onChange={(value) => {
                        setValue('tinhTrangHonNhan', value);
                        trigger('tinhTrangHonNhan')
                      }}
                    />
                    {(errors?.tinhTrangHonNhan ?? false) && <FormFeedback>{errors?.tinhTrangHonNhan?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.soNguoiPhuThuoc })}>Số người phụ thuộc</Label>
                    <Input
                      type="number"
                      placeholder="Nhập số người phụ thuộc"
                      className={classnames('form-control', { 'is-invalid': !!errors.soNguoiPhuThuoc })}
                      defaultValue={watch('soNguoiPhuThuoc') || 0}
                      onBlur={({ target: { value } }) => {
                        setValue('soNguoiPhuThuoc', parseInt(value || 0, 10));
                        trigger('soNguoiPhuThuoc');
                      }}
                    />
                    {(errors?.soNguoiPhuThuoc ?? false) && <FormFeedback>{errors?.soNguoiPhuThuoc?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.idBangCap })}>Bằng cấp</Label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={getCertificates}
                      loadingMessage={() => 'Đang lấy dữ liệu...'}
                      noOptionsMessage={() => 'Không có dữ liệu'}
                      placeholder="Chọn bằng cấp"
                      styles={{
                        control: (base, state) => (
                          errors.idBangCap
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
                      onChange={(value) => {
                        setValue('idBangCap', value);
                        trigger('idBangCap');
                      }}
                    />
                    {(errors?.idBangCap ?? false) && <FormFeedback>{errors?.idBangCap?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
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
                    <Label className={classnames({ 'error__label': !!errors.soDienThoai })}>Số điện thoại</Label>
                    <Input
                      placeholder="Nhập số điện thoại"
                      className={classnames('form-control', { 'is-invalid': !!errors.soDienThoai })}
                      defaultValue={watch('soDienThoai') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('soDienThoai', value);
                        trigger('soDienThoai');
                      }}
                    />
                    {(errors?.soDienThoai ?? false) && <FormFeedback>{errors?.soDienThoai?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.diaChi })}>Địa chỉ</Label>
                    <Input
                      placeholder="Nhập địa chỉ"
                      className={classnames('form-control', { 'is-invalid': !!errors.diaChi })}
                      defaultValue={watch('diaChi') || ''}
                      onBlur={({ target: { value } }) => {
                        setValue('diaChi', value);
                        trigger('diaChi');
                      }}
                    />
                    {(errors?.diaChi ?? false) && <FormFeedback>{errors?.diaChi?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </StyledCard>
          <StyledCard>
            <CardHeader className={classnames({ 'error__card': contractErrors })} onClick={() => setAccordionContract(!accordionContract)}>
              <span className={classnames('title', { 'title__active': accordionContract })}>Thông tin hợp đồng</span>
            </CardHeader>
            <CardBody className={classnames({ 'disabled': !accordionContract })}>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.soHopDong })}>Số hợp đồng</Label>
                    <Input
                      placeholder="Nhập số hợp đồng"
                      className={classnames('form-control', { 'is-invalid': !!errors?.soHopDong })}
                      onChange={({ target: { value } }) => {
                        setValue('soHopDong', value);
                        trigger('soHopDong');
                      }}
                    />
                    {(errors?.soHopDong ?? false) && <FormFeedback>{errors?.soHopDong?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.idLoaiHopDong })}>Loại hợp đồng</Label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={getContractTypes}
                      loadingMessage={() => 'Đang lấy dữ liệu...'}
                      noOptionsMessage={() => 'Không có dữ liệu'}
                      placeholder="Chọn loại hợp đồng"
                      styles={{
                        control: (base, state) => (
                          errors.idLoaiHopDong
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
                      onChange={(value) => {
                        setValue('idLoaiHopDong', value);
                        trigger('idLoaiHopDong');
                      }}
                    />
                    {(errors?.idLoaiHopDong ?? false) && <FormFeedback>{errors?.idLoaiHopDong?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors?.ngayBatDau })}>Ngày bắt đầu</Label>
                    <DatePicker
                      autoComplete="off"
                      locale="vi"
                      dateFormat={'dd/MM/yyyy'}
                      className={classnames('form-control', { 'is-invalid': !!errors.ngayBatDau })}
                      selected={watch('ngayBatDau') || undefined}
                      onChange={time => {
                        setValue('ngayBatDau', time);
                        trigger('ngayBatDau');
                      }}
                    />
                    {(errors?.ngayBatDau ?? false) && <FormFeedback>{errors?.ngayBatDau?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors?.ngayKetThuc })}>Ngày kết thúc</Label>
                    <DatePicker
                      autoComplete="off"
                      locale="vi"
                      dateFormat={'dd/MM/yyyy'}
                      className={classnames('form-control', { 'is-invalid': !!errors.ngayKetThuc })}
                      selected={watch('ngayKetThuc') || undefined}
                      onChange={time => {
                        setValue('ngayKetThuc', time);
                        trigger('ngayKetThuc');
                      }}
                    />
                    {(errors?.ngayKetThuc ?? false) && <FormFeedback>{errors?.ngayKetThuc?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.mucLuong })}>Lương</Label>
                    <NumberFormat
                      suffix=" đ"
                      thousandSeparator
                      placeholder="Mức lương"
                      className={classnames('form-control', { 'is-invalid': !!errors?.mucLuong })}
                      onChange={({ target: { value } }) => {
                        setValue('mucLuong', value);
                        trigger('mucLuong');
                      }}
                    />
                    {(errors?.mucLuong ?? false) && <FormFeedback>{errors?.mucLuong?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={4}>
                  <div style={{ padding: '2rem' }}>
                    <Input
                      type="checkbox"
                      onChange={() => {
                        setAcceptPayInsurance(!acceptPayInsurance);
                        setValue('dongDH', acceptPayInsurance);
                      }}
                    /> Đóng bảo hiểm
                  </div>
                </Col>
              </Row>
              {acceptPayInsurance && (
                <Row>
                  <Col xs={6}>
                    <FormGroup>
                      <Label className={classnames({ 'error__label': !!errors.ngayDongBH })}>Ngày đóng bảo hiểm</Label>
                      <DatePicker
                        autoComplete="off"
                        locale="vi"
                        dateFormat={'dd/MM/yyyy'}
                        className={classnames('form-control', { 'is-invalid': !!errors.ngayDongBH })}
                        selected={watch('ngayDongBH') || undefined}
                        onChange={time => {
                          setValue('ngayDongBH', time);
                          trigger('ngayDongBH');
                        }}
                      />
                      {(errors?.ngayDongBH ?? false) && <FormFeedback>{errors?.ngayDongBH?.message ?? ''}</FormFeedback>}
                    </FormGroup>
                  </Col>
                  <Col xs={6}>
                    <FormGroup>
                      <Label className={classnames({ 'error__label': !!errors.kyHanDongBH })}>Kỳ hạn đóng bảo hiểm</Label>
                      <Select
                        styles={{
                          control: (base, state) => (
                            errors.kyHanDongBH
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
                        value={watch('kyHanDongBH') || undefined}
                        options={Object.keys(insurancePaymentTerm || {}).map((key) => ({
                          value: key,
                          label: insurancePaymentTerm[key],
                        }))}
                        onChange={(value) => {
                          setValue('kyHanDongBH', value);
                          trigger('kyHanDongBH');
                        }}
                      />
                      {(errors?.kyHanDongBH ?? false) && <FormFeedback>{errors?.kyHanDongBH?.message ?? ''}</FormFeedback>}
                    </FormGroup>
                  </Col>
                </Row>
              )}
            </CardBody>
          </StyledCard>
          <StyledCard>
            <CardHeader className={classnames({ 'error__card': positionErrors })} onClick={() => setAccordionPosition(!accordionPosition)}>
              <span className={classnames('title', { 'title__active': accordionPosition })}>Vị trí làm việc</span>
            </CardHeader>
            <CardBody className={classnames({ 'disabled': !accordionPosition })}>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.idDonVi })}>Đơn vị công tác</Label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={getUnits}
                      loadingMessage={() => 'Đang lấy dữ liệu...'}
                      noOptionsMessage={() => 'Không có dữ liệu'}
                      placeholder="Chọn đơn vị công tác"
                      styles={{
                        control: (base, state) => (
                          errors.idDonVi
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
                      onChange={(value) => {
                        setValue('idDonVi', value);
                        trigger('idDonVi');
                      }}
                    />
                    {(errors?.idDonVi ?? false) && <FormFeedback>{errors?.idDonVi?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.idChucVu })}>Chức vụ</Label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={getPositions}
                      loadingMessage={() => 'Đang lấy dữ liệu...'}
                      noOptionsMessage={() => 'Không có dữ liệu'}
                      placeholder="Chọn chức vụ"
                      styles={{
                        control: (base, state) => (
                          errors.idChucVu
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
                      onChange={(value) => {
                        setValue('idChucVu', value);
                        trigger('idChucVu');
                      }}
                    />
                    {(errors?.idChucVu ?? false) && <FormFeedback>{errors?.idChucVu?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label className={classnames({ 'error__label': !!errors.idChiNhanh })}>Chi nhánh</Label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={getSites}
                      loadingMessage={() => 'Đang lấy dữ liệu...'}
                      noOptionsMessage={() => 'Không có dữ liệu'}
                      placeholder="Chọn chi nhánh"
                      styles={{
                        control: (base, state) => (
                          errors.idChiNhanh
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
                      onChange={(value) => {
                        setValue('idChiNhanh', value);
                        trigger('idChiNhanh');
                      }}
                    />
                    {(errors?.idChiNhanh ?? false) && <FormFeedback>{errors?.idChiNhanh?.message ?? ''}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </StyledCard>
          <StyledCard>
            <CardHeader className={classnames({ 'error__card': diligenceErrors })} onClick={() => setAccordionDiligence(!accordionDiligence)}>
              <span className={classnames('title', { 'title__active': accordionDiligence })}>Chuyên cần nhà trọ</span>
            </CardHeader>
            <CardBody className={classnames({ 'disabled': !accordionDiligence })}>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label className={classnames({ error__label: !!errors.bonusType })}>Hỗ trợ chuyên cần nhà trọ</Label>
                    <Select
                      styles={{
                        control: (base, state) => (
                          errors.bonusType
                            ?
                            {
                              ...base,
                              boxShadow: state.isFocused ? null : null,
                              borderColor: '#F46A6A',
                              '&:hover': {
                                borderColor: '#F46A6A',
                              },
                            }
                            :
                            {
                              ...base,
                              boxShadow: state.isFocused ? null : null,
                              borderColor: '#CED4DA',
                              '&:hover': {
                                borderColor: '#2684FF',
                              },
                            }
                        ),
                      }}
                      placeholder={'Được hưởng chuyên cần nhà trọ...'}
                      options={Object.keys(bonusType || {}).map((key) => ({
                        value: key,
                        label: bonusType[key],
                      }))}
                      onChange={(value) => {
                        setValue('bonusType', value);
                        trigger('bonusType');
                      }}
                    />
                    {(errors?.bonusType ?? false) && <FormFeedback>{errors?.bonusType?.message ?? ''}</FormFeedback>}
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
  );
}

export default CreateModal;
