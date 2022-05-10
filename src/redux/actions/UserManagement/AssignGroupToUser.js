import axios from 'axios';
import {
  ASSIGN_GROUP_TO_USER_SUCCESS,
  ASSIGN_GROUP_TO_USER_FAILURE,
} from '../../../constants/constants';
import { enqueueSnackbar } from '../Notifier/NotifierAction';
import { I18n } from 'react-redux-i18n';

export const assignGroupToUser = (token, userId, groupId) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return (dispatch) => {
    axios
      .put(`${process.env.REACT_APP_AUTH_URL}/admin/realms/${process.env.REACT_APP_REALMS}/users/${userId}/groups/${groupId}`, {}, config)
      .then(response => {
        dispatch(assignGroupToUserSuccess(response.data));
      })
      .catch(error => {
        if (error.response) {
          dispatch(assignGroupToUserFailure(error.message));
          dispatch(enqueueSnackbar({
            message: I18n.t(`ERRORCODES.${error.response.statusText}`),
            options: {
              variant: 'error'
            }
          }));
        } else {
          dispatch(enqueueSnackbar({
            message: I18n.t(`ERRORCODES.UNKNOWN_ERROR`),
            options: {
              variant: 'error'
            }
          }));
        }
      })
  };
};


export const assignGroupToUserSuccess = role => {
  return {
    type: ASSIGN_GROUP_TO_USER_SUCCESS,
    payload: role
  }
};

export const assignGroupToUserFailure = error => {
  return {
    type: ASSIGN_GROUP_TO_USER_FAILURE,
    payload: error
  }
};
