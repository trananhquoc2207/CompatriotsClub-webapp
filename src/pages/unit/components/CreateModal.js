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
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-datepicker';
import employeeApi from 'api/employeeApi';
import siteApi from 'api/siteApi';
import { notify } from 'utils/helpers';

import projectApi from 'api/projectApi';
import departmentApi from 'api/departmentApi';
import unitApi from 'api/unitApi';
import shiftApi from 'api/shiftApi';
import unitType from 'assets/mocks/unitType.json';
import { useDispatch, useSelector } from 'react-redux';
import { getUnitGroup } from '../actions/unit';

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
		getValues,
		handleSubmit,
	} = useForm();

	const [type, setType] = useState(0);
	const dispatch = useDispatch();
	const { unitGroup, getUnitGroupLoading } = useSelector((s) => s.unit);
	const { data: unitList, totalSizes } = unitGroup;

	/* const getUnits = async () => {
		const { success, data } = await unitApi.get();
		if (success) {
			return data.slice(0, 10).map((o) => ({ value: o.id, label: o.tenDonVi }));
		}
	}; */
	const getShifts = useCallback(async (p) => {
		const { success, data } = await shiftApi.get({ Ma: p });
		if (success) {
			return data.slice(0, 10).map((o) => ({ value: o.id, label: `${o.tenCa} (${o.gioVaoCa} - ${o.gioRaCa})` }));
		}
	}, [shiftApi]);
	const onSubmit = async (d) => {
		try {
			await unitApi.post({
				...d,
				idDonViCha: d.idDonViCha?.value ?? 0,
				caLamViecId: d.caLamViecId?.value ?? 0,
				loaiDonVi: parseInt(d.loaiDonVi?.value) ?? 0,
				phuCap: parseFloat(d?.phuCap.replace(/[^\d]/g, '') ?? '0'),
			});
			onClose();
			notify('success', 'Đã thêm.');
			onRefresh();
		} catch (error) {
			notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
		}
	};
	const handleRefresh = () => {
		const payload = {
			LoaiDonVi: type,
		};
		dispatch(getUnitGroup(payload));
	};
	useEffect(() => {
		handleRefresh();
	}, [type]);
	useEffect(() => {
		register('tenDonVi', { required: 'Chưa nhập tên đơn vị' });
		register('caLamViecId', { required: 'Chưa chọn ca làm việc' });
		register('loaiDonVi',
			{ required: 'Chưa chọn loại đơn vị tổ chức' },
		);
		register('idDonViCha');
		register('phuCap');
	}, [register, setValue]);

	return (
		<StyledModal size="md" isOpen={open}>
			<Form onSubmit={handleSubmit((d) => onSubmit(d))}>
				<ModalHeader toggle={onClose}>
					Thêm mới
				</ModalHeader>
				<ModalBody>
					<Row>
						<Col xs={12}>
							<FormGroup>
								<Label className={classnames({ error: !!errors.tenDonVi })}>Tên đơn vị</Label>
								<Input
									placeholder="Nhập tên đơn vị"
									defaultValue={watch('tenDonVi') || ''}
									onBlur={({ target: { value } }) => {
										setValue('tenDonVi', value);
										trigger('tenDonVi');
									}}
								/>
								{(errors?.tenDonVi ?? false) && <FormFeedback>{errors?.tenDonVi?.message ?? ''}</FormFeedback>}
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs={12}>
							<FormGroup>
								<Label className={classnames({ error: !!errors.caLamViecId })}>Ca làm việc</Label>
								<AsyncSelect
									cacheOptions
									defaultOptions
									loadOptions={getShifts}
									loadingMessage={() => 'Đang lấy dữ liệu...'}
									noOptionsMessage={() => 'Không có dữ liệu'}
									placeholder="Chọn ca làm việc"
									styles={{
										control: (base, state) => (
											errors.caLamViecId
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
									onChange={(value) => {
										setValue('caLamViecId', value);
										trigger('caLamViecId');
									}}
								/>
								{(errors?.caLamViecId ?? false) && <FormFeedback>{errors?.caLamViecId?.message ?? ''}</FormFeedback>}
							</FormGroup>
						</Col>
					</Row>
					<Row >
						<Col>
							<FormGroup>
								<Label className={classnames({ error__label: !!errors.loaiDonVi })}>Loại đơn vị</Label>
								<Select
									styles={{
										control: (base, state) => (
											errors.loaiDonVi
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
									options={Object.keys(unitType || {}).map((key) => ({
										value: key,
										label: unitType[key],
									}))}
									onChange={(value) => {
										setValue('loaiDonVi', value);
										setType(value.value);
										trigger('loaiDonVi');
									}}
								/>
								{(errors?.loaiDonVi ?? false) && <FormFeedback>{errors?.loaiDonVi?.message ?? ''}</FormFeedback>}
							</FormGroup>
						</Col>
					</Row>
					<Row className={`${type > 0 ? '' : 'd-none'}`}>
						<Col xs={12}>
							<FormGroup>
								<Label className={classnames({ error__label: !!errors.idDonViCha })}>Đơn vị trực thuộc</Label>
								<Select
									styles={{
										control: (base, state) => (
											errors.idDonViCha
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
									options={
										unitList?.map((item) => ({
											value: item?.id,
											label: item?.tenDonVi,
										}))

									}
									onChange={(value) => {
										setValue('idDonViCha', value);
										trigger('idDonViCha');
									}}
								/>
								{(errors?.idDonViCha ?? false) && <FormFeedback>{errors?.idDonViCha?.message ?? ''}</FormFeedback>}
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<FormGroup>
								<Label className={classnames({ error__label: !!errors.phuCap })}>Phụ cấp</Label>
								<NumberFormat
									suffix=" đ"
									thousandSeparator
									placeholder="Phụ cấp"
									className={classnames('form-control', { 'is-invalid': !!errors?.phuCap })}
									onChange={({ target: { value } }) => {
										setValue('phuCap', value);
										trigger('phuCap');
									}}
								/>
								{(errors?.phuCap ?? false) && <FormFeedback>{errors?.phuCap?.message ?? ''}</FormFeedback>}
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

export default CreateModal;
