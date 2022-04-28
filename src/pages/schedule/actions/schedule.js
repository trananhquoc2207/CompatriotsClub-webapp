import scheduleApi from 'api/scheduleApi';
import {
  SCHEDULE_FILTER,
  GET_SCHEDULES_REQUEST,
  GET_SCHEDULES_SUCCESS,
  GET_SCHEDULES_FAILURE,
  GET_SCHEDULES_OF_EMPLOYEE_REQUEST,
  GET_SCHEDULES_OF_EMPLOYEE_SUCCESS,
  GET_SCHEDULES_OF_EMPLOYEE_FAILURE,
} from './types';

// Schedule filter
const setScheduleFilter = (payload) => ({
  type: SCHEDULE_FILTER,
  payload,
});
// Schedule CRUD
const getSchedulesRequest = () => ({ type: GET_SCHEDULES_REQUEST });
const getSchedulesSuccess = (response) => ({ type: GET_SCHEDULES_SUCCESS, payload: response });
const getSchedulesFailure = (error) => ({ type: GET_SCHEDULES_FAILURE, payload: error });

const getSchedules = (p) => async (dispatch) => {
  try {
    dispatch(getSchedulesRequest());
    const { success, meta, data } = await scheduleApi.get(p);
    if (success) {
      dispatch(getSchedulesSuccess({ data, totalSizes: meta.total }));
    }
  } catch (error) {
    dispatch(getSchedulesFailure(error));
  }
};

const getSchedulesOfEmployeeRequest = () => ({ type: GET_SCHEDULES_OF_EMPLOYEE_REQUEST });
const getSchedulesOfEmployeeSuccess = (response) => ({ type: GET_SCHEDULES_OF_EMPLOYEE_SUCCESS, payload: response });
const getSchedulesOfEmployeeFailure = (error) => ({ type: GET_SCHEDULES_OF_EMPLOYEE_FAILURE, payload: error });

const getSchedulesOfEmployee = (p) => async (dispatch) => {
  try {
    dispatch(getSchedulesOfEmployeeRequest());
    const { success, data } = await scheduleApi.get(p);
    if (success) {
      dispatch(getSchedulesOfEmployeeSuccess(data[0] || {}));
    }
  } catch (error) {
    console.log(error);
    dispatch(getSchedulesOfEmployeeFailure(error));
  }
};
// #endregion

export {
  setScheduleFilter,
  getSchedules,
  getSchedulesOfEmployee,
};
