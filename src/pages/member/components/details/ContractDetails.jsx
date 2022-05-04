import React, { useMemo } from 'react';
import dayJS from 'dayjs';
import styled from 'styled-components';

import { Row, Col } from 'reactstrap';

import { useDispatch, useSelector } from 'react-redux';
import { setContractDetailsSelected } from 'pages/member/actions/member';
import { formatCurrency } from 'utils/helpers';

const Wrapper = styled.div`
  & .header {
    &__title {
      cursor: pointer;
      font-weight: 700;
      font-size: 16px;
      vertical-align: middle;
      margin-bottom: 10px;
      &:before {
        margin-right: 10px;
        content: "\\ed35";
        font-family: 'boxicons' !important;
        display: block;
        float: left;
        transition: transform .2s;
        font-size: 1rem;
        transform: rotate(180deg);
      } 
    }
  }
  & .body {}
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
`;

const table = [
  [
    {
      label: 'Số hợp đồng',
      accessor: 'soHopDong',
    },
    {
      label: 'Loại hợp đồng',
      accessor: 'idLoaiHopDong',
      render: (d) => d?.LoaiHopDong.tenLoaiHopDong ?? '-',
    }
  ],
  [
    {
      label: 'Ngày hiệu lực',
      accessor: 'ngayHieuLuc',
      render: (d) => d?.ngayHieuLuc ? dayJS(d.ngayHieuLuc).format('DD/MM/YYYY') : '-',
    },
    {
      label: 'Ngày kết thúc',
      accessor: 'ngayKetThuc',
      render: (d) => d?.ngayKetThuc ? dayJS(d.ngayKetThuc).format('DD/MM/YYYY') : '-',
    },
  ],
  [
    {
      label: 'Mức lương',
      accessor: 'mucLuong',
      render: (d) => formatCurrency(d?.mucLuong ?? 0, 'đ'),
    },
  ],
];

const ContractDetails = () => {
  const { contractDetailsSelected: contract } = useSelector((state) => state.employee);
  const dispatch = useDispatch();

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
                    {c?.render ? c.render(contract) : (contract[c.accessor] || '-')}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ))}
      </>
    )
  }, [contract]);

  return (
    <Wrapper>
      <div className="wrapper">
        <div className="header">
          <div className="header__title" onClick={() => dispatch(setContractDetailsSelected(undefined))}>
            Chi tiết hợp đồng
          </div>
        </div>
        <div className="part">
          <div className="part_body">
            {node}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ContractDetails;