import React, { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import dayJS from 'dayjs';

import {
	Container,
	Row, Col,
	Table,
	Card, CardBody,
	Modal, ModalHeader, ModalBody,
	Nav, NavItem, NavLink,
	Label, Badge, Input, Button, Spinner, ModalFooter, BreadcrumbItem,
} from 'reactstrap';
import toastr from 'toastr';
import Pagination from 'components/Pagination';
import Loader from 'components/Loader';

import useQueryString from 'hooks/useQueryString';
import usePushQueryString from 'hooks/usePushQueryString';

import timeOffApi from 'api/timeOffApi';
import { useParams, Link } from 'react-router-dom';
import Breadcrumb from 'components/Common/Breadcrumb';
import { API_URL } from 'utils/contants';
import Request from './Request';

const ButtonLoader = ({ loading, content, onClick, ...otherProps }) => (
  <Button disabled={loading} onClick={(event) => { onClick(event); }} {...otherProps}>
    {loading ? <Spinner size="sm" color="white" /> : content}
  </Button>
);

const TableBody = (props) => {
	const { pagination, data, handleDetail } = props;
	const statusType = { 7: 'success', 8: 'secondary', 9: 'secondary', 10: 'danger' };
	return (
  <tbody>
    {(!data || data.length < 1)
				? <tr><td colSpan={8} className="text-center">{props.t('No information')}</td></tr>
				: data.map((item, idx) => {
					const { id, beginDate, endDate, approvedTime, dayLeft, type, status, employee } = item;

					return (
  <tr key={`class_${idx}`}>
    <td className="align-middle" style={{ width: '20px' }}>
      {(idx + 1) + (pagination.limit * (pagination.page - 1))}
    </td>
    <td className="align-middle text-left">
      {employee.name}
    </td>
    <td className="align-middle text-center">
      {dayJS(beginDate).format('DD/MM/YYYY')}
    </td>
    <td className="align-middle text-center">
      {dayJS(endDate).format('DD/MM/YYYY')}
    </td>
    <td className="align-middle text-center">
      {`${(Math.round((dayJS(endDate).unix() - dayJS(beginDate).unix()) / 86400) + 1).toString()} ${props.t('day(s)')}`}
    </td>
    <td className="align-middle text-left">
      {type.name}
    </td>
    {/* <td className="align-middle text-center">
								{`${dayLeft} ${props.t('day(s)')}`}
							</td> */}
    <td className="align-middle text-center">
      {approvedTime ? dayJS(approvedTime).format('HH:mm DD/MM/YYYY') : '-'}
    </td>
    <td className="align-middle text-center font-size-16">
      <Badge color={statusType[status.id]} size="md" style={{ width: '80px' }} pill>{status.name}</Badge>
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

const AdminTable = (props) => {
	const { page } = useQueryString();
	const { idNhanVien } = useParams();
	const pushQueryString = usePushQueryString();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [modalDetail, setModalDetail] = useState({
		isShow: false,
		data: {},
	});
	const [modalCancel, setModalCancel] = useState({
		isShow: false,
		id: null,
	});
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		totalRows: 1,
	});

	const handlePageChange = (newPage) => pushQueryString({ page: newPage });

	const handleDetail = (id) => setModalDetail({ ...modalDetail, isShow: true, data: data[parseInt(id.substr(id.indexOf('_') + 1))] });

	const handleAccept = (id) => accept(data[parseInt(id.substr(id.indexOf('_') + 1))].id);

	const handleReject = (id) => reject(data[parseInt(id.substr(id.indexOf('_') + 1))].id);

	const handleCancel = (id) => setModalCancel({ isShow: true, id: data[parseInt(id.substr(id.indexOf('_') + 1))].id });

	// Function
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
			const params = { idTrangThai: 7 };
			await timeOffApi.put(id, params);

			reload('accept'); notify('success', props.t('Accepted.'));
		} catch (_err) {
			notify('danger', _err);
		}
	};

	const reject = async (id) => {
		try {
			const params = { idTrangThai: 10 };
			const response = await timeOffApi.put(id, params);

			reload('reject'); notify('success', props.t('Rejected.'));
		} catch (_err) {
			notify('danger', _err);
		}
	};

	const cancel = async (id) => {
		try {
			const params = { idTrangThai: 9 };
			const response = await timeOffApi.put(id, params);

			reload('cancel'); notify('success', props.t('Canceled.'));
		} catch (_err) {
			notify('danger', _err);
		}
	};

	const fetch = async () => {
		const params = { page_size: pagination.limit, page_number: pagination.page, idNhanVien };
		if (page) { params.page_number = page; }

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
	const handleExport = () => {
		const date = new Date();
		const from = new Date(date.getFullYear(), date.getMonth(), 2).toISOString().split('T')[0];
		const to = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
		window.open(`${API_URL}​/api/Exports/Absents/StatisticByEmployee?fromDate=${from}&toDate=${to}&employeeId=${idNhanVien}`);
	};
	useEffect(() => {
		fetch();
	}, [page, idNhanVien]);

	return (
  <Container fluid style={{ position: 'relative' }}>
    <Loader inverted active={loading} />
    <Row style={{ display: idNhanVien ? '' : 'none' }}>
      <Col xs={6}>
        <Breadcrumb title="Thống kê" breadcrumbItem="Chi tiết nghỉ phép" link="statistic/time-off" />
      </Col>
      <Col xs={6} className="d-flex justify-content-end">
        <Button color="success" className="mr-3 mb-4">
          <div onClick={() => handleExport()}>
            <i className="bx bx-cloud-download" />
            <span className="ml-2">Xuất báo cáo nghỉ vắng</span>
          </div>
        </Button>
      </Col>
    </Row>
    <Col sm={6} md={4} xl={3}>
      <Modal size="md" isOpen={modalDetail.isShow} style={{ top: '100px', minWidth: '700px' }}>
        <ModalHeader toggle={() => { setModalDetail({ isShow: false, data: {} }); }} />
        <ModalBody>
          <Request data={modalDetail.data} />
        </ModalBody>
        <ModalFooter>
          {(modalDetail.data?.status?.id ?? 0) === 8 && (
          <>
            <Button type="button" color="success" size="md" onClick={(event) => { accept(modalDetail?.data?.id ?? ''); setModalDetail({ isShow: false, data: {} }); }}>
              Chấp nhận
            </Button>
            <Button type="button" color="danger" size="md" onClick={(event) => { reject(modalDetail?.data?.id ?? ''); setModalDetail({ isShow: false, data: {} }); }}>
              Từ chối
            </Button>
          </>
						)}
          {(modalDetail.data?.status?.id ?? 0) === 7 && (
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
        <ModalFooter />
      </Modal>
    </Col>
    <div className="table-responsive wrapper">
      <Table className="table table-wrapper table-hover table-nowrap mb-0">
        <thead>
          <tr>
            <th className="text-left" style={{ width: '20px' }}>#</th>
            <th className="text-left" style={{ width: '170px' }}>Tên nhân viên</th>
            <th className="text-center">Từ ngày</th>
            <th className="text-center">Đến hết ngày</th>
            <th className="text-center">Số ngày</th>
            <th className="text-left">Loại nghỉ phép</th>
            {/* <th className="text-center">Số ngày còn lại</th> */}
            <th className="text-center">Thời gian duyệt</th>
            <th className="text-center">Trạng thái duyệt</th>
            <th className="text-center" style={{ width: '200px' }}>Chức năng</th>
          </tr>
        </thead>
        <TableBody
          t={props.t}
          data={data}
          pagination={pagination}
          handleDetail={handleDetail}
          handleAccept={handleAccept}
          handleReject={handleReject}
          handleCancel={handleCancel}
        />
      </Table>
    </div>
    <Pagination
      pagination={pagination}
      onPageChange={handlePageChange}
    />
  </Container>
	);
};

export default withNamespaces()(AdminTable);
