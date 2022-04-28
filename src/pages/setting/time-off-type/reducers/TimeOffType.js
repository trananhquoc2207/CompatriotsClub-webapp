import types from 'pages/setting/time-off-type/actions/types';

const INITIAL_STATE = {
  timeOffTypeData: {
    data: [],
    totalSizes: 0,
  },
  getTimeOffTypeLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_TIME_OFF_TYPE_REQUEST:
      return {
        ...state,
        getTimeOffTypeLoading: true,
      };
    case types.GET_TIME_OFF_TYPE_SUCCESS:
      return {
        ...state,
        timeOffTypeData: action.payload,
        getTimeOffTypeLoading: false,
      };
    case types.GET_TIME_OFF_TYPE_FAILURE:
      return {
        ...state,
        getTimeOffTypeLoading: false,
      };
    default:
      return state;
  }
}
