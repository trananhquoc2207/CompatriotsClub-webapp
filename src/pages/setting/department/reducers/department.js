import {
    GET_DEPARTMENTS_REQUEST,
    GET_DEPARTMENTS_SUCCESS,
    GET_DEPARTMENTS_FAILURE,
} from 'pages/setting/department/actions/types';

const INITIAL_STATE = {
    department: {
        data: [],
        totalSizes: 0,
    },
    getDepartmentsLoading: false,
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_DEPARTMENTS_REQUEST:
            return {
                ...state,
                getUserInfoLoading: true,
            };
        case GET_DEPARTMENTS_SUCCESS:
            return {
                ...state,
                department: action.payload,
                getUserInfoLoading: false,
            };
        case GET_DEPARTMENTS_FAILURE:
            return {
                ...state,
                getUserInfoLoading: false,
            };
        default:
            return state;
    }
}
