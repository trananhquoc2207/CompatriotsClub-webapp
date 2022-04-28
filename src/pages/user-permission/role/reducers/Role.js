import types from 'pages/user-permission/role/actions/types';
import { defaultPaging } from 'utils/helpers';

const INITIAL_STATE = {
  roleList: defaultPaging,
  roleDetail: {},
  rolePermission: defaultPaging,
  getRoleLoading: false,
  getRoleDetailLoading: false,
  getRolePermissionLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_ROLE_REQUEST:
      return {
        ...state,
        getRoleLoading: true,
      };
    case types.GET_ROLE_SUCCESS:
      return {
        ...state,
        roleList: action.payload,
        getRoleLoading: false,
      };
    case types.GET_ROLE_FAILURE:
      return {
        ...state,
        getRoleLoading: false,
      };
    case types.GET_ROLE_DETAILS_REQUEST:
      return {
        ...state,
        getRoleDetailLoading: true,
      };
    case types.GET_ROLE_DETAILS_SUCCESS:
      return {
        ...state,
        roleDetail: action.payload,
        getRoleDetailLoading: false,
      };
    case types.GET_ROLE_DETAILS_FAILURE:
      return {
        ...state,
        getRoleDetailLoading: false,
      };
    case types.GET_ROLE_PERMISSION_REQUEST:
      return {
        ...state,
        getRolePermissionLoading: true,
      };
    case types.GET_ROLE_PERMISSION_SUCCESS:
      return {
        ...state,
        rolePermission: action.payload,
        getRolePermissionLoading: false,
      };
    case types.GET_ROLE_PERMISSION_FAILURE:
      return {
        ...state,
        getRolePermissionLoading: false,
      };
    default:
      return state;
  }
}
