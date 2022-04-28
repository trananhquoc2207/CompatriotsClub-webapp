import types from 'pages/schedule-group/actions/types';
import { defaultPaging } from 'utils/helpers';

const INITIAL_STATE = {
  scheduleGroups: defaultPaging,
  getScheduleGroupLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_SCHEDULE_GROUP_REQUEST:
      return {
        ...state,
        getScheduleGroupLoading: true,
      };
    case types.GET_SCHEDULE_GROUP_SUCCESS:
      return {
        ...state,
        scheduleGroups: action.payload,
        getScheduleGroupLoading: false,
      };
    case types.GET_SCHEDULE_GROUP_FAILURE:
      return {
        ...state,
        getScheduleGroupLoading: false,
      };
    default:
      return state;
  }
}
