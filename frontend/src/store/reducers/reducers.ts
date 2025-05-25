/* eslint-disable @typescript-eslint/no-explicit-any */

import { SAVE_USER, SAVE_USER_EMAIL } from "../actions/action";


const initialState = {
  email: null,
  user : null
};

export type RootState = ReturnType<typeof rootReducer>;


const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SAVE_USER_EMAIL:
      return {
        ...state,
        email: action.payload,
      };
    case SAVE_USER:
      return {
        ...state,
        user : action.payload,
      }
    default:
      return state;
  }
};

export default rootReducer;




