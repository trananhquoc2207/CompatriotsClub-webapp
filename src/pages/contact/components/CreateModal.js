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
import { notify } from 'utils/helpers';

import projectApi from 'api/projectApi';
import contactApi from 'api/contactApi';
import shiftApi from 'api/shiftApi';
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
	const { contacts, getContactLoading } = useSelector((s) => s.contact);
	const { data: contactList, totalSizes } = contacts;

	/* const getContacts = async () => {
		const { success, data } = await contactApi.get();
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
			await contactApi.post({
				...d,
				name: d.name?.value ?? '',
				description: d.name?.value ?? '0',
				note: parseInt(d.name?.value) ?? '0',
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
		dispatch(getContacts(payload));
	};
	useEffect(() => {
		handleRefresh();
	}, [type]);
	useEffect(() => {
		register('name', { required: 'Chưa nhập tên đơn vị' });
		register('description', { required: 'Chưa chọn ca làm việc' });
		register('note',
			{ required: 'Chưa chọn loại đơn vị tổ chức' },
		);
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
									defaultValue={watch('name') || ''}
									onBlur={({ target: { value } }) => {
										setValue('name', value);
										trigger('name');
									}}
								/>
								{(errors?.tenDonVi ?? false) && <FormFeedback>{errors?.tenDonVi?.message ?? ''}</FormFeedback>}
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs={12}>
							<FormGroup>
								<Label className={classnames({ error: !!errors.name })}>Tên đơn vị</Label>
								<Input
									placeholder="Nhập miêu tả"
									defaultValue={watch('description') || ''}
									onBlur={({ target: { value } }) => {
										setValue('description', value);
										trigger('description');
									}}
								/>
								{(errors?.tenDonVi ?? false) && <FormFeedback>{errors?.description ?? ''}</FormFeedback>}
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col xs={12}>
							<FormGroup>
								<Label className={classnames({ error: !!errors.tenDonVi })}>Tên đơn vị</Label>
								<Input
									placeholder="Ghi chú"
									defaultValue={watch('note') || ''}
									onBlur={({ target: { value } }) => {
										setValue('note', value);
										trigger('note');
									}}
								/>
								{(errors?.tenDonVi ?? false) && <FormFeedback>{errors?.tenDonVi?.message ?? ''}</FormFeedback>}
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
