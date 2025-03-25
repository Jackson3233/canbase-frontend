import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "./userReducer";
import { ICharges } from "./chargesReducer";

export interface IHarvests {
  harvestname: string;
  status: string;
  charge: ICharges;
  member: IUser;
  wet_weight: number;
  waste: number;
  dry_weight: number;
  cbd: number;
  thc: number;
  tags?: string[];
  note?: string;
  diary?: {
    user: IUser;
    content: string;
    date: string;
  }[];
  harvestID: string;
  createdAt: string;
  updatedAt: string;
}

interface InitialStateType {
  harvests: IHarvests[];
}

const initialState: InitialStateType = {
  harvests: [],
};

const harvestsSlice = createSlice({
  name: "harvest",
  initialState,
  reducers: {
    setHarvests: (state, action) => {
      state.harvests = action.payload.harvests;
    },
  },
});

export const harvestsReducer = harvestsSlice.reducer;
export const harvestsActions = harvestsSlice.actions;
