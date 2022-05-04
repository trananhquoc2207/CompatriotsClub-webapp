import types from 'pages/member/actions/types';

const INITIAL_STATE = {
  contractDetailsSelected: undefined,
  employeeFilter: {},
  employees: {
    data: [],
    totalSizes: 0,
  },
  employeeDetails: {},
  getEmployeesLoading: false,
  getEmployeeDetailsLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.CONTRACT_DETAILS_SELECTED:
      return {
        ...state,
        contractDetailsSelected: action.payload,
      };
    case types.SET_EMPLOYEE_FILTER:
      return {
        ...state,
        employeeFilter: action.payload,
      };
    case types.GET_EMPLOYEES_REQUEST:
      return {
        ...state,
        getEmployeesLoading: true,
      };
    case types.GET_EMPLOYEES_SUCCESS:
      return {
        ...state,
        employees: action.payload,
        getEmployeesLoading: false,
      };
    case types.GET_EMPLOYEES_FAILURE:
      return {
        ...state,
        getEmployeesLoading: false,
      };
    case types.GET_EMPLOYEE_DETAILS_REQUEST:
      return {
        ...state,
        getEmployeeDetailsLoading: true,
      };
    case types.GET_EMPLOYEE_DETAILS_SUCCESS:
      return {
        ...state,
        employeeDetails: action.payload,
        getEmployeeDetailsLoading: false,
      };
    case types.GET_EMPLOYEE_DETAILS_FAILURE:
      return {
        ...state,
        getEmployeeDetailsLoading: false,
      };
    default:
      return state;
  }
}
