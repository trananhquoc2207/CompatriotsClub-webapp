import httpClient from 'utils/http-client';
import apiLinks from 'utils/api-links';
import types from './types';

const setOverBodyTemperatureFilter = (payload) => ({
  type: types.SET_OVER_BODY_TEMPERATURE_FILTER,
  payload,
});

const getOverBodyTemperatureRequest = () => ({ type: types.GET_OVER_BODY_TEMPERATURES_REQUEST });
const getOverBodyTemperatureSuccess = (response) => ({
  type: types.GET_OVER_BODY_TEMPERATURES_SUCCESS,
  payload: response,
});
const getOverBodyTemperatureFailure = (error) => ({
  type: types.GET_OVER_BODY_TEMPERATURES_FAILURE,
  payload: error,
});

// eslint-disable-next-line
const getOverBodyTemperatures = (params) => async (dispatch) => {
  try {
    dispatch(getOverBodyTemperatureRequest());
    const { data: { success, meta, data } } =
      await httpClient.callApi({
        method: 'GET',
        url: apiLinks.statistic.getOverBodyTemperature,
        params,
      });
    if (success) {
      dispatch(getOverBodyTemperatureSuccess({ data, totalSizes: meta.total }));
    }
    return data || [];
  } catch (error) {
    dispatch(getOverBodyTemperatureFailure(error));
  }
};

export {
  setOverBodyTemperatureFilter,
  getOverBodyTemperatures,
};
