import { createContext } from "react";

export const UserContext = createContext();

export const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "CLEAR_USER":
      return null;
    default:
      return state;
  }
}