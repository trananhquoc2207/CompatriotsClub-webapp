import assessmentApi from 'api/assessmentApi';
import types from './types';

const setKpiFilter = (payload) => ({ type: types.KPI_FILTER, payload });
const setKpiDetailFilter = (payload) => ({ type: types.KPI_DETAIL_FILTER, payload });

// #region CRUD
const getKpiDetailRequest = () => ({ type: types.GET_KPI_DETAIL_REQUEST });
const getKpiDetailSuccess = (response) => ({ type: types.GET_KPI_DETAIL_SUCCESS, payload: response });
const getKpiDetailFailure = (error) => ({ type: types.GET_KPI_DETAIL_FAILURE, payload: error });

const getKpiDetail = (p) => async (dispatch) => {
  try {
    dispatch(getKpiDetailRequest());
    const data = await assessmentApi.get(p);
    dispatch(getKpiDetailSuccess(data || {}));
  } catch (error) {
    dispatch(getKpiDetailFailure(error));
  }
};
// #endregion

export {
  setKpiFilter,
  setKpiDetailFilter,
  getKpiDetail,
};
