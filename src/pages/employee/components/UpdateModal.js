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
import DatePicker from 'react-datepicker';
import certificateApi from 'api/certificateApi';
import departmentApi from 'api/departmentApi';
import positionApi from 'api/positionApi';
import contractTypeApi from 'api/contractTypeApi';
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
	const getDepartments = useCallback(async (p) => {
		const { success, data } = await departmentApi.get({ tenPB: p });
		if (success) {
			return data.slice(0, 10).map((o) => ({ value: o.id, label: o.tenPhongBan }));
		}
	}, [departmentApi]);
	const getPositions = useCallback(async (p) => {
		const { success, data } = await positionApi.getAll({ q: p , isPaged: false });
		if (success) {
			return data.map((o) => ({ value: o.id, label: o.tenChucVu }));
		}
	}, [positionApi]);

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
		register('id');
		register('maNV', { required: 'Bắt buộc phải nhập mã nhân viên' });
		register('tenNV', { required: 'Bắt buộc phải nhập tên nhân viên' });
		register('ngaySinh', { required: 'Bắt buộc phải nhập ngày sinh' });
		register('gioiTinh', { required: 'Bắt buộc phải chọn giới tính' });
		register('quocTich', { required: 'Bắt buộc phải nhập quốc tịch' });
		register('canCuocCongDan', { required: 'Bắt buộc phải nhập căn cước công dân' });
		register('idBangCap', { required: 'Bắt buộc phải chọn bằng cấp' });
		register('tinhTrangHonNhan', { required: 'Bắt buộc phải chọn tình trạng hôn nhân' });
		register('soNguoiPhuThuoc', { required: 'Bắt buộc phải nhập số người phụ thuộc' });
		register('email', { required: 'Bắt buộc phải nhập email' });
		register('soDienThoai', { required: 'Bắt buộc phải nhập số điện thoại' });
		register('diaChi', { required: 'Bắt buộc phải nhập địa chỉ' });
		register('dongBH');
		register('ngayDongBH');
		register('kyHanDongBH');
		register('idDonVi', { required: 'Bắt buộc phải chọn phòng ban' });
		register('idChucVu', { required: 'Bắt buộc phải chọn chức vụ' });
		register('idChiNhanh', { required: 'Bắt buộc phải chọn chi nhánh' });
		register('bonusType', { required: 'Chưa chọn chế độ chuyên cần' });
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
								<Col xs={12}>
									<FormGroup>
										<Label className={classnames({ 'error': !!errors.idBangCap })}>Bằng cấp</Label>
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
											defaultValue={watch('idBangCap') || undefined}
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
					<StyledCard>
						<CardHeader onClick={() => setAccordionPosition(!accordionPosition)}>
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
											defaultValue={watch('idDonVi') || 0}
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
											defaultValue={watch('idChucVu') || 0}
											onChange={(value) => {
												setValue('idChucVu', value);
												trigger('idChucVu');
											}}
										/>
										{(errors?.idChucVu ?? false) && <FormFeedback>{errors?.idChucVu?.message ?? ''}</FormFeedback>}
									</FormGroup>
								</Col>
								{/* <Col xs={6}>
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
											defaultValue={watch('idChiNhanh') || 0}
											onChange={(value) => {
												setValue('idChiNhanh', value);
												trigger('idChiNhanh');
											}}
										/>
										{(errors?.idChiNhanh ?? false) && <FormFeedback>{errors?.idChiNhanh?.message ?? ''}</FormFeedback>}
									</FormGroup>
								</Col> */}
							</Row>
						</CardBody>
					</StyledCard>
					<StyledCard>
						<CardHeader onClick={() => setAccordionDiligence(!accordionDiligence)}>
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
											defaultValue={watch('bonusType') || 0}
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

export default UpdateModal;
