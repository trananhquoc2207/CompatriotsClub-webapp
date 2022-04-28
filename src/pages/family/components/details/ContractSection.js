import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import dayJS from 'dayjs';
import styled from 'styled-components';

import Loader from 'components/Loader';

import { useDispatch } from 'react-redux';
import { setContractDetailsSelected } from 'pages/employee/actions/employee';
import contractApi from 'api/contractApi';

const Wrapper = styled.div`
  position: relative;
  & .tree {
    position: relative;
    &__node {
      &:first-child {
        & .body__dot {
          background: #3674FD;
        }
        & .body__content {
          .label {
            color: #3674FD;
          }
        }
      }
      & .line {
        width: 1px;
        height: 100%;
        position: absolute;
        top: 12px;
        left: 5px;
        background: #d8d8d8;
      }
      & .body {
        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: start;
        -webkit-align-items: flex-start;
        -moz-box-align: start;
        -ms-flex-align: start;
        align-items: flex-start;
        -webkit-flex-wrap: nowrap;
        -ms-flex-wrap: nowrap;
        flex-wrap: nowrap;
        color: rgba(0,0,0,.54);
        font-size: 14px;
        line-height: 32px;
        &__dot {
          width: 11px;
          height: 11px;
          margin: 11px 8px 0 0;
          -webkit-flex-shrink: 0;
          -ms-flex-negative: 0;
          flex-shrink: 0;
          z-index: 1;
          border-radius: 50%;
          background: #d8d8d8;
        }
        &__content {
          & .time__prev {}
          & .time__prev:after {
            margin-left: 8px;
            margin-right: 10px;
            content: "\\eb43";
            font-family: 'boxicons' !important;
            transition: transform .2s;
          }
          & .time__next {}
          & .label {
            cursor: pointer;
            margin-left: 15px;
            font-weight: 600;
          }
        }
      }
    }
  }
`;

const Contract = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { id } = useParams();

  const node = useMemo(() => {
    return (
      <div className="tree">
        {(data || []).map((o, i) => (
          <div className="tree__node" key={`node_${i}`}>
            <div className="line"></div>
            <div className="body">
              <div className="body__dot"></div>
              <div className="body__content">
                <span className="time__prev">{(o?.ngayHieuLuc ?? '') !== '' ? dayJS(o.ngayHieuLuc).format('DD/MM/YYYY') : '-'}</span>
                <span className="time__next">{(o?.ngayKetThuc ?? '') !== '' ? dayJS(o.ngayKetThuc).format('DD/MM/YYYY') : '-'}</span>
                <span className="label" onClick={() => dispatch(setContractDetailsSelected(o))}>{o?.soHopDong ?? ''}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }, [data]);

  const fetch = async (id) => {
    try {
      setLoading(true);
      const { success, data } = await contractApi.getHistoryOfEmployee(id);
      if (success) {
        setData(data);
      }
    } catch (error) { } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (id) { fetch(id) } }, [id]);

  return (
    <Wrapper>
      <Loader inverted active={loading} />
      {node}
    </Wrapper>
  )
};

export default Contract;