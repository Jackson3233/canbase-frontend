import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "./userReducer";
import { IStrains } from "./strainsReducer";
import { IZones } from "./zonesReducer";
import { ICharges } from "./chargesReducer";

export interface IPlants {
  _id: string;
  plantname: string;
  description?: string;
  strain: IStrains;
  zone?: IZones;
  charge?: ICharges;
  status?: string;
  isParent: boolean;
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
  note?: string;
  diary?: {
    user: IUser;
    content: string;
    date: string;
  }[];
  isHarvested: boolean;
  plantID: string;
  createdAt: string;
  updatedAt: string;
}

interface InitialStateType {
  plants: IPlants[];
}

const initialState: InitialStateType = {
  plants: [],
};

const plantsSlice = createSlice({
  name: "plant",
  initialState,
  reducers: {
    setPlants: (state, action) => {
      state.plants = action.payload.plants;
    },
  },
});

export const plantsReducer = plantsSlice.reducer;
export const plantsActions = plantsSlice.actions;
