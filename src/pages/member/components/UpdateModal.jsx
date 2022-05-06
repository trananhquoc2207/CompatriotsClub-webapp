import React, { useState, useEffect } from 'react';
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
import DatePicker from 'react-datepicker';
import employeeApi from 'api/employeeApi';
import { notify } from 'utils/helpers';
import genders from 'assets/mocks/genders.json';
import materialStatuses from 'assets/mocks/material-status.json';

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

const bonusType = {
	"0": "Không được hưởng chế độ chuyên cần và nhà trọ",
	"1": "Chỉ được hưởng chế độ chuyên cần",
	"2": "Chỉ được hưởng chế độ nhà trọ",
	"3": "Được hưởng chế độ chuyên cần và nhà trọ",
}
const UpdateModal = ({ data, onClose, onRefresh }) => {
	const {
		errors,
		reset,
		watch,
		trigger,
		register,
		setValue,
		handleSubmit,
	} = useForm();

	const [accordionInfomation, setAccordionInfomation] = useState(true);
	const [accordionPosition, setAccordionPosition] = useState(false);
	const [accordionDiligence, setAccordionDiligence] = useState(false);

	const onSubmit = async (d) => {
		try {
			await employeeApi.put(d?.id ?? 0, {
				...d,
				ngayBatDau: dayJS(d.ngayBatDau).format('YYYY-MM-DD'),
				ngayKetThuc: dayJS(d.ngayKetThuc).format('YYYY-MM-DD'),
				ngayDongBH: dayJS(d.ngayDongBH).format('YYYY-MM-DD'),
				ngaySinh: dayJS(d.ngaySinh).format('YYYY-MM-DD'),
				gioiTinh: parseInt(d.gioiTinh?.value ?? 0, 10),
				idChiNhanh: d.idChiNhanh?.value ?? 0,
				idChucVu: d.idChucVu?.value ?? 0,
				idDonVi: d.idDonVi?.value ?? 0,
				tinhTrangHonNhan: parseInt(d.tinhTrangHonNhan?.value ?? 0, 10),
				idBangCap: d.idBangCap?.value ?? 0,
				kyHanDongBH: parseInt(d.kyHanDongBH?.value ?? 0, 10),
				bonusType: d.bonusType.value ?? 0
			});
			onClose();
			notify('success', 'Đã cập nhật.');
			onRefresh();
		} catch (error) {
			notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
		}
	};

	useEffect(() => {
		register("code", {
		  required: "Bắt buộc phải nhập mã thành viên"
		});
	
		register("name", { required: "Bắt buộc phải nhập tên nhân viên" });
		register("birth", { required: "Bắt buộc phải nhập ngày sinh" });
		register("joinDate", new Date());
		register("gender", { required: "Bắt buộc phải chọn giới tính" });
		register("notes", { required: "Bắt buộc phải nhập tên nhân viên" });
		register("email", { required: "Bắt buộc phải nhập tên nhân viên" });
		register("phoneNumber", { required: "Bắt buộc phải nhập tên nhân viên" });
		register("word", { required: "Bắt buộc phải nhập tên nhân viên" });
		register("idcard", { required: "Bắt buộc phải nhập cmnd" });
		setValue("birth", new Date());
		setValue("joinDate", new Date());
	  }, [register, setValue]);

	useEffect(() => {
		reset({
			...data,
			gioiTinh: {
				value: data?.gioiTinh ?? 0,
				label: genders[data?.gioiTinh ?? 0],
			},
			tinhTrangHonNhan: {
				value: data?.tinhTrangHonNhan ?? 0,
				label: materialStatuses[data?.tinhTrangHonNhan ?? 0],
			},
			ngaySinh: ((data?.ngaySinh ?? '') !== '') ? new Date(data.ngaySinh) : new Date(),
			ngayDongBH: ((data?.ngayDongBH ?? '') !== '') ? new Date(data.ngayDongBH) : new Date(),
			ngayVaoLam: ((data?.ngayVaoLam ?? '') !== '') ? new Date(data.ngayVaoLam) : new Date(),
			idBangCap: {
				value: data?.idBangCap ?? 0,
				label: data?.BangCap?.tenBangCap ?? ''
			},
			idDonVi: {
				value: data?.idDonVi ?? 0,
				label: data?.donVi?.tenDonVi ?? ''
			},
			idChucVu: {
				value: data?.idChucVu ?? 0,
				label: data?.chucVu?.tenChucVu ?? ''
			},
			idChiNhanh: {
				value: data?.chiNhanh?.id ?? 0,
				label: data?.chiNhanh?.tenChiNhanh ?? ''
			},
			bonusType: {
				value: data?.bonusType ?? 0,
				label: bonusType[data?.bonusType ?? 0]
			}
		});
	}, [data]);
	return (
		<StyledModal size="lg" isOpen={Boolean(data)}>
			<Form onSubmit={handleSubmit((d) => onSubmit(d))}>
				<ModalHeader toggle={onClose}>
					Sửa đổi
				</ModalHeader>
				<ModalBody>
					<StyledCard>
						<CardHeader onClick={() => setAccordionInfomation(!accordionInfomation)}>
							<span className={classnames('title', { 'title__active': accordionInfomation })}>Thông tin cá nhân</span>
						</CardHeader>
						<CardBody className={classnames({ 'disabled': !accordionInfomation })}>
							<Row>
								<Col xs={4}>
									<FormGroup>
										<Label className={classnames({ 'error': !!errors.maNV })}>Mã nhân viên</Label>
										<Input
											placeholder="Nhập mã nhân viên"
											className={classnames('form-control', { 'is-invalid': !!errors.maNV })}
											defaultValue={watch('maNV') || ''}
											onBlur={({ target: { value } }) => {
												setValue('maNV', value);
												trigger('maNV');
											}}
										/>
										{(errors?.maNV ?? false) && <FormFeedback>{errors?.maNV?.message ?? ''}</FormFeedback>}
									</FormGroup>
								</Col>
								<Col xs={8}>
									<FormGroup>
										<Label className={classnames({ 'error': !!errors.tenNV })}>Họ và tên</Label>
										<Input
											placeholder="Nhập tên nhân viên"
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
										<Label className={classnames({ 'error': !!errors.ngaySinh })}>Ngày sinh</Label>
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
										<Label className={classnames({ 'error': !!errors.gioiTinh })}>Giới tính</Label>
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
										<Label className={classnames({ 'error': !!errors.quocTich })}>Quốc tịch</Label>
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
										<Label className={classnames({ 'error': !!errors.canCuocCongDan })}>Căn cước công dân</Label>
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
										<Label className={classnames({ 'error': !!errors.tinhTrangHonNhan })}>Tình trạng hôn nhân</Label>
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
										<Label className={classnames({ 'error': !!errors.soNguoiPhuThuoc })}>Số người phụ thuộc</Label>
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
								<Col xs={6}>
									<FormGroup>
										<Label className={classnames({ 'error': !!errors.email })}>Email</Label>
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
										<Label className={classnames({ 'error': !!errors.soDienThoai })}>Số điện thoại</Label>
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
										<Label className={classnames({ 'error': !!errors.diaChi })}>Địa chỉ</Label>
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
				</ModalBody>
				<ModalFooter>
					<Button type="submit" color="success">Xác nhận</Button>
				</ModalFooter>
			</Form>
		</StyledModal>
	);
}

export default UpdateModal;
