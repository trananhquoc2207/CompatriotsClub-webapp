/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import classnames from 'classnames';
import moment from 'moment';
import dayJS from 'dayjs';

import { Row, Col } from 'reactstrap';
import Loader from 'components/Loader';
import Tooltip from 'components/Tooltip';
import Accordion from 'components/Accordion';
import AttendanceDetailToolbar from 'pages/attendance/components/AttendanceDetailToolbar';
import UpdateAttendanceModal from 'pages/attendance/components/UpdateAttendanceModal';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectAttendance,
  getAttendanceByEmployee,
  setAttendanceDetailFilter,
} from 'pages/attendance/actions/attendance';
import { getSchedulesOfEmployee } from 'pages/schedule/actions/schedule';
import { getShiftDetail } from 'pages/shift/actions/shift';
import { convertHourToSecond } from 'utils/helpers';

const Wrapper = styled.div`
  & .header {
    display: flex;
    & .back {
      font-size: 20px;
      margin-right: 12px;
      & i {
        cursor: pointer;
        padding: 16px 0;
        line-height: none;
      }
    }
    & .title {
      font-size: 20px;
      font-weight: 700;
    }
    & .description {
      font-style: italic;
      font-size: 14px;
    }
  }
  & .body {
    display: flex;
    flex-direction: row;
    & .sheet {
      width: 74%;
      max-height: 1200px;
      position: relative;
      margin-right: 1%;
      margin-bottom: 10px;
      background-color: #FFF;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 1px 1px 3px -1px #ccc;
      & .table {
        margin: 0;
        padding: 0;
        width: 100%;
        color: rgba(0, 0, 0, 0.87);
        font-size: 1em;
        table-layout: fixed;
        border-collapse: separate;
        border-spacing: 0px;
        & th, td {
          overflow: hidden;
          text-overflow: ellipsis;
          transition: background 0.1s ease, color 0.1s ease;
          border-right: 1px solid rgba(34, 36, 38, 0.1);
          &:last-child {
            border-right: 0;
          }
        }
        & th {
          vertical-align: inherit;
          padding: 0.94444444em 0.77777778em;
          font-weight: bold;
          font-style: none;
          font-size: 16px;
          text-transform: none;
          text-align: center;
          border-top: 0;
          border-bottom: 1px solid rgba(34, 36, 38, 0.1);
        }
        & td {
          position: relative;
          padding: 0;
        }
        & .hover {
          &:hover {
            background-color: #f8f8f9;
          }
        }
        & .selected {
          border: 1px solid black !important;
        }
        & .cursor {
          cursor: pointer;
        }
        & .date {
          position: absolute;
          top: 4px;
          right: 6px;
          font-size: 15px;
          font-weight: 550;
          &-disabled {
            color: #bfc1c5;
          }
        }
        & .shift{
          color: black;
          font-size: 13px;
          font-weight: 500;
          &-code{
            position: absolute;
            top: 3%;
            left: 5%
          }
          &-hour{
            position: absolute;
            top: 15%;
            left: 4%
          }
        }
        & .attendance{
          color: black;
          font-size: 14px;
          font-weight: 500;
          & .update{
            color: red;
          }
        }
        & .status {
          margin-top: 3.5em;
          padding: 1.5em 0.5em;
          text-align: center;
          font-size: 17px;
          font-weight: 700;
          &-warning {
            color: #eda01d;
          }
          &-danger {
            color: #f46a6a;
          }
        }
      }
    } 
    & .detail {
      width: 25%;
      & .header {}
      & .body {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        & .accordion {
          &__header {
            font-size: 15px;
          }
        }
      }
      & .item {
        &__label {
          display: inline-block;
          margin-bottom: 3px;
          font-size: 15px;
          font-weight: 700;
        }
        &__content {
            display: block;
            position: relative;
            font-size: 16px;
            color: #000000;
            & i {
              position: absolute;
              top: 2px;
              left: 70px;
              font-size: 20px;
              font-weight: 600;
            }
            & .from {}
            & .to {
              position: absolute;
              left: 100px;
            }
        }
        & .accordion {
          padding: 0 !important;
          &__header {
            color: #939EA9;
            font-size: 15px;
            font-weight: 400;
            & i {
              display: none;
            }
          }
        }
    }
    & .item:last-child {
        padding: 0;
      }
    }
  }
`;

const days = 'Thứ 2_Thứ 3_Thứ 4_Thứ 5_Thứ 6_Thứ 7_Chủ Nhật'.split('_');

const AttendanceDetailPage = () => {
  const [sheet, setSheet] = useState([]);
  const [attendanceGeneral, setAttendanceGeneral] = useState(undefined);
  const [attendanceDetail, setAttendanceDetail] = useState(undefined);
  const [selectedAttendance, setSelectedAttendance] = useState(undefined);
  const [updateAttendanceModal, setUpdateAttendanceModal] = useState(undefined);

  const { exportLoading } = useSelector((state) => state.global);
  const {
    attendanceDetailFilter: filter,
    attendanceByEmployee,
    getAttendanceByEmployeeLoading,
  } = useSelector((state) => state.attendance);
  const {
    attendanceFilter,
  } = useSelector((state) => state.attendance);
  const {
    schedulesOfEmployee,
    getSchedulesOfEmployeeLoading,
  } = useSelector((state) => state.schedule);
  const {
    getShiftDetailLoading,
  } = useSelector((state) => state.shift);

  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const loading = exportLoading || getAttendanceByEmployeeLoading || getSchedulesOfEmployeeLoading;
  // #region function of date
  const getLeadingDays = (date, startDay = 0) => {
    const result = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const days = (firstWeekday + 7) - (startDay + 7) - 1;
    for (let i = days * -1; i <= 0; i++) result.push(new Date(year, month, i).getDate());
    return result;
  };
  const getMonthDays = (date) => {
    const result = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) result.push(i);
    return result;
  };
  const getTrailingDays = (leadingDays, monthDays) => {
    const result = [];
    const days = 42 - (leadingDays.length + monthDays.length);
    for (let i = 1; i <= days; i++) result.push(i);
    return result;
  };
  // #endregion

  // #region sheet
  const calculateSheet = useCallback(() => {
    if (attendanceByEmployee?.ngayChamCong && schedulesOfEmployee?.lichLamViec) {
      const lastDateOfMonth = new Date(new Date(filter.TuNgay).getFullYear(), new Date(filter.TuNgay).getMonth() + 1, 0);
      const present = new Date().getMonth() !== new Date(filter.TuNgay).getMonth() ? lastDateOfMonth : new Date();
      const unix = present.getTime() / 1000;
      const shift =
        schedulesOfEmployee.lichLamViec
          .reduce((array, shift) => {
            const time = shift?.ngay ? new Date(shift.ngay.split('T')[0]) : undefined;
            if (time) {
              const index = time.getDate() - 1;
              if (!array[index]) {
                array[index] = [];
              }
              array[index].push(shift);
            }
            return array;
          }, []);
      setSheet(
        [...Array(present.getDate()).keys()]
          .reduce((array, index) => {
            if (shift[index]) {
              array[index] =
                (shift[index] || []).reduce((object, shift) => {
                  const day = shift?.ngay.split('T')[0] ?? '';
                  const timeOut = dayJS(`${day}T${shift?.gioRaCa ?? '00:00:00'}`).unix() || 0;
                  const attendance = attendanceByEmployee.ngayChamCong.find((o) => (o?.ngay ?? '').includes(day));
                  object.absent = !attendance && timeOut <= unix;
                  object.raw.push({ shift, attendance });
                  if (!object.absent) {
                    object.workHours += attendance?.soGioLam ?? 0;
                  }
                  return object;
                }, {
                  absent: false,
                  workHours: 0,
                  raw: [],
                });
            }
            return array;
          }, []),
      );
    }
  }, [attendanceByEmployee, schedulesOfEmployee]);
  const sheetNode = useMemo(() => {
    // #region date
    const present = new Date();
    const time = filter?.TuNgay ? new Date(filter.TuNgay) : present;
    const daysPrevMonth = getLeadingDays(time, 1);
    const daysThisMonth = getMonthDays(time);
    const daysNextMonth = getTrailingDays(daysPrevMonth, daysThisMonth);
    const merge = [...daysPrevMonth, ...daysThisMonth, ...daysNextMonth];
    // #endregion
    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              {(days || []).map((day, index) => (
                <th key={`day_${index}`}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5).keys()].map((_, row) => (
              <tr key={`row_${row}`}>
                {[...Array(7)].map((_, col) => {
                    const index = col + row + (row * 6);
                    const attendance = sheet[merge[index] - 1];
                    const daysPrevMonthLength = daysPrevMonth.length;
                    const daysPrevAndThisMonthLength = daysPrevMonth.length + daysThisMonth.length - 1;
                    return (
                      <td
                        key={`col_${col}`}
                        className={classnames({ hover: Boolean(attendance), selected: selectedAttendance ? (merge[index] - 1) === selectedAttendance : '' })}
                        onClick={() => {
                          if (attendance) {
                            setSelectedAttendance(merge[index] - 1);
                          }
                        }}
                      >
                        <div className={classnames('date', { 'date-disabled': index < daysPrevMonthLength || index > daysPrevAndThisMonthLength })}>
                          {merge[index]}
                        </div>
                        <div className={classnames('status', {
                          cursor: Boolean(attendance),
                          'status-danger': attendance?.absent || attendance?.raw[0].attendance === undefined || attendance.raw[0].attendance?.chamCong[0]?.gioRa === '00:00:00' || attendance.raw[0].attendance?.chamCong[0]?.gioVao === '00:00:00',
                        })}
                        >
                          {(index >= daysPrevMonthLength && index <= daysPrevAndThisMonthLength && Boolean(attendance))
                            ? (
                              <>
                                <div className="shift">
                                  <div className="shift-code">
                                    {attendance.raw[0].shift?.maCa ? `Ca ${attendance.raw[0].shift.maCa}` : null}
                                  </div>
                                  <div className="shift-hour">
                                    <span>
                                      (
                                      {attendance.raw[0].shift.gioVaoCa?.slice(0, 5) ?? '-'}
                                    </span>
                                    <i className="bx bx-right-arrow-alt" />
                                    <span>
                                      {attendance.raw[0].shift.gioRaCa?.slice(0, 5) ?? '-'}
                                      )
                                    </span>
                                  </div>
                                </div>
                                <span id={`date_${merge[index]}`}>
                                  {
                                  attendance?.raw[0].attendance === undefined ? 'KP'
                                    : attendance.raw[0].attendance?.chamCong[0]?.gioRa === '00:00:00' || attendance.raw[0].attendance?.chamCong[0]?.gioVao === '00:00:00'
                                      ? 'QT'
                                      : `${attendance?.workHours.toFixed(2) ?? 0} giờ`
                                  }
                                </span>
                                {
                                  attendance?.raw[0].attendance !== undefined && (
                                    <div className="attendance">
                                      <span
                                        className={classnames({
                                          update: Boolean(attendance?.raw[0].attendance.boSung === 1 || attendance?.raw[0].attendance.boSung === 3),
                                        })}
                                      >
                                        (
                                        {attendance.raw[0]?.attendance?.chamCong[0]?.gioVao?.slice(0, 5) ?? '-'}
                                      </span>
                                      <i className="bx bx-right-arrow-alt" />
                                      <span
                                        className={classnames({
                                          update: Boolean(attendance?.raw[0].attendance.boSung === 2 || attendance?.raw[0].attendance.boSung === 3),
                                        })}
                                      >
                                        {attendance.raw[0]?.attendance?.chamCong[0]?.gioRa.slice(0, 5) ?? '-'}
                                        )
                                      </span>
                                    </div>
                                  )
                                }

                                <Tooltip id={`date_${merge[index]}`} message="Xem chi tiết" />
                              </>
                            )
                            : ''
                          }
                          &nbsp;
                        </div>
                      </td>
                    );
                  })}
              </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }, [sheet, selectedAttendance]);
  // #endregion

  // #region detail
  const calculateAttendanceGeneral = useCallback(() => {
    if (attendanceByEmployee?.ngayChamCong) {
      const absents = (sheet || []).reduce((t, d) => t + (d?.absent ? 1 : 0), 0);
      setAttendanceGeneral(
        attendanceByEmployee.ngayChamCong
          .reduce((obj, attendance) => {
            obj.workHours += attendance?.soGioLam ?? 0;
            obj.factor += attendance?.soGioLamHeSo ?? 0;
            return obj;
          }, {
            workHours: 0,
            factor: 0,
            absents,
          }),
      );
    }
  }, [sheet, attendanceByEmployee]);
  const calculateAttendanceDetail = useCallback(async () => {
    const index = selectedAttendance === 0 ? 0 : selectedAttendance || (new Date().getDate() - 1);
    if (sheet[index]) {
      const raw = sheet[index]?.raw ?? [];
      setAttendanceDetail(
        await Promise.all(
          raw.map(async (object) => {
            const { data: shiftDetail } = await dispatch(getShiftDetail({ CaLamViecId: object.idCa }));
            const attendance =
              (object?.attendance?.chamCong ?? [])
                .reduce((array, record) => {
                  const different = Math.abs(convertHourToSecond(array.time.from) - convertHourToSecond(record?.gioVao ?? '00:00:00'));
                  if (different < array.different) {
                    array.different = different;
                    array.temperature = {
                      checkIn: record?.nhietDoVao?.toFixed(1) ?? '-',
                      checkOut: record?.nhietDoRa?.toFixed(1) ?? '-',
                    };
                    array.time = {
                      from: record?.gioVao ?? '00:00:00',
                      to: record?.gioRa ?? '00:00:00',
                    };
                  }
                  return array;
                }, {
                  different: 60 * 60,
                  time: {
                    from: object?.attendance?.chamCong[0]?.gioVao ?? '00:00:00',
                    to: object?.attendance?.chamCong[0]?.gioRa ?? '00:00:00',
                  },
                });
            return {
              employeeId: parseFloat(id),
              shiftData: object?.shift ?? undefined,
              nameShift: object?.shift?.tenCa ?? undefined,
              workHours: object?.attendance?.soGioLam ?? undefined,
              factor: object?.attendance?.soGioLamHeSo ?? undefined,
              assignTime: {
                from: object?.shift?.gioVaoCa ?? undefined,
                to: object?.shift?.gioRaCa ?? undefined,
              },
              temperature: {
                checkIn: attendance?.temperature?.checkIn ?? '-',
                checkOut: attendance?.temperature?.checkOut ?? '-',
              },
              realTime: {
                from: attendance.time.from.includes('00:00:00') ? undefined : attendance.time.from,
                to: attendance.time.to.includes('00:00:00') ? undefined : attendance.time.to,
                detail: {
                  from: !attendance.time.from.includes('00:00:00') ? object.attendance.ngay?.slice(0, 11).concat(attendance.time.from) : undefined,
                  to:
                    !attendance.time.to.includes('00:00:00')
                    ? convertHourToSecond(attendance.time.to) < convertHourToSecond(attendance.time.from)
                      ? moment(object.attendance.ngay).add(1, 'days').format('YYYY-MM-DDT').concat(attendance.time.to)
                      : object.attendance.ngay?.slice(0, 11).concat(attendance.time.to)
                    : undefined,
                },
              },
              fatorDetail: shiftDetail,
            };
          }),
        ));
    } else {
      setAttendanceDetail(undefined);
    }
  }, [sheet, selectedAttendance]);
  const attendanceGeneralNode = useMemo(() => (
    <div className="header">
      <Accordion expand background title="Thống kê theo tháng">
        <Row className="m-0 pb-2">
          <Col className="p-0">
            <div className="item">
              <div className="item__label">
                Tổng số giờ làm
              </div>
              <div className="item__content">
                {attendanceGeneral?.workHours.toFixed(2) ?? 0}
              </div>
            </div>
          </Col>
          {/* <Col className="p-0">
            <div className="item">
              <div className="item__label">
                Giờ làm theo hệ số
              </div>
              <div className="item__content">
                {attendanceGeneral?.factor.toFixed(2) ?? 0}
              </div>
            </div>
          </Col> */}
        </Row>
        <Row className="m-0 pb-2">
          <Col className="p-0">
            <div className="item">
              <div className="item__label">
                Số ngày nghỉ
              </div>
              <div className="item__content">
                {attendanceGeneral?.absents ?? 0}
              </div>
            </div>
          </Col>
        </Row>
      </Accordion>
    </div>
  ), [attendanceGeneral]);
  const attendanceDetailNode = useMemo(() => (
    <div className="body">
      <Loader inverted active={loading || getShiftDetailLoading} />
      {attendanceDetail &&
        attendanceDetail
          .map((a, i) => (
            <Accordion
              key={`shift_${i}`}
              expand={i === 0}
              background
              title={a?.nameShift ?? ''}
            >
              {/* <Row className="m-0 pb-2">
                <Col className="p-0" xs={4}>
                  <div className="item">
                    <div className="item__label">
                      <StyledButton
                        outline
                        id="change_shift"
                        color="warning"
                        onClick={() => { setUpdateShiftModal({ ...a?.shiftData, idNhanVien: attendanceByEmployee?.idNhanVien } ?? undefined); }}
                      >
                        Đổi ca làm
                      </StyledButton>
                      <Tooltip id="change_shift" message="Đổi ca" />
                    </div>
                  </div>
                </Col>
                {(typeof a?.realTime?.from === 'undefined' || typeof a?.realTime?.to === 'undefined') && (
                  <Col className="p-0" xs={8}>
                    <div className="item">
                      <div className="item__label">
                        <StyledButton
                          outline
                          id="update_hour"
                          color="success"
                          onClick={() => { setUpdateAttendanceModal({ ...a?.shiftData, idNhanVien: attendanceByEmployee?.idNhanVien, attendanceRealTime: a?.realTime } ?? undefined); }}
                        >
                          Chấm công bổ sung
                        </StyledButton>
                        <Tooltip id="change_shift" message="Đổi ca" />
                      </div>
                    </div>
                  </Col>
                )}
              </Row> */}
              <Row className="m-0 pb-2">
                <Col className="p-0">
                  <div className="item">
                    <div className="item__label">
                      Số giờ làm
                    </div>
                    <div className="item__content">
                      {a?.workHours?.toFixed(2) ?? '-'}
                    </div>
                  </div>
                </Col>
              </Row>
              {/* <Row className="m-0 pb-2">
                <Col className="p-0">
                  <div className="item">
                    <div className="item__label">
                      Giờ làm theo hệ số
                    </div>
                    <div className="item__content">
                      {a?.factor?.toFixed(2) ?? '-'}
                    </div>
                  </div>
                </Col>
              </Row> */}
              <Row className="m-0 pb-2">
                <Col className="p-0">
                  <div className="item">
                    <div className="item__label">
                      Nhiệt độ vào - ra
                    </div>
                    <div className="item__content">
                      <span className="from">{`${a?.temperature?.checkIn} °C` ?? '-'}</span>
                      <i className="bx bx-right-arrow-alt" />
                      <span className="to">{`${a?.temperature?.checkOut} °C` ?? '-'}</span>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="m-0 pb-2">
                <Col className="p-0">
                  <div className="item">
                    <div className="item__label">
                      Thời gian chấm công thực tế
                    </div>
                    <div className="item__content">
                      <span className="from">{a?.realTime?.from?.slice(0, 8) ?? '-'}</span>
                      <i className="bx bx-right-arrow-alt" />
                      <span className="to">{a?.realTime?.to?.slice(0, 8) ?? '-'}</span>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="m-0 pb-2">
                <Col className="p-0">
                  <div className="item">
                    <div className="item__label">
                      Thời gian chấm công quy định
                    </div>
                    <div className="item__content">
                      <span className="from">{a?.assignTime?.from ?? '-'}</span>
                      <i className="bx bx-right-arrow-alt" />
                      <span className="to">{a?.assignTime?.to ?? '-'}</span>
                    </div>
                  </div>
                </Col>
              </Row>
              {/* {a?.fatorDetail &&
                a.fatorDetail.length > 0 && (
                  <div className="item">
                    <Accordion icon="none" title="Bảng hệ số">
                      <Row xs="8" className="m-0 pb-1">
                        <Col className="p-0">
                          <div className="item" style={{ borderBottom: '1px solid #ddd' }}>
                            <div className="item__label text-dark">
                              Thời gian
                            </div>
                          </div>
                        </Col>
                        <Col xs="4" className="p-0">
                          <div className="item text-right" style={{ borderBottom: '1px solid #ddd' }}>
                            <div className="item__label text-dark">
                              Hệ số
                            </div>
                          </div>
                        </Col>
                      </Row>
                      {a.fatorDetail
                        .sort((a, b) => convertHourToSecond(a.tgBatDau) - convertHourToSecond(b.tgBatDau))
                        .map((d) => (
                          <Row key={`detail_${d?.id}`} className="m-0 pb-1">
                            <Col xs="10" className="p-0">
                              <div className="item">
                                <div className="item__content">
                                  <span className="from">{moment(d?.tgBatDau).format('MM/DD/YYYY') ?? '-'}</span>
                                  <i className="bx bx-right-arrow-alt" />
                                  <span className="to">{d?.tgKetThuc ?? '-'}</span>
                                </div>
                              </div>
                            </Col>
                            <Col xs="2" className="p-0">
                              <div className="item">
                                <div className="item__content text-right">
                                  {d?.heSo ?? '-'}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        ))}
                    </Accordion>
                  </div>
                )} */}
            </Accordion>
          ))
      }
    </div>
  ), [loading, getShiftDetailLoading, attendanceDetail]);
  // #endregion
  const getSchedule = () => {
    if (attendanceByEmployee?.maNV) {
      dispatch(getSchedulesOfEmployee({ maNV: attendanceByEmployee.maNV, isPaged: false, ...filter }));
    }
  };
  useEffect(() => {
    if (filter?.maNV && filter?.TuNgay) {
      setSelectedAttendance(undefined);
      dispatch(selectAttendance(undefined));
      dispatch(getAttendanceByEmployee({ isPaged: false, ...filter }));
    } else if (id && filter?.TuNgay) {
      setSelectedAttendance(undefined);
      dispatch(selectAttendance(undefined));
      dispatch(getAttendanceByEmployee({ idNhanVien: id, isPaged: false, ...filter }));
    }
  }, [id, filter]);
  useEffect(() => {
    if (selectedAttendance && attendanceDetail && attendanceDetail.length > 0) {
      dispatch(selectAttendance(attendanceDetail[0]));
    }
  }, [attendanceDetail]);
  useEffect(() => {
    getSchedule();
  }, [attendanceByEmployee]);
  useEffect(() => { calculateSheet(); }, [calculateSheet]);
  useEffect(() => { calculateAttendanceGeneral(); }, [calculateAttendanceGeneral]);
  useEffect(() => { calculateAttendanceDetail(); }, [calculateAttendanceDetail]);
  useEffect(() => {
    if (attendanceFilter?.TuNgay && attendanceFilter?.DenNgay) { dispatch(setAttendanceDetailFilter(attendanceFilter)); }
  }, [attendanceFilter]);

  return (
    <div className="page-content">
      <Wrapper>
        <div className="header">
          {(history.location?.state?.from ?? '') === '/attendance' && (
            <div className="back" onClick={() => history.push('/attendance')}>
              <i className="bx bx-arrow-back" />
            </div>
          )}
          <div>
            <div className="title">{`Bảng chấm công chi tiết tháng ${new Date(filter?.TuNgay).getMonth() + 1 ?? ''}`}</div>
            <div className="description">
              Nhân viên:
              {' '}
              {`${attendanceByEmployee?.tenNV ?? 'Không tìm thấy nhân viên này'} - Mã NV: ${attendanceByEmployee?.maNV ?? ''}`}
            </div>
          </div>
        </div>
        <AttendanceDetailToolbar data={{ ...filter, idNhanVien: attendanceByEmployee?.idNhanVien ?? '' }} setUpdateAttendanceModal={setUpdateAttendanceModal} />
        <div className="body">
          <div className="sheet">
            <Loader inverted active={loading} />
            {sheetNode}
          </div>
          <div className="detail">
            {attendanceGeneralNode}
            {attendanceDetailNode}
          </div>
        </div>
      </Wrapper>
      <UpdateAttendanceModal
        data={updateAttendanceModal}
        onRefresh={() => { window.location.reload(); }}
        onClose={() => setUpdateAttendanceModal(undefined)}
      />
    </div>
  );
};

export default AttendanceDetailPage;
