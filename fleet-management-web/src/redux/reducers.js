import { combineReducers } from "redux";
import { profile } from "./profile/reducer";
import { commonapis } from "./commonapis/reducer";

const rootReducer = combineReducers({
  profile: profile,
  commonapis: commonapis
});

export default rootReducer;
