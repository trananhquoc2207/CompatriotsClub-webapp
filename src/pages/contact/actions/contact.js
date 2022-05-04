import contactApi from 'api/contactApi';
import types from './types';

const params = {
  page_number: 0,
  page_size: 100,
}
const getContactsRequest = () => ({ type: types.GET_CONTACTS_REQUEST });
const getContactsSuccess = (response) => ({ type: types.GET_CONTACTS_SUCCESS, payload: response });
const getContactsFailure = (error) => ({ type: types.GET_CONTACTS_FAILURE, payload: error });

const getContacts = (p) => async (dispatch) => {
    dispatch(getContactsRequest());
    const { success, totalCounts, data } = await contactApi.get(p);
    dispatch(getContactsSuccess({ data, totalCounts }));
 
};

export {
  getContacts,
};
