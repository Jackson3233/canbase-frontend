import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userReducer as user } from "./reducers/userReducer";
import { clubReducer as club } from "./reducers/clubReducer";
import { membersReducer as members } from "./reducers/membersReducer";
import { membershipReducer as membership } from "./reducers/membershipReducer";
import { roleReducer as role } from "./reducers/roleReducer";
import { questionReducer as question } from "./reducers/questionReducer";
import { channelReducer as channel } from "./reducers/channelReducer";
import { chatReducer as chat } from "./reducers/chatReducer";
import { feedReducer as feed } from "./reducers/feedReducer";
import { strainsReducer as strains } from "./reducers/strainsReducer";
import { plantsReducer as plants } from "./reducers/plantsReducer";
import { chargesReducer as charges } from "./reducers/chargesReducer";
import { transactionsReducer as transactions } from "./reducers/transactionsReducer";
import { bankReducer as bank } from "./reducers/bankReducer";
import { zonesReducer as zones } from "./reducers/zonesReducer";
import { harvestsReducer as harvests } from "./reducers/harvestReducer";
import { inventoriesReducer as inventories } from "./reducers/inventoriesReducer";
import { storagesReducer as storages } from "./reducers/storageReducer";
import { propertyReducer as property } from "./reducers/propertyReducer";

export const store = configureStore({
  reducer: combineReducers({
    user,
    club,
    members,
    membership,
    role,
    question,
    channel,
    chat,
    feed,
    strains,
    plants,
    charges,
    transactions,
    bank,
    zones,
    harvests,
    inventories,
    storages,
    property,
  }),
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
