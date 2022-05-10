/* eslint-disable no-useless-concat */
import axios from 'axios';
import {
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
} from '../../../constants/constants';
import { enqueueSnackbar } from '../Notifier/NotifierAction';
import { I18n } from 'react-redux-i18n';
import { userList } from './UserList';

export const createUser = (token, userData) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return (dispatch) => {
    axios
      .post(`${process.env.REACT_APP_AUTH_URL}/admin/realms/${process.env.REACT_APP_REALMS}/users`, userData, config)
      .then(response => {
        dispatch(createUserSuccess(response.data));
        dispatch(userList(token));
        dispatch(enqueueSnackbar({
          message: I18n.t(("USER_MANAGEMENT.USER_CREATED")),
          options: {
            variant: 'success'
          }
        }));
      })
      .catch(error => {
        if (error.response) {
          if (error.response.data.errorMessage) {
            dispatch(createUserFailure(error.response));
            dispatch(enqueueSnackbar({
              message: I18n.t(`ERRORCODES.${[error.response.data.errorMessage]}`),
              options: {
                variant: 'error'
              }
            }));
          } else if (error.response.data.error) {
            dispatch(enqueueSnackbar({
              message: I18n.t(`ERRORCODES.${[error.response.statusText]}`),
              options: {
                variant: 'error'
              }
            }));
          }
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


export const createUserSuccess = user => {
  return {
    type: CREATE_USER_SUCCESS,
    payload: user
  }
}

export const createUserFailure = error => {
  return {
    type: CREATE_USER_FAILURE,
    payload: error
  }
}