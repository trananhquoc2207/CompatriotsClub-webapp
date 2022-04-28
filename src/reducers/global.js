import types from 'actions/types';

const INITIAL_STATE = {
  exportLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.EXPORT_REQUEST:
      return {
        ...state,
        exportLoading: true,
      };
    case types.EXPORT_SUCCESS:
      return {
        ...state,
        attendances: action.payload,
        exportLoading: false,
      };
    case types.EXPORT_FAILURE:
      return {
        ...state,
        exportLoading: false,
      };
    default:
      return state;
  }
}
