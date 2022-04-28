import unitApi from 'api/unitApi';
import types from './types';

const params = {
  page_number: 0,
  page_size: 100,
}
const getUnitsRequest = () => ({ type: types.GET_UNITS_REQUEST });
const getUnitsSuccess = (response) => ({ type: types.GET_UNITS_SUCCESS, payload: response });
const getUnitsFailure = (error) => ({ type: types.GET_UNITS_FAILURE, payload: error });

const getUnits = (p) => async (dispatch) => {
  try {
    dispatch(getUnitsRequest());
    const { success, meta, data } = await unitApi.get(p);
    if (success) {
      dispatch(getUnitsSuccess({ data, totalSizes: meta.total }));
    }
  } catch (error) {
    dispatch(getUnitsFailure(error));
  }
};

const getUnitGroupRequest = () => ({ type: types.GET_UNIT_GROUP_REQUEST });
const getUnitGrouptSuccess = (response) => ({ type: types.GET_UNIT_GROUP_SUCCESS, payload: response });
const getUnitGroupFailure = (error) => ({ type: types.GET_UNIT_GROUP_FAILURE, payload: error });

const getUnitGroup = (p) => async (dispatch) => {
  try {
    dispatch(getUnitGroupRequest());
    const { success, meta, data } = await unitApi.get(p);
    if (success) {
      dispatch(getUnitGrouptSuccess({ data, totalSizes: meta.total }));
    }
  } catch (error) {
    dispatch(getUnitGroupFailure(error));
  }
};

const getLevelOneByUnitRequest = () => ({ type: types.GET_LEVEL_ONE_BY_UNIT_REQUEST });
const getLevelOneByUnitSuccess = (response) => ({ type: types.GET_LEVEL_ONE_BY_UNIT_SUCCESS, payload: response });
const getLevelOneByUnitFailure = (error) => ({ type: types.GET_LEVEL_ONE_BY_UNIT_FAILURE, payload: error });

const getLevelOneByUnit = (p) => async (dispatch) => {
  try {
    dispatch(getLevelOneByUnitRequest());
    const { success, meta, data } = await unitApi.get({ ...p, ...params, loaiDonVi: 0 });
    if (success) {
      dispatch(getLevelOneByUnitSuccess({ data, totalCount: meta.total }));
      return { data, totalCount: meta.total };
    }
  } catch (error) {
    dispatch(getLevelOneByUnitFailure(error));
    return { data: [], totalCount: 0 };
  }
};

const getLevelTwoByUnitRequest = () => ({ type: types.GET_LEVEL_TWO_BY_UNIT_REQUEST });
const getLevelTwoByUnitSuccess = (response) => ({ type: types.GET_LEVEL_TWO_BY_UNIT_SUCCESS, payload: response });
const getLevelTwoByUnitFailure = (error) => ({ type: types.GET_LEVEL_TWO_BY_UNIT_FAILURE, payload: error });

const getLevelTwoByUnit = (p) => async (dispatch) => {
  try {
    dispatch(getLevelTwoByUnitRequest());
    const { success, meta, data } = await unitApi.get({ ...p, ...params, loaiDonVi: 1 });
    if (success) {
      dispatch(getLevelTwoByUnitSuccess({ data, totalCount: meta.total }));
      return { data, totalCount: meta.total };
    }
  } catch (error) {
    dispatch(getLevelTwoByUnitFailure(error));
    return { data: [], totalCount: 0 };
  }
};
const getLevelThreeByUnitRequest = () => ({ type: types.GET_LEVEL_THREE_BY_UNIT_REQUEST });
const getLevelThreeByUnitSuccess = (response) => ({ type: types.GET_LEVEL_THREE_BY_UNIT_SUCCESS, payload: response });
const getLevelThreeByUnitFailure = (error) => ({ type: types.GET_LEVEL_THREE_BY_UNIT_FAILURE, payload: error });

const getLevelThreeByUnit = (p) => async (dispatch) => {
  try {
    dispatch(getLevelThreeByUnitRequest());
    const { success, meta, data } = await unitApi.get({ ...p, ...params, loaiDonVi: 2 });
    if (success) {
      dispatch(getLevelThreeByUnitSuccess({ data, totalCount: meta.total }));
      return { data, totalCount: meta.total };
    }
  } catch (error) {
    dispatch(getLevelThreeByUnitFailure(error));
    return { data: [], totalCount: 0 };
  }
};

const getLevelFourByUnitRequest = () => ({ type: types.GET_LEVEL_FOUR_BY_UNIT_REQUEST });
const getLevelFourByUnitSuccess = (response) => ({ type: types.GET_LEVEL_FOUR_BY_UNIT_SUCCESS, payload: response });
const getLevelFourByUnitFailure = (error) => ({ type: types.GET_LEVEL_FOUR_BY_UNIT_FAILURE, payload: error });

const getLevelFourByUnit = (p) => async (dispatch) => {
  try {
    dispatch(getLevelFourByUnitRequest());
    const { success, meta, data } = await unitApi.get({ ...p, ...params, loaiDonVi: 3 });
    if (success) {
      dispatch(getLevelFourByUnitSuccess({ data, totalCount: meta.total }));
      return { data, totalCount: meta.total };
    }
  } catch (error) {
    dispatch(getLevelFourByUnitFailure(error));
    return { data: [], totalCount: 0 };
  }
};

export {
  getUnits,
  getUnitGroup,
  getLevelOneByUnit,
  getLevelTwoByUnit,
  getLevelThreeByUnit,
  getLevelFourByUnit
};
