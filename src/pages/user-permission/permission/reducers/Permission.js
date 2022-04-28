import types from 'pages/user-permission/permission/actions/types';
import { defaultPaging } from 'utils/helpers';

const INITIAL_STATE = {
  permissionList: defaultPaging,
  permissionDetail: {},
  getPermissionLoading: false,
  getPermissionDetailLoading: false,

};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_PERMISSION_REQUEST:
      return {
        ...state,
        getPermissionLoading: true,
      };
    case types.GET_PERMISSION_SUCCESS:
      return {
        ...state,
        permissionList: action.payload,
        getPermissionLoading: false,
      };
    case types.GET_PERMISSION_FAILURE:
      return {
        ...state,
        getPermissionLoading: false,
      };
    case types.GET_PERMISSION_DETAILS_REQUEST:
      return {
        ...state,
        getPermissionDetailLoading: true,
      };
    case types.GET_PERMISSION_DETAILS_SUCCESS:
      return {
        ...state,
        permissionDetail: action.payload,
        getPermissionDetailLoading: false,
      };
    case types.GET_PERMISSION_DETAILS_FAILURE:
      return {
        ...state,
        getPermissionDetailLoading: false,
      };
    default:
      return state;
  }
}
