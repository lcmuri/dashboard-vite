import { combineReducers } from "@reduxjs/toolkit";

// Front
import LayoutReducer from "./layouts/reducer";

const rootReducer = combineReducers({
  Layout: LayoutReducer,
});

export default rootReducer;
