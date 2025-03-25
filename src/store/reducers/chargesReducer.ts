import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "./userReducer";
import { IPlants } from "./plantsReducer";
import { IStrains } from "./strainsReducer";
import { IZones } from "./zonesReducer";

export interface ICharges {
  _id: string;
  chargename: string;
  plants: IPlants[];
  description?: string;
  note?: string;
  diary?: {
    user: IUser;
    content: string;
    date: string;
  }[];
  isHarvested: boolean;
  chargeID: string;
  createdAt: string;
  updatedAt: string;
  // flag data
  strain: IStrains;
  zone?: IZones;
  status?: string;
  sowing_date?: Date;
  germination_date?: Date;
  cutting_date?: Date;
  growing_date?: Date;
  flowering_date?: Date;
  harvest_date?: Date;
  destruction_date?: Date;
  yield_per_plant?: number;
  substrate?: string;
  fertilizer?: string;
}

interface InitialStateType {
  charges: ICharges[];
}

const initialState: InitialStateType = {
  charges: [],
};

const chargesSlice = createSlice({
  name: "charge",
  initialState,
  reducers: {
    setCharges: (state, action) => {
      state.charges = action.payload.charges;
    },
  },
});

export const chargesReducer = chargesSlice.reducer;
export const chargesActions = chargesSlice.actions;
