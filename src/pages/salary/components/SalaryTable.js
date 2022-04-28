import React, { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  Container,
  Button,
  Table,
  Row,
} from 'reactstrap';

import toastr from 'toastr';
import MonthPickerCustom from './MonthPickerCustom';
import Loader from 'components/Loader';
import Pagination from 'components/Pagination';

import useQueryString from 'hooks/useQueryString';
import usePushQueryString from 'hooks/usePushQueryString';
import salaryApi from 'api/salaryApi';
import { TOKEN, API_URL } from 'utils/contants';

const TableBody = ({ trans, data }) => {
  const format = number =>
    number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

  return (
    <tbody>
      {(!data || data.length <= 0)
        ?
        <tr><td colSpan="12" className="text-center">{trans('No information')}</td></tr>
        :
        data.map(({ ordinary, name, position, wage, actualWork, offTime, product, allowance, total, deduction, remain }, index) => (
          <tr key={'employee_' + index}>
            <td className="text-left">
              {ordinary + 1}
            </td>
            <td className="text-left">
              {name}
            </td>
            <td className="text-left">
              {position}
            </td>
            <td className="text-right">
              {`${format(wage)} đ`}
            </td>
            <td className="text-left">
              {`${10} ${trans('day(s)')}`}
            </td>
            <td className="text-left">
              {`${actualWork} ${trans('hour(s)')}`}
            </td>
            <td className="text-left">
              {`${offTime} ${trans('day(s)')}`}
            </td>
            <td className="text-right">
              {`${format(product)} đ`}
            </td>
            <td className="text-right">
              {`${format(allowance)} đ`}
            </td>
            <td className="text-right">
              {`${format(total)} đ`}
            </td>
            <td className="text-right">
              {`${format(deduction)} đ`}
            </td>
            <td className="text-right">
              {`${format(remain)} đ`}
            </td>
          </tr>
        ))
      }
    </tbody>
  )
}

const EmployeePage = (props) => {
  const {
    t: trans,
    profile = {},
    isAdmin = false,
    isEmployee = false,
  } = props;
  const { page, time } = useQueryString();
  const pushQueryString = usePushQueryString();

  const current = new Date();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    id: null,
    thang: null,
    nam: null
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRows: 1
  });

  const handlePageChange = newPage => pushQueryString({ page: newPage });

  const notify = (type, message) => {
    toastr.options = {
      positionClass: 'toast-bottom-right',
      timeOut: 2000,
      extendedTimeOut: 3000,
      closeButton: true,
      preventDuplicates: true
    }

    if (type === 'success')
      toastr.success(message, trans('Success'));
    else if (type === 'info')
      toastr.info(message);
    else if (type === 'warning')
      toastr.warning(message, trans('Failed'));
    else if (type === 'danger')
      toastr.error(message, trans('Failed'));
    else
      toastr.secondary(message);
  }

  const fetch = async () => {
    let params = { page_size: pagination.limit, page_number: 1 };

    if (!isAdmin && isEmployee) {
      try {
        const token = JSON.parse(localStorage.getItem(TOKEN));
        params.idNhanVien = token?.idNhanVien ?? '';
      } catch (error) { }
    }

    if (page !== undefined)
      params.page_number = page;
    if (time === undefined) {
      params.thang = current.getMonth() + 1; params.nam = current.getFullYear();
    }
    else {
      try {
        const parse = time.split('/');
        params.thang = parseInt(parse[0]); params.nam = parseInt(parse[1]);
      } catch (error) {
        params.thang = current.getMonth() + 1; params.nam = current.getFullYear();
      }
    }

    setLoading(true);
    setFilter({ id: profile?.idNhanVien ?? '', thang: params.thang, nam: params.nam });

    try {
      const { success, meta, data } = await salaryApi.getEmployee(params);
      if (success && data.length >= 0) {
        const parse = data.map((item, idx) => {
          return {
            ordinary: ((meta.page_number - 1) * 10 + idx),
            id: item.id,
            code: item.maNV,
            name: item.tenNV,
            position: item.chucVu,
            probationaryDay: item.ngayThuViec,
            officialDay: item.ngayChinhThuc,
            wage: item.mucLuong,
            standardWork: item.soNgayLam,
            actualWork: item.soGioLam,
            offTime: item.soNgayNghi,
            insuranceWage: item.luongBaoHiem,
            amount: item.soTien,
            product: item?.sanPham ?? 0,
            allowance: (item?.phuCap ?? []).reduce((t, o) => t + (o?.soTien ?? 0), 0),
            businessEfficiency: item.hieuQuaKinhDoanh,
            total: item?.tongLuong ?? 0,
            deduction: (item?.khauTru ?? []).reduce((t, o) => t + (o?.soTien ?? 0), 0),
            remain: item?.conLai ?? 0,
            note: item?.ghiChu ?? '',
          }
        });

        setPagination({
          page: meta.page_number,
          limit: meta.page_size,
          totalRows: meta.total
        })

        setData(parse);
      }
    } catch (error) {
      notify('danger', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetch();
  }, [page, time]);

  return (
    <React.Fragment>
      <Container fluid style={{ position: 'relative' }}>
        <Loader inverted active={loading} />
        <Row className="mb-2 ml-2">
          <MonthPickerCustom />
          {isAdmin && (
            <div className="mr-3" style={{ marginLeft: 'auto' }}>
              <Button className='justify-content-end' type="button" color="success" style={{ marginLeft: "0.5rem" }} className="btn-rounded waves-effect waves-light mb-1 mr-2"
                onClick={() => { window.open(`${API_URL}/v1/NhanVien/tongluongnhan/export?thang=${filter.thang}&nam=${filter.nam}`) }}
              >
                <i className="bx bx-cloud-download" style={{ fontSize: '10px' }}></i> {trans('Export')}
              </Button>
            </div>
          )}
        </Row>
        <div className="table-responsive wrapper">
          <Table className="table table-wrapper table-hover table-nowrap mb-0">
            <thead>
              <tr>
                <th className="text-left">{trans('#')}</th>
                <th className="text-left">{trans('Employee name')}</th>
                <th className="text-left">{trans('Position')}</th>
                <th className="text-right">{trans('Wage')}</th>
                <th className="text-left">{trans('Standard work')}</th>
                <th className="text-left">{trans('Actual work')}</th>
                <th className="text-left">{trans('Off time')}</th>
                <th className="text-right">Sản phẩm</th>
                <th className="text-right">{trans('Allowance')}</th>
                <th className="text-right">{trans('Total salary')}</th>
                <th className="text-right">{trans('Deduction')}</th>
                <th className="text-right">{trans('Remain salary')}</th>
              </tr>
            </thead>
            <TableBody trans={trans} data={data} />
          </Table>
        </div>
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </Container>
    </React.Fragment>
  )
}

export default withNamespaces()(EmployeePage);