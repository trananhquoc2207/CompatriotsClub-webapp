/* eslint-disable consistent-return */
import httpClient from 'utils/http-client';
import apiLinks from 'utils/api-links';
import { notify } from 'utils/helpers';
import types from './types';

const setMealStatisticFilter = (payload) => ({
  type: types.MEAL_STATISTIC_FILTER,
  payload,
});

const getMealStatisticRequest = () => ({ type: types.GET_MEAL_STATISTIC_REQUEST });
const getMealStatisticSuccess = (response) => ({
  type: types.GET_MEAL_STATISTIC_SUCCESS,
  payload: response,
});
const getMealStatisticFailure = (error) => ({
  type: types.GET_MEAL_STATISTIC_FAILURE,
  payload: error,
});
const getMealStatistic = (params) => async (dispatch) => {
  try {
    dispatch(getMealStatisticRequest());
    const { data: { success, meta, data } } =
      await httpClient.callApi({
        method: 'GET',
        url: apiLinks.statistic.getMealStatistic,
        params,
      });

    if (success) {
      dispatch(getMealStatisticSuccess({ data, totalSizes: meta.total }));
    }
  } catch (error) {
    dispatch(getMealStatisticFailure(error));
  }
};

const getListEmployeePostByLeaderRequest = () => ({ type: types.GET_LIST_EMPLOYEE_POST_BY_LEADER_REQUEST });
const getListEmployeePostByLeaderSuccess = (response) => ({
  type: types.GET_LIST_EMPLOYEE_POST_BY_LEADER_SUCCESS,
  payload: response,
});
const getListEmployeePostByLeaderFailure = (error) => ({
  type: types.GET_LIST_EMPLOYEE_POST_BY_LEADER_FAILURE,
  payload: error,
});
const getListEmployeePostByLeader = (params) => async (dispatch) => {
  try {
    dispatch(getListEmployeePostByLeaderRequest());
    const { data: { totalCounts, data } } =
      await httpClient.callApi({
        method: 'GET',
        url: apiLinks.statistic.getListEmployeePostByLeader,
        params,
      });
    dispatch(getListEmployeePostByLeaderSuccess({ data, totalSizes: totalCounts }));
  } catch (error) {
    dispatch(getListEmployeePostByLeaderFailure(error));
  }
};

const getRiceRegisteredOfEmployeeRequest = () => ({ type: types.GET_RICE_REGISTERED_OF_EMPLOYEE_REQUEST });
const getRiceRegisteredOfEmployeeSuccess = (response) => ({
  type: types.GET_RICE_REGISTERED_OF_EMPLOYEE_SUCCESS,
  payload: response,
});
const getRiceRegisteredOfEmployeeFailure = (error) => ({
  type: types.GET_RICE_REGISTERED_OF_EMPLOYEE_FAILURE,
  payload: error,
});
const getRiceRegisteredOfEmployee = (id, params) => async (dispatch) => {
  try {
    dispatch(getRiceRegisteredOfEmployeeRequest());
    const { data: { succeed, errorMessages, data } } =
      await httpClient.callApi({
        method: 'GET',
        url: `${apiLinks.statistic.getRiceRegisteredOfEmployee}/${id}`,
        params,
      });
    if (succeed) {
      dispatch(getRiceRegisteredOfEmployeeSuccess({ data, riceStatistics: (data?.riceStatistics || []) }));
    } else {
      dispatch(getRiceRegisteredOfEmployeeFailure(errorMessages));
    }
  } catch (error) {
    dispatch(getRiceRegisteredOfEmployeeFailure(error));
  }
};

const getTypeRegisteredMealRequest = () => ({ type: types.GET_TYPE_REGISTERED_MEAL_REQUEST });
const getTypeRegisteredMealSuccess = (response) => ({ type: types.GET_TYPE_REGISTERED_MEAL_SUCCESS, payload: response });
const getTypeRegisteredMealFailure = (error) => ({ type: types.GET_TYPE_REGISTERED_MEAL_FAILURE, payload: error });
const getTypeRegisteredMeal = (params) => async (dispatch) => {
  try {
    dispatch(getTypeRegisteredMealRequest());
    const response =
      await httpClient.callApi({
        method: 'GET',
        url: apiLinks.meal.getMealType,
        params,
      });
    dispatch(getTypeRegisteredMealSuccess(response?.data ?? {}));
    return response?.data ?? {};
  } catch (error) {
    dispatch(getTypeRegisteredMealFailure(error));
  }
};

const confirmRegisteredMealRequest = () => ({ type: types.CONFIRM_REGISTERED_MEAL_REQUEST });
const confirmRegisteredMealSuccess = (response) => ({ type: types.CONFIRM_REGISTERED_MEAL_SUCCESS, payload: response });
const confirmRegisteredMealFailure = (error) => ({ type: types.CONFIRM_REGISTERED_MEAL_FAILURE, payload: error });
const confirmRegisteredMeal = (params) => async (dispatch) => {
  try {
    dispatch(confirmRegisteredMealRequest());
    const response =
      await httpClient.callApi({
        method: 'PUT',
        url: apiLinks.statistic.updateStatusRegisteredOfEmployee,
        params,
      });

    notify('success', 'Đã cập nhật.');
    dispatch(confirmRegisteredMealSuccess(response?.data ?? {}));
    return response?.data ?? {};
  } catch (error) {
    notify('danger', error.response?.data?.errorMessages);
    dispatch(confirmRegisteredMealFailure(error));
  }
};

const updateMealTypeRequest = () => ({ type: types.UPDATE_MEAL_TYPE_REQUEST });
const updateMealTypeSuccess = (response) => ({ type: types.UPDATE_MEAL_TYPE_SUCCESS, payload: response });
const updateMealTypeFailure = (error) => ({ type: types.UPDATE_MEAL_TYPE_FAILURE, payload: error });
const updateMealType = (id, data) => async (dispatch) => {
  try {
    dispatch(updateMealTypeRequest());
    const response =
      await httpClient.callApi({
        method: 'PUT',
        url: apiLinks.statistic.updateMealRegisteredOfEmployee(id),
        data,
      });
    dispatch(updateMealTypeSuccess(response?.data ?? {}));
    return response?.data ?? {};
  } catch (error) {
    dispatch(updateMealTypeFailure(error));
  }
};

export {
  setMealStatisticFilter,
  getMealStatistic,
  getListEmployeePostByLeader,
  getRiceRegisteredOfEmployee,
  getTypeRegisteredMeal,
  confirmRegisteredMeal,
  updateMealType,
};
