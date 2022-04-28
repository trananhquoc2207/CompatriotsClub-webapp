import {
  GET_SHIFTS_REQUEST,
  GET_SHIFTS_SUCCESS,
  GET_SHIFTS_FAILURE,
  GET_SHIFT_DETAIL_REQUEST,
  GET_SHIFT_DETAIL_SUCCESS,
  GET_SHIFT_DETAIL_FAILURE,
} from 'pages/shift/actions/types';

const INITIAL_STATE = {
  shifts: {
    data: [],
    totalSizes: 0,
  },
  shiftDetail: {
    data: [],
    totalSizes: 0,
  },
  getShiftsLoading: false,
  getShiftDetailLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_SHIFTS_REQUEST:
      return {
        ...state,
        getShiftsLoading: true,
      };
    case GET_SHIFTS_SUCCESS:
      return {
        ...state,
        shifts: action.payload,
        getShiftsLoading: false,
      };
    case GET_SHIFTS_FAILURE:
      return {
        ...state,
        getShiftsLoading: false,
      };
    case GET_SHIFT_DETAIL_REQUEST:
      return {
        ...state,
        getShiftDetailLoading: true,
      };
    case GET_SHIFT_DETAIL_SUCCESS:
      return {
        ...state,
        shiftDetail: action.payload,
        getShiftDetailLoading: false,
      };
    case GET_SHIFT_DETAIL_FAILURE:
      return {
        ...state,
        getShiftDetailLoading: false,
      };
    default:
      return state;
  }
}
