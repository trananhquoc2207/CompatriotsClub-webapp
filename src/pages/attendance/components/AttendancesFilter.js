import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import {
  Row, Col,
  FormGroup, Label, Input,
} from 'reactstrap';
import Select from 'components/Select';
import SearchBar from 'components/SearchBar';
import { RangeDatePicker } from 'components/date-picker';

import { useDispatch, useSelector } from 'react-redux';
import {
  getLevelOneByUnit,
  getLevelTwoByUnit,
  getLevelThreeByUnit,
  getLevelFourByUnit,
} from 'pages/unit/actions/unit';
import { setAttendanceDetailFilter, setAttendanceFilter } from 'pages/attendance/actions/attendance';

const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
  }
`;

const AttendaceStatus = {
  '': 'Tất cả',
  0: 'Không chấm công',
  1: 'Có chấm công',
  2: 'Chấm công đủ',
  3: 'Chấm công thiếu',
};
const shiftType = {
  '': 'Tất cả',
  0: 'Ca ngày',
  1: 'Ca đêm',
  2: 'Tăng ca ngày',
  3: 'Tăng ca đêm',
};

const AttendanceFilter = ({ setIsGroupByScheduleGroup }) => {
  const [filter, setFilter] = useState({
    TuNgay: moment().startOf('month').toDate(),
    DenNgay: moment().toDate(),
  });

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
    dispatch(setAttendanceFilter(payload));
    dispatch(setAttendanceDetailFilter({ TuNgay: payload.TuNgay, DenNgay: payload.DenNgay }));
  };

  const loading =
    getLevelOneByUnitLoading ||
    getLevelTwoByUnitLoading ||
    getLevelThreeByUnitLoading ||
    getLevelFourByUnitLoading;

  useEffect(() => {
    onChange({
      TuNgay: moment(filter?.TuNgay).format('YYYY-MM-DDT00:00:00'),
      DenNgay: moment(filter?.DenNgay).format('YYYY-MM-DDT23:59:59'),
    });
  }, []);
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
        <SearchBar text="Nhập mã nhân viên để tìm kiếm" onChange={(k) => onChange({ maNV: k })}>
          <Row>
            <Col xs={4}>
              <FormGroup>
                <Label>Thời gian</Label>
                <RangeDatePicker
                  value={{
                    from: filter?.TuNgay ?? moment().toDate(),
                    to: filter?.DenNgay ?? moment().toDate(),
                  }}
                  onChange={({ from, to }) => {
                  if (from && to) {
                    onChange({
                      TuNgay: moment(from).format('YYYY-MM-DDT00:00:00'),
                      DenNgay: moment(to).format('YYYY-MM-DDT23:59:59'),
                    });
                  }
                }}
                />
              </FormGroup>
            </Col>
            <Col xs={4}>
              <FormGroup>
                <Label>Thống kê theo ca</Label>
                <Select
                  placeholder="Chọn nhóm ca"
                  options={Object.keys(shiftType || {}).map((key) => ({
                    value: key,
                    label: shiftType[key],
                  }))}
                  onChange={(o) => onChange({ shiftType: o?.value ?? undefined })}
                />
              </FormGroup>
            </Col>
            <Col xs={4}>
              <FormGroup>
                <Label>Trạng thái chấm công</Label>
                <Select
                  placeholder="Chọn trạng thái"
                  options={Object.keys(AttendaceStatus || {}).map((key) => ({
                    value: key,
                    label: AttendaceStatus[key],
                  }))}
                  onChange={(o) => onChange({ attendanceType: o?.value ?? undefined })}
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
        <div className="ml-2 mt-2 custom-control custom-checkbox">
          <Input
            type="checkbox"
            id="groupByScheduleGroup"
            className="custom-control-input"
            onChange={(d) => setIsGroupByScheduleGroup(d.target.checked)}
          />
          <Label className="custom-control-label" htmlFor="groupByScheduleGroup">Hiển thị theo nhóm đi ca</Label>
        </div>
      </SearchBarWrapper>
    </>
  );
};

export default AttendanceFilter;
