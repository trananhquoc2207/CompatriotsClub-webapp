import {
  GET_KIOSKS_REQUEST,
  GET_KIOSKS_SUCCESS,
  GET_KIOSKS_FAILURE,
} from './types';
import kioskApi from 'api/kioskApi';
import { defaultPaging } from 'utils/helpers';

// #region CRUD shift
const getKiosksRequest = () => ({ type: GET_KIOSKS_REQUEST });
const getKiosksSuccess = (response) => ({ type: GET_KIOSKS_SUCCESS, payload: response });
const getKiosksFailure = (error) => ({ type: GET_KIOSKS_FAILURE, payload: error });

const getKiosks = (p) => async (dispatch) => {
  try {
    dispatch(getKiosksRequest());
    const { success, meta, data } = await kioskApi.get(p);
    if (success) {
      dispatch(getKiosksSuccess({ data, totalCount: meta.total }));
      return { data, totalCount: meta.total };
    }
  } catch (error) {
    dispatch(getKiosksFailure(error));
    return defaultPaging;
  }
};
// #endregion

export {
  getKiosks,
}