import httpClient from 'utils/http-client';
import apiLinks from 'utils/api-links';
import types from './types';

const setAbsentStatisticFilter = (payload) => ({
  type: types.ABSENT_STATISTIC_FILTER,
  payload,
});

const getAbsentStatisticRequest = () => ({ type: types.GET_ABSENT_STATISTIC_REQUEST });
const getAbsentStatisticSuccess = (response) => ({
  type: types.GET_ABSENT_STATISTIC_SUCCESS,
  payload: response,
});
const getAbsentStatisticFailure = (error) => ({
  type: types.GET_ABSENT_STATISTIC_FAILURE,
  payload: error,
});

// eslint-disable-next-line
const getAbsentStatistic = (params) => async (dispatch) => {
  try {
    dispatch(getAbsentStatisticRequest());
    const response =
      await httpClient.callApi({
        method: 'GET',
        url: apiLinks.statistic.getAbsentStatistic,
        params,
      });
    dispatch(getAbsentStatisticSuccess(response?.data ?? {}));
    return response?.data ?? {};
  } catch (error) {
    dispatch(getAbsentStatisticFailure(error));
  }
};

export {
  setAbsentStatisticFilter,
  getAbsentStatistic,
};
