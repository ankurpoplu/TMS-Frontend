import {
  GET_KEYCLOAK_GROUPS_SUCCESS,
  GET_KEYCLOAK_GROUPS_FAILURE,
} from '../../../constants/constants'

const getKeycloakGroupsReducer = (state = [], action) => {
  switch (action.type) {
    case GET_KEYCLOAK_GROUPS_SUCCESS:
      return [...action.payload]

    case GET_KEYCLOAK_GROUPS_FAILURE:
      return [];

    default: return state;
  }
}

export default getKeycloakGroupsReducer;