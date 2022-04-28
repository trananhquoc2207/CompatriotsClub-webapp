import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { withNamespaces } from 'react-i18next';
import dayJS from 'dayjs';

import {
    Spinner,
    Container, Row, Col,
    Table,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Label, Badge, Input, Button, FormFeedback, FormGroup,
} from 'reactstrap';
import toastr from 'toastr';
import Toolbox from 'components/Toolbox';
import NumberFormat from 'react-number-format';
import Pagination from 'components/Pagination';
import Loader from 'components/Loader';
import DatePicker, { registerLocale } from 'react-datepicker';

import useQueryString from 'hooks/useQueryString';
import usePushQueryString from 'hooks/usePushQueryString';
import deductionApi from 'api/deductionApi';
import { TOKEN } from 'utils/contants';

import vi from 'date-fns/locale/vi';
import Request from './Request';

registerLocale('vi', vi);

const ButtonLoader = ({ loading, content, onClick, ...otherProps }) => (
  <Button disabled={loading} onClick={(event) => { onClick(event); }} {...otherProps}>
    {loading ? <Spinner size="sm" color="white" /> : content}
  </Button>
);

const TableBody = (props) => {
    const { pagination, data, handleDetail } = props;
    const statusType = { 14: 'success', 16: 'warning', 17: 'secondary', 18: 'danger' };
    const formatCurrency = (number, currency) => `${number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')} ${currency}`;
    return (
      <tbody>
        { (!data || data.length < 1)
                ? <tr><td colSpan={8} className="text-center">{props.t('No information')}</td></tr>
                : data.map((item, idx) => {
                    const { id, time, reason, status, employee, approvedTime, isChecked, amount } = item;

                    return (
                      <tr key={`class_${idx}`}>
                        <td className="align-middle" style={{ width: '20px' }}>
                          {(idx + 1) + (pagination.limit * (pagination.page - 1))}
                        </td>
                        <td className="align-middle text-left">
                          {employee.code}
                        </td>
                        <td className="align-middle text-left">
                          {dayJS(time).format('DD/MM/YYYY')}
                        </td>
                        <td className="align-middle text-left">
                          {reason}
                        </td>
                        <td className="align-middle text-left">
                          {formatCurrency(amount, 'đ')}
                        </td>
                        <td className="align-middle text-center font-size-16">
                          <Badge color={statusType[status.id]} size="md" style={{ width: '100px' }} pill>{status.name}</Badge>
                        </td>
                        <td className="align-middle text-center">
                          {approvedTime ? dayJS(approvedTime).format('HH:mm DD/MM/YYYY') : '-'}
                        </td>
                        <td className="align-middle text-center">
                          <ButtonLoader id={`accept_${idx}`} className="mr-3 align-middle" size="sm" color="primary" style={{ width: '70px' }} loading={false} content={props.t('Detail')} onClick={(event) => { handleDetail(event.target.id); }} />
                        </td>
                      </tr>
                    );
                })
            }
      </tbody>
    );
};

const User = (props) => {
    const { page } = useQueryString();
    const pushQueryString = usePushQueryString();
    const {
        watch,
        register,
        errors,
        control,
        handleSubmit,
    } = useForm({ mode: 'all', shouldFocusError: false });

    const currentTime = new Date();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
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

    const handleSubmitRequest = (payload) => request({
        lyDoKhauTru: payload.lyDoKhauTru,
        thoiGianKhauTru: payload.thoiGianKhauTru.toISOString(),
        soTien: parseFloat(payload.soTien.replace(/[^\d]/g, '')),
    });

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
            const response = await deductionApi.post(payload);

            reload('request'); notify('success', props.t('Requested.'));
        } catch (_err) {
            notify('danger', _err);
        }
    };

    const cancel = async (id) => {
        try {
            const params = { idTrangThai: 17 };
            const response = await deductionApi.delete(id);

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
            params.IDNhanVien = token?.idNhanVien ?? '';
        } catch (error) { }

        try {
            setLoading(true);
            const response = await deductionApi.get(params);
            if (response.success && response.data) {
                const dataParse = response.data.map((item) => ({
                        id: item.id,
                        time: item.thoiGianKhauTru,
                        reason: item.lyDoKhauTru,
                        amount: item.soTien,
                        status: {
                            id: item.trangThai.id,
                            name: item.trangThai.tenTrangThai,
                        },
                        employee: {
                            id: item.nhanVien.id,
                            code: item.nhanVien.maNhanVien,
                            name: item.nhanVien.tenNhanVien,
                        },

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

    useEffect(() => {
        init();
        fetch();
    }, [page]);

    return (
      <Container fluid style={{ position: 'relative' }}>
        <Loader inverted active={loading} />
        <Toolbox t={props.t} option={toolBox} />
        <Col sm={6} md={4} xl={3}>
          <Modal size="md" isOpen={modalDetail.isShow} style={{ top: '100px', minWidth: '700px' }}>
            <ModalHeader toggle={() => { setModalDetail({ isShow: false, data: {} }); }} />
            <ModalBody>
              <Request data={modalDetail.data} />
            </ModalBody>
            <ModalFooter>
              {(modalDetail.data?.status?.id ?? 0) === 16 && (
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
                {/*  <Row>
                                <Col>
                                    <ErrorMessage name="toDate" errors={errors} render={({ message }) => {
                                        if (message === 'outOfLimited') {
                                            return (
                                                <Alert color="danger">
                                                    <span className="alert-heading font-weight-bold">{props.t('Warning!')}</span><br />
                                                    <span>
                                                        {props.t('You have only ')}
                                                        <span className="font-weight-bold">{currentType ? currentType.soNgayConlai : ((dayJS(watch('toDate')).unix() - dayJS(watch('fromDate')).unix()) / 86400) + 1}</span>
                                                        {props.t(' day(s) left for time off type ')}
                                                        <span className="font-weight-bold">{currentType ? currentType.tenLoaiPhep : ''}</span>
                                                    </span>
                                                </Alert>
                                            )
                                        }

                                        return '';
                                    }} />
                                </Col>
                            </Row> */}
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="lyDoKhauTru">{props.t('Deduction Reason')}</Label>
                      <Input
                        name="lyDoKhauTru"
                        className={errors.lyDoKhauTru ? 'is-invalid' : ''}
                        placeholder={props.t('Enter deduction reason')}
                        innerRef={
                                                register({
                                                    required: props.t('Deduction reason not entered'),

                                                })
                                            }
                      />
                      <ErrorMessage name="lyDoKhauTru" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="thoiGianKhauTru">{props.t('Deduction Date')}</Label>
                      <Controller
                        name="thoiGianKhauTru"
                        control={control}
                        valueName="selected"
                        defaultValue={currentTime}
                        rules={{
                                                required: props.t('Deduction date not entered'),
                                            }}
                        render={({ onChange, onBlur, value, name }) =>
                                              (<DatePicker
                                                name={name}
                                                className={errors.thoiGianKhauTru ? 'form-control is-invalid' : 'form-control'}
                                                locale="vi"
                                                dateFormat="dd/MM/yyyy"
                                                autocomplete="off"
                                                selected={value}
                                                onChange={(time) => onChange(time)}
                                              />)
                                            }
                      />
                      <ErrorMessage name="thoiGianKhauTru" errors={errors} render={({ message }) => <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>} />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="soTien" style={{ fontSize: '15px', fontWeight: '400' }}>{props.t('Deduction amount')}</Label>
                      <Controller
                        as={NumberFormat}
                        name="soTien"
                        control={control}
                        className={errors.soTien ? 'form-control is-invalid' : 'form-control'}
                        thousandSeparator
                        defaultValue=""
                        placeholder={props.t('Enter deduction amount')}
                        rules={
                                                { required: props.t('Deduction amount not entered') }
                                            }
                      />
                      <ErrorMessage name="soTien" errors={errors} render={({ message }) => <FormFeedback>{message}</FormFeedback>} />
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
                <th className="text-left">{props.t('Employee code')}</th>
                <th className="text-left">{props.t('Time')}</th>
                <th className="text-left">{props.t('Deduction reason')}</th>
                <th className="text-left">{props.t('Amount of money')}</th>
                <th className="text-center">{props.t('Status')}</th>
                <th className="text-center">Thời gian duyệt</th>
                <th className="text-center" style={{ width: '150px' }}>&nbsp;</th>
              </tr>
            </thead>
            <TableBody t={props.t} pagination={pagination} data={data} handleDetail={handleDetail} />
          </Table>
        </div>
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </Container>
    );
};

export default withNamespaces()(User);
