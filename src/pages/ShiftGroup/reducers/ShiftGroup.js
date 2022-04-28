import types from 'pages/ShiftGroup/actions/types';
import { defaultPaging } from 'utils/helpers';

const INITIAL_STATE = {
  scheduleGroups: defaultPaging,
  scheduleGroupDetail: {},
  getScheduleGroupDetailLoading: false,
  getScheduleGroupLoading: false,

};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_GROUP_REQUEST:
      return {
        ...state,
        getScheduleGroupLoading: true,
      };
    case types.GET_GROUP_SUCCESS:
      return {
        ...state,
        scheduleGroups: action.payload,
        getScheduleGroupLoading: false,
      };
    case types.GET_GROUP_FAILURE:
      return {
        ...state,
        getScheduleGroupLoading: false,
      };
    case types.GET_GROUP_DETAILS_REQUEST:
      return {
        ...state,
        getScheduleGroupDetailLoading: true,
      };
    case types.GET_GROUP_DETAILS_SUCCESS:
      return {
        ...state,
        scheduleGroupDetail: action.payload,
        getScheduleGroupDetailLoading: false,
      };
    case types.GET_GROUP_DETAILS_FAILURE:
      return {
        ...state,
        getScheduleGroupDetailLoading: false,
      };
    default:
      return state;
  }
}
