import { createSlice } from "@reduxjs/toolkit";

export interface IBank {
  _id: string;
  recipient: string;
  IBAN: string;
  note_members?: string;
  purpose?: string;
  sepa_number?: string;
  note_sepa_mandate?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  prefix?: string;
  suffix?: string;
  booking_day?: number;
  overdue?: number;
  auto_invoice?: boolean;
}

interface InitialStateType {
  bank: IBank | null;
}

const initialState: InitialStateType = {
  bank: null,
};

const bankSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {
    setBank: (state, action) => {
      state.bank = action.payload.bank;
    },
  },
});

export const bankReducer = bankSlice.reducer;
export const bankActions = bankSlice.actions;
