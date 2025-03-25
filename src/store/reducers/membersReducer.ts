import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "./userReducer";

interface InitialStateType {
  members: IUser[];
}

const initialState: InitialStateType = {
  members: [],
};

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<{ members: IUser[] }>) => {
      state.members = action.payload.members;
    },
    removeMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter(
        member => member.memberID !== action.payload
      );
    },
    updateMemberStatus: (state, action: PayloadAction<IUser>) => {
      const index = state.members.findIndex(
        member => member.memberID === action.payload.memberID
      );
      if (index !== -1) {
        state.members[index] = action.payload;
      }
    }
  },
});

export const membersReducer = membersSlice.reducer;
export const membersActions = membersSlice.actions;
