import { createSlice } from "@reduxjs/toolkit";

export interface IQuestion {
  _id: string;
  questiontitle: string;
  description: string;
  required: string;
  questiontype?: string;
  content?: {
    id: string;
    value: string;
  }[];
  placeholder?: string;
  isShown: boolean;
}

interface InitialStateType {
  question: IQuestion[];
}

const initialState: InitialStateType = {
  question: [],
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestion: (state, action) => {
      state.question = action.payload.question;
    },
  },
});

export const questionReducer = questionSlice.reducer;
export const questionActions = questionSlice.actions;
