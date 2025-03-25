import { createSlice } from "@reduxjs/toolkit";

export interface IStorages {
  _id: string;
  storagename: string;
  description?: string;
  avatar?: string;
  street?: string;
  address?: string;
  postcode?: string;
  city?: string;
  country?: string;
  tags?: string[];
  note?: string;
  storageID: string;
}

interface InitialStateType {
  storages: IStorages[];
}

const initialState: InitialStateType = {
  storages: [],
};

const storagesSlice = createSlice({
  name: "strain",
  initialState,
  reducers: {
    setStorages: (state, action) => {
      state.storages = action.payload.storages;
    },
  },
});

export const storagesReducer = storagesSlice.reducer;
export const storagesActions = storagesSlice.actions;
