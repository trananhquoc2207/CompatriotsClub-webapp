import types from 'pages/statistic/time-off/actions/types';
import { defaultPaging } from 'utils/helpers';

const INITIAL_STATE = {
  absentStatisticFilter: {},
  absentStatistic: {
    data: [],
    totalCounts: 0,
  },
  getAbsentStatisticLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.ABSENT_STATISTIC_FILTER:
      return {
        ...state,
        absentStatisticFilter: action.payload,
      };
    case types.GET_ABSENT_STATISTIC_REQUEST:
      return {
        ...state,
        getAbsentStatisticLoading: true,
      };
    case types.GET_ABSENT_STATISTIC_SUCCESS:
      return {
        ...state,
        absentStatistic: action.payload,
        getAbsentStatisticLoading: false,
      };
    case types.GET_ABSENT_STATISTIC_FAILURE:
      return {
        ...state,
        getAbsentStatisticLoading: false,
      };
    default:
      return state;
  }
}
