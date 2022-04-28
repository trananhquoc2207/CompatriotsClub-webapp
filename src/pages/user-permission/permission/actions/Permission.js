import apiLinks from 'utils/api-links';
import httpClient from 'utils/http-client';
import types from './types';

const getPermissionRequest = () => ({ type: types.GET_PERMISSION_REQUEST });
const getPermissionSuccess = (response) => ({ type: types.GET_PERMISSION_SUCCESS, payload: response });
const getPermissionFailure = (error) => ({ type: types.GET_PERMISSION_FAILURE, payload: error });

const getPermissionDetailsRequest = () => ({ type: types.GET_PERMISSION_DETAILS_REQUEST });
const getPermissionDetailsSuccess = (response) => ({ type: types.GET_PERMISSION_DETAILS_SUCCESS, payload: response });
const getPermissionDetailsFailure = (error) => ({ type: types.GET_PERMISSION_DETAILS_FAILURE, payload: error });

const getPermission = (params) => async (dispatch) => {
  try {
    dispatch(getPermissionRequest());
    const response = await httpClient.callApi({
      method: 'GET',
      url: apiLinks.permission.get,
      params,
    });
    dispatch(getPermissionSuccess(response?.data ?? {}));
    return response?.data ?? {};
  } catch (error) {
    dispatch(getPermissionFailure(error));
  }
};

const getPermissionDetail = (id) => async (dispatch) => {
  const params = { id: id };
  try {
    dispatch(getPermissionDetailsRequest());
    const response = await httpClient.callApi({
      method: 'GET',
      url: apiLinks.permission.getDetail(id),
      params
    });
    dispatch(getPermissionDetailsSuccess(response?.data ?? {}));
    return response?.data ?? {};
  } catch (error) {
    dispatch(getPermissionDetailsFailure(error));
  }
};
export {
  getPermission,
  getPermissionDetail,
};
