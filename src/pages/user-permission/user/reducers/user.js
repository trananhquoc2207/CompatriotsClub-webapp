import types from 'pages/user-permission/user/actions/types';
import { defaultPaging } from 'utils/helpers';

const INITIAL_STATE = {
  userData: defaultPaging,
  getUserLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_USER_REQUEST:
      return {
        ...state,
        getUserLoading: true,
      };
    case types.GET_USER_SUCCESS:
      return {
        ...state,
        userData: action.payload,
        getUserLoading: false,
      };
    case types.GET_USER_FAILURE:
      return {
        ...state,
        getUserLoading: false,
      };
    default:
      return state;
  }
}
