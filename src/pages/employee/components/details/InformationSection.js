import React, { useMemo } from 'react';
import dayJS from 'dayjs';
import styled from 'styled-components';

import { Row, Col } from 'reactstrap';
import Loader from 'components/Loader';

import { useSelector } from 'react-redux';
import genders from 'assets/mocks/genders.json';
import materialStatuses from 'assets/mocks/material-status.json';

const Wrapper = styled.div`
    position: relative;
    & .group {
        &__label {
            display: inline-block;
            margin-bottom: 3px;
            font-size: 14px;
            color: #939EA9;
        }
        &__content {
            display: block;
            font-size: 14px;
            color: #000000;
        }       
    }

    & .part {
        &__header {
            padding: 5px;
            font-size: 16px;
            font-weight: 700;
        }
        &__body {
            padding: 5px;
        }
    }
`;

const table = [
  [
    {
      label: 'Họ và tên',
      accessor: 'tenNV',
    },
    {
      label: 'Giới tính',
      accessor: 'gioiTinh',
      render: (d) => genders[d.gioiTinh] || '-',
    },
  ],
  [
    {
      label: 'Ngày sinh',
      accessor: 'ngaySinh',
      render: (d) => d?.ngaySinh ? dayJS(d.ngaySinh).format('DD/MM/YYYY') : '-',
    },
  ],
  [
    {
      label: 'Địa chỉ',
      accessor: 'diaChi',
    },
  ],
  [
    {
      label: 'Số điện thoại',
      accessor: 'soDienThoai',
      render: (d) => (d?.soDienThoai ?? '') !== '' ? d.soDienThoai.replace(/\D/g, '').replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3') : '-',
    },
    {
      label: 'Email',
      accessor: 'email',
    },
  ],
  [
    {
      label: 'Quốc tịch',
      accessor: 'quocTich',
    },
  ],
  [
    {
      label: 'CMND/CCCD',
      accessor: 'canCuocCongDan',
    },
  ],
  [
    {
      label: 'Trình độ giáo dục',
      accessor: 'BangCap',
      render: (d) => d?.BangCap ? d?.BangCap?.tenBangCap ?? '' : '-',
    },
  ],
  [
    {
      label: 'Tình trạng hôn nhân',
      accessor: 'tinhTrangHonNhan',
      render: (d) => materialStatuses[d.tinhTrangHonNhan] || '-',
    },
    {
      label: 'Số người phụ thuộc',
      accessor: 'soNguoiPhuThuoc',
      render: (d) => d?.soNguoiPhuThuoc ?? '-',
    },
  ],
];


const InformationDetails = () => {
  const {
    employeeDetails,
    getEmployeeDetailsLoading
  } = useSelector((state) => state.employee);

  const node = useMemo(() => {
    return (
      <>
        {table.map((r, i) => (
          <Row key={`row_${i}`} style={{ marginBottom: '10px' }}>
            {(r || []).map((c, j) => (
              <Col key={`col_${j}`}>
                <div className="group">
                  <div className="group__label">
                    {c.label}
                  </div>
                  <div className="group__content">
                    {c?.render ? c.render(employeeDetails) : (employeeDetails[c.accessor] || '-')}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ))}
      </>
    )
  }, [employeeDetails]);

  return (
    <Wrapper>
      <Loader inverted active={getEmployeeDetailsLoading} />
      <div className="part">
        <div className="part__body">
          {node}
        </div>
      </div>
    </Wrapper>
  );
};

export default InformationDetails;