import types from 'pages/unit/actions/types';
import { defaultPaging } from 'utils/helpers';

const INITIAL_STATE = {
  units: defaultPaging,
  unitGroup: defaultPaging,
  levelOneByUnit: defaultPaging,
  levelTwoByUnit: defaultPaging,
  levelThreeByUnit: defaultPaging,
  levelFourByUnit: defaultPaging,
  getUnitsLoading: false,
  getUnitGroupLoading: false,
  getLevelOneByUnitLoading: false,
  getLevelTwoByUnitLoading: false,
  getLevelThreeByUnitLoading: false,
  getLevelFourByUnitLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_UNITS_REQUEST:
      return {
        ...state,
        getUnitsLoading: true,
      };
    case types.GET_UNITS_SUCCESS:
      return {
        ...state,
        units: action.payload,
        getUnitsLoading: false,
      };
    case types.GET_UNITS_FAILURE:
      return {
        ...state,
        getUnitsLoading: false,
      };
    case types.GET_UNIT_GROUP_REQUEST:
      return {
        ...state,
        getUnitGroupLoading: true,
      };
    case types.GET_UNIT_GROUP_SUCCESS:
      return {
        ...state,
        unitGroup: action.payload,
        getUnitGroupLoading: false,
      };
    case types.GET_UNIT_GROUP_FAILURE:
      return {
        ...state,
        getUnitGroupLoading: false,
      };
    case types.GET_LEVEL_ONE_BY_UNIT_REQUEST:
      return {
        ...state,
        getLevelOneByUnitLoading: true,
      };
    case types.GET_LEVEL_ONE_BY_UNIT_SUCCESS:
      return {
        ...state,
        levelOneByUnit: action.payload,
        getLevelOneByUnitLoading: false,
      };
    case types.GET_LEVEL_ONE_BY_UNIT_FAILURE:
      return {
        ...state,
        getLevelOneByUnitLoading: false,
      };
    case types.GET_LEVEL_TWO_BY_UNIT_REQUEST:
      return {
        ...state,
        getLevelTwoByUnitLoading: true,
      };
    case types.GET_LEVEL_TWO_BY_UNIT_SUCCESS:
      return {
        ...state,
        levelTwoByUnit: action.payload,
        getLevelTwoByUnitLoading: false,
      };
    case types.GET_LEVEL_TWO_BY_UNIT_FAILURE:
      return {
        ...state,
        getLevelTwoByUnitLoading: false,
      };
    case types.GET_LEVEL_THREE_BY_UNIT_REQUEST:
      return {
        ...state,
        getLevelThreeByUnitLoading: true,
      };
    case types.GET_LEVEL_THREE_BY_UNIT_SUCCESS:
      return {
        ...state,
        levelThreeByUnit: action.payload,
        getLevelThreeByUnitLoading: false,
      };
    case types.GET_LEVEL_THREE_BY_UNIT_FAILURE:
      return {
        ...state,
        getLevelThreeByUnitLoading: false,
      };
    case types.GET_LEVEL_THREE_BY_UNIT_REQUEST:
      return {
        ...state,
        getLevelThreeByUnitLoading: true,
      };
    case types.GET_LEVEL_THREE_BY_UNIT_SUCCESS:
      return {
        ...state,
        levelThreeByUnit: action.payload,
        getLevelThreeByUnitLoading: false,
      };
    case types.GET_LEVEL_THREE_BY_UNIT_FAILURE:
      return {
        ...state,
        getLevelThreeByUnitLoading: false,
      };

    case types.GET_LEVEL_FOUR_BY_UNIT_REQUEST:
      return {
        ...state,
        getLevelFourByUnitLoading: true,
      };
    case types.GET_LEVEL_FOUR_BY_UNIT_SUCCESS:
      return {
        ...state,
        levelFourByUnit: action.payload,
        getLevelFourByUnitLoading: false,
      };
    case types.GET_LEVEL_FOUR_BY_UNIT_FAILURE:
      return {
        ...state,
        getLevelFourByUnitLoading: false,
      };
    default:
      return state;
  }
}
