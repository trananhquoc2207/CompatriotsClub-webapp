import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import dayJS from 'dayjs';

import Chart from 'echarts-for-react';
import Loader from 'components/Loader';

import { useDispatch, useSelector } from 'react-redux';
import { getKpiDetail } from 'pages/kpi/actions/kpi';

const Wrapper = styled.div`
  position: relative;
  .header {
    display: flex;
    margin-bottom: 10px;
    &__title {
      align-items: center;
      font-weight: bold;
      font-size: 16px;
    }
    &__description {
      margin-left: auto;
      font-size: 15px;
    }
  }
`;

const KPIChart = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    kpiDetail,
    kpiDetailFilter,
    getKpiDetailLoading,
  } = useSelector((state) => state.kpi);

  const options = useMemo(() => {
    const label = (kpiDetail?.chiTiet ?? []).map((o) => o?.label ?? '');
    const value = (kpiDetail?.chiTiet ?? []).map((o) => o?.value ?? '');
    return {
      grid: { top: 8, right: 8, bottom: 24, left: 36 },
      xAxis: {
        type: 'category',
        data: label
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: value,
        type: 'line',
        smooth: true,
      }]
    }
  }, [kpiDetail]);

  const handleRefresh = async () => {
    const time = kpiDetailFilter?.time;
    const payload = {
      nhanvienID: id,
      ngay: time ? time.split('-').reverse().join('-') : new Date().toISOString().split('T')[0],
      type: kpiDetailFilter?.picker ?? 0,
    }
    dispatch(getKpiDetail(payload));
  }

  useEffect(() => {
    if (id) {
      handleRefresh();
    }
  }, [id, kpiDetailFilter]);

  return (
    <Wrapper>
      <Loader inverted active={getKpiDetailLoading} />
      <div className="wrapper p-3">
        <div className="header">
          <div className="header__title">Biểu đồ hệ số điểm chuyên cần</div>
          <div className="header__description">Điểm: {`${(kpiDetail?.chiTiet ?? []).reduce((a, b) => a + (b?.value), 0)}/${kpiDetail?.maxDiem ?? 0}`}</div>
        </div>
        <div className="body">
          <Chart option={options} />
        </div>
      </div>
    </Wrapper>
  );
};

export default KPIChart;