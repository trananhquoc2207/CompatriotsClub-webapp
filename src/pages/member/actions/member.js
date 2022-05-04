import employeeApi from 'api/employeeApi';
import types from './types';

const setEmployeeFilter = (payload) => ({ type: types.SET_EMPLOYEE_FILTER, payload });
const setContractDetailsSelected = (payload) => ({ type: types.CONTRACT_DETAILS_SELECTED, payload });

// #region CRUD
const getEmployeesRequest = () => ({ type: types.GET_EMPLOYEES_REQUEST });
const getEmployeesSuccess = (response) => ({ type: types.GET_EMPLOYEES_SUCCESS, payload: response });
const getEmployeesFailure = (error) => ({ type: types.GET_EMPLOYEES_FAILURE, payload: error });

const getEmployees = (p) => async (dispatch) => {
  try {
    dispatch(getEmployeesRequest());
    const { totalCounts, data } = await employeeApi.get(p);
      dispatch(getEmployeesSuccess({ data : data, totalSizes: totalCounts }));
      return data;
    
  } catch (error) {
    dispatch(getEmployeesFailure(error));
  }
};

const getEmployeeDetailsRequest = () => ({ type: types.GET_EMPLOYEE_DETAILS_REQUEST });
const getEmployeeDetailsSuccess = (response) => ({ type: types.GET_EMPLOYEE_DETAILS_SUCCESS, payload: response });
const getEmployeeDetailsFailure = (error) => ({ type: types.GET_EMPLOYEE_DETAILS_FAILURE, payload: error });

const getEmployeeDetails = (id) => async (dispatch) => {
  try {
    dispatch(getEmployeeDetailsRequest());
    const { success, data } = await employeeApi.getID(id);
    if (success) {
      dispatch(getEmployeeDetailsSuccess(data));
    }
  } catch (error) {
    dispatch(getEmployeeDetailsFailure(error));
  }
};
// #endregion

export {
  getEmployees,
  getEmployeeDetails,
  setEmployeeFilter,
  setContractDetailsSelected,
};
