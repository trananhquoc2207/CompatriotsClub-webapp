/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import styled from 'styled-components';

import DataTable from 'components/data-table';
import { Input, Label } from 'reactstrap';
import ManagerShiftRegisterMealFilter from 'pages/statistic/meal/components/ManagerShiftRegisterMealFilter';
import RiceRegisteredOfEmployeeModal from 'pages/statistic/meal/components/RiceRegisteredOfEmployeeModal';
import RegisterRiceModal from 'pages/statistic/meal/components/RegisterRiceModal';
import UpdateRegisterdRiceModal from 'pages/statistic/meal/components/UpdateRegisterdRiceModal';

import { useDispatch, useSelector } from 'react-redux';
import { getScheduleGroup } from 'pages/ShiftGroup/actions/ShiftGroup';
import { getEmployees } from 'pages/employee/actions/employee';
import { getListEmployeePostByLeader, confirmRegisteredMeal } from 'pages/statistic/meal/actions/meal';

import { TOKEN, EMPLOYEE_POST_BY_LEADER_STATUSES } from 'utils/contants';

const BackWrapper = styled.div`
  position: absolute;
  cursor: pointer;
  top: 2px;
  font-size: 20px;
  z-index: 1000;
`;

const LabelWrapper = styled.span`
  line-height: 1;
  color: ${(props) => props.color};
  font-weight: 600;
  font-size: 13px;
  padding: 0.25em 0.4em;
  border-radius: 0.25rem;
  border: 1px solid ${(props) => props.color};
`;

const ManagerShiftRegisterMeal = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [checkAll, setCheckAll] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [isGroupByScheduleGroup, setIsGroupByScheduleGroup] = useState(false);
  const [selectedScheduleGroup, setSelectedScheduleGroup] = useState(undefined);

  const [showRegisterRiceModal, setShowRegisterRiceModal] = useState(false);
  const [updateRegisterdRiceModal, setUpdateRegisterdRiceModal] = useState(false);
  const [registeredRiceHistoryModal, setRegisteredRiceHistoryModal] = useState(undefined);

  const dispatch = useDispatch();
  const {
    mealStatisticFilter: filter,
    mealStatistic: { data, totalSizes },
    getMealStatisticLoading,
    confirmRegisteredMealLoading,
  } = useSelector((state) => state.mealStatistic);
  const {
    employees: { data: employeeData },
    getEmployeesLoading,
  } = useSelector((state) => state.employee);
  const {
    scheduleGroups,
    getScheduleGroupLoading,
  } = useSelector((state) => state.shiftGroup);

  const profile = localStorage.getItem(TOKEN) ? JSON.parse(localStorage.getItem(TOKEN)) : null;
  const loading = getMealStatisticLoading || getScheduleGroupLoading || getEmployeesLoading || confirmRegisteredMealLoading;

  const getData = useCallback(() => {
    dispatch(getListEmployeePostByLeader({
      pageIndex,
      pageSize,
      dayOfAttendance: moment(filter.Ngay).format('YYYY-MM-DD') ?? moment().format('YYYY-MM-DD'),
      hasAttendance: filter?.hasAttendance ?? true,
      code: filter.code,
      unitId: filter.unitId,
      scheduleGroupId: selectedScheduleGroup?.id,
    }));
  }, [dispatch, filter, selectedScheduleGroup, pageIndex, pageSize]);
  useEffect(getData, [getData]);

  const getEmployeeData = useCallback(() => {
    dispatch(getEmployees({
      attendanceType:
        typeof filter.hasAttendance !== 'undefined'
          ?
            filter?.hasAttendance ? 1 : 0
          : 1,
      fromDate: moment(filter.Ngay).format('YYYY-MM-DD') ?? moment().format('YYYY-MM-DD'),
      toDate: moment(filter.Ngay).format('YYYY-MM-DD') ?? moment().format('YYYY-MM-DD'),
      IDNhomDiCa: selectedScheduleGroup?.id,
      page_number: 1,
      page_size: 2147483647,
    }));
  }, [dispatch, filter, selectedScheduleGroup]);
  useEffect(getEmployeeData, [getEmployeeData]);

  const getScheduleGroupData = useCallback(() => {
    const payload = {
      pageIndex: pageIndex > 0 ? pageIndex - 1 : 0,
      pageSize,
      scheduleGroupLeaderId:
        profile.roleName !== 'ADMIN'
        ? profile?.idNhanVien ?? undefined
        : undefined,
    };

    dispatch(getScheduleGroup(payload));
  }, [isGroupByScheduleGroup]);
  useEffect(getScheduleGroupData, [getScheduleGroupData]);

  const handleCheckedChanged = (r, e) => {
    // eslint-disable-next-line no-underscore-dangle
    const _selectedEmployees = _.cloneDeep(selectedEmployees);
    if (e.target.checked) {
      _selectedEmployees.push(r?.id);
    } else {
      const indexRemove = _selectedEmployees.findIndex((item) => item === r?.id);
      delete _selectedEmployees[indexRemove];
    }
    const updatedEmployees = _selectedEmployees.filter((item) => item !== undefined);
    setSelectedEmployees(updatedEmployees);
  };

  const handleCheckAll = () => {
    if (!checkAll) {
      const confirmedEmployees = data.filter((d) => d.trangThai === 1);
      setSelectedEmployees((employeeData || []).filter((e) => !confirmedEmployees.includes(e.id)).map((e) => e.id));
    } else {
      setSelectedEmployees([]);
    }
    setCheckAll(!checkAll);
  };

  const onRefresh = () => {
    setShowRegisterRiceModal(false);
    setUpdateRegisterdRiceModal(false);
    setSelectedEmployees([]);
    getData();
  };

  const renderServingType = (r) => {
    if (r?.comChay) {
      return (
        <LabelWrapper color="#6bbc46">Cơm chay</LabelWrapper>
      );
    }
    if (r?.comMan) {
      return (
        <LabelWrapper color="#c8902b">Cơm mặn</LabelWrapper>
      );
    }
    return '-';
  };

  const columns = [
    {
      name: 'idNhanVien',
      align: 'center',
      label: () => (
        <div className="custom-control custom-checkbox">
          <Input checked={checkAll} type="checkbox" className="custom-control-input" id="checkbox_all" onChange={() => handleCheckAll()} />
          <Label className="custom-control-label" htmlFor="checkbox_all">&nbsp;</Label>
        </div>
      ),
      render: (r) => (
        <div className={classNames('custom-control custom-checkbox', { 'd-none': r.trangThai === 1 })}>
          <Input checked={!!selectedEmployees.includes(r.id)} type="checkbox" className="custom-control-input" id={`checkbox_${r?.id}`} onChange={(e) => handleCheckedChanged(r, e)} />
          <Label className="custom-control-label" htmlFor={`checkbox_${r?.id}`}>&nbsp;</Label>
        </div>
        ),
    },
    {
      name: 'maNV',
      align: 'left',
      label: 'Mã nhân viên',
      render: (r) => r?.maNV ?? '',
    },
    {
      name: 'tenNV',
      align: 'left',
      label: 'Họ tên',
      render: (r) => r?.tenNV ?? '',
    },
    {
      name: 'ca1',
      label: 'Ca ngày',
      align: 'center',
      render: (r) => renderServingType(r?.ca1),
    },
    {
      name: 'tCa1',
      label: 'Tăng ca ngày',
      align: 'center',
      render: (r) => renderServingType(r?.tCa1),
    },
    {
      name: 'ca3',
      label: 'Ca đêm',
      align: 'center',
      render: (r) => renderServingType(r?.ca3),
    },
    {
      name: 'tCa2',
      label: 'Tăng ca đêm',
      align: 'center',
      render: (r) => renderServingType(r?.tCa2),
    },
    {
      name: 'trangThai',
      label: 'Trạng thái',
      align: 'center',
      render: (r) => (
        <LabelWrapper color={EMPLOYEE_POST_BY_LEADER_STATUSES[r?.trangThai ?? 0]?.color}>{EMPLOYEE_POST_BY_LEADER_STATUSES[r?.trangThai ?? 0]?.label}</LabelWrapper>
      ),
    },
  ];

  const scheduleGroupColumns = [
    {
      name: 'index',
      label: '#',
      align: 'center',
      style: {
        width: '20px',
      },
    },
    {
      name: 'code',
      align: 'left',
      label: 'Mã nhóm',
    },
    {
      name: 'name',
      align: 'left',
      label: 'Tên nhóm',
    },
    {
      name: 'leader',
      align: 'left',
      label: 'Nhân viên quản lý',
      render: (r) => (`${r?.leader?.code} - ${r?.leader?.name}`) ?? '-',
    },
    {
      name: 'employeeIds',
      align: 'center',
      label: 'Số lượng nhân viên',
      render: (r) => (r.employeeIds.length) ?? '-',
    },
  ];

  useEffect(() => {
    if (!isGroupByScheduleGroup) {
      setSelectedScheduleGroup(undefined);
    }
  }, [isGroupByScheduleGroup]);

  return (
    <div className="page-content">
      <ManagerShiftRegisterMealFilter setIsGroupByScheduleGroup={setIsGroupByScheduleGroup} />
      {!isGroupByScheduleGroup || selectedScheduleGroup
        ? (
          <DataTable
            style={{ maxHeight: '100px' }}
            loading={loading}
            title={
              selectedScheduleGroup?.id
              ? (
                <>
                  <BackWrapper>
                    <i
                      className="bx bx-arrow-back"
                      onClick={() => {
                        setSelectedScheduleGroup(undefined);
                      }}
                    />
                  </BackWrapper>
                  <div style={{ marginLeft: '28px' }}>{`Nhóm đi ca ${selectedScheduleGroup.name}`}</div>
                </>
              )
              : 'Đăng ký cơm'
            }
            columns={columns}
            data={
              (data || [])
                .map((o, i) => ({ ...o, index: (i + 1) + ((pageIndex) * pageSize) }))
            }
            totalRows={totalSizes}
            onPageChange={(index, size) => {
              if (index !== pageIndex + 1) {
                setPageIndex(index - 1);
              }
              if (size !== pageSize) {
                if (size === 10) {
                  setPageSize(size);
                } else {
                  setPageIndex(0);
                  setPageSize(size);
                }
              }
            }}
            rowActions={[
              {
                name: 'detail',
                label: 'Chi tiết',
                color: 'info',
                icon: 'detail',
                action: (r) => setRegisteredRiceHistoryModal(r),
              },
            ]}
            tableActions={[
              {
                name: 'showRegisterRice',
                label: 'Đăng ký cơm',
                color: 'success',
                icon: 'check',
                action: () => setShowRegisterRiceModal(true),
                hidden: (selectedEmployees || []).length === 0,
              },
              {
                name: 'updateRegisterRice',
                label: 'Đổi phần cơm',
                color: 'warning',
                icon: 'pencil',
                action: () => setUpdateRegisterdRiceModal(true),
                hidden: (selectedEmployees || []).length === 0,
              },
              {
                name: 'confirmRegisteredMeal',
                label: 'Xác nhận',
                color: 'success',
                icon: 'check',
                text: 'Xác nhận',
                action: async () => {
                  await dispatch(confirmRegisteredMeal());
                  getData();
                },
              },
            ]}
          />
        )
        : (
          <>
            <DataTable
              loading={loading}
              title="Nhóm đi ca"
              columns={scheduleGroupColumns}
              data={
                (scheduleGroups.data || [])
                  .map((o, i) => ({ ...o, index: (i + 1) + ((pageIndex > 0 ? pageIndex - 1 : 0) * pageSize) }))
              }
              totalRows={scheduleGroups?.totalCounts}
              onPageChange={(index, size) => {
                setPageIndex(index);
                if (size !== pageSize) {
                  if (size === 10) {
                    setPageSize(size);
                  } else {
                    setPageIndex(0);
                    setPageSize(size);
                  }
                }
              }}
              rowActions={[
                {
                  name: 'detail',
                  label: 'Chi tiết',
                  icon: 'detail',
                  color: 'info',
                  action: (d) => {
                    setPageIndex(0);
                    setSelectedScheduleGroup(d);
                  },
                },
              ]}
            />
          </>
        )
      }

      <RiceRegisteredOfEmployeeModal
        data={registeredRiceHistoryModal}
        onClose={() => setRegisteredRiceHistoryModal(false)}
        onRefresh={onRefresh}
      />

      <RegisterRiceModal
        open={showRegisterRiceModal}
        selectedEmployees={selectedEmployees}
        onClose={() => onRefresh()}
      />

      <UpdateRegisterdRiceModal
        open={updateRegisterdRiceModal}
        selectedEmployees={selectedEmployees}
        onClose={() => onRefresh()}
      />
    </div>
  );
};

export default ManagerShiftRegisterMeal;
