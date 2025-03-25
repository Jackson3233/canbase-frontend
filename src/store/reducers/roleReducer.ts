import { createSlice } from "@reduxjs/toolkit";

export interface IRole {
  rolename: string;
  roledesc: string;
  roleID: string;
  rolecolor: string;
  club: string;
  users: string[];
  functions: string[];
}

interface InitialStateType {
  role: IRole[];
}

const initialState: InitialStateType = {
  role: [],
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload.role;
    },
  },
});

export const roleReducer = roleSlice.reducer;
export const roleActions = roleSlice.actions;
