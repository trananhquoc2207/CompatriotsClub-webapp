import apiLinks from 'utils/api-links';
import httpClient from 'utils/http-client';
import types from './types';

const getRoleRequest = () => ({ type: types.GET_ROLE_REQUEST });
const getRoleSuccess = (response) => ({ type: types.GET_ROLE_SUCCESS, payload: response });
const getRoleFailure = (error) => ({ type: types.GET_ROLE_FAILURE, payload: error });

const getRoleDetailsRequest = () => ({ type: types.GET_ROLE_DETAILS_REQUEST });
const getRoleDetailsSuccess = (response) => ({ type: types.GET_ROLE_DETAILS_SUCCESS, payload: response });
const getRoleDetailsFailure = (error) => ({ type: types.GET_ROLE_DETAILS_FAILURE, payload: error });

const getRolePermissionRequest = () => ({ type: types.GET_ROLE_PERMISSION_REQUEST });
const getRolePermissionSuccess = (response) => ({ type: types.GET_ROLE_PERMISSION_SUCCESS, payload: response });
const getRolePermissionFailure = (error) => ({ type: types.GET_ROLE_PERMISSION_FAILURE, payload: error });

const getRole = (params) => async (dispatch) => {
  try {
    dispatch(getRoleRequest());
    const response = await httpClient.callApi({
      method: 'GET',
      url: apiLinks.role.get,
      params,
    });
    dispatch(getRoleSuccess(response?.data ?? {}));
    return response?.data ?? {};
  } catch (error) {
    dispatch(getRoleFailure(error));
  }
};
const getRolePermission = (id) => async (dispatch) => {
  const params = { id };
  try {
    dispatch(getRolePermissionRequest());
    const response = await httpClient.callApi({
      method: 'GET',
      url: apiLinks.role.getPermission(id),
      params,
    });
    dispatch(getRolePermissionSuccess(response?.data ?? {}));
    return response?.data ?? {};
  } catch (error) {
    dispatch(getRolePermissionFailure(error));
  }
};
const getRoleDetail = (id) => async (dispatch) => {
  const params = { id };
  try {
    dispatch(getRoleDetailsRequest());
    const response = await httpClient.callApi({
      method: 'GET',
      url: apiLinks.role.getDetail(id),
      params,
    });
    dispatch(getRoleDetailsSuccess(response?.data ?? {}));
    return response?.data ?? {};
  } catch (error) {
    dispatch(getRoleDetailsFailure(error));
  }
};
export {
  getRole,
  getRoleDetail,
  getRolePermission,
};
