import types from 'pages/statistic/temperature/actions/types';
import { defaultPaging } from 'utils/helpers';

const INITIAL_STATE = {
  overBodyTemperatureFilter: {},
  overBodyTemperatures: defaultPaging,
  getOverBodyTemperatureLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SET_OVER_BODY_TEMPERATURE_FILTER:
      return {
        ...state,
        overBodyTemperatureFilter: action.payload,
      };
    case types.GET_OVER_BODY_TEMPERATURES_REQUEST:
      return {
        ...state,
        getOverBodyTemperatureLoading: true,
      };
    case types.GET_OVER_BODY_TEMPERATURES_SUCCESS:
      return {
        ...state,
        overBodyTemperatures: action.payload,
        getOverBodyTemperatureLoading: false,
      };
    case types.GET_OVER_BODY_TEMPERATURES_FAILURE:
      return {
        ...state,
        getOverBodyTemperatureLoading: false,
      };
    default:
      return state;
  }
}
