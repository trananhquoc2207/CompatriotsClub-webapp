import {
  SCHEDULE_FILTER,
  GET_SCHEDULES_REQUEST,
  GET_SCHEDULES_SUCCESS,
  GET_SCHEDULES_FAILURE,
  GET_SCHEDULES_OF_EMPLOYEE_REQUEST,
  GET_SCHEDULES_OF_EMPLOYEE_SUCCESS,
  GET_SCHEDULES_OF_EMPLOYEE_FAILURE,
} from 'pages/schedule/actions/types';

const INITIAL_STATE = {
  scheduleFilter: {},
  schedules: {
    data: [],
    totalSizes: 0,
  },
  schedulesOfEmployee: {},
  getSchedulesLoading: false,
  getSchedulesOfEmployeeLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SCHEDULE_FILTER:
      return {
        ...state,
        scheduleFilter: action.payload,
      };
    case GET_SCHEDULES_REQUEST:
      return {
        ...state,
        getSchedulesLoading: true,
      };
    case GET_SCHEDULES_SUCCESS:
      return {
        ...state,
        schedule: action.payload,
        getSchedulesLoading: false,
      };
    case GET_SCHEDULES_FAILURE:
      return {
        ...state,
        getSchedulesLoading: false,
      };
    case GET_SCHEDULES_OF_EMPLOYEE_REQUEST:
      return {
        ...state,
        getSchedulesOfEmployeeLoading: true,
      };
    case GET_SCHEDULES_OF_EMPLOYEE_SUCCESS:
      return {
        ...state,
        schedulesOfEmployee: action.payload,
        getSchedulesOfEmployeeLoading: false,
      };
    case GET_SCHEDULES_OF_EMPLOYEE_FAILURE:
      return {
        ...state,
        getSchedulesOfEmployeeLoading: false,
      };
    default:
      return state;
  }
}
