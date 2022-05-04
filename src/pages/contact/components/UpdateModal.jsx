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
    Input,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card,
} from 'reactstrap';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import NumberFormat from 'react-number-format';
import { notify } from 'utils/helpers';

import contactApi from 'api/contactApi';
import contactType from 'assets/mocks/contactType.json';
import { useDispatch, useSelector } from 'react-redux';
import { getContacts } from '../actions/contact';

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

const UpdateModal = ({ data, open, onClose, onRefresh }) => {
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
	const { contacts, getContactGroupLoading } = useSelector((s) => s.contact);
	const { data: contactList, totalSizes } = contacts;

	/* const getContacts = async () => {
		const { success, data } = await contactApi.get();
		if (success) {
			return data.slice(0, 10).map((o) => ({ value: o.id, label: o.tenDonVi }));
		}
	}; */

	const onSubmit = async (d) => {
		try {
			await contactApi.put({
				...d,
				id: data.id,
				idDonViCha: d.idDonViCha?.value ?? 0,
				caLamViecId: d.caLamViecId?.value ?? 0,
				loaiDonVi: parseInt(d.loaiDonVi?.value) ?? 0,
				phuCap: parseFloat(d?.phuCap),

			});
			onClose();
			notify('success', 'Đã cập nhật.');
			onRefresh();
		} catch (error) {
			notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
		}
	};
	const handleRefresh = () => {
		const payload = {
			LoaiDonVi: type,
		};
		dispatch(getContacts(payload));
	};
	useEffect(() => {
		handleRefresh();
	}, [type]);
	useEffect(() => {
		register('tenDonVi', { required: 'Chưa nhập tên đơn vị' });
		register('caLamViecId', { required: 'Chưa chọn ca làm việc' });
		register('loaiDonVi', { required: 'Chưa chọn loại đơn vị tổ chức' });
		register('phuCap', { required: 'Chưa nhập phụ cấp' });
		register('idDonViCha', { required: 'Chưa chọn đơn vị trực thuộc' });
	}, [register, setValue]);
	useEffect(() => {
		reset({
			...data,
			loaiDonVi: {
				value: data?.loaiDonVi ?? 0,
				label: contactType[data?.loaiDonVi ?? 0],
			},
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
					Cập nhật
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
									//loadOptions={getShifts}
									loadingMessage={() => 'Đang lấy dữ liệu...'}
									noOptionsMessage={() => 'Không có dữ liệu'}
									defaultValue={watch('caLamViecId') || undefined}
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
					<Row>
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
									value={watch('loaiDonVi') || undefined}
									options={Object.keys(contactType || {}).map((key) => ({
										value: key,
										label: contactType[key],
									}))}
									onChange={(value) => {
										setValue('loaiDonVi', value);
										setType(value.value - 1);
										trigger('loaiDonVi');
									}}
								/>
								{(errors?.loaiDonVi ?? false) && <FormFeedback>{errors?.loaiDonVi?.message ?? ''}</FormFeedback>}
							</FormGroup>
						</Col>
					</Row>
					<Row>
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
									value={watch('idDonViCha') || undefined}
									options={
										contactList?.map((item) => ({
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
									thousandSeparator
									defaultValue={watch('phuCap') || undefined}
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

export default UpdateModal;
