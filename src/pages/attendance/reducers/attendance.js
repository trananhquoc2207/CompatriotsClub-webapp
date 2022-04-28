import types from 'pages/attendance/actions/types';
import { defaultPaging } from 'utils/helpers';

const INITIAL_STATE = {
  attendanceFilter: {},
  attendanceHistoryFilter: {},
  attendanceDetailFilter: {},
  attendances: {
    data: [],
    totalSizes: 0,
  },
  attendanceHistory: {
    data: [],
    totalSizes: 0,
  },
  attendanceAdditionalReason: defaultPaging,
  attendanceByEmployee: {},
  attendanceAnalysisByDay: {},
  attendanceAnalysisByWeek: [],
  getAttendancesLoading: false,
  getAttendanceHistoryLoading: false,
  getAttendanceByEmployeeLoading: false,
  getAttendanceAnalysisByDayLoading: false,
  getAttendanceAnalysisByWeekLoading: false,
  getAttendanceAdditionalReasonLoading: false,

  selectedAttendance: undefined,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.ATTENDANCE_FILTER:
      return {
        ...state,
        attendanceFilter: action.payload,
      };
    case types.ATTENDANCE_HISTORY_FILTER:
      return {
        ...state,
        attendanceHistoryFilter: action.payload,
      };
    case types.ATTENDANCE_DETAIL_FILTER:
      return {
        ...state,
        attendanceDetailFilter: action.payload,
      };
    case types.GET_ATTENDANCES_REQUEST:
      return {
        ...state,
        getAttendancesLoading: true,
      };
    case types.GET_ATTENDANCES_SUCCESS:
      return {
        ...state,
        attendances: action.payload,
        getAttendancesLoading: false,
      };
    case types.GET_ATTENDANCES_FAILURE:
      return {
        ...state,
        getAttendancesLoading: false,
      };
    case types.GET_ATTENDANCE_HISTORY_REQUEST:
      return {
        ...state,
        getAttendanceHistoryLoading: true,
      };
    case types.GET_ATTENDANCE_HISTORY_SUCCESS:
      return {
        ...state,
        attendanceHistory: action.payload,
        getAttendanceHistoryLoading: false,
      };
    case types.GET_ATTENDANCE_HISTORY_FAILURE:
      return {
        ...state,
        getAttendanceHistoryLoading: false,
      };
    case types.GET_ATTENDANCE_BY_EMPLOYEE_REQUEST:
      return {
        ...state,
        getAttendanceByEmployeeLoading: true,
      };
    case types.GET_ATTENDANCE_BY_EMPLOYEE_SUCCESS:
      return {
        ...state,
        attendanceByEmployee: action.payload,
        getAttendanceByEmployeeLoading: false,
      };
    case types.GET_ATTENDANCE_BY_EMPLOYEE_FAILURE:
      return {
        ...state,
        getAttendanceByEmployeeLoading: false,
      };
    case types.GET_ATTENDANCE_ANALYSIS_BY_DAY_REQUEST:
      return {
        ...state,
        getAttendanceAnalysisByDayLoading: true,
      };
    case types.GET_ATTENDANCE_ANALYSIS_BY_DAY_SUCCESS:
      return {
        ...state,
        attendanceAnalysisByDay: action.payload,
        getAttendanceAnalysisByDayLoading: false,
      };
    case types.GET_ATTENDANCE_ANALYSIS_BY_DAY_FAILURE:
      return {
        ...state,
        getAttendanceAnalysisByDayLoading: false,
      };
    case types.GET_ATTENDANCE_ANALYSIS_BY_WEEK_REQUEST:
      return {
        ...state,
        getAttendanceAnalysisByWeekLoading: true,
      };
    case types.GET_ATTENDANCE_ANALYSIS_BY_WEEK_SUCCESS:
      return {
        ...state,
        attendanceAnalysisByWeek: action.payload,
        getAttendanceAnalysisByWeekLoading: false,
      };
    case types.GET_ATTENDANCE_ANALYSIS_BY_WEEK_FAILURE:
      return {
        ...state,
        getAttendanceAnalysisByWeekLoading: false,
      };
    case types.GET_ATTENDANCE_REASON_REQUEST:
      return {
        ...state,
        getAttendanceAdditionalReasonLoading: true,
      };
    case types.GET_ATTENDANCE_REASON_SUCCESS:
      return {
        ...state,
        attendanceAdditionalReason: action.payload,
        getAttendanceAdditionalReasonLoading: false,
      };
    case types.GET_ATTENDANCE_REASON_FAILURE:
      return {
        ...state,
        getAttendanceAdditionalReasonLoading: false,
      };
    case types.SELECTED_ATTENDANCE:
      return {
        ...state,
        selectedAttendance: action.payload,
      };
    default:
      return state;
  }
}
