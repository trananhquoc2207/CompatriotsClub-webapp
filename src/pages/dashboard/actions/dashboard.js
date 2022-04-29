import dashboardApi from 'api/dashboardApi';
import {
  GET_DASHBOARD_REQUEST,
  GET_DASHBOARD_SUCCESS,
  GET_DASHBOARD_FAILURE,
} from './types';

const getDashboardRequest = () => ({ type: GET_DASHBOARD_REQUEST });
const getDashboardSuccess = (response) => ({ type: GET_DASHBOARD_SUCCESS, payload: response });
const getDashboardFailure = (error) => ({ type: GET_DASHBOARD_FAILURE, payload: error });

const getDashboards = () => (dispatch) => new Promise((resolve, reject) => {
  dispatch(getDashboardRequest());
  dashboardApi
    .get()
    .then((response) => {
      dispatch(getDashboardSuccess(response || {}));
      resolve();
    })
    .catch((error) => {
      dispatch(getDashboardFailure(error));
    });
});

export {
  getDashboards,
};
