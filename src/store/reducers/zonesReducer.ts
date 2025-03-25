import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "./userReducer";
import { IPlants } from "./plantsReducer";

export interface IZones {
  _id: string;
  zonename: string;
  description?: string;
  size?: string;
  electricity?: string;
  lighting?: string;
  ventilation?: string;
  temperature?: number;
  humidity?: number;
  note?: string;
  plants?: IPlants[];
  diary?: {
    user: IUser;
    content: string;
    date: string;
  }[];
  zoneID: string;
}

interface InitialStateType {
  zones: IZones[];
}

const initialState: InitialStateType = {
  zones: [],
};

const zonesSlice = createSlice({
  name: "charge",
  initialState,
  reducers: {
    setZones: (state, action) => {
      state.zones = action.payload.zones;
    },
  },
});

export const zonesReducer = zonesSlice.reducer;
export const zonesActions = zonesSlice.actions;
