import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import styled from 'styled-components';

import {
  Row, Col,
  Form, FormGroup, Label, Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import AsyncSelect from 'react-select/async';
import { RangeDatePicker } from 'components/date-picker';

import { useAuth } from 'hooks';
import { useDispatch } from 'react-redux';
import { getEmployees } from 'pages/employee/actions/employee';
import { getScheduleGroups } from 'pages/schedule-group/actions/schedule-group';

import apiLinks from 'utils/api-links';
import httpClient from 'utils/http-client';

const StyledModal = styled(Modal)`
  .modal-title {
    font-weight: 700;
    font-size: 1.5em;
  }
`;

const SyncAttendanceStatisticModal = ({ open, onClose, onRefresh }) => {
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedScheduleGroups, setSelectedScheduleGroups] = useState([]);

  const dispatch = useDispatch();
  const getScheduleGroupData = useCallback(async (keyword) => {
    const result = await dispatch(getScheduleGroups({ keyword }));
    return (result || []).map((d) => ({ value: d.id, label: `${d.code} | ${d.name}` }));
  }, []);

  const getEmployeeData = useCallback(async (q) => {
    const result = await dispatch(getEmployees({ q }));
    return (result || []).map((d) => ({ value: d.id, label: `${d.maNV} | ${d.tenNV}` }));
  }, []);

  const refresh = () => {
    setFrom(new Date());
    setTo(new Date());
    setSelectedEmployees([]);
    setSelectedScheduleGroups([]);

    onClose();
    onRefresh();
  };

  const handleSubmit = useCallback(async () => {
    await httpClient.callApi({
      method: 'POST',
      url: apiLinks.tools.syncAttendance,
      data: {
        employeeIds:
          selectedEmployees.map((e) => e.value),
        leaderIds: [],
        scheduleGroupIds:
          selectedScheduleGroups.map((s) => s.value),
        fromDate: moment(from).format('YYYY-MM-DD'),
        toDate: moment(to).format('YYYY-MM-DD'),
        isForcedCalculating: true,
      },
    });

    refresh();
  }, [selectedEmployees, selectedScheduleGroups]);

  return (
    <StyledModal size="md" isOpen={open}>
      <Form>
        <ModalHeader toggle={onClose}>
          Đồng bộ
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label>Thời gian</Label>
                <RangeDatePicker
                  onChange={({ from: f, to: t }) => {
                    if (t && t) {
                      setFrom(f);
                      setTo(t);
                    }
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label>Nhân viên</Label>
                <AsyncSelect
                  value={selectedEmployees}
                  isMulti
                  cacheOptions
                  defaultOptions
                  loadOptions={getEmployeeData}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  placeholder="Chọn nhân viên"
                  onChange={(value) => {
                    setSelectedEmployees(value);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <Label>Nhóm đi ca</Label>
                <AsyncSelect
                  value={selectedScheduleGroups}
                  isMulti
                  cacheOptions
                  defaultOptions
                  closeMenuOnSelect={false}
                  loadOptions={getScheduleGroupData}
                  loadingMessage={() => 'Đang lấy dữ liệu...'}
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  placeholder="Chọn nhóm đi ca"
                  onChange={(value) => {
                    setSelectedScheduleGroups(value);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => handleSubmit()}>Xác nhận</Button>
        </ModalFooter>
      </Form>
    </StyledModal>
  );
};

export default SyncAttendanceStatisticModal;
