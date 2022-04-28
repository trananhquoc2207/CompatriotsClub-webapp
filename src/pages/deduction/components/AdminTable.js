import React, { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import dayJS from 'dayjs';
import {
    Spinner,
    Container,
    Row, Col,
    Table,
    Card, CardBody,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Nav, NavItem, NavLink,
    Label, Badge, Input, Button,
} from 'reactstrap';
import toastr from 'toastr';
import Loader from 'components/Loader';
import Pagination from 'components/Pagination';

import useQueryString from 'hooks/useQueryString';
import usePushQueryString from 'hooks/usePushQueryString';
import deductionApi from 'api/deductionApi';
import Request from './Request';

const ButtonLoader = ({ loading, content, onClick, ...otherProps }) => (
  <Button disabled={loading} onClick={(event) => { onClick(event); }} {...otherProps}>
    {loading ? <Spinner size="sm" color="white" /> : content}
  </Button>
);

const TableBody = (props) => {
    const { pagination, data, handleDetail, handleAccept, handleReject, handleCancel } = props;
    const statusType = { 14: 'success', 16: 'warning', 17: 'secondary', 18: 'danger' };
    const formatCurrency = (number, currency) => `${number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')} ${currency}`;
    const loading = false;
    return (
      <tbody>
        { (!data || data.length < 1)
                ? <tr><td colSpan={8} className="text-center">{props.t('No information')}</td></tr>
                : data.map((item, idx) => {
                    const { id, time, reason, amount, approvedTime, status, employee } = item;

                    return (
                      <tr key={`class_${idx}`}>
                        <td className="align-middle" style={{ width: '20px' }}>
                          {(idx + 1) + (pagination.limit * (pagination.page - 1))}
                        </td>
                        <td className="align-middle text-left">
                          {employee.code}
                        </td>
                        <td className="align-middle text-left">
                          {employee.name}
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
                          <Badge color={statusType[status.id]} size="lg" style={{ width: '100px' }} pill>{status.name}</Badge>
                        </td>
                        <td className="align-middle text-center">
                          {approvedTime ? dayJS(approvedTime).format('HH:mm DD/MM/YYYY') : '-'}
                        </td>
                        <td className="align-middle text-center">
                          <ButtonLoader id={`accept_${idx}`} className="mr-3 align-middle" size="sm" color="primary" style={{ width: '70px' }} loading={loading} content={props.t('Detail')} onClick={(event) => { handleDetail(event.target.id); }} />
                        </td>
                      </tr>
                    );
                })
            }
      </tbody>
    );
};

const AdminTable = (props) => {
    const { page } = useQueryString();
    const pushQueryString = usePushQueryString();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalRows: 1,
    });
    const [modalDetail, setModalDetail] = useState({
        isShow: false,
        data: {},
    });
    const [modalCancel, setModalCancel] = useState({
        isShow: false,
        id: null,
    });

    const handlePageChange = (newPage) => pushQueryString({ page: newPage });

    const handleDetail = (id) => setModalDetail({ isShow: true, data: data[parseInt(id.substr(id.indexOf('_') + 1))] });

    const handleAccept = (id) => accept(data[parseInt(id.substr(id.indexOf('_') + 1))].id);

    const handleReject = (id) => reject(data[parseInt(id.substr(id.indexOf('_') + 1))].id);

    const handleCancel = (id) => setModalCancel({ isShow: true, id: data[parseInt(id.substr(id.indexOf('_') + 1))].id });

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

    const reload = type => {
        switch (type) {
            case 'cancel': {
                setModalCancel({ isShow: false, id: null });
                break;
            }
            default:
                break;
        }

        window.location.reload();
    };

    const accept = async (id) => {
        try {
            const params = { idTrangThai: 14 };
            const response = await deductionApi.put(id, params);

            reload('accept'); notify('success', props.t('Accepted.'));
        } catch (_err) {
            notify('danger', _err);
        }
    };

    const reject = async (id) => {
        try {
            const params = { idTrangThai: 18 };
            const response = await deductionApi.put(id, params);

            reload('reject'); notify('success', props.t('Rejected.'));
        } catch (_err) {
            notify('danger', _err);
        }
    };

    const cancel = async (id) => {
        try {
            const params = { idTrangThai: 17 };
            const response = await deductionApi.put(id, params);

            reload('cancel'); notify('success', props.t('Canceled.'));
        } catch (_err) {
            notify('danger', _err);
        }
    };

    const fetch = async () => {
        const params = { page_size: pagination.limit, page_number: pagination.page };

        if (page) { params.page_number = page; }

        try {
            setLoading(true);
            const response = await deductionApi.get(params);
            if (response.success && response.data) {
                const dataParse = response.data.map((item) => ({
                        id: item.id,
                        time: item.thoiGianKhauTru,
                        reason: item.lyDoKhauTru,
                        amount: item.soTien,
                        approvedTime: item.ngayDuyet !== '0001-01-01T00:00:00' ? item.ngayDuyet : undefined,
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

                setData(dataParse);
            }
        } catch (_err) {
            notify('danger', _err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, [page]);

    return (
      <Container fluid style={{ position: 'relative' }}>
        <Loader inverted active={loading} />
        <Col sm={6} md={4} xl={3}>
          <Modal size="md" isOpen={modalDetail.isShow} style={{ top: '100px', minWidth: '700px' }}>
            <ModalHeader toggle={() => { setModalDetail({ isShow: false, data: {} }); }} />
            <ModalBody>
              <Request data={modalDetail.data} />
            </ModalBody>
            <ModalFooter>
              {(modalDetail.data?.status?.id ?? 0) === 16 && (
                <>
                  <Button type="button" color="success" size="md" onClick={(event) => { accept(modalDetail?.data?.id ?? ''); setModalDetail({ isShow: false, data: {} }); }}>
                    Chấp nhận
                  </Button>
                  <Button type="button" color="danger" size="md" onClick={(event) => { reject(modalDetail?.data?.id ?? ''); setModalDetail({ isShow: false, data: {} }); }}>
                    Từ chối
                  </Button>
                </>
                        )}
              {(modalDetail.data?.status?.id ?? 0) === 14 && (
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
                <th className="text-left" style={{ width: '10px' }}>{props.t('Employee code')}</th>
                <th className="text-left" style={{ width: '170px' }}>{props.t('Employee name')}</th>
                <th className="text-left">{props.t('Time')}</th>
                <th className="text-left">{props.t('Deduction reason')}</th>
                <th className="text-left">{props.t('Amount of money')}</th>
                <th className="text-center">{props.t('Status')}</th>
                <th className="text-center">Thời gian duyệt</th>
                <th className="text-center" style={{ width: '200px' }}>&nbsp;</th>
              </tr>
            </thead>
            <TableBody t={props.t} pagination={pagination} data={data} handleDetail={handleDetail} handleAccept={handleAccept} handleReject={handleReject} handleCancel={handleCancel} />
          </Table>
        </div>
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </Container>
    );
};

export default withNamespaces()(AdminTable);
