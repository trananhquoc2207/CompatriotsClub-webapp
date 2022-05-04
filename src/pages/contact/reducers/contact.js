import types from 'pages/contact/actions/types';
import { defaultPaging } from 'utils/helpers';

const INITIAL_STATE = {
  contacts: defaultPaging,
  contactGroup: defaultPaging,
  levelOneByContact: defaultPaging,
  levelTwoByContact: defaultPaging,
  levelThreeByContact: defaultPaging,
  levelFourByContact: defaultPaging,
  getContactsLoading: false,
  getContactGroupLoading: false,
  getLevelOneByContactLoading: false,
  getLevelTwoByContactLoading: false,
  getLevelThreeByContactLoading: false,
  getLevelFourByContactLoading: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_CONTACTS_REQUEST:
      return {
        ...state,
        getContactsLoading: true,
      };
    case types.GET_CONTACTS_SUCCESS:
      return {
        ...state,
        contacts: action.payload,
        getContactsLoading: false,
      };
    case types.GET_CONTACTS_FAILURE:
      return {
        ...state,
        getContactsLoading: false,
      };
    case types.GET_CONTACT_GROUP_REQUEST:
      return {
        ...state,
        getContactGroupLoading: true,
      };
    case types.GET_CONTACT_GROUP_SUCCESS:
      return {
        ...state,
        contactGroup: action.payload,
        getContactGroupLoading: false,
      };
    case types.GET_CONTACT_GROUP_FAILURE:
      return {
        ...state,
        getContactGroupLoading: false,
      };
    case types.GET_LEVEL_ONE_BY_CONTACT_REQUEST:
      return {
        ...state,
        getLevelOneByContactLoading: true,
      };
    case types.GET_LEVEL_ONE_BY_CONTACT_SUCCESS:
      return {
        ...state,
        levelOneByContact: action.payload,
        getLevelOneByContactLoading: false,
      };
    case types.GET_LEVEL_ONE_BY_CONTACT_FAILURE:
      return {
        ...state,
        getLevelOneByContactLoading: false,
      };
    case types.GET_LEVEL_TWO_BY_CONTACT_REQUEST:
      return {
        ...state,
        getLevelTwoByContactLoading: true,
      };
    case types.GET_LEVEL_TWO_BY_CONTACT_SUCCESS:
      return {
        ...state,
        levelTwoByContact: action.payload,
        getLevelTwoByContactLoading: false,
      };
    case types.GET_LEVEL_TWO_BY_CONTACT_FAILURE:
      return {
        ...state,
        getLevelTwoByContactLoading: false,
      };
    case types.GET_LEVEL_THREE_BY_CONTACT_REQUEST:
      return {
        ...state,
        getLevelThreeByContactLoading: true,
      };
    case types.GET_LEVEL_THREE_BY_CONTACT_SUCCESS:
      return {
        ...state,
        levelThreeByContact: action.payload,
        getLevelThreeByContactLoading: false,
      };
    case types.GET_LEVEL_THREE_BY_CONTACT_FAILURE:
      return {
        ...state,
        getLevelThreeByContactLoading: false,
      };
    case types.GET_LEVEL_FOUR_BY_CONTACT_REQUEST:
      return {
        ...state,
        getLevelFourByContactLoading: true,
      };
    case types.GET_LEVEL_FOUR_BY_CONTACT_SUCCESS:
      return {
        ...state,
        levelFourByContact: action.payload,
        getLevelFourByContactLoading: false,
      };
    case types.GET_LEVEL_FOUR_BY_CONTACT_FAILURE:
      return {
        ...state,
        getLevelFourByContactLoading: false,
      };
    default:
      return state;
  }
}
