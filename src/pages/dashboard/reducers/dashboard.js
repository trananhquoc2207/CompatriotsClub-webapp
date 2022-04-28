/* eslint-disable no-tabs */
import {
	GET_DASHBOARD_REQUEST,
	GET_DASHBOARD_SUCCESS,
	GET_DASHBOARD_FAILURE,
} from 'pages/dashboard/actions/types';

const INITIAL_STATE = {
	dashboard: {},
	getDashboardLoading: false,
};

export default function (state = INITIAL_STATE, action) {
	switch (action.type) {
		case GET_DASHBOARD_REQUEST: {
			return {
				...state,
				getDashboardLoading: true,
			};
		}
		case GET_DASHBOARD_SUCCESS: {
			return {
				...state,
				dashboard: action.payload,
				getDashboardLoading: false,
			};
		}
		case GET_DASHBOARD_FAILURE: {
			return {
				...state,
				getDashboardLoading: false,
			};
		}
		default:
			return state;
	}
}
