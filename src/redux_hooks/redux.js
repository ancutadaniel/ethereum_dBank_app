import * as ACTIONS from './constants';

export const reducer = (state, action) => {
  const { SET_WEB3, SET_ERROR, SET_DEPOSIT, SET_LOADING } = ACTIONS;

  switch (action.type) {
    case SET_WEB3:
      return {
        ...state,
        ...action.value,
      };

    case SET_DEPOSIT:
      return {
        ...state,
        reloadData: true,
        loading: false,
      };

    case SET_LOADING:
      return {
        ...state,
        loading: !state.loading,
      };

    case SET_ERROR:
      return {
        ...state,
        errors: action.value,
      };

    default:
      return {
        ...state,
      };
  }
};
