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
      accessor: 'name',
    },
    {
      label: 'Giới tính',
      accessor: 'gender',
      render: (r) =>{
        if( r.gender==0)
          return 'Nam'
         return  'Nữ'},
    },
  ],
  [
    {
      label: 'Ngày sinh',
      accessor: 'birth',
      render: (d) => d?.birth ? dayJS(d.birth).format('DD/MM/YYYY') : '-',
    },
    {
      label: 'Ngày vào hội',
      accessor: 'joinDate',
      render: (d) => d?.joinDate ? dayJS(d.joinDate).format('DD/MM/YYYY') : '-',
    },
  ],
  [
    {
      label: 'Địa chỉ',
      accessor: 'diaChi',
      render: (d) => 'Địa chỉ'
    },
  ],
  [
    {
      label: 'Số điện thoại',
      accessor: 'phoneNumber',
      //render: (d) => (d?.soDienThoai ?? '') !== '' ? d.soDienThoai.replace(/\D/g, '').replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3') : '-',
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
      render: (d) => 'Việt Nam'
    },
  ],
  [
    {
      label: 'CMND/CCCD',
      accessor: 'idcard',
    },
  ],
  [
    {
      label: 'Trình độ giáo dục',
      accessor: 'BangCap',
    //  render: (d) => d?.BangCap ? d?.BangCap?.tenBangCap ?? '' : '-',
    },
  ],
  [
    {
      label: 'Tình trạng hôn nhân',
      accessor: 'tinhTrangHonNhan',
    //  render: (d) => materialStatuses[d.tinhTrangHonNhan] || '-',
    render: (d) => 'Đọc thân'
    },
    {
      label: 'Công việc',
      accessor: 'word',
    //  render: (d) => materialStatuses[d.tinhTrangHonNhan] || '-',
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