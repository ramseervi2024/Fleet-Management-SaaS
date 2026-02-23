import { ADDRESSLIST, ALL_LANGUAGE, ALL_SPECIALTY, HOMEPAGE, HOMEPAGE_BOTTOM } from '../constants';
const initialState = {
  alllanguages: {},
  allspecialty: {},
};
export const commonapis = (state = initialState, action) => {
  switch (action.type) {
    case ALL_LANGUAGE:
      return { ...state, alllanguages: action.payload };
    case ALL_SPECIALTY:
      return { ...state, allspecialty: action.payload };

    default:
      return state;
  }
};