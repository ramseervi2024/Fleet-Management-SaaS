import { ALL_LANGUAGE, ALL_SPECIALTY, HOMEPAGE, HOMEPAGE_BOTTOM } from '../constants';
import { axiosInstance } from '../api/api';

export const getAllLanguages = () => async (dispatch) => {
  const data = { "type": 2 }
  try {
    const response = await axiosInstance.get("doctor_app/doctor/get_all_languages");
    if (response?.status) {
      dispatch({ type: ALL_LANGUAGE, payload: response?.data?.response });
    } else {
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};

export const getAllSpecialty = () => async (dispatch) => {
  const data = { "type": 2 }
  try {
    const response = await axiosInstance.get("doctor_app/doctor/get_all_specialty");
    if (response?.status) {
      dispatch({ type: ALL_SPECIALTY, payload: response?.data?.response });
    } else {
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};
