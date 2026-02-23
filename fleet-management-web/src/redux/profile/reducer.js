import { ADDRESSLIST, APPOINTMENT_DASHBOARD, APPOINTMENT_DETAILS, APPOINTMENT_LIST, CONTACT_DETAILS, DEFAULT_ADDRESS, FAQ_LIST, GET_ADDRESS_BY_ID, GET_LABS, HOMEPAGE, LAB_ORDER_LIST, LIST_SCHEDULE_DATES, MY_PATIENTS, ONBORDING_DETAILS, PATIENT_APPOINTMENT_LIST, PATIENT_PRESCRIPTION_LIST, PROFILE, SET_USER, TERMS_CONDITIONS, WALLET } from '../constants';
const initialState = {
  homepagedata: {},
  addresslist: {},
  profiledetails: {},
  users: false,
  addressbyid: {},
  wallethistory: {},
  faqlist: {},
  contactdetails: {},
  onboardingdetails: {},
  appointmentdashboard: {},
  appointmentlist: {},
  appointmentdetails: {},
  patientappointmentlist: {},
  mypatients: {},
  termandcondition: {},
  lablists: {},
  listscheduledates: {},
  laborders: {},
  patientprescriptionlist: {},
};
export const profile = (state = initialState, action) => {
  switch (action.type) {
    case HOMEPAGE:
      return { ...state, homepagedata: action.payload };
    case ADDRESSLIST:
      return { ...state, addresslist: action.payload };
    case PROFILE:
      return { ...state, profiledetails: action.payload };
    case SET_USER:
      return { ...state, users: action.payload };
    case WALLET:
      return { ...state, wallethistory: action.payload };
    case GET_ADDRESS_BY_ID:
      return { ...state, addressbyid: action.payload };
    case DEFAULT_ADDRESS:
      return { ...state, defaultaddress: action.payload };
    case FAQ_LIST:
      return { ...state, faqlist: action.payload };
    case CONTACT_DETAILS:
      return { ...state, contactdetails: action.payload };
    case TERMS_CONDITIONS:
      return { ...state, termandcondition: action.payload };
    case ONBORDING_DETAILS:
      return { ...state, onboardingdetails: action.payload };
    case APPOINTMENT_DASHBOARD:
      return { ...state, appointmentdashboard: action.payload };
    case APPOINTMENT_LIST:
      return { ...state, appointmentlist: action.payload };
    case PATIENT_APPOINTMENT_LIST:
      return { ...state, patientappointmentlist: action.payload };
    case MY_PATIENTS:
      return { ...state, mypatients: action.payload };
    case APPOINTMENT_DETAILS:
      return { ...state, appointmentdetails: action.payload };
    case LIST_SCHEDULE_DATES:
      return { ...state, listscheduledates: action.payload };
    case GET_LABS:
      return { ...state, lablists: action.payload };
    case LAB_ORDER_LIST:
      return { ...state, laborders: action.payload };
    case PATIENT_PRESCRIPTION_LIST:
      return { ...state, patientprescriptionlist: action.payload };
    
    default:
      return state;
  }
};