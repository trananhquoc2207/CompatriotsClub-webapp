import { defaultPaging } from 'utils/helpers';
import types from '../actions/types';

const INITIAL_STATE = {
  mealStatisticFilter: {},
  mealStatistic: {
    data: [],
    totalCounts: 0,
  },
  mealTypeList: {
    data: [],
    totalSizes: 0,
  },
  getMealTypeLoading: false,
  getMealStatisticLoading: false,
  riceRegisteredOfEmployee: {
    riceStatistics: [],
  },
  getRiceRegisteredOfEmployeeLoading: false,
  confirmRegisteredMealLoading: false,
  updateMealTypeLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.MEAL_STATISTIC_FILTER:
      return {
        ...state,
        mealStatisticFilter: action.payload,
      };
    case types.GET_MEAL_STATISTIC_REQUEST:
      return {
        ...state,
        getMealStatisticLoading: true,
      };
    case types.GET_MEAL_STATISTIC_SUCCESS:
      return {
        ...state,
        mealStatistic: action.payload,
        getMealStatisticLoading: false,
      };
    case types.GET_MEAL_STATISTIC_FAILURE:
      return {
        ...state,
        getMealStatisticLoading: false,
      };
    case types.GET_LIST_EMPLOYEE_POST_BY_LEADER_REQUEST:
      return {
        ...state,
        getMealStatisticLoading: true,
      };
    case types.GET_LIST_EMPLOYEE_POST_BY_LEADER_SUCCESS:
      return {
        ...state,
        mealStatistic: action.payload,
        getMealStatisticLoading: false,
      };
    case types.GET_LIST_EMPLOYEE_POST_BY_LEADER_FAILURE:
      return {
        ...state,
        getMealStatisticLoading: false,
      };
    case types.GET_RICE_REGISTERED_OF_EMPLOYEE_REQUEST:
      return {
        ...state,
        getRiceRegisteredOfEmployeeLoading: true,
      };
    case types.GET_RICE_REGISTERED_OF_EMPLOYEE_SUCCESS:
      return {
        ...state,
        riceRegisteredOfEmployee: action.payload,
        getRiceRegisteredOfEmployeeLoading: false,
      };
    case types.GET_RICE_REGISTERED_OF_EMPLOYEE_FAILURE:
      return {
        ...state,
        getRiceRegisteredOfEmployeeLoading: false,
      };
    case types.GET_TYPE_REGISTERED_MEAL_REQUEST:
      return {
        ...state,
        getMealTypeLoading: true,
      };
    case types.GET_TYPE_REGISTERED_MEAL_SUCCESS:
      return {
        ...state,
        mealTypeList: action.payload,
        getMealTypeLoading: false,
      };
    case types.GET_TYPE_REGISTERED_MEAL_FAILURE:
      return {
        ...state,
        getMealTypeLoading: false,
      };
    case types.CONFIRM_REGISTERED_MEAL_REQUEST:
      return {
        ...state,
        confirmRegisteredMealLoading: true,
      };
    case types.CONFIRM_REGISTERED_MEAL_SUCCESS:
      return {
        ...state,
        confirmRegisteredMealLoading: false,
      };
    case types.CONFIRM_REGISTERED_MEAL_FAILURE:
      return {
        ...state,
        confirmRegisteredMealLoading: false,
      };
    case types.UPDATE_MEAL_TYPE_REQUEST:
      return {
        ...state,
        updateMealTypeLoading: true,
      };
    case types.UPDATE_MEAL_TYPE_SUCCESS:
      return {
        ...state,
        updateMealTypeLoading: false,
      };
    case types.UPDATE_MEAL_TYPE_FAILURE:
      return {
        ...state,
        updateMealTypeLoading: false,
      };
    default:
      return state;
  }
}
