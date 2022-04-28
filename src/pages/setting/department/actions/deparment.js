import {
    GET_DEPARTMENTS_REQUEST,
    GET_DEPARTMENTS_SUCCESS,
    GET_DEPARTMENTS_FAILURE,
} from 'pages/setting/department/actions/types';
import departmentApi from 'api/departmentApi';

const getDepartmentsRequest = () => ({ type: GET_DEPARTMENTS_REQUEST });
const getDepartmentsSuccess = (response) => ({ type: GET_DEPARTMENTS_SUCCESS, payload: response });
const getDepartmentsFailure = (error) => ({ type: GET_DEPARTMENTS_FAILURE, payload: error });

const getDepartments = () => async (dispatch) => {
    try {
        const { success, meta, data } = await departmentApi.get();
        if (success) {
            dispatch(getDepartmentsSuccess({ data, totalSizes: meta.total }));
        }
    } catch (error) {
        dispatch(getDepartmentsFailure(error));
    }
};

export {
    getDepartments,
    getDepartmentsRequest,
    getDepartmentsSuccess,
    getDepartmentsFailure,
};
