import ratedTemperatureApi from 'api/ratedTemperature';
import types from './types';

const getTemperatureRequest = () => ({ type: types.GET_TEMPERATURE_REQUEST });
const getTemperatureSuccess = (response) => ({ type: types.GET_TEMPERATURE_SUCCESS, payload: response });
const getTemperatureFailure = (error) => ({ type: types.GET_TEMPERATURE_FAILURE, payload: error });

const getTemperature = (p) => async (dispatch) => {
  try {
    dispatch(getTemperatureRequest());
    const { success, meta, data } = await ratedTemperatureApi.get(p);
    if (success) {
      dispatch(getTemperatureSuccess({ data }));
    }
  } catch (error) {
    dispatch(getTemperatureFailure(error));
  }
};

export {
  getTemperature,
};
