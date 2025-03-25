import { createSlice } from "@reduxjs/toolkit";

export interface ITransaction {
  club: string;
  recipient: string;
  description?: string;
  amount: number;
  tax?: number;
  method: string;
  purpose?: string;
  IBAN?: string;
  BIC?: string;
  mandate?: string;
  note?: string;
  createdDate: string;
  attachments?: string[];
  history?: { content: string; date: Date }[];
  transactionID: string;
  updatedAt: string;
}

interface InitialStateType {
  transactions: ITransaction[];
  currentMonthTotalPositive: number;
  currentMonthTotalNegative: number;
  previousMonthTotalPositive: number;
  previousMonthTotalNegative: number;
}

const initialState: InitialStateType = {
  transactions: [],
  currentMonthTotalPositive: 0,
  currentMonthTotalNegative: 0,
  previousMonthTotalPositive: 0,
  previousMonthTotalNegative: 0,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload.transactions;
      state.currentMonthTotalPositive =
        action.payload.currentMonthTotalPositive ?? 0;
      state.currentMonthTotalNegative =
        action.payload.currentMonthTotalNegative ?? 0;
      state.previousMonthTotalPositive =
        action.payload.previousMonthTotalPositive ?? 0;
      state.previousMonthTotalNegative =
        action.payload.previousMonthTotalNegative ?? 0;
    },
  },
});

export const transactionsReducer = transactionsSlice.reducer;
export const transactionsActions = transactionsSlice.actions;
