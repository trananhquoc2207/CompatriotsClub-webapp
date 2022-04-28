import types from 'pages/setting/rated-temperature/actions/types';
import { defaultPaging } from 'utils/helpers';

const INITIAL_STATE = {
  ratedTemperature: defaultPaging,
  getRatedTemperatureLoading: false,

};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_TEMPERATURE_REQUEST:
      return {
        ...state,
        getRatedTemperatureLoading: true,
      };
    case types.GET_TEMPERATURE_SUCCESS:
      return {
        ...state,
        ratedTemperature: action.payload,
        getRatedTemperatureLoading: false,
      };
    case types.GET_TEMPERATURE_FAILURE:
      return {
        ...state,
        getRatedTemperatureLoading: false,
      };
    default:
      return state;
  }
}
