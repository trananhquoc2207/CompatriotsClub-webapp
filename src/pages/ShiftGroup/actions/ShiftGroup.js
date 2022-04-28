import apiLinks from 'utils/api-links';
import httpClient from 'utils/http-client';
import types from './types';

const getGroupRequest = () => ({ type: types.GET_GROUP_REQUEST });
const getGroupSuccess = (response) => ({ type: types.GET_GROUP_SUCCESS, payload: response });
const getGroupFailure = (error) => ({ type: types.GET_GROUP_FAILURE, payload: error });

const getGroupDetailsRequest = () => ({ type: types.GET_GROUP_DETAILS_REQUEST });
const getGroupDetailsSuccess = (response) => ({ type: types.GET_GROUP_DETAILS_SUCCESS, payload: response });
const getGroupDetailsFailure = (error) => ({ type: types.GET_GROUP_DETAILS_FAILURE, payload: error });

const getScheduleGroup = (params) => async (dispatch) => {
  try {
    dispatch(getGroupRequest());
    const response = await httpClient.callApi({
      method: 'GET',
      url: apiLinks.scheduleGroup.get,
      params,
    });
    dispatch(getGroupSuccess(response?.data ?? {}));
    return response?.data ?? {};
  } catch (error) {
    dispatch(getGroupFailure(error));
  }
};

const getScheduleGroupDetail = (id) => async (dispatch) => {
  const params = { id: id };
  try {
    dispatch(getGroupDetailsRequest());
    const response = await httpClient.callApi({
      method: 'GET',
      url: apiLinks.scheduleGroup.getDetail(id),
      params
    });
    dispatch(getGroupDetailsSuccess(response?.data ?? {}));
    return response?.data ?? {};
  } catch (error) {
    dispatch(getGroupDetailsFailure(error));
  }
};
export {
  getScheduleGroup,
  getScheduleGroupDetail,
};
