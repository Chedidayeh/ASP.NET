
// Action Types

import { User } from "@/services/api";

export const SAVE_USER_EMAIL = 'SAVE_USER_EMAIL';
export const SAVE_USER = 'SAVE_USER';


// Action Creators

  export const saveUserEmail = (email : string | null) => ({
    type: SAVE_USER_EMAIL,
    payload: email,
  });

  export const saveUser = (user : User | null) => ({
    type: SAVE_USER,
    payload: user,
  });










