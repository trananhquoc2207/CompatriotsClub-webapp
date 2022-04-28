import {
  GET_KIOSKS_REQUEST,
  GET_KIOSKS_SUCCESS,
  GET_KIOSKS_FAILURE,
} from 'pages/kiosk/actions/types';
import { defaultPaging } from 'utils/helpers';

const INITIAL_STATE = {
  kiosks: defaultPaging,
  getKiosksLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_KIOSKS_REQUEST:
      return {
        ...state,
        getKiosksLoading: true,
      };
    case GET_KIOSKS_SUCCESS:
      return {
        ...state,
        kiosks: action.payload,
        getKiosksLoading: false,
      };
    case GET_KIOSKS_FAILURE:
      return {
        ...state,
        getKiosksLoading: false,
      };
    default:
      return state;
  }
}