import { ADDRESSLIST, APPOINTMENT_DASHBOARD, APPOINTMENT_DETAILS, APPOINTMENT_LIST, CONTACT_DETAILS, DEFAULT_ADDRESS, FAQ_LIST, GET_ADDRESS_BY_ID, GET_LABS, GET_PRODUCT_BY_ID, HOMEPAGE, LAB_ORDER_LIST, LIST_SCHEDULE_DATES, MY_PATIENTS, ONBORDING_DETAILS, PATIENT_APPOINTMENT_LIST, PATIENT_PRESCRIPTION_LIST, PROFILE, SET_USER, TERMS_CONDITIONS, WALLET } from '../constants';
import { axiosInstance } from '../api/api';
import { toast } from 'react-toastify';


export const getOnboarding = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.get("doctor_app/doctor/get_onboard_detail");
    if (response?.status) {
      dispatch({ type: ONBORDING_DETAILS, payload: response?.data?.response });
      return response?.data
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};

export const doctorOnboarding = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.post("doctor_app/doctor/doctor_onboarding", data);
    if (response?.status) {
      return response
    }
    return response
  } catch (error) {
    throw error;
  }
};

export const landingPageUpdate = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.put("doctor_app/doctor/landing_page_update", data);
    if (response?.status) {
      return response
    }
    return response
  } catch (error) {
    throw error;
  }
};

export const updateSchedule = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.put("doctor_app/doctor/update_schedule", data);
    if (response?.status) {
      return response
    }
    return response
  } catch (error) {
    throw error;
  }
};

export const updateOnboardDetails = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.put("doctor_app/doctor/update_onboard_detail", data);
    if (response?.status) {
      return response
    }
    return response
  } catch (error) {
    throw error;
  }
};


export const updateProfile = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.put("doctor_app/doctor/update_profile", data);
    if (response?.status) {
      return response
    }
    return response
  } catch (error) {
    throw error;
  }
};


export const getWalletPagination = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.post("customer_app/users/get_wallet", data);
    if (response?.status) {
      return response
    }
    return response
  } catch (error) {
    throw error;
  }
};


export const getProfileDetails = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.get("doctor_app/doctor/get_profile");
    if (response?.status) {
      dispatch({ type: PROFILE, payload: response?.data?.response });
      return response?.data
    } else {
      return response?.data
    }
  } catch (error) {
    throw error;
  }
};
export const getAppointmentDashboard = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.get("doctor_app/appointment/dashboard");
    if (response?.status) {
      dispatch({ type: APPOINTMENT_DASHBOARD, payload: response?.data?.response });
      return response?.data
    } else {
      return response?.data
    }
  } catch (error) {
    throw error;
  }
};
export const getAppointmentList = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.get("doctor_app/appointment/get_appointment_list?page=1&flag=1");
    if (response?.status) {
      dispatch({ type: APPOINTMENT_LIST, payload: response?.data?.response });
      return response?.data
    } else {
      return response?.data
    }
  } catch (error) {
    throw error;
  }
};
export const getAppointmentDetails = (id) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(`doctor_app/appointment/get_appointment_detail`, { params: { id: id } });
    if (response?.data?.status) {
      dispatch({ type: APPOINTMENT_DETAILS, payload: response?.data?.response });
      return response?.data
    } else {
      return response?.data
    }
  } catch (error) {
    throw error;
  }
};
export const getLabOrderList = (id) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(`doctor_app/users/lab_order_list`, { params: { patient_id: id } });
    if (response?.data?.status) {
      dispatch({ type: LAB_ORDER_LIST, payload: response?.data?.response });
      return response?.data
    } else {
      return response?.data
    }
  } catch (error) {
    throw error;
  }
};
export const getPatientPrescriptionList = (id) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(`doctor_app/users/get_patient_prescription_list`, { params: { id: id, 'page': 0 } });
    if (response?.data?.status) {
      dispatch({ type: PATIENT_PRESCRIPTION_LIST, payload: response?.data?.response });
      return response?.data
    } else {
      return response?.data
    }
  } catch (error) {
    throw error;
  }
};
export const getListScheduleDates = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get(`doctor_app/doctor/list_schedule_dates`);
    if (response?.data?.status) {
      dispatch({ type: LIST_SCHEDULE_DATES, payload: response?.data?.response });
      return response?.data
    } else {
      return response?.data
    }
  } catch (error) {
    throw error;
  }
};
export const deleteScheduleDate = (id) => async (dispatch) => {
  try {
    const response = await axiosInstance.delete(`doctor_app/doctor/delete_schedule_date`, { data: { "schedule_id": id } });
    if (response?.data?.status) {
      toast.success(response?.data?.message || "Schedule deleted successfully");
      dispatch(getListScheduleDates())
      return response?.data
    } else {
      toast.error(response?.data?.message || "Schedule deleted successfully");
      return response?.data
    }
  } catch (error) {
    throw error;
  }
};
export const getPatientAppointmentList = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.get("doctor_app/users/get_patient_appointment_list?page=1&flag=1&user_id=1");
    if (response?.status) {
      dispatch({ type: PATIENT_APPOINTMENT_LIST, payload: response?.data?.response });
      return response?.data
    } else {
      return response?.data
    }
  } catch (error) {
    throw error;
  }
};
export const getMyPatients = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.get("doctor_app/users/my_patients");
    if (response?.status) {
      dispatch({ type: MY_PATIENTS, payload: response?.data?.response });
      return response?.data
    } else {
      return response?.data
    }
  } catch (error) {
    throw error;
  }
};


export const setUserAccess = (type) => async (dispatch) => {
  try {
    dispatch({ type: SET_USER, payload: type });
  } catch (error) {
    throw error;
  }
};

export const logoutAPI = () => async (dispatch) => {
  const data = {
    // "page": 1
  }
  try {
    const response = await axiosInstance.post("customer_app/users/logout", data);
    if (response?.status) {
    } else {
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};


export const deleteAccountAPI = () => async (dispatch) => {
  const data = {
    // "page": 1
  }
  try {
    const response = await axiosInstance.post("customer_app/users/delete", data);
    if (response?.status) {
    } else {
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};


export const getWallet = () => async (dispatch) => {
  const data = {
    "page": 1
  }
  try {
    const response = await axiosInstance.post("customer_app/users/get_wallet", data);
    if (response?.status) {
      dispatch({ type: WALLET, payload: response?.data?.response });
    } else {
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};

export const getDefaultAddress = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get("customer_app/address/get_default_address");
    if (response?.status) {
      dispatch({ type: DEFAULT_ADDRESS, payload: response?.data?.response });
      return response?.data
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};
export const createAddress = (data) => async (dispatch) => {
  try {
    const response = await axiosInstance.post("customer_app/address/create", data);
    if (response?.status) {
      dispatch({ type: HOMEPAGE, payload: response?.data?.response });
    } else {
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};
export const insertPushTokenAPI = (data) => async (dispatch) => {
  console.log(data, 'FCMPAYLOAD PAYLOAD')
  try {
    const response = await axiosInstance.post("validate_and_issue_token", data);
    return response
  } catch (error) {
    throw error;
  }
};
export const resetPushTokenAPI = (data) => async (dispatch) => {
  try {
    const response = await axiosInstance.post("customer_app/users/insert_push_token", data);
    return response;
  } catch (error) {
    console.error("Error in resetPushTokenAPI:", error);
    throw error;
  }
};
export const updateAddress = (data) => async (dispatch) => {
  try {
    const response = await axiosInstance.post("customer_app/address/update", data);
    if (response?.status) {
      dispatch({ type: HOMEPAGE, payload: response?.data?.response });
    } else {
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};

export const getAddressByID = (id) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(`customer_app/address/get_byid/${id}`);
    if (response?.status) {
      dispatch({ type: GET_ADDRESS_BY_ID, payload: response?.data?.response });
    } else {
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};


export const deleteAddress = (data) => async (dispatch) => {
  try {
    const response = await axiosInstance.post("customer_app/address/delete", data);
    return response?.data
  } catch (error) {
    throw error;
  }
};

export const getAllAddress = () => async (dispatch) => {
  const data = {
    "page": 1
  }
  try {
    const response = await axiosInstance.post("customer_app/address/get_all", data);
    console.log('====================================');
    console.log(response?.status, 'RESPONSE');
    console.log('====================================');
    if (response?.status) {
      dispatch({ type: ADDRESSLIST, payload: response?.data?.response });
    } else {
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};




export const getFaqlist = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.get("customer_app/users/faq");
    if (response?.status) {
      dispatch({ type: FAQ_LIST, payload: response?.data?.response });
    } else {
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};



export const getContactDetail = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.get("customer_app/settings/contact_detail");
    if (response?.status) {
      dispatch({ type: CONTACT_DETAILS, payload: response?.data?.response });
    } else {
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};

export const getTermandCondition = () => async (dispatch) => {

  try {
    const response = await axiosInstance.get("customer_app/users/term_and_condition");
    if (response?.status) {
      dispatch({ type: TERMS_CONDITIONS, payload: response?.data?.response });
    } else {
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};


export const deleteDocument = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.delete("doctor_app/doctor/delete_document", { data: data });
    if (response?.data?.status) {
      toast.success(response?.data?.message || "Document deleted successfully");
      dispatch(getOnboarding())
      return response?.data
    }
    toast.error(response?.data?.message || "Failed to delete document");
    return response?.data
  } catch (error) {
    throw error;
  }
};

export const deleteCertificate = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.delete("doctor_app/doctor/delete_certificate", { data: data });
    if (response?.data?.status) {
      toast.success(response?.data?.message || "Certificate deleted successfully");
      dispatch(getOnboarding())
      return response?.data
    }
    toast.error(response?.data?.message || "Failed to delete certificate");
    return response?.data
  } catch (error) {
    throw error;
  }
};

export const deleteBreak = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.delete("doctor_app/doctor/delete_break", { data: data });
    if (response?.data?.status) {
      toast.success(response?.data?.message || "Break deleted successfully");
      dispatch(getOnboarding())
      return response?.data
    }
    toast.error(response?.data?.message || "Failed to delete break");
    return response?.data
  } catch (error) {
    throw error;
  }
};

export const deleteSchedule = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.delete("doctor_app/doctor/delete_schedule", { data: data });
    if (response?.data?.status) {
      toast.success(response?.data?.message || "Schedule deleted successfully");
      dispatch(getOnboarding())
      return response?.data
    }
    toast.error(response?.data?.message || "Failed to delete schedule");
    return response?.data
  } catch (error) {
    throw error;
  }
};

export const createService = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.post("doctor_app/service/create", data);
    if (response?.data?.status) {
      toast.success(response?.data?.message || "Service created successfully");
      dispatch(getAllService())
      return response?.data
    }
    toast.error(response?.data?.message || "Failed to create service");
    return response?.data
  } catch (error) {
    throw error;
  }
};
export const getAllService = () => async (dispatch) => {

  try {
    const response = await axiosInstance.get("doctor_app/service/get_all");
    if (response?.data?.status) {
      return response?.data
    }
    return response?.data
  } catch (error) {
    throw error;
  }
};
export const getServiceById = (data) => async (dispatch) => {
  console.log(data, 'DATA');

  try {
    const response = await axiosInstance.get(`doctor_app/service/get_by_id?id=${data?.id}`);
    if (response?.data?.status) {
      return response?.data
    }
    toast.error(response?.data?.message || "Failed to fetch service");
    return response?.data
  } catch (error) {
    throw error;
  }
};
export const updateService = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.put("doctor_app/service/update", data);
    if (response?.data?.status) {
      toast.success(response?.data?.message || "Service updated successfully");
      return response?.data
    }
    toast.error(response?.data?.message || "Failed to update service");
    return response?.data
  } catch (error) {
    throw error;
  }
};
export const deleteService = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.delete(`doctor_app/service/delete/${data?.id}`);
    if (response?.data?.status) {
      toast.success(response?.data?.message || "Service deleted successfully");
      return response?.data
    }
    toast.error(response?.data?.message || "Failed to delete service");
    return response?.data
  } catch (error) {
    throw error;
  }
};

export const addPrescription = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.post(`doctor_app/appointment/add_prescription`, data);
    if (response?.data?.status) {
      toast.success(response?.data?.message || "Prescription added successfully");
      return response?.data
    }
    toast.error(response?.data?.message || "Failed to add prescription");
    return response?.data
  } catch (error) {
    throw error;
  }
};

export const deleteMedicine = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.delete(`doctor_app/appointment/delete_medicine`, { data });
    if (response?.data?.status) {
      toast.success(response?.data?.message || "Medicine deleted successfully");
      return response?.data
    }
    toast.error(response?.data?.message || "Failed to delete medicine");
    return response?.data
  } catch (error) {
    throw error;
  }
};


export const createLabOrder = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.post(`doctor_app/appointment/create_lab_order`, data);
    if (response?.data?.status) {
      toast.success(response?.data?.message || "Lab order created successfully");
      return response?.data
    }
    toast.error(response?.data?.message || "Failed to create lab order");
    return response?.data
  } catch (error) {
    throw error;
  }
};


export const getLabs = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.get(`doctor_app/appointment/get_labs`, data);
    if (response?.data?.status) {
      dispatch({ type: GET_LABS, payload: response?.data?.response });
      return response?.data
    }
    toast.error(response?.data?.message || "Failed to fetch lab tests");
    return response?.data
  } catch (error) {
    throw error;
  }
};


export const createScheduleDate = (data) => async (dispatch) => {

  try {
    const response = await axiosInstance.post(`doctor_app/doctor/create_schedule_date`, data);
    if (response?.data?.status) {
      toast.success(response?.data?.message || "Schedule date created successfully");
      return response?.data
    }
    toast.error(response?.data?.message || "Failed to create schedule date");
    return response?.data
  } catch (error) {
    throw error;
  }
};