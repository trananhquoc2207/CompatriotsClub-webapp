import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import {
  Row, Col,
  FormGroup, Label,
} from 'reactstrap';
import Select from 'components/Select';
import SearchBar from 'components/SearchBar';
import { RangeDatePicker } from 'components/date-picker';

import { useDispatch, useSelector } from 'react-redux';
import {
  getLevelOneByUnit,
  getLevelTwoByUnit,
  getLevelThreeByUnit,
} from 'pages/unit/actions/unit';
import { setOverBodyTemperatureFilter } from 'pages/statistic/temperature/actions/statistic';

const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
  }
`;

const AttendanceFilter = () => {
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
    dispatch(setOverBodyTemperatureFilter(payload));
  };

  const loading = getLevelOneByUnitLoading || getLevelTwoByUnitLoading || getLevelThreeByUnitLoading;

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
    <>
      <SearchBarWrapper>
        <SearchBar text="Nhập mã nhân viên để tìm kiếm" onChange={(k) => onChange({ Keyword: k })}>
          <Row>
            <Col xs="4">
              <FormGroup>
                <Label>Thời gian</Label>
                <RangeDatePicker
                  onChange={(range) => {
                    if (range?.from && range?.to) {
                      onChange({
                        FromDate: moment(range.from).format('YYYY-MM-DD'),
                        ToDate: moment(range.to).format('YYYY-MM-DD'),
                      });
                    }
                  }}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Khối</Label>
                <Select
                  isClearable
                  isLoading={loading}
                  placeholder=""
                  value={(levelOneByUnitList || []).reduce((object, option) => {
                    if (filter?.UnitId && option.id === filter.UnitId) {
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
                  onChange={(o) => onChange({ UnitId: o?.value ?? undefined })}
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
                    if (filter?.UnitId && option.id === filter.UnitId) {
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
                  onChange={(o) => onChange({ UnitId: o?.value ?? undefined })}
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
                    if (filter?.UnitId && option.id === filter.UnitId) {
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
                  onChange={(o) => onChange({ UnitId: o?.value ?? undefined })}
                />
              </FormGroup>
            </Col>
          </Row>
        </SearchBar>
      </SearchBarWrapper>
    </>
  );
};

export default AttendanceFilter;
