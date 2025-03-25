import { createSlice } from "@reduxjs/toolkit";

export interface IInventories {
  _id: string;
  inventoryname?: string;
  description?: string;
  type: string;
  quantity: number;
  unit: string;
  storage?: string;
  sowing_date?: Date;
  manufacturer?: string;
  serial_number?: string;
  barcode?: string;
  purchase_date?: Date;
  tags?: string[];
  note?: string;
  inventoryID: string;
}

interface InitialStateType {
  inventories: IInventories[];
}

const initialState: InitialStateType = {
  inventories: [],
};

const inventoriesSlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setInventories: (state, action) => {
      state.inventories = action.payload.inventories;
    },
  },
});

export const inventoriesReducer = inventoriesSlice.reducer;
export const inventoriesActions = inventoriesSlice.actions;
