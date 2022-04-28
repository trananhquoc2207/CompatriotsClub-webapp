import React, { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import vi from 'date-fns/locale/vi';
import dayJS from 'dayjs';

import {
	Spinner,
	Container, Alert,
	Row, Col,
	Table,
	Modal, ModalHeader, ModalBody, ModalFooter,
	Label, Badge, Input, Button, FormFeedback, FormGroup,
} from 'reactstrap';
import toastr from 'toastr';
import Select from 'react-select';
import Slider from 'react-slick';
import Toolbox from 'components/Toolbox';
import Pagination from 'components/Pagination';
import DatePicker, { registerLocale } from 'react-datepicker';
import LoadingIndicator from 'components/LoadingIndicator';

import useQueryString from 'hooks/useQueryString';
import usePushQueryString from 'hooks/usePushQueryString';
import timeOffApi from 'api/timeOffApi';
import { TOKEN } from 'utils/contants';
import Request from './Request';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Config
registerLocale('vi', vi);

const ButtonLoader = ({ loading, content, onClick, ...otherProps }) => (
  <Button disabled={loading} onClick={(event) => { onClick(event); }} {...otherProps}>
    {loading ? <Spinner size="sm" color="white" /> : content}
  </Button>
);

const TableBody = (props) => {
	const { pagination, data, handleDetail, handleCancel } = props;
	const statusType = { 7: 'success', 8: 'secondary', 9: 'secondary', 10: 'danger' };

	const [detailLoading, setDetailLoading] = useState(false);
	const [acceptLoading, setAcceptLoading] = useState(false);
	const [cancelLoading, setCancelLoading] = useState(false);
	const [rejectLoading, setRejectLoading] = useState(false);

	return (
  <tbody>
    {(!data || data.length < 1)
				? <tr><td colSpan={7} className="text-center">{props.t('No information')}</td></tr>
				: data.map((item, idx) => {
					const { id, beginDate, endDate, type, approvedTime, status } = item;

					return (
  <tr key={`class_${idx}`}>
    <td className="align-middle" style={{ width: '20px' }}>
      {(idx + 1) + (pagination.limit * (pagination.page - 1))}
    </td>
    <td className="align-middle text-left">
      {dayJS(beginDate).format('DD/MM/YYYY')}
    </td>
    <td className="align-middle text-left">
      {dayJS(endDate).format('DD/MM/YYYY')}
    </td>
    <td className="align-middle text-left">
      {`${((dayJS(endDate).unix() - dayJS(beginDate).unix()) / 86400 + 1).toString()} ${props.t('day(s)')}`}
    </td>
    <td className="align-middle text-left">
      {type.name}
    </td>
    <td className="align-middle text-center font-size-16">
      <Badge color={statusType[status.id]} size="md" style={{ width: '80px' }} pill>{status.name}</Badge>
    </td>
    <td className="align-middle text-center">
      {approvedTime ? dayJS(approvedTime).format('HH:mm DD/MM/YYYY') : '-'}
    </td>
    <td className="align-middle text-center">
      <ButtonLoader id={`accept_${idx}`} className="mr-3 align-middle" size="sm" color="primary" style={{ width: '70px' }} loading={detailLoading} content={props.t('Detail')} onClick={(event) => { handleDetail(event.target.id); }} />
      {(status?.id ?? 0) === 8 && (
      <ButtonLoader id={`cancel_${idx}`} className="align-middle" size="sm" color="danger" style={{ width: '70px' }} loading={cancelLoading} content={props.t('Cancel')} onClick={(event) => { handleCancel(event.target.id); }} />
								)}
    </td>
  </tr>
					);
				})
			}
  </tbody>
	);
};

const UserTable = (props) => {
	const { page } = useQueryString();
	const pushQueryString = usePushQueryString();
	const {
		watch,
		register,
		errors,
		control,
		handleSubmit,
	} = useForm({ mode: 'all', shouldFocUserTableror: false });

	const currentTime = new Date();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [type, setType] = useState([]);
	const [currentType, setCurrentType] = useState(null);
	const [modalDetail, setModalDetail] = useState({
		isShow: false,
		data: {},
	});
	const [modalRequest, setModalRequest] = useState(false);
	const [modalCancel, setModalCancel] = useState({
		isShow: false,
		id: null,
	});
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
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		totalRows: 1,
	});

	const handlePageChange = (newPage) => pushQueryString({ page: newPage });

	const handleDetail = (id) => setModalDetail({ isShow: true, data: data[parseInt(id.substr(id.indexOf('_') + 1))] });

	const handleRequest = () => setModalRequest(true);

	const handleCancel = (id) => setModalCancel({ isShow: true, id: data[parseInt(id.substr(id.indexOf('_') + 1))].id });

	const handleSubmitRequest = (payload) => request({ idLoaiNghiPhep: payload.timeOffType.id, ngayBatDau: payload.fromDate.toISOString(), ngayKetThuc: payload.toDate.toISOString(), ghichu: payload.note });

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

	const init = () => {
		const nextToolBox = toolBox;
		nextToolBox.add = {
			isShow: true,
			title: props.t('Send request'),
			handle: handleRequest,
		};

		setToolBox(nextToolBox);
	};

	const reload = type => {
		switch (type) {
			case 'request': {
				setModalRequest(false);
				break;
			}
			case 'cancel': {
				setModalCancel({ isShow: false, id: null });
				break;
			}
			default:
				break;
		}

		window.location.reload();
	};

	const request = async (payload) => {
		try {
			const response = await timeOffApi.post(payload);

			reload('request'); notify('success', props.t('Requested.'));
		} catch (_err) {
			notify('danger', _err);
		}
	};

	const cancel = async (id) => {
		try {
			const params = { idTrangThai: 9 };
			const response = await timeOffApi.delete(id);

			reload('cancel'); notify('success', props.t('Canceled.'));
		} catch (_err) {
			notify('danger', _err);
		}
	};

	const fetch = async () => {
		const params = { page_size: pagination.limit, page_number: pagination.page };

		if (page) { params.page_number = page; }

		try {
			const token = JSON.parse(localStorage.getItem(TOKEN));
			params.idNhanVien = token?.idNhanVien ?? '';
		} catch (error) { }

		try {
			setLoading(true);
			const response = await timeOffApi.get(params);
			if (response.success && response.data) {
				const dataParse = response.data.map((item) => ({
						id: item.id,
						beginDate: item.ngayBatDau,
						endDate: item.ngayKetThuc,
						approvedTime: item.ngayDuyet !== '0001-01-01T00:00:00' ? item.ngayDuyet : undefined,
						dayLeft: item?.ngayNghiConLai ?? '0',
						reason: item?.ghiChu ?? '-',
						sign: item?.chuKy ?? undefined,
						type: {
							id: item.loaiNghiPhep.id,
							name: item.loaiNghiPhep.tenLoaiPhep,
							limit: item.loaiNghiPhep.soNgayNghi,
						},
						status: {
							id: item.trangThai.id,
							name: item.trangThai.tenTrangThai,
						},
						employee: {
							id: item.nhanVien.id,
							code: item.nhanVien.maNhanVien,
							name: item.nhanVien.tenNhanVien,
						},
						isChecked: false,
					}));

				setPagination({
					page: response.meta.page_number,
					limit: response.meta.page_size,
					totalRows: response.meta.total,
				});

				setData(dataParse); setLoading(false);
			}
		} catch (_err) {
			notify('danger', _err); setLoading(false);
		}
	};

	const fetchType = async () => {
		try {
			const response = await timeOffApi.getType();
			if (response.success && response.data) {
				setType(response.data);
			}
		} catch (_err) {
			notify('danger', _err);
		}
	};

	useEffect(() => {
		init();
		fetch();
		fetchType();
	}, [page]);

	return (
  <Container fluid>
    {loading ? <LoadingIndicator />
				:
    <>
      {(type.length > 0)
						?
  <Slider className="mb-3 p-2" infinite={false} dots slidesToShow={4} slidesToScroll={1} swipeToSlide>
    {
								type.map((item, idx) => (
  <div className="px-2 d-flex justify-content-center" key={`slider_${idx}`}>
    <div className="wrapper mb-0">
      <p className="mb-1 font-weight-bold">{item.tenLoaiPhep}</p>
      <span style={{ color: '#74788d' }}>{`${item.soNgayNghi - item.soNgayConlai} ${props.t('day(s)')} / ${item.soNgayNghi} ${props.t('day(s)')}`}</span>
    </div>
  </div>
									))
							}
  </Slider>
						:
						null
					}
      <Toolbox t={props.t} option={toolBox} />
      <Col sm={6} md={4} xl={3}>
        <Modal size="md" isOpen={modalDetail.isShow} style={{ top: '100px', minWidth: '700px' }}>
          <ModalHeader toggle={() => { setModalDetail({ isShow: false, data: {} }); }} />
          <ModalBody>
            <Request data={modalDetail.data} />
          </ModalBody>
          <ModalFooter>
            {(modalDetail.data?.status?.id ?? 0) === 8 && (
            <>
              <Button type="button" color="danger" size="md" onClick={(event) => { cancel(modalDetail?.data?.id ?? ''); setModalDetail({ isShow: false, data: {} }); }}>
                Huỷ
              </Button>
            </>
								)}
            <Button type="button" color="secondary" size="md" onClick={() => setModalDetail({ isShow: false, data: {} })}>
              Đóng
            </Button>
          </ModalFooter>
        </Modal>
        <Modal size="md" isOpen={modalRequest}>
          <ModalHeader toggle={() => setModalRequest(false)}>
            <span className="font-weight-bold">{props.t('New request')}</span>
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(handleSubmitRequest)}>
              <Row>
                <Col>
                  <ErrorMessage
                    name="toDate"
                    errors={errors}
                    render={({ message }) => {
												if (message === 'outOfLimited') {
													return (
  <Alert color="danger">
    <span className="alert-heading font-weight-bold">{props.t('Warning!')}</span>
    <br />
    <span>
      {props.t('You have only ')}
      <span className="font-weight-bold">{currentType ? currentType.soNgayConlai : ((dayJS(watch('toDate')).unix() - dayJS(watch('fromDate')).unix()) / 86400) + 1}</span>
      {props.t(' day(s) left for time off type ')}
      <span className="font-weight-bold">{currentType ? currentType.tenLoaiPhep : ''}</span>
    </span>
  </Alert>
													);
												}

												return '';
											}}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="timeOffType">{props.t('Time off type')}</Label>
                    <Controller
                      as={Select}
                      name="timeOffType"
                      control={control}
                      styles={{
														control: (base, state) => (
															errors.timeOffType
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
                      isClearable
                      options={type}
                      getOptionLabel={(option) => option.tenLoaiPhep}
                      getOptionValue={(option, idx) => option.id}
                      defaultValue=""
                      rules={{
														required: props.t('Time off type not choose'),
														validate: (payload) => {
															setCurrentType(payload);
															return true;
														},
													}}
                    />
                    <ErrorMessage
                      name="timeOffType"
                      errors={errors}
                      render={({ message }) =>
                    (<div style={{ width: '100%', marginTop: '.25rem', fontSize: '80%', color: '#f46a6a' }}>
                      {message}
                     </div>)
												}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="fromDate">{props.t('From date')}</Label>
                    <Controller
                      name="fromDate"
                      control={control}
                      valueName="selected"
                      defaultValue={currentTime}
                      rules={{
														required: props.t('From date not entered'),
													}}
                      render={({ onChange, onBlur, value, name }) =>
  (<DatePicker
    name={name}
    className={errors.fromDate ? 'form-control is-invalid' : 'form-control'}
    locale="vi"
    dateFormat="dd/MM/yyyy"
    autocomplete="off"
    selected={value}
    onChange={(time) => onChange(time)}
  />)
													}
                    />
                    <ErrorMessage name="fromDate" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="toDate">{props.t('To date')}</Label>
                    <Controller
                      name="toDate"
                      control={control}
                      valueName="selected"
                      defaultValue={new Date(currentTime.getTime() + (1000 * 60 * 60 * 24))}
													/* 	rules={{
															required: props.t('To date not entered'),
															validate: payload => {
																const difference = dayJS(payload).unix() - dayJS(watch('fromDate')).unix();
																if (difference < 86400)
																	return props.t('To date is invalid');

																if (currentType !== null && ((difference / 86400) > currentType.soNgayConlai))
																	return 'outOfLimited';

																return true;
															}
														}} */
                      render={({ onChange, onBlur, value, name }) =>
  (<DatePicker
    name={name}
    className={errors.toDate ? 'form-control is-invalid' : 'form-control'}
    locale="vi"
    dateFormat="dd/MM/yyyy"
    autocomplete="off"
    selected={value}
    onChange={(time) => onChange(time)}
  />)
													}
                    />
                    <ErrorMessage name="toDate" errors={errors} render={({ message }) => { if (message !== 'outOfLimited') { return <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>; } return ''; }} />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormGroup>
                    <Label for="note">{props.t('Note')}</Label>
                    <Controller
                      as={Input}
                      control={control}
                      name="note"
                      type="textarea"
                      placeholder={props.t('Enter note')}
                      defaultValue=""
                    />
                  </FormGroup>
                </Col>
              </Row>

              <div className="d-flex">
                <Button type="submit" color="success">{props.t('Send')}</Button>
                <Button type="button" className="ml-2" color="secondary" onClick={() => { setModalRequest(false); }}>{props.t('Cancel')}</Button>
              </div>
            </form>
          </ModalBody>
        </Modal>
        <Modal size="sm" isOpen={modalCancel.isShow} style={{ top: '100px', maxWidth: '350px' }}>
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
              {props.t('Do you really want to cancel this request ?\nThis process cannot be undone.')}
            </p>
          </ModalHeader>
          <ModalBody className="justify-content-center" style={{ textAlign: 'center', paddingTop: '0', paddingBottom: '2rem' }}>
            <Button type="button" color="danger" size="md" onClick={(event) => { cancel(modalCancel.id); setModalCancel({ isShow: false, id: -1 }); }}>
              {props.t('Accept')}
            </Button>
            <Button type="button" className="ml-3" color="secondary" size="md" onClick={() => setModalCancel({ isShow: false, id: -1 })}>
              {props.t('Cancel')}
            </Button>
          </ModalBody>
        </Modal>
      </Col>
      <div className="table-responsive wrapper">
        <Table className="table table-wrapper table-hover table-nowrap mb-0">
          <thead>
            <tr>
              <th className="text-left" style={{ width: '20px' }}>#</th>
              <th className="text-left">{props.t('From date')}</th>
              <th className="text-left">{props.t('To date')}</th>
              <th className="text-left">{props.t('Total')}</th>
              <th className="text-left">{props.t('Time off type')}</th>
              <th className="text-center">{props.t('Status')}</th>
              <th className="text-center">Thời gian duyệt</th>
              <th className="text-center" style={{ width: '150px' }}>&nbsp;</th>
            </tr>
          </thead>
          <TableBody t={props.t} pagination={pagination} data={data} handleDetail={handleDetail} handleCancel={handleCancel} />
        </Table>
      </div>
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </>
			}
  </Container>
	);
};

export default withNamespaces()(UserTable);
