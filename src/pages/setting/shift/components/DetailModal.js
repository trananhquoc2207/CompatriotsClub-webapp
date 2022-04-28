import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import dayJS from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import {
	Container,
	Table,
	Row,
	Col,
	Card,
	ModalFooter,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	FormGroup,
	FormFeedback,
	Label,
	Input,
	Button,
	NavLink,
	NavItem,
	TabContent,
	Nav,
	TabPane,
	CardTitle,
} from 'reactstrap';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import certificateApi from 'api/certificateApi';
import departmentApi from 'api/departmentApi';
import positionApi from 'api/positionApi';
import contractTypeApi from 'api/contractTypeApi';
import employeeApi from 'api/employeeApi';
import siteApi from 'api/siteApi';
import { notify } from 'utils/helpers';
import genders from 'assets/mocks/genders.json';
import materialStatuses from 'assets/mocks/material-status.json';
import shiftDetailApi from 'api/shiftDetailApi';
import Loader from 'components/Loader';
import LoadingIndicator from 'components/LoadingIndicator';
//i18n
import { withNamespaces } from 'react-i18next';
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

const timeIndex = {
	"0": "Công làm việc",
	"1": "Nghỉ giữa ca",
	"2": "Nghỉ ngắn",
}
const salaryIndex = {
	"0.0": "0.0",
	"1.0": "1.0",
	"1.3": "1.3",
	"1.5": "1.5",
	"2.0": "2.0",
}
const DetailModal = ({ data, onClose, onRefresh, t }) => {
	const {
		errors,
		reset,
		watch,
		trigger,
		control,
		register,
		setValue,
		handleSubmit,
	} = useForm();
	const [loading, setLoading] = useState(false);
	const [tab, setTab] = useState(1);
	const [indexSalary, setIndexSalary] = useState([]);
	const [valueSalary, setValueSalary] = useState([])
	const [shiftDetail, setShiftDetail] = useState([]);
	const [shiftDetailUpdate, setShiftDetailUpdate] = useState([]);

	const [inputFields, setInputFields] = useState([

	]);
	const handleChangeInput = (id, payload, type) => {
		const newInputFields = inputFields.map(item => {
			if (id === item.id) {
				item[type] = payload;
			}
			return item;
		})
		setInputFields(newInputFields);
	}

	const handleAddFields = () => {
		setInputFields([...inputFields, { id: uuidv4(), heSo: '', tgBatDau: '', tgKetThuc: '', loaiHeSo: '' }])
	}

	const handleRemoveFields = id => {
		const values = [...inputFields];
		values.splice(values.findIndex(value => value.id === id), 1);
		setInputFields(values);
	}
	const onSubmit = async (d) => {
		const formatTime = time =>
			time.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).split(' ')[0];
		setLoading(true);
		//add shift detail
		if (inputFields.length > 0) {
			let requestShiftDetail = [];
			inputFields.forEach(item => {
				if (item.heSo && item.tgBatDau && item.tgKetThuc) {
					let tmp = {
						heSo: parseFloat(item.heSo),
						loaiHeSo: parseFloat(item.loaiHeSo),
						tgBatDau: formatTime(item.tgBatDau),
						tgKetThuc: formatTime(item.tgKetThuc),
						caLamViecId: data,
					}
					requestShiftDetail.push(shiftDetailApi
						.post(tmp)
						.catch(error => notify('danger', error)));
				}
			});
			await Promise
				.all(requestShiftDetail)
				.then(() => { notify('success', 'Đã cập nhật.'); })
				.catch(error => { notify('danger', error) });
		}

		// edit shift detail
		let groupArr = [];
		for (let i = 0; i < shiftDetail.length; i++) {
			groupArr[i] = {
				id: shiftDetail[i].id,
				caLamViecId: shiftDetail[i].caLamViecId,
				heSo: parseFloat(d[`heSo_${i}`]),
				loaiHeSo: parseFloat(d[`loaiHeSo_${i}`]),
				tgBatDau: d[`tgBatDau_${i}`],
				tgKetThuc: d[`tgKetThuc_${i}`],
			}
		}
		const filterData = groupArr.map((item, idx) => {
			if (item.heSo !== shiftDetail[idx].heSo || item.loaiHeSo !== shiftDetail[idx].loaiHeSo || item.tgBatDau !== shiftDetail[idx].tgBatDau || item.tgKetThuc !== shiftDetail[idx].tgKetThuc) {
				return item;
			}
		})
		if (filterData.length > 0) {
			let requestShiftDetail = [];
			filterData.forEach(item => {
				if (item !== undefined) {
					let tmp = {
						heSo: item.heSo,
						loaiHeSo: item.loaiHeSo,
						tgBatDau: formatTime(item.tgBatDau),
						tgKetThuc: formatTime(item.tgKetThuc),
						caLamViecId: item.caLamViecId,
					}
					requestShiftDetail.push(shiftDetailApi
						.put(item.id, tmp)
						.catch(error => notify('danger', 'Đã xảy ra lỗi')));
				}
			});
			await Promise
				.all(requestShiftDetail)
				.then((res) => {
					notify('success', 'Đã cập nhật.');
					setInputFields([{ id: uuidv4(), heSo: '', tgBatDau: '', tgKetThuc: '', loaiHeSo: '' }]);
				})
				.catch(error => { notify('danger', 'Đã xảy ra lỗi') });
		}
		handleRefresh(data);
	};
	const handleRemove = useCallback(async (d) => {
		setLoading(true);
		try {
			await shiftDetailApi.delete(d);
			handleRefresh(data);
		} catch (error) {
			notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
		}
	})
	const handleShiftDetail = (arr, prop) => {
		let data = arr.reduce((acc, cur) => {
			let key = cur[prop];
			if (key !== 0) {
				if (!acc[key]) {
					acc[key] = [];
				}
				acc[key].push(cur);
			}
			return acc;
		}, {})
		setIndexSalary(Object.keys(data));
		setValueSalary(Object.values(data).map(item => {
			return item.reduce((a, b) => a + (b?.tongGio), 0)
		}));
	}
	const getShiftDetail = useCallback(async (p) => {
		const formatTime = time => {
			const current = new Date(), parse = time.split(':');
			return new Date(current.getFullYear(), current.getMonth() + 1, current.getDate(), parse[0], parse[1], parse[2]);
		}
		try {
			const { success, data } = await shiftDetailApi.get(p);
			if (success)
				setShiftDetail(data.map((item, index) => ({
					id: item?.id,
					caLamViecId: item?.caLamViecId,
					heSo: item?.heSo,
					loaiHeSo: item?.loaiHeSo,
					tgBatDau: formatTime(item?.tgBatDau),
					tgKetThuc: formatTime(item?.tgKetThuc),
					tongGio: (formatTime(item?.tgKetThuc).getTime() - formatTime(item?.tgBatDau).getTime() < 0) ? ((formatTime(item?.tgKetThuc).getTime() - formatTime("00:00:00").getTime()) + (formatTime("24:00:00").getTime() - formatTime(item?.tgBatDau).getTime())) / 1000 / 60 / 60 : ((formatTime(item?.tgKetThuc).getTime()) - (formatTime(item?.tgBatDau).getTime())) / 1000 / 60 / 60,
					order: index + 1
				})));
			handleShiftDetail(data.map((item, index) => ({
				id: item?.id,
				caLamViecId: item?.caLamViecId,
				heSo: item?.heSo,
				loaiHeSo: item?.loaiHeSo,
				tgBatDau: formatTime(item?.tgBatDau),
				tgKetThuc: formatTime(item?.tgKetThuc),
				tongGio: (formatTime(item?.tgKetThuc).getTime() - formatTime(item?.tgBatDau).getTime() < 0) ? ((formatTime(item?.tgKetThuc).getTime() - formatTime("00:00:00").getTime()) + (formatTime("24:00:00").getTime() - formatTime(item?.tgBatDau).getTime())) / 1000 / 60 / 60 : ((formatTime(item?.tgKetThuc).getTime()) - (formatTime(item?.tgBatDau).getTime())) / 1000 / 60 / 60,
				order: index + 1
			})), 'heSo');

		} catch (error) {
			notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
		}
	}, [shiftDetailApi]);
	const handleRefresh = async (data) => {
		setLoading(true);
		let payload = { CaLamViecId: data };
		await getShiftDetail(payload);
		setLoading(false);
	}
	useEffect(() => {
		handleRefresh(data);
	}, [data]);

	useEffect(() => {
		reset({
			...data,
		});
	}, [data]);

	return (

		<StyledModal size="lg" isOpen={Boolean(data)}>
			<Form onSubmit={handleSubmit((d) => onSubmit(d))}>
				<ModalHeader toggle={onClose}>
					Chi tiết ca làm việc
				</ModalHeader>
				<ModalBody>
					{loading ? <LoadingIndicator />
						:
						<>
							<div className="twitter-bs-wizard">
								<ul className="twitter-bs-wizard-nav nav nav-pills nav-justified" style={{ borderRadius: '0.4rem' }}>
									<NavItem>
										<NavLink className={classNames({ active: tab === 1 })} style={{ fontWeight: '700', color: '#495057!important' }} onClick={() => { setTab(1) }}>
											<span className="step-number mr-2">01</span>
											Thống kê hệ số lương
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink className={classNames({ active: tab === 2 })} style={{ fontWeight: '700', color: '#495057!important' }} onClick={() => { setTab(2) }}>
											<span className="step-number mr-2">02</span>
											Chi tiết ca làm việc
										</NavLink>
									</NavItem>
								</ul>
								<TabContent activeTab={tab} className="twitter-bs-wizard-tab-content">
									<TabPane tabId={1}>
										<Row>
											<b style={{ margin: '0px 100px', minWidth: '100px' }}>{'Hệ số lương'}</b>
											{indexSalary.map(i => (
												<div style={{ minWidth: '100px' }}>{i}</div>
											))}
										</Row>
										<hr />
										<Row>
											<b style={{ margin: '0px 100px', minWidth: '100px' }}>{'Số giờ'}</b>
											{valueSalary.map(i => (
												<div style={{ minWidth: '100px' }}>{i.toFixed(2)}</div>
											))}
										</Row>
									</TabPane>
									<TabPane tabId={2}>
										{(shiftDetail || []).map((row, index) => (
											<div key={index} >
												<Row className='d-flex justify-content-center ml-4'>
													<Col xs={2}>
														<Label for="tgBatDau">{('Giờ bắt đầu')}</Label>
														<Controller
															name={`tgBatDau_${index}`}
															control={control}
															valueName={'selected'}
															defaultValue={row?.tgBatDau}
															rules={{
																required: ('Giờ bắt đầu chưa nhập'),
																validate: payload => {
																	return true;
																}
															}}
															render={({ onChange, onBlur, value, name }) =>
																<DatePicker
																	name={name}
																	className={errors.tgBatDau ? 'form-control is-invalid' : 'form-control'}
																	showTimeSelect
																	timeFormat="HH:mm"
																	showTimeSelectOnly
																	dateFormat="HH:mm"
																	timeIntervals={30}
																	autocomplete={'off'}
																	selected={value}
																	onChange={time => onChange(time)}
																/>
															}
														/>
														<ErrorMessage name="tgBatDau" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
													</Col>
													<Col xs={2}>
														<Label for="tgKetThuc">{('Giờ kết thúc')}</Label>
														<Controller
															name={`tgKetThuc_${index}`}
															control={control}
															valueName={'selected'}
															defaultValue={row?.tgKetThuc}
															rules={{
																required: ('Giờ kết thúc chưa nhập'),
																// validate: payload => {
																// 	if (dayJS(watch('timeIn')).unix() > dayJS(payload).unix()) {
																// 		return ('Giờ kết thúc không hợp lệ');
																// 	}
																// 	else
																// 		return true;
																// }
															}}
															rules={{ required: ('Giờ bắt đầu chưa nhập') }}
															render={({ onChange, onBlur, value, name }) =>
																<DatePicker
																	name={name}
																	className={errors.tgKetThuc ? 'form-control is-invalid' : 'form-control'}
																	showTimeSelect
																	timeFormat="HH:mm"
																	showTimeSelectOnly
																	dateFormat="HH:mm"
																	timeIntervals={30}
																	timeCaption={('Time')}
																	autocomplete={'off'}
																	selected={value}
																	onChange={time => onChange(time)}
																/>
															}
														/>
														<ErrorMessage name="tgKetThuc" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
													</Col>
													<Col xs={3}>
														<Label for="heSo">{('Hệ số lương')}</Label>
														<Controller
															name={`heSo_${index}`}
															control={control}
															defaultValue={row?.heSo}
															rules={{ required: ('Hệ số lương chưa nhập') }}
															render={({ onChange, onBlur, value, name }) =>
																<Select
																	name={`heSo_${index}`}
																	cacheOptions
																	defaultValue={{ value: row?.heSo, label: row?.heSo.toFixed(1) }}
																	placeholder="Chọn hệ số lương"
																	styles={{
																		control: (base, state) => (
																			errors.heSo
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
																	options={Object.keys(salaryIndex || {}).map((key) => ({
																		value: key,
																		label: salaryIndex[key],
																	}))}
																	onChange={(payload) => {
																		onChange(payload.value);
																	}}
																/>
															}
														/>
														<ErrorMessage name={`heSo_${index}`} errors={errors} render={({ message }) => <FormFeedback>{'message'}</FormFeedback>} />
													</Col>
													<Col xs={3}>
														<Label className={classNames({ error: !!errors.loaiHeSo })}>Loại công</Label>
														<Controller
															name={`loaiHeSo_${index}`}
															control={control}
															defaultValue={row?.loaiHeSo}
															rules={{ required: ('Chưa chọn loại công') }}
															render={({ onChange, onBlur, value, name }) =>
																<Select
																	name={`loaiHeSo_${index}`}
																	cacheOptions
																	defaultValue={{ value: row?.loaiHeSo, label: row?.loaiHeSo === 0 ? 'Công Làm việc' : row?.loaiHeSo === 1 ? 'Nghỉ giữa ca' : 'Nghỉ ngắn' ?? '' }}
																	placeholder="Chọn loại công"
																	styles={{
																		control: (base, state) => (
																			errors.loaiHeSo
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
																	options={Object.keys(timeIndex || {}).map((key) => ({
																		value: key,
																		label: timeIndex[key],
																	}))}
																	onChange={(payload) => {
																		onChange(payload.value);
																	}}
																/>
															}
														/>
														<ErrorMessage name={`loaiHeSo_${index}`} errors={errors} render={({ message }) => <FormFeedback>{'message'}</FormFeedback>} />
													</Col>
													<Col xs={1}>
														<div className='d-flex' style={{ marginTop: '30px' }}>
															<Button style={{ verticalAlign: 'middle', marginLeft: '10px', padding: '4px 6px' }} color="danger"
																onClick={() => handleRemove(row.id)}>
																<i className="bx bx-x"></i>
															</Button>
														</div>
													</Col>
												</Row>
											</div>
										))}

										<hr />
										{inputFields.map(inputField => (
											<Row className='d-flex justify-content-center ml-4'>
												<Col xs={2}>
													<Label for="tgBatDau">{('Giờ bắt đầu')}</Label>
													<Controller
														name={`tgBatDau_${inputField.id}`}
														control={control}
														valueName={'selected'}
														placeholder={'Giờ bắt đầu'}
														defaultValue={new Date()}
														rules={{
															//required: t('Time in not entered'),
															validate: payload => {
																/* 	if (dayJS(watch('timeIn')).unix() > dayJS(payload).unix() || dayJS(watch('timeOut')).unix() < dayJS(payload).unix())
																				return t('Time in is invalid');
																		else {
																				handleChangeInput(inputField.id, payload, 'tgBatDau');
																				return true;
																		} */
																handleChangeInput(inputField.id, payload, 'tgBatDau');
																return true;
															}
														}}
														render={({ onChange, onBlur, value, name }) =>
															<DatePicker
																name={name}
																className={errors.DetailTimeIn ? 'form-control is-invalid' : 'form-control'}
																showTimeSelect
																timeFormat="HH:mm"
																showTimeSelectOnly
																dateFormat="HH:mm"
																timeIntervals={30}
																timeCaption={('Thời gian')}
																autocomplete={'off'}
																selected={value}
																onChange={time => onChange(time)}
															/>
														}
													/>
													<ErrorMessage name={`tgBatDau_${inputField.id}`} errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
												</Col>
												<Col xs={2}>
													<Label for="tgKetThuc">{('Giờ ra')}</Label>
													<Controller
														name={`tgKetThuc_${inputField.id}`}
														control={control}
														valueName={'selected'}
														placeholder={'Giờ kết thúc'}
														defaultValue={new Date()}
														rules={{
															//required: t('Time out not entered'),
															validate: payload => {
																// if (dayJS(watch(`tgBatDau_${inputField.id}`)).unix() > dayJS(payload).unix())
																// 	return t('Time out is invalid');
																// else {
																// 	handleChangeInput(inputField.id, payload, 'tgKetThuc');
																// 	return true;
																// }
																handleChangeInput(inputField.id, payload, 'tgKetThuc');
																return true;
															}
														}}
														render={({ onChange, onBlur, value, name }) =>
															<DatePicker
																name={name}
																className={errors.DetailTimeOut ? 'form-control is-invalid' : 'form-control'}
																showTimeSelect
																timeFormat="HH:mm"
																showTimeSelectOnly
																dateFormat="HH:mm"
																timeIntervals={30}
																timeCaption={('Thời gian')}
																autocomplete={'off'}
																selected={value}
																onChange={time => onChange(time)}
															/>
														}
													/>
													<ErrorMessage name={`tgKetThuc_${inputField.id}`} errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
												</Col>
												<Col xs={3}>
													<FormGroup>
														<Label for="heSo">{('Hệ số lương')}</Label>
														<Select
															name={`heSo_${inputField.id}`}
															cacheOptions
															placeholder="Chọn hệ số lương"
															styles={{
																control: (base, state) => (
																	errors.heSo
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
															options={Object.keys(salaryIndex || {}).map((key) => ({
																value: key,
																label: salaryIndex[key],
															}))}
															onChange={(payload) => {
																handleChangeInput(inputField.id, parseFloat(payload.value), 'heSo');
															}}
														/>
														<ErrorMessage name={`heSo_${inputField.id}`} errors={errors} render={({ message }) => <FormFeedback>{'message'}</FormFeedback>} />
													</FormGroup>
												</Col>
												<Col xs={3}>
													<FormGroup>
														<Label className={classNames({ error: !!errors.loaiHeSo })}>Loại công</Label>
														<Select
															name={`loaiHeSo_${inputField.id}`}
															cacheOptions
															placeholder="Chọn loại công"
															styles={{
																control: (base, state) => (
																	errors.loaiHeSo
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
															options={Object.keys(timeIndex || {}).map((key) => ({
																value: key,
																label: timeIndex[key],
															}))}
															onChange={(payload) => {
																handleChangeInput(inputField.id, parseFloat(payload.value), 'loaiHeSo');

															}}
														/>
														<ErrorMessage name={`loaiHeSo_${inputField.id}`} errors={errors} render={({ message }) => <FormFeedback>{'message'}</FormFeedback>} />
													</FormGroup>
												</Col>
												<Col xs={1}>
													<div className='d-flex' style={{ marginTop: '30px' }}>
														<Button
															style={{ verticalAlign: 'middle', marginLeft: '10px', padding: '4px 6px' }} color="danger"
															disabled={inputFields.length === 0}
															onClick={() => handleRemoveFields(inputField.id)}
														>
															<i className="bx bx-x"></i>
														</Button>
													</div>
												</Col>
											</Row>
										))}
										<Row className='mt-1 ml-4 mb-2' >
											<Button
												style={{ marginLeft: '40px' }}
												color="primary"
												onClick={handleAddFields}
											>
												<i className="bx bx-plus"> </i>
												Thêm ca chi tiết
											</Button>
										</Row>
									</TabPane>
								</TabContent>
							</div>
						</>
					}
				</ModalBody>
				<ModalFooter>
					{tab === 2 ? <Button type="submit" color="success">Lưu thay đổi</Button> : null}
				</ModalFooter>
			</Form>

		</StyledModal>
	);
}

export default withNamespaces()(DetailModal);