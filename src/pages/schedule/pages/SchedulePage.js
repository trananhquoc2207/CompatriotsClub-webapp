/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { Badge } from 'reactstrap';
import DataTable from 'components/data-table';
import ScheduleTable from 'pages/schedule/components/table/';
import ScheduleFilter from 'pages/schedule/components/ScheduleFilter';
import EmployeeModal from 'pages/schedule/components/EmployeeModal';
import CellDetailModal from 'pages/schedule/components/CellDetailModal';
import UpdateModal from 'pages/schedule/components/UpdateModal';
import ScheduleGroupModal from 'pages/schedule/components/ScheduleGroupModal';

import { useDispatch, useSelector } from 'react-redux';
import { getScheduleGroup } from 'pages/ShiftGroup/actions/ShiftGroup';
import { notify } from 'utils/helpers';
import { TOKEN } from 'utils/contants';
import scheduleApi from 'api/scheduleApi';

const StyledCell = styled.div`
  position: relative;
  cursor: pointer;
  & .badge {
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.color};
    font-weight: 500;
    font-size: 15px;
    margin-top: 8px;
    margin-bottom: 10px;
    padding: 8px;
  }
  .badge-icon{
    display:none;
    position: absolute;
    background-color: white;
    border: 1px solid #faad14;
    font-size: 13px;
    margin-top: 6px;
    padding: 3px;
    right: -5px;
  }
  :hover {
     .badge-icon {
      display: inline-block;
    }
  .badge-icon:active {
    background-color: #f4ac31;
  }  
  :active {
    .badge-icon {
      display: inline-block;
    }
       
  }
`;

const BackWrapper = styled.div`
  position: absolute;
  cursor: pointer;
  top: 2px;
  font-size: 20px;
  z-index: 1000;
`;

const getContrast = (hexcolor) => {
  hexcolor = hexcolor.replace('#', '');
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
};

const defaultTime = new Date();
const profile = localStorage.getItem(TOKEN) ? JSON.parse(localStorage.getItem(TOKEN)) : null;
const EmployeesPage = () => {
  const {
    scheduleGroups,
    getScheduleGroupLoading,
  } = useSelector((state) => state.shiftGroup);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [typeShiftRender, setTypeShiftRender] = useState(false);
  const [selectedScheduleGroup, setSelectedScheduleGroup] = useState(undefined);
  const [employeeTable, setEmployeeTable] = useState(false);
  const [modalDetail, setModalDetail] = useState(undefined);
  const [modalEmployee, setModalEmployee] = useState(undefined);
  const [modalScheduleGroup, setModalScheduleGroup] = useState(undefined);
  const [modalUpdate, setModalUpdate] = useState(undefined);

  const [schedule, setSchedule] = useState([]);
  const [dateOfMonth, setDateOfMonth] = useState([undefined]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(1);

  const [filter, setFilter] = useState({
    TuNgay: moment(new Date(defaultTime.getFullYear(), defaultTime.getMonth(), 1)).format('YYYY-MM-DD'),
    DenNgay: moment(new Date(defaultTime.getFullYear(), defaultTime.getMonth() + 1, 0)).format('YYYY-MM-DD'),
  });

  const calculateDateOfMonth = (d, m, y) => {
    const lastDateOfMonth = new Date(y, m + 1, 0).getDate();
    const present = new Date().getMonth() !== new Date(filter.TuNgay).getMonth() ? lastDateOfMonth : new Date();
    const dateOfMonth = [];
    // for (let i = 1; i < (d + 7); i++) {
    //   if (i <= lastDateOfMonth) {
    //     dateOfMonth.push(`${i}/${m + 1}`);
    //   }
    //   else {
    //     if (m + 2 < 13)
    //       dateOfMonth.push(`${i - lastDateOfMonth}/${m + 2}`);
    //     else {
    //       dateOfMonth.push(`${i - lastDateOfMonth}/1`);
    //     }
    //   }
    // }
    for (let i = 1; i <= lastDateOfMonth; i++) {
      dateOfMonth.push(i);
    }
    return dateOfMonth;
  };

  const CreateColums = (data) => data.map((item, idx) => ({
    name: 'shift',
    align: 'center',
    label: item,
    render: (r) => (
      <StyledCell key={idx} className="cell mt-2" theme={{ bgColor: r.shift[idx]?.mauCa || '#c8e5ff', color: getContrast(r.shift[idx]?.mauCa || '#c8e5ff') }}>
        {
          typeShiftRender
            ?
              <>
                <Badge className="badge mr-2">{r.shift[idx]?.gioVaoCa?.slice(0, 5) ?? '--:--'}</Badge>
                <Badge className="badge">{r.shift[idx]?.gioRaCa?.slice(0, 5) ?? '--:--'}</Badge>
              </>
            :
              <Badge className="badge mr-2">{r.shift[idx]?.maCa ?? ''}</Badge>
        }
      </StyledCell>
    ),
  }));

  const columnsDate = useMemo(() => CreateColums(dateOfMonth), [dateOfMonth, typeShiftRender]);

  const columns = useMemo(() => (
    [
      {
        name: 'index',
        label: '#',
        align: 'center',
        render: (r) => (
          <div className="mt-3">
            {r.index}
          </div>
        ),
      },

      {
        name: 'tenNV',
        align: 'left',
        label: 'Nhân viên',
        style: { position: 'sticky', left: '0', zIndex: '2', backgroundColor: '#FFFCE1' },
        render: (r) => (
          <div className="mt-2">
            <div>{r.employee?.maNV ?? ''}</div>
            <div>{r.employee?.tenNV ?? ''}</div>
          </div>
        ),
      },
      {
        name: 'tenChucVu',
        align: 'left',
        label: 'Chức vụ - Đơn vị',
        render: (r) => (
          <div className="mt-2">
            <div>{r.employee?.chucVu?.tenChucVu ?? ''}</div>
            <div>{r.employee?.donVi?.tenDonVi ?? ''}</div>
          </div>
        ),
      },
    ].concat(columnsDate)
  ), [dateOfMonth, schedule, typeShiftRender]);

  const columnForScheduleGroup = [
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

  const handleCellData = (shift, employee) => {
    if (shift && employee) {
      setModalUpdate({ employee, shift });
    }
  };

  const getSchedules = useCallback(async (p) => {
    try {
      const { success, meta, data } = await scheduleApi.get(p);
      if (success) {
        const schedules = data.map((s) => ({
            employee: s?.nhanVien ?? {},
            shift: s.lichLamViec,
          }));
        setSchedule(schedules);
        setTotalRows(meta?.total ?? 1);
      }
    } catch (error) {
      notify('danger', error?.response?.error_message ?? error?.message ?? 'Lỗi không thể xác định.');
    }
  }, [scheduleApi]);

  const getScheduleGroups = useCallback(() => {
    dispatch(getScheduleGroup({
      pageIndex: pageIndex - 1,
      pageSize,
      ...filter,
    }));
  }, [dispatch, getScheduleGroup, pageIndex, pageSize]);
  useEffect(getScheduleGroups, [getScheduleGroups]);

  const handleRefresh = async () => {
    setLoading(true);
    const payload = {
      page_number: pageIndex,
      page_size: pageSize,
      maNV: filter.maNV,
      TuNgay: filter.TuNgay,
      DenNgay: filter.DenNgay,
      DonViId: filter.donViId,
      NhomDiCaId: selectedScheduleGroup?.id,
      HasNull: true,
    };
    await getSchedules(payload);
    setLoading(false);
  };

  useEffect(() => {
    if (employeeTable && !selectedScheduleGroup) {
      return;
    }

    handleRefresh();
    setDateOfMonth(calculateDateOfMonth(new Date(filter?.TuNgay).getDate(), new Date(filter?.TuNgay).getMonth(), new Date(filter?.TuNgay).getFullYear()));
  }, [filter, pageIndex, pageSize, employeeTable, selectedScheduleGroup]);

  useEffect(() => {
    if (!employeeTable) {
      getScheduleGroups();
      setSelectedScheduleGroup(undefined);
    }
  }, [employeeTable]);

  return (
    <>
      <div className="page-content">
        <ScheduleFilter
          onChange={(f) => setFilter(f)}
          setIsGroupByScheduleGroup={(value) => {
            setPageIndex(1);
            setPageSize(10);
            setEmployeeTable(value);
          }}
          setShowShiftByTime={setTypeShiftRender}
        />
        {
          !employeeTable || selectedScheduleGroup
            ?
              <ScheduleTable
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
                  : `Lịch làm việc tháng ${new Date(filter?.TuNgay).getMonth() + 1 ?? ''}`
                }
                columns={columns}
                data={(schedule || [])
                .map((o, i) => ({ ...o, index: (i + 1) + ((pageIndex - 1) * pageSize) }))}
                totalRows={totalRows}
                onClickCell={profile?.isLeaderOfScheduleGroup ? null : handleCellData}
                onPageChange={(index, size) => {
                  if (index !== pageIndex) {
                    setPageIndex(index);
                  }
                  if (size !== pageSize) {
                    setPageSize(size);
                  }
                }}
                tableActions={
                  !profile?.isLeaderOfScheduleGroup
                  ?
                    [
                      {
                        name: 'detail',
                        label: 'Tạo lịch',
                        color: 'success',
                        icon: 'plus',
                        text: 'Tạo lịch cho nhân viên',
                        action: () => { setModalEmployee(true); },
                      },
                      {
                        name: 'detail',
                        label: 'Tạo lịch',
                        color: 'success',
                        icon: 'plus',
                        text: 'Tạo lịch cho nhóm đi ca',
                        action: () => { setModalScheduleGroup(true); },
                      },
                    ]
                  : []
                }
              />
            :
              <DataTable
                loading={getScheduleGroupLoading}
                title="Nhóm đi ca"
                columns={columnForScheduleGroup}
                data={
                  (scheduleGroups.data || [])
                    .map((o, i) => ({ ...o, index: (i + 1) + ((pageIndex - 1) * pageSize) }))
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
                      setSelectedScheduleGroup(d);
                      setPageIndex(1);
                    },
                  },
                ]}
                tableActions={[
                  {
                    name: 'detail',
                    label: 'Tạo lịch cho nhóm đi ca',
                    color: 'success',
                    icon: 'plus',
                    text: 'Tạo lịch cho nhóm đi ca',
                    action: () => { setModalScheduleGroup(true); },
                  },
                ]}
              />
        }
      </div>
      <CellDetailModal
        data={modalDetail}
        onRefresh={handleRefresh}
        onClose={() => setModalDetail(undefined)}
      />
      <UpdateModal
        data={modalUpdate}
        onRefresh={handleRefresh}
        onClose={() => setModalUpdate(undefined)}
      />
      <EmployeeModal
        unit={filter}
        open={modalEmployee}
        onRefresh={handleRefresh}
        onClose={() => setModalEmployee(false)}
      />
      <ScheduleGroupModal
        unit={filter}
        open={modalScheduleGroup}
        onRefresh={handleRefresh}
        onClose={() => setModalScheduleGroup(false)}
      />

    </>
  );
};

export default EmployeesPage;
