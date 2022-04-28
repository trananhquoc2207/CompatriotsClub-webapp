import attendanceApi from 'api/attendanceApi';
import apiLinks from 'utils/api-links';
import httpClient from 'utils/http-client';
import types from './types';

const setAttendanceFilter = (payload) => ({ type: types.ATTENDANCE_FILTER, payload });
const setAttendanceHistoryFilter = (payload) => ({ type: types.ATTENDANCE_HISTORY_FILTER, payload });
const setAttendanceDetailFilter = (payload) => ({ type: types.ATTENDANCE_DETAIL_FILTER, payload });

const getAttendancesRequest = () => ({ type: types.GET_ATTENDANCES_REQUEST });
const getAttendancesSuccess = (response) => ({ type: types.GET_ATTENDANCES_SUCCESS, payload: response });
const getAttendancesFailure = (error) => ({ type: types.GET_ATTENDANCES_FAILURE, payload: error });

const getAttendances = (p) => async (dispatch) => {
  try {
    dispatch(getAttendancesRequest());
    const { success, meta, data } = await attendanceApi.get(p);
    if (success) {
      dispatch(getAttendancesSuccess({ data, totalSizes: meta.total }));
    }
  } catch (error) {
    dispatch(getAttendancesFailure(error));
  }
};

const getAttendanceByEmployeeRequest = () => ({ type: types.GET_ATTENDANCE_BY_EMPLOYEE_REQUEST });
const getAttendanceByEmployeeSuccess = (response) => ({ type: types.GET_ATTENDANCE_BY_EMPLOYEE_SUCCESS, payload: response });
const getAttendanceByEmployeeFailure = (error) => ({ type: types.GET_ATTENDANCE_BY_EMPLOYEE_FAILURE, payload: error });

const getAttendanceByEmployee = (p) => async (dispatch) => {
  try {
    dispatch(getAttendanceByEmployeeRequest());
    const { success, data } = await attendanceApi.get(p);
    if (success) {
      dispatch(getAttendanceByEmployeeSuccess(data[0] || {}));
    }
  } catch (error) {
    dispatch(getAttendanceByEmployeeFailure(error));
  }
};

const getAttendanceHistoryRequest = () => ({ type: types.GET_ATTENDANCE_HISTORY_REQUEST });
const getAttendanceHistorySuccess = (response) => ({ type: types.GET_ATTENDANCE_HISTORY_SUCCESS, payload: response });
const getAttendanceHistoryFailure = (error) => ({ type: types.GET_ATTENDANCE_HISTORY_FAILURE, payload: error });

const getAttendanceHistory = (p) => async (dispatch) => {
  try {
    dispatch(getAttendanceHistoryRequest());
    const { success, meta, data } = await attendanceApi.getHistory(p);
    if (success) {
      dispatch(getAttendanceHistorySuccess({ data, totalSizes: meta.total }));
    }
  } catch (error) {
    dispatch(getAttendanceHistoryFailure(error));
  }
};

const getAttendanceAnalysisByDayRequest = () => ({ type: types.GET_ATTENDANCE_ANALYSIS_BY_DAY_REQUEST });
const getAttendanceAnalysisByDaySuccess = (response) => ({ type: types.GET_ATTENDANCE_ANALYSIS_BY_DAY_SUCCESS, payload: response });
const getAttendanceAnalysisByDayFailure = (error) => ({ type: types.GET_ATTENDANCE_ANALYSIS_BY_DAY_FAILURE, payload: error });

const getAttendanceAnalysisByDay = (p) => async (dispatch) => {
  try {
    dispatch(getAttendanceAnalysisByDayRequest());
    const { success, data } = await attendanceApi.getAnalysis(p);
    if (success) {
      dispatch(getAttendanceAnalysisByDaySuccess(data[0] || []));
      return data[0] || [];
    }
    return [];
  } catch (error) {
    dispatch(getAttendanceAnalysisByDayFailure(error));
    return [];
  }
};

const getAttendanceAnalysisByWeekRequest = () => ({ type: types.GET_ATTENDANCE_ANALYSIS_BY_WEEK_REQUEST });
const getAttendanceAnalysisByWeekSuccess = (response) => ({ type: types.GET_ATTENDANCE_ANALYSIS_BY_WEEK_SUCCESS, payload: response });
const getAttendanceAnalysisByWeekFailure = (error) => ({ type: types.GET_ATTENDANCE_ANALYSIS_BY_WEEK_FAILURE, payload: error });

const getAttendanceAnalysisByWeek = (p) => async (dispatch) => {
  try {
    dispatch(getAttendanceAnalysisByWeekRequest());
    const { success, data } = await attendanceApi.getAnalysis(p);
    if (success) {
      dispatch(getAttendanceAnalysisByWeekSuccess(data));
      return data;
    }
    return [];
  } catch (error) {
    dispatch(getAttendanceAnalysisByWeekFailure(error));
    return [];
  }
};

const getAttendanceReasonRequest = () => ({ type: types.GET_ATTENDANCE_REASON_REQUEST });
const getAttendanceReasonSuccess = (response) => ({ type: types.GET_ATTENDANCE_REASON_SUCCESS, payload: response });
const getAttendanceReasonFailure = (error) => ({ type: types.GET_ATTENDANCE_REASON_FAILURE, payload: error });

const getAttendanceAdditionalReason = (params) => async (dispatch) => {
  try {
    dispatch(getAttendanceReasonRequest());
    const response = await httpClient.callApi({
      method: 'GET',
      url: apiLinks.attendance.additionalReason,
      params,
    });
    dispatch(getAttendanceReasonSuccess(response?.data ?? {}));
    return response?.data ?? {};
  } catch (error) {
    dispatch(getAttendanceReasonFailure(error));
  }
};

const selectAttendance = (payload) => ({ type: types.SELECTED_ATTENDANCE, payload });

export {
  setAttendanceFilter,
  setAttendanceHistoryFilter,
  setAttendanceDetailFilter,
  getAttendances,
  getAttendanceByEmployee,
  getAttendanceHistory,
  getAttendanceAnalysisByDay,
  getAttendanceAnalysisByWeek,
  getAttendanceAdditionalReason,
  selectAttendance,
};
