import apiLinks from 'utils/api-links';
import httpClient from 'utils/http-client';
import types from './types';

const getUserRequest = () => ({ type: types.GET_USER_REQUEST });
const getUserSuccess = (response) => ({ type: types.GET_USER_SUCCESS, payload: response });
const getUserFailure = (error) => ({ type: types.GET_USER_FAILURE, payload: error });

const getUsers = (params) => async (dispatch) => {
  try {
    dispatch(getUserRequest());
    const response = await httpClient.callApi({
      method: 'GET',
      url: apiLinks.userManagement.user.get,
      params,
    });

    const { data, meta } = response.data;
    dispatch(getUserSuccess({ data: data || [], totalCount: meta?.total ?? 0 }));

    return { data: data || [], totalCount: meta?.total ?? 0 };
  } catch (error) {
    dispatch(getUserFailure(error));
  }
};

const getUserWithoutDispatch = async (params) => {
  const result = {
    totalCount: 0,
    data: [],
  }
  try {
    const response = await httpClient.callApi({
      method: 'GET',
      url: apiLinks.userManagement.user.get,
      params,
    });

    const { data, meta } = response.data;
    result.totalCount = meta?.total ?? result.totalCount;
    result.data = data || result.data;
  } catch (error) { }
  return result;
}

export {
  getUsers,
  getUserWithoutDispatch,
};
