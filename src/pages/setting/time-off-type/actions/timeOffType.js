import timeOffTypeApi from 'api/timeOffTypeApi';
import types from './types';

// const getTimeOffType = (p) => async (dispatch) => {
//   try {
//     dispatch(getTimeOffTypeRequest());
//     const { success, meta, data } = await timeOffTypeApi.get(p);
//     console.log(object);
//     if (success) {
//       dispatch(getTimeOffTypeSuccess({ data }));
//     }
//   } catch (error) {
//     dispatch(getTimeOffTypeFailure(error));
//   }
// };

const getTimeOffTypeRequest = () => ({ type: types.GET_TIME_OFF_TYPE_REQUEST });
const getTimeOffTypeSuccess = (response) => ({ type: types.GET_TIME_OFF_TYPE_SUCCESS, payload: response });
const getTimeOffTypeFailure = (error) => ({ type: types.GET_TIME_OFF_TYPE_FAILURE, payload: error });

const getTimeOffType = (p) => async (dispatch) => {
  try {
    dispatch(getTimeOffTypeRequest());
    const { success, meta, data } = await timeOffTypeApi.get(p);
    if (success) {
      dispatch(getTimeOffTypeSuccess({ data, totalSizes: meta.total }));
    }
  } catch (error) {
    dispatch(getTimeOffTypeFailure(error));
  }
};
export {
  getTimeOffType,
};
