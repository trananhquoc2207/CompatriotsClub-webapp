import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  Row, Col,
  FormGroup, Label,
} from 'reactstrap';
import Select from 'components/Select';
import SearchBar from 'components/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import {
  getLevelOneByUnit,
  getLevelTwoByUnit,
  getLevelThreeByUnit,
} from 'pages/unit/actions/unit';
import { setKpiFilter } from 'pages/kpi/actions/kpi';

const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
  }
`;

const KPIFilter = () => {
  const [filter, setFilter] = useState({});

  const dispatch = useDispatch();
  const {
    levelOneByUnit: { data: levelOneByUnitList },
    levelTwoByUnit: { data: levelTwoByUnitList },
    levelThreeByUnit: { data: levelThreeByUnitList },
    getLevelOneByUnitLoading,
    getLevelTwoByUnitLoading,
    getLevelThreeByUnitLoading,
  } = useSelector((state) => state.unit);

  const loading = getLevelOneByUnitLoading || getLevelTwoByUnitLoading || getLevelThreeByUnitLoading;

  const onChange = (object) => {
    const merge = { ...filter, ...object };
    const payload =
      Object
        .keys(merge)
        .reduce((result, key) => {
          if (merge[key]) {
            // eslint-disable-next-line no-param-reassign
            result[key] = merge[key];
          }
          return result;
        }, {});
    setFilter(payload);
    dispatch(setKpiFilter(payload));
  };

  useEffect(() => {
    if (levelOneByUnitList.length === 0) {
      dispatch(getLevelOneByUnit());
    }
    if (levelTwoByUnitList.length === 0) {
      dispatch(getLevelTwoByUnit());
    }
    if (levelThreeByUnitList.length === 0) {
      dispatch(getLevelThreeByUnit());
    }
  }, []);

  return (
    <SearchBarWrapper>
      <SearchBar text='Nhập mã nhân viên để tìm kiếm' onChange={(k) => onChange({ q: k })}>
        <Row>
          <Col>
            <FormGroup>
              <Label>Khối</Label>
              <Select
                isClearable
                isLoading={loading}
                placeholder=""
                value={(levelOneByUnitList || []).reduce((object, option) => {
                  // eslint-disable-next-line eqeqeq
                  if (filter?.idDonVi && option.id == filter.idDonVi) {
                    return {
                      key: option.id,
                      value: option.id,
                      label: option.tenDonVi,
                    };
                  }
                  return object;
                }, null)}
                options={(levelOneByUnitList || []).map((o) => ({
                  key: o.id,
                  value: o.id,
                  label: o.tenDonVi,
                }))}
                onChange={(o) => onChange({ idDonVi: o?.value ?? undefined })}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Phòng</Label>
              <Select
                isClearable
                isLoading={loading}
                placeholder=""
                value={(levelTwoByUnitList || []).reduce((object, option) => {
                  // eslint-disable-next-line eqeqeq
                  if (filter?.idDonVi && option.id == filter.idDonVi) {
                    return {
                      key: option.id,
                      value: option.id,
                      label: option.tenDonVi,
                    };
                  }
                  return object;
                }, null)}
                options={(levelTwoByUnitList || []).map((o) => ({
                  key: o.id,
                  value: o.id,
                  label: o.tenDonVi,
                }))}
                onChange={(o) => onChange({ idDonVi: o?.value ?? undefined })}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Bộ phận</Label>
              <Select
                isClearable
                isLoading={loading}
                placeholder=""
                value={(levelThreeByUnitList || []).reduce((object, option) => {
                  // eslint-disable-next-line eqeqeq
                  if (filter?.idDonVi && option.id == filter.idDonVi) {
                    return {
                      key: option.id,
                      value: option.id,
                      label: option.tenDonVi,
                    };
                  }
                  return object;
                }, null)}
                options={(levelThreeByUnitList || []).map((o) => ({
                  key: o.id,
                  value: o.id,
                  label: o.tenDonVi,
                }))}
                onChange={(o) => onChange({ idDonVi: o?.value ?? undefined })}
              />
            </FormGroup>
          </Col>
        </Row>
      </SearchBar>
    </SearchBarWrapper>
  );
};

export default KPIFilter;
