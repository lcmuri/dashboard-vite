import { combineReducers } from "@reduxjs/toolkit";

// Front
import LayoutReducer from "./layouts/reducer";

// IMS
import CategoryReducer from "./ims/category/reducer";

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  categories: CategoryReducer,
});

export default rootReducer;
