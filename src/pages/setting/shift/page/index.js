import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import dayJS from 'dayjs';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import {
	Container,
	Table,
	Row,
	Col,
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

// Component
import toastr from 'toastr';
import Toolbox from 'components/Toolbox';
import DatePicker from 'react-datepicker';
import LoadingIndicator from 'components/LoadingIndicator';
import Pagination from 'components/Pagination';
import CustomToolTip from 'components/CustomToolTip';

// Hook
import useQueryString from 'hooks/useQueryString';
import usePushQueryString from 'hooks/usePushQueryString';

// CSS
import 'toastr/build/toastr.min.css';

// i18n
import { withNamespaces } from 'react-i18next';

// API
import shiftApi from 'api/shiftApi';
import shiftDetailApi from 'api/shiftDetailApi';
import Select from 'react-select';
import DetailModal from '../components/DetailModal';

const timeIndex = {
	0: 'Công làm việc',
	1: 'Nghỉ giữa ca',
	2: 'Nghỉ ngắn',
};
const salaryIndex = {
	'0.0': '0.0',
	'1.0': '1.0',
	1.3: '1.3',
	1.5: '1.5',
	'2.0': '2.0',
};
const TableBody = (props) => {
	const { data, handleCheckBox, handleEdit, handleDelete, handleDetail } = props;
	const formatTime = (time) => {
		const current = new Date(); const
parse = time.split(':');
		return new Date(current.getFullYear(), current.getMonth() + 1, current.getDate(), parse[0], parse[1], parse[2]);
	};
	return (
  <tbody>
    {(!data || data.length < 1)
				? <tr><td colSpan={5} className="text-center">{props.t('No information')}</td></tr>
				: data.map((item, idx) => {
					const { id, code, totalTime, offTime, name, timeIn, timeOut, isChecked } = item;
					return (
  <tr className={classnames({ 'bg-green': isChecked })} key={`shift_${idx}`}>
    <td>
      <div className="custom-control custom-checkbox">
        <Input type="checkbox" className="custom-control-input" id={`checkbox_${id}`} checked={isChecked} onChange={(event) => handleCheckBox(event)} />
        <Label className="custom-control-label" htmlFor={`checkbox_${id}`}>&nbsp;</Label>
      </div>
    </td>
    <td className="text-left">
      {code}
    </td>
    <td className="text-left">
      {name}
    </td>
    <td className="text-center">
      {timeIn.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </td>
    <td className="text-center">
      {timeOut.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </td>
    <td className="text-center">
      {totalTime.toFixed(2)}
    </td>
    {/* <td className="text-center">
								{(((timeOut).getTime() - (timeIn).getTime() < 0) ? (((timeOut).getTime() - (formatTime("00:00:00")).getTime()) + (formatTime("24:00:00").getTime() - (timeIn).getTime())) / 1000 / 60 / 60 : (((timeOut).getTime()) - ((timeIn).getTime())) / 1000 / 60 / 60).toFixed(1)}
							</td> */}
    <td className="text-center">
      <span id={`detail_${idx}`} className="mr-2" onClick={() => handleDetail(id)}><i className="bx bx-xs bx-detail" /></span>
      <CustomToolTip id={`detail_${idx}`} message={props.t('Detail')} />

      <span id={`edit_${idx}`} className="mr-2" onClick={(event) => handleEdit(event)}><i className="bx bx-xs bx-pencil" /></span>
      <CustomToolTip id={`edit_${idx}`} message={props.t('Edit')} />

      <span id={`delete_${idx}`} onClick={(event) => handleDelete(event)}><i className="bx bx-xs bx-trash-alt" /></span>
      <CustomToolTip id={`delete_${idx}`} message={props.t('Delete')} />
    </td>
  </tr>
					);
				})
			}
  </tbody>
	);
};

const SettingShift = (props) => {
	// Hook
	const pushQueryString = usePushQueryString();

	// Loading
	const [loading, setLoading] = useState(false);

	const [activeTab, setActiveTab] = useState(1);
	// Form
	const {
		errors,
		watch,
		trigger,
		control,
		register,
		setValue,
		handleSubmit,
	} = useForm();

	// Toolbox
	const [toolBox, setToolBox] = useState({
		search: {
			isShow: false,
			value: '',
			handle: null,
		},
		datePicker: {
			isShow: false,
			value: null,
			handle: null,
		},
		groupBy: {
			isShow: false,
			value: '',
			option: [],
			handle: null,
		},
		attendance: {
			isShow: false,
			data: null,
			handle: null,
		},
		import: {
			isShow: false,
			handle: null,
		},
		export: {
			isShow: false,
			handle: null,
		},
		add: {
			isShow: false,
			handle: null,
		},
		delete: {
			isShow: false,
			handle: null,
		},
	});
	// filter
	const [filters, setFilters] = useState({
		page_size: 10,
		page_number: 1,
		keyword: '',
	});

	// Modal
	const [modalCreate, setModalCreate] = useState(false);
	const [modalAdd, setModalAdd] = useState({
		employeeID: '',
		page: 1,
		add: false,
		isShow: false,
	});
	const [modalEdit, setModalEdit] = useState({
		isShow: false,
		shift: {
			id: -1,
			name: '',
			code: '',
			color: '',
			totalTime: '',
			timeIn: new Date(),
			timeOut: new Date(),
		},
	});
	const [modalDelete, setModalDelete] = useState({
		isShow: false,
		id: null,
	});
	// detail
	const [modalDetail, setModalDetail] = useState(undefined);
	// Filter
	const { page, search } = useQueryString();

	// Pagination
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		totalRows: 1,
	});

	// Data
	const [data, setData] = useState([]);

	const toggleTab = (tab) => {
		if (modalAdd.page !== tab) {
			if (tab >= 1 && tab <= 2) {
				setModalAdd({ ...modalAdd, page: tab });
			}
		}
	};
	// Handle
	const handleCheckBox = (event) => {
		let dataFilter = []; const nextToolBox = toolBox; let flag = false; let
{ id } = event.target;
		if (id === 'checkbox_all') {
			if (event.target.checked) { flag = true; }

			dataFilter = data.map((item) => ({ ...item, isChecked: flag }));
		} else {
			if (event.target.checked) { flag = true; }

			id = id.substr(id.indexOf('_') + 1);
			dataFilter = data.map((item) => {
				if (item.id === parseInt(id)) { return { ...item, isChecked: flag }; }

				return item;
			});
		}

		if (!flag) {
			for (let i = 0; i < dataFilter.length; i++) {
				if (dataFilter[i].isChecked) {
					flag = true;
					break;
				}
			}
		}
		if (flag) {
			nextToolBox.search = { ...nextToolBox.search, isShow: false };
			nextToolBox.add = { ...nextToolBox.add, isShow: false };
			nextToolBox.delete = { ...nextToolBox.delete, isShow: true };
		} else {
			nextToolBox.search = { ...nextToolBox.search, isShow: true };
			nextToolBox.add = { ...nextToolBox.add, isShow: true };
			nextToolBox.delete = { ...nextToolBox.delete, isShow: false };
		}

		setData(dataFilter); setToolBox(nextToolBox);
	};

	const handlePageChange = (newPage) => {
		pushQueryString({ page: newPage });
	};

	const handleFilter = (filter) => {
		if (!filter) { return false; }

		const query = {};
		if (filter.keyword && filter.keyword !== '') { query.search = filter.keyword; }

		pushQueryString(query);
	};

	const handleEdit = (event) => {
		let { id } = event.target.parentElement; id = id.substr(id.indexOf('_') + 1);
		if (isNaN(parseInt(id)) || data[id] === undefined) { return false; }
		setModalEdit({ ...modalEdit, isShow: true, shift: data[id] });
	};

	const handleDelete = (event) => {
		if (event === undefined) { setModalDelete({ isShow: true, id: 'all' }); } else {
			let { id } = event.target.parentElement; id = id.substr(id.indexOf('_') + 1);
			if (isNaN(parseInt(id))) { return false; }

			setModalDelete({ isShow: true, id });
		}
	};
	// Function
	const init = () => {
		const nextToolBox = toolBox;
		nextToolBox.search = {
			isShow: true,
			value: '',
			handle: handleFilter,
		};

		nextToolBox.add = {
			isShow: true,
			handle: () => { setModalAdd({ ...modalAdd, isShow: true }); },
		};

		nextToolBox.delete = {
			isShow: false,
			handle: handleDelete,
		};

		setToolBox(nextToolBox);
	};

	const notify = (type, message) => {
		toastr.options = {
			positionClass: 'toast-bottom-right',
			timeOut: 2000,
			extendedTimeOut: 3000,
			closeButton: true,
			preventDuplicates: true,
		};

		if (type === 'success') { toastr.success(message, props.t('Success')); } else if (type === 'info') { toastr.info(message); } else if (type === 'warning') { toastr.warning(message); } else if (type === 'danger') { toastr.error(message, props.t('Failed')); } else { toastr.secondary(message); }
	};

	const reload = (type = 'add') => {
		let page = Math.ceil(pagination.totalRows / pagination.limit);
		if (data.length >= pagination.limit) {
			if (type === 'add') page += 1;
			else if (type === 'delete') page -= 1;
		}

		// Modal
		setModalAdd({ ...modalAdd, isShow: false });
		setModalEdit({ isShow: false, shift: { id: -1, code: '', name: '', allowance: 0 } });
		setModalDelete({ isShow: false, id: -1 });

		// Filter
		setFilters((prevState) => ({ ...prevState, page_number: page, keyword: '' }));
	};
	const [inputFields, setInputFields] = useState([
		{ id: uuidv4(), heSo: 0, tgBatDau: '', tgKetThuc: '', loaiHeSo: '' },
	]);
	const handleChangeInput = (id, payload, type) => {
		const newInputFields = inputFields.map((item) => {
			if (id === item.id) {
				item[type] = payload;
			}
			return item;
		});
		setInputFields(newInputFields);
	};

	const handleAddFields = () => {
		setInputFields([...inputFields, { id: uuidv4(), heSo: 0, tgBatDau: '', tgKetThuc: '' }]);
	};

	const handleRemoveFields = (id) => {
		const values = [...inputFields];
		values.splice(values.findIndex((value) => value.id === id), 1);
		setInputFields(values);
	};
	const addShift = async (payload) => {
		// Function
		const formatTime = (time) =>
			time.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).split(' ')[0];
		// add shift
		const params = {
			tenCa: payload.name,
			maCa: payload.code,
			mauCa: payload.shiftColor,
			gioVaoCa: formatTime(payload.timeIn),
			gioRaCa: formatTime(payload.timeOut),
		};
		let shiftId = -1;
		await shiftApi
			.post(params)
			.then((res) => {
				shiftId = res.data;
			})
			.catch((error) => notify('danger', error));
		// add shift detail
		if (shiftId !== -1 && inputFields.length > 0) {
			const requestShiftDetail = [];
			inputFields.forEach((item) => {
				if (item.tgBatDau && item.tgKetThuc) {
					const tmp = {
						heSo: parseFloat(item.heSo),
						loaiHeSo: parseFloat(item.loaiHeSo),
						tgBatDau: formatTime(item.tgBatDau),
						tgKetThuc: formatTime(item.tgKetThuc),
						caLamViecId: shiftId,
					};
					requestShiftDetail.push(shiftDetailApi
						.post(tmp)
						.catch((error) => notify('danger', error)));
				}
			});
			await Promise
				.all(requestShiftDetail)
				.then(() => { notify('success', props.t('Added.')); reload('add'); })
				.catch((error) => { notify('danger', error); });
		}
	};

	const editShift = async (payload) => {
		// Function
		const formatTime = (time) =>
			time.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).split(' ')[0];

		if (payload.name !== modalEdit.shift.name || formatTime(payload.timeIn) !== modalEdit.shift.timeIn || formatTime(payload.timeOut) !== modalEdit.shift.timeOut) {
			/* Request */
			const params = {
				id: modalEdit.shift.id,
				tenCa: payload.name,
				maCa: payload.code,
				mauCa: payload.shiftColor,
				gioVaoCa: formatTime(payload.timeIn),
				gioRaCa: formatTime(payload.timeOut),
			};

			await shiftApi
				.put(params.id, params)
				.then(() => { notify('success', props.t('Updated.')); reload('edit'); })
				.catch((error) => notify('danger', error));
		}
	};

	const deleteShift = async (id) => {
		if (id === 'all') {
			const requests = [];
			data.forEach((item) => {
				if (item.isChecked) {
					requests.push(shiftApi
						.delete(item.id)
						.catch(() => { notify('danger', props.t('Can\'t delete shift #') + item.code); }));
				}
			});

			await Promise
				.all(requests)
				.then(() => { notify('success', props.t('Deleted.')); reload('delete'); })
				.catch((error) => { notify('danger', error); });
		} else if (data[id] !== undefined) {
			await shiftApi
				.delete(data[id].id)
				.then(() => { notify('success', props.t('Deleted.')); reload(); })
				.catch((error) => notify('danger', error));
		} else { notify('danger', props.t('Shift ID not found')); }
	};

	const fetchShift = async () => {
		const formatTime = (time) => {
			const current = new Date(); const
parse = time.split(':');
			return new Date(current.getFullYear(), current.getMonth() + 1, current.getDate(), parse[0], parse[1], parse[2]);
		};

		setLoading(true);
		const params = { page_size: pagination.limit, page_number: 1 };
		if (page !== undefined) { params.page_number = page; }
		if (search !== undefined) { params.tuKhoa = search; }

		try {
			const response = await shiftApi.get(params);
			const dataFetch = response.data.map((item) => ({
					id: item.id,
					code: item.maCa,
					name: item.tenCa,
					color: item.mauCa,
					totalTime: item.soGioLamViec,
					offTime: item.soGioNghi,
					timeIn: formatTime(item.gioVaoCa),
					timeOut: formatTime(item.gioRaCa),
					isChecked: false,
				}));

			setPagination({
				page: response.meta.page_number,
				limit: response.meta.page_size,
				totalRows: response.meta.total,
			});

			setData(dataFetch); setLoading(false);
		} catch (error) {
			setLoading(false); notify('danger', error);
		}
	};

	useEffect(() => {
		init();
		fetchShift();
	}, [filters]);

	useEffect(() => {
		fetchShift();
	}, [page, search]);
	return (
  <>
    <div className="page-content">
      <Container fluid>
        {loading ? <LoadingIndicator /> :
        <>
          <Row>
            <Col>
              <Row>
                <Col sm={6} md={4} xl={3}>
                  <Modal size="lg" isOpen={modalAdd.isShow}>
                    <ModalHeader toggle={() => setModalAdd({ ...modalAdd, isShow: false })}>
                  <span className="font-weight-bold">{props.t('Add new shift')}</span>
                </ModalHeader>
                    <ModalBody>
                  <Form onSubmit={handleSubmit((d) => addShift(d))}>
                  <div className="twitter-bs-wizard">
                  <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified" style={{ borderRadius: '0.4rem' }}>
                    <NavItem>
                    <NavLink className={classnames({ active: modalAdd.page === 1 })} style={{ fontWeight: '700', color: '#495057!important' }} onClick={() => { setModalAdd({ ...modalAdd, page: 1 }); }}>
                    <span className="step-number mr-2">01</span>
                    Ca làm việc
																	</NavLink>
                  </NavItem>
                    <NavItem>
                    <NavLink className={classnames({ active: modalAdd.page === 2 })} style={{ fontWeight: '700', color: '#495057!important' }} onClick={() => { setModalAdd({ ...modalAdd, page: 2 }); }}>
                    <span className="step-number mr-2">02</span>
                    Chi tiết ca làm việc
																	</NavLink>
                  </NavItem>
                  </ul>
                  <TabContent activeTab={modalAdd.page} className="twitter-bs-wizard-tab-content">
                    <TabPane tabId={1}>
                    <Row>
                    <Col>
                    <FormGroup>
                    <Label for="name">{props.t('Mã ca làm việc')}</Label>
                    <Input
                    name="code"
                    className={errors.name ? 'is-invalid' : ''}
                    placeholder={props.t('Nhập mã ca làm việc')}
                    innerRef={
																						register({
																							required: props.t('Mã ca làm việc chưa nhập'),
																						})
																					}
                  />
                    <ErrorMessage name="name" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                  </FormGroup>
                  </Col>
                    <Col>
                    <FormGroup>
                    <Label for="name">{props.t('Shift name')}</Label>
                    <Input
                    name="name"
                    className={errors.name ? 'is-invalid' : ''}
                    placeholder={props.t('Enter shift name')}
                    innerRef={
																						register({
																							required: props.t('Shift name not entered'),
																						})
																					}
                  />
                    <ErrorMessage name="name" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                  </FormGroup>
                  </Col>
                    <Col>
                    <FormGroup>
                    <Label for="shiftColor">{props.t('Màu ca')}</Label>
                    <Input
                    type="color"
                    name="shiftColor"
                    className={errors.name ? 'is-invalid' : ''}
                    placeholder={props.t('Chọn màu ca')}
                    innerRef={
																						register({
																							required: props.t('Chưa chọn màu ca'),
																						})
																					}
                  />
                    <ErrorMessage name="shiftColor" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                  </FormGroup>
                  </Col>
                  </Row>
                    <Row className="mb-3">
                    <Col xs={6}>
                    <Label for="timeIn">{props.t('Time in')}</Label>
                    <Controller
                    name="timeIn"
                    control={control}
                    valueName="selected"
                    defaultValue={new Date()}
                    rules={{ required: props.t('Time in not entered') }}
                    render={({ onChange, onBlur, value, name }) =>
                    <DatePicker
                    style={{ width: '50px' }}
                    name={name}
                    className={errors.timeIn ? 'form-control is-invalid' : 'form-control'}
                    showTimeSelect
                    timeFormat="HH:mm"
                    showTimeSelectOnly
                    dateFormat="HH:mm"
                    timeIntervals={30}
                    timeCaption={props.t('Time')}
                    autocomplete="off"
                    selected={value}
                    onChange={(time) => onChange(time)}
                  />
																				}
                  />
                    <ErrorMessage name="timeIn" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                  </Col>
                    <Col xs={6}>
                    <Label for="timeOut">{props.t('Time out')}</Label>
                    <Controller
                    name="timeOut"
                    control={control}
                    valueName="selected"
                    defaultValue={new Date()}
                    rules={{
																					required: props.t('Time out not entered'),
																					// validate: payload => {
																					// 	if (dayJS(watch('timeIn')).unix() > dayJS(payload).unix())
																					// 		return props.t('Time out is invalid');;

																					// 	return true;
																					// }
																				}}
                    render={({ onChange, onBlur, value, name }) =>
                    <DatePicker
                    name={name}
                    className={errors.timeOut ? 'form-control is-invalid' : 'form-control'}
                    showTimeSelect
                    timeFormat="HH:mm"
                    showTimeSelectOnly
                    dateFormat="HH:mm"
                    timeIntervals={30}
                    timeCaption={props.t('Time')}
                    autocomplete="off"
                    selected={value}
                    onChange={(time) => onChange(time)}
                  />
																				}
                  />
                    <ErrorMessage name="timeOut" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                  </Col>
                  </Row>
                  </TabPane>
                    <TabPane tabId={2}>
                    {inputFields.map((inputField) => (
                    <Row key={inputField.id} className="d-flex justify-content-center ml-4">
                    <Col xs={2}>
                    <Label for="DetailTimeIn">{props.t('Giờ bắt đầu')}</Label>
                    <Controller
                    name={`tgBatDau_${inputField.id}`}
                    control={control}
                    valueName="selected"
                    defaultValue={new Date()}
                    rules={{
																						required: props.t('Time in not entered'),
																						validate: (payload) => {
																							// if (dayJS(watch('timeIn')).unix() > dayJS(payload).unix() || dayJS(watch('timeOut')).unix() < dayJS(payload).unix())
																							// 	return props.t('Time in is invalid');
																							// else {
																							// 	handleChangeInput(inputField.id, payload, 'tgBatDau');
																							// 	return true;
																							// }
																							handleChangeInput(inputField.id, payload, 'tgBatDau');
																						},
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
                    timeCaption={props.t('Time')}
                    autocomplete="off"
                    selected={value}
                    onChange={(time) => onChange(time)}
                  />
																					}
                  />
                    <ErrorMessage name={`tgBatDau_${inputField.id}`} errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                  </Col>
                    <Col xs={2}>
                    <Label for="DetailTimeOut">{props.t('Giờ kết thúc')}</Label>
                    <Controller
                    name={`tgKetThuc_${inputField.id}`}
                    control={control}
                    valueName="selected"
                    defaultValue={new Date()}
                    rules={{
																						required: props.t('Time out not entered'),
																						validate: (payload) => {
																							// if (dayJS(watch(`tgBatDau_${inputField.id}`)).unix() > dayJS(payload).unix())
																							// 	return props.t('Time out is invalid');
																							// else {
																							// 	handleChangeInput(inputField.id, payload, 'tgKetThuc');
																							// 	return true;
																							// }
																							handleChangeInput(inputField.id, payload, 'tgKetThuc');
																						},
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
                    timeCaption={props.t('Time')}
                    autocomplete="off"
                    selected={value}
                    onChange={(time) => onChange(time)}
                  />
																					}
                  />
                    <ErrorMessage name={`tgKetThuc_${inputField.id}`} errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                  </Col>
                    <Col xs={3}>
                    <FormGroup>
                    <Label for="heSo">{props.t('Hệ số lương')}</Label>
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
                    <ErrorMessage name={`heSo_${inputField.id}`} errors={errors} render={({ message }) => <FormFeedback>message</FormFeedback>} />
                  </FormGroup>
                  </Col>
                    <Col xs={3}>
                    <FormGroup>
                    <Label className={classnames({ error: !!errors.loaiHeSo })}>Loại công</Label>
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
                    <ErrorMessage name={`loaiHeSo_${inputField.id}`} errors={errors} render={({ message }) => <FormFeedback>message</FormFeedback>} />
                  </FormGroup>
                  </Col>

                    <Col xs={1}>
                    <div className="d-flex" style={{ marginTop: '30px' }}>
                    <Button
                    style={{ verticalAlign: 'middle', marginLeft: '10px', padding: '4px 6px' }} color="danger"
                    disabled={inputFields.length === 0}
                    onClick={() => handleRemoveFields(inputField.id)}
                  >
                    <i className="bx bx-x" />
                  </Button>
                  </div>
                  </Col>
                  </Row>
																	))}
                    <Row className="mt-1 ml-4 mb-2">
                    <Button
                    style={{ marginLeft: '40px' }}
                    color="primary"
                    onClick={handleAddFields}
                  >
                    <i className="bx bx-plus" />
                  </Button>
                  </Row>
                  </TabPane>
                  </TabContent>
                  <div className="pager wizard twitter-bs-wizard-pager-link">
                    <span style={{ display: modalAdd.page === 1 ? 'none' : 'block' }} className={(modalAdd.page === 1) ? 'btn btn-info waves-effect waves-light float-left disabled' : 'btn btn-info waves-effect waves-light float-left'} size="md" onClick={() => toggleTab(1)}>{props.t('Previous')}</span>
                    <span style={{ display: modalAdd.page === 2 ? 'none' : 'block' }} className={(modalAdd.page === 2) ? 'btn btn-info waves-effect waves-light float-right disabled' : 'btn btn-info waves-effect waves-light float-right'} size="md" onClick={() => { toggleTab(2); }}>{props.t('Next')}</span>
                    {modalAdd.page !== 2 ? null : <button className="btn btn-success waves-effect waves-light float-right mr-3" type="submit">{props.t('Add')}</button>}
                  </div>
                </div>
                </Form>
                </ModalBody>
                  </Modal>
                  <Modal size="lg" isOpen={modalEdit.isShow}>
                    <ModalHeader toggle={() => setModalEdit({ isShow: false, shift: { id: -1, code: '', name: '', allowance: 0 } })}>
                  <span className="font-weight-bold">{props.t('Cập nhật ca làm việc')}</span>
                </ModalHeader>
                    <ModalBody>
                  <Form onSubmit={handleSubmit(editShift)}>
                  <Row>
                  <Col>
                    <FormGroup>
                    <Label for="name">{props.t('Mã ca làm việc')}</Label>
                    <Input
                    name="code"
                    className={errors.name ? 'is-invalid' : ''}
                    placeholder={props.t('Nhập mã ca làm việc')}
                    defaultValue={modalEdit.shift.code}
                    innerRef={
																			register({
																				required: props.t('Mã ca làm việc chưa nhập'),
																			})
																		}
                  />
                    <ErrorMessage name="name" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                  </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                    <Label for="name">{props.t('Shift name')}</Label>
                    <Input
                    name="name"
                    className={errors.name ? 'is-invalid' : ''}
                    placeholder={props.t('Enter shift name')}
                    defaultValue={modalEdit.shift.name}
                    innerRef={
																			register({
																				required: props.t('Shift name not entered'),
																			})
																		}
                  />
                    <ErrorMessage name="name" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                  </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                    <Label for="shiftColor">{props.t('Màu ca')}</Label>
                    <Input
                    type="color"
                    name="shiftColor"
                    className={errors.name ? 'is-invalid' : ''}
                    placeholder={props.t('Chọn màu ca')}
                    defaultValue={modalEdit.shift.color || '#c8e5ff'}
                    innerRef={
																			register({
																				required: props.t('Chưa chọn màu ca'),
																			})
																		}
                  />
                    <ErrorMessage name="shiftColor" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                  </FormGroup>
                  </Col>
                </Row>
                  <Row className="mb-3">
                  <Col xs={6}>
                    <Label for="timeIn">{props.t('Time in')}</Label>
                    <Controller
                    name="timeIn"
                    control={control}
                    valueName="selected"
                    defaultValue={new Date(modalEdit.shift.timeIn)}
                    render={({ onChange, onBlur, value, name }) =>
                    <DatePicker
                    name={name}
                    className={errors.timeIn ? 'form-control is-invalid' : 'form-control'}
                    showTimeSelect
                    timeFormat="HH:mm"
                    showTimeSelectOnly
                    dateFormat="HH:mm"
                    timeIntervals={30}
                    timeCaption={props.t('Time')}
                    autocomplete="off"
                    selected={value}
                    onChange={(time) => onChange(time)}
                  />
																	}
                  />
                    <ErrorMessage name="timeIn" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                  </Col>
                  <Col xs={6}>
                    <Label for="timeOut">{props.t('Time out')}</Label>
                    <Controller
                    name="timeOut"
                    control={control}
                    valueName="selected"
                    defaultValue={new Date(modalEdit.shift.timeOut)}
                    render={({ onChange, onBlur, value, name }) =>
                    <DatePicker
                    name={name}
                    className={errors.timeOut ? 'form-control is-invalid' : 'form-control'}
                    showTimeSelect
                    timeFormat="HH:mm"
                    showTimeSelectOnly
                    dateFormat="HH:mm"
                    timeIntervals={30}
                    timeCaption={props.t('Time')}
                    autocomplete="off"
                    selected={value}
                    onChange={(time) => onChange(time)}
                  />
																	}
                  />
                    <ErrorMessage name="timeOut" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                  </Col>
                </Row>

                  <Button type="submit" color="success">{props.t('Update')}</Button>
                  <Button type="button" className="ml-2" color="secondary" onClick={() => setModalEdit({ isShow: false, shift: { id: -1, code: '', name: '', allowance: 0 } })}>{props.t('Cancel')}</Button>
                </Form>
                </ModalBody>
                  </Modal>
                  <Modal size="sm" isOpen={modalDelete.isShow} style={{ top: '100px', maxWidth: '350px' }}>
                    <ModalHeader style={{ display: 'block', border: 'none', paddingBottom: '.5rem' }}>
                  <div style={{ margin: '15px auto', textAlign: 'center' }}>
                  <i className="bx bxs-x-circle" style={{ color: '#f15e5e', fontSize: '80px' }} />
                </div>
                  <span>
                  <h5 style={{ display: 'block', maxWidth: '100%', margin: '0px 0px .5em', color: 'rgb(89, 89, 89)', fontSize: '1.875em', fontWeight: '600', textAlign: 'center', textTransform: 'none', overflowWrap: 'break-word' }}>
                  {props.t('Confirm')}
                </h5>
                </span>
                  <p style={{ textAlign: 'center', color: '#999', whiteSpace: 'pre-line', fontSize: '14px' }}>
                  {props.t('Do you really want to delete this record(s)?\nThis process cannot be undone.')}
                </p>
                </ModalHeader>
                    <ModalBody className="justify-content-center" style={{ textAlign: 'center', paddingTop: '0', paddingBottom: '2rem' }}>
                  <Button type="button" color="danger" size="md" onClick={() => { deleteShift(modalDelete.id); }}>
                  {props.t('Accept')}
                </Button>
                  <Button type="button" className="ml-3" color="secondary" size="md" onClick={() => setModalDelete({ isShow: false, id: null })}>
                  {props.t('Cancel')}
                </Button>
                </ModalBody>
                  </Modal>
                </Col>
              </Row>

              <Toolbox t={props.t} option={toolBox} />
              <div className="table-responsive wrapper">
                <Table className="table table-wrapper table-hover table-nowrap mb-0">
                  <thead>
                    <tr>
                  <th style={{ width: '20px' }}>
                  <div className="custom-control custom-checkbox">
                  <Input type="checkbox" className="custom-control-input" id="checkbox_all" onChange={(event) => handleCheckBox(event)} />
                  <Label className="custom-control-label" htmlFor="checkbox_all">&nbsp;</Label>
                </div>
                </th>
                  <th className="text-left">{props.t('Mã ca làm việc')}</th>
                  <th className="text-left">{props.t('Shift name')}</th>
                  <th className="text-center">{props.t('Time in')}</th>
                  <th className="text-center">{props.t('Time out')}</th>
                  <th className="text-center">{props.t('Số giờ làm việc')}</th>
                  <th className="text-center" style={{ width: '50px' }}>{props.t('Action')}</th>
                </tr>
                  </thead>
                  <TableBody t={props.t} data={data} handleCheckBox={handleCheckBox} handleEdit={handleEdit} handleDelete={handleDelete} handleDetail={setModalDetail} />
                </Table>
              </div>
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
            </Col>
          </Row>
        </>
					}
        <DetailModal
          data={modalDetail}
          onRefresh={reload}
          onClose={() => setModalDetail(undefined)}
        />
      </Container>
    </div>

  </>
	);
};

export default withNamespaces()(SettingShift);
