import shiftApi from 'api/shiftApi';
import shiftDetailApi from 'api/shiftDetailApi';
import apiLinks from 'utils/api-links';
import httpClient from 'utils/http-client';
import {
  GET_SHIFTS_REQUEST,
  GET_SHIFTS_SUCCESS,
  GET_SHIFTS_FAILURE,
  GET_SHIFT_DETAIL_REQUEST,
  GET_SHIFT_DETAIL_SUCCESS,
  GET_SHIFT_DETAIL_FAILURE,
} from './types';

// #region CRUD shift
const getShiftsRequest = () => ({ type: GET_SHIFTS_REQUEST });
const getShiftsSuccess = (response) => ({ type: GET_SHIFTS_SUCCESS, payload: response });
const getShiftsFailure = (error) => ({ type: GET_SHIFTS_FAILURE, payload: error });

const getShifts = (params) => async (dispatch) => {
  try {
    dispatch(getShiftsRequest());
    const { data: { success, meta, data } } =
      await httpClient.callApi({
        method: 'GET',
        url: apiLinks.scheduleGroup.get,
        params,
      });
    if (success) {
      dispatch(getShiftsSuccess({ data, totalSizes: meta.total }));
      return { data, totalSizes: meta.total };
    }
  } catch (error) {
    dispatch(getShiftsFailure(error));
    return { data: [], totalSizes: 0 };
  }
};
// #endregion
// #region CRUD Shift details
const getShiftDetailRequest = () => ({ type: GET_SHIFT_DETAIL_REQUEST });
const getShiftDetailSuccess = (response) => ({ type: GET_SHIFT_DETAIL_SUCCESS, payload: response });
const getShiftDetailFailure = (error) => ({ type: GET_SHIFT_DETAIL_FAILURE, payload: error });

const getShiftDetail = (p) => async (dispatch) => {
  try {
    dispatch(getShiftDetailRequest());
    const { success, meta, data } = await shiftDetailApi.get(p);
    if (success) {
      dispatch(getShiftDetailSuccess({ data, totalSizes: meta.total }));
      return { data, totalSizes: meta.total };
    }
  } catch (error) {
    dispatch(getShiftDetailFailure(error));
    return { data: [], totalSizes: 0 };
  }
};
// #endregion

export {
  getShifts,
  getShiftDetail,
};
