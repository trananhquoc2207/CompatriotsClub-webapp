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
import { notify } from 'utils/helpers';

import contactApi from 'api/contactApi';
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
