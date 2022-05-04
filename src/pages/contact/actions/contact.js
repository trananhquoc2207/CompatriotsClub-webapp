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

// const getContactGroupRequest = () => ({ type: types.GET_CONTACT_GROUP_REQUEST });
// const getContactGrouptSuccess = (response) => ({ type: types.GET_CONTACT_GROUP_SUCCESS, payload: response });
// const getContactGroupFailure = (error) => ({ type: types.GET_CONTACT_GROUP_FAILURE, payload: error });

// const getContactGroup = (p) => async (dispatch) => {
//   try {
//     dispatch(getContactGroupRequest());
//     const { success, totalCounts, data } = await contactApi.get(p);
//     if (success) {
//       dispatch(getContactGrouptSuccess({ data, totalCounts }));
//     }
//   } catch (error) {
//     dispatch(getContactGroupFailure(error));
//   }
// };



export {
  getContacts,
 // getContactGroup,
};
