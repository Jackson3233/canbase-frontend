import { createSlice } from "@reduxjs/toolkit";

export interface IProperty {
  id?: string;
  title?: string;
  location?: [number, number];
  size?: string;
  price?: string;
  phone?: string;
}

interface InitialStateType {
  property: IProperty[];
}

const initialState: InitialStateType = {
  property: [],
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    setProperty: (state, action) => {
      state.property = action.payload.property;
    },
  },
});

export const propertyReducer = propertySlice.reducer;
export const propertyActions = propertySlice.actions;
