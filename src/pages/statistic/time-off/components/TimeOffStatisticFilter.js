import React, { useEffect, useState, forwardRef } from 'react';
import styled from 'styled-components';

import {
  Row, Col,
  FormGroup, Label, Input,
} from 'reactstrap';
import Select from 'components/Select';
import SearchBar from 'components/SearchBar';
import { MonthPicker } from 'components/date-picker';

import { useDispatch, useSelector } from 'react-redux';
import {
  getLevelOneByUnit,
  getLevelTwoByUnit,
  getLevelThreeByUnit,
  getLevelFourByUnit,
} from 'pages/unit/actions/unit';
import { setAbsentStatisticFilter } from '../actions/TimeOff';

const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
  }
`;

const TimeOffStatisticFilter = () => {
  const [filter, setFilter] = useState({});

  const dispatch = useDispatch();
  const {
    levelOneByUnit: { data: levelOneByUnitList },
    levelTwoByUnit: { data: levelTwoByUnitList },
    levelThreeByUnit: { data: levelThreeByUnitList },
    levelFourByUnit: { data: levelFourByUnitList },
    getLevelOneByUnitLoading,
    getLevelTwoByUnitLoading,
    getLevelThreeByUnitLoading,
    getLevelFourByUnitLoading,
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
    dispatch(setAbsentStatisticFilter(payload));
  };

  const loading = getLevelOneByUnitLoading || getLevelTwoByUnitLoading || getLevelThreeByUnitLoading || getLevelFourByUnitLoading;

  const MonthPickerInput = forwardRef((props) => {
    const {
      value,
      ...rest
    } = props;
    const render = (d) => {
      const date = d !== '' ? new Date(d) : new Date();
      return `Tháng ${date.getMonth() + 1} - ${date.getFullYear()}`;
    };

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Input value={render(value)} {...rest} />
    );
  });

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
    if (levelFourByUnitList.length === 0) {
      dispatch(getLevelFourByUnit());
    }
  }, []);

  return (
    <>
      <SearchBarWrapper>
        <SearchBar onChange={(k) => onChange({ employeeCode: k })}>
          <Row>
            <Col xs={6}>
              <FormGroup>
                <Label>Thời gian</Label>
                <MonthPicker
                  initial
                  range
                  format
                  customInput={<MonthPickerInput />}
                  onChange={(f, t) => onChange({
                    fromDate: f.split('/').reverse().join('-'),
                    toDate: t.split('/').reverse().join('-'),
                  })}
                />
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup>
                <Label>Khối</Label>
                <Select
                  isClearable
                  isLoading={loading}
                  placeholder=""
                  value={(levelOneByUnitList || []).reduce((object, option) => {
                    if (filter?.idDonVi && option.id === filter.idDonVi) {
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
                    if (filter?.idDonVi && option.id === filter.idDonVi) {
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
                    if (filter?.idDonVi && option.id === filter.idDonVi) {
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
            <Col>
              <FormGroup>
                <Label>Nhóm</Label>
                <Select
                  isClearable
                  isLoading={loading}
                  placeholder=""
                  value={(levelFourByUnitList || []).reduce((object, option) => {
                    if (filter?.idDonVi && option.id === filter.idDonVi) {
                      return {
                        key: option.id,
                        value: option.id,
                        label: option.tenDonVi,
                      };
                    }
                    return object;
                  }, null)}
                  options={(levelFourByUnitList || []).map((o) => ({
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
    </>
  );
};

export default TimeOffStatisticFilter;
