import types from 'pages/kpi/actions/types';

const INITIAL_STATE = {
  kpiFilter: {},
  kpiDetailFilter: {},
  kpiDetail: {},
  getKpiDetailLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.KPI_FILTER:
      return {
        ...state,
        kpiFilter: action.payload,
      };
    case types.KPI_DETAIL_FILTER:
      return {
        ...state,
        kpiDetailFilter: action.payload,
      };
    case types.GET_KPI_DETAIL_REQUEST:
      return {
        ...state,
        getKpiDetailLoading: true,
      };
    case types.GET_KPI_DETAIL_SUCCESS:
      return {
        ...state,
        kpiDetail: action.payload,
        getKpiDetailLoading: false,
      };
    case types.GET_KPI_DETAIL_FAILURE:
      return {
        ...state,
        getKpiDetailLoading: false,
      };
    default:
      return state;
  }
}
