/* eslint-disable consistent-return */
import httpClient from 'utils/http-client';
import apiLinks from 'utils/api-links';
import types from './types';

// Schedule group CRUD
const getScheduleGroupsRequest = () => ({ type: types.GET_SCHEDULE_GROUP_REQUEST });
const getScheduleGroupsSuccess = (response) => ({ type: types.GET_SCHEDULE_GROUP_SUCCESS, payload: response });
const getScheduleGroupsFailure = (error) => ({ type: types.GET_SCHEDULE_GROUP_FAILURE, payload: error });

const getScheduleGroups = (params) => async (dispatch) => {
  try {
    dispatch(getScheduleGroupsRequest());
    const response =
      await httpClient.callApi({
        method: 'GET',
        url: apiLinks.scheduleGroup.get,
        params,
      });
    dispatch(getScheduleGroupsSuccess(response.data));
    return response.data?.data ?? [];
  } catch (error) {
    dispatch(getScheduleGroupsFailure(error));
  }
};

export {
  getScheduleGroups,
};
