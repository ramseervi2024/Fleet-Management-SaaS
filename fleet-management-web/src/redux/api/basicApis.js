import { setUserAccess } from '../profile/action';
import { axiosInstance } from './api';
import { setGenerateToken, setAccessToken, setRefreshToken, getRefreshToken, clearAllStoredData, getAccessToken, setJustAccessToken } from './savetoken';  // Import functions to set tokens

// API Call to generate token
export const apiCallforAuthtoken = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get("generate_token");

    if (response?.status) {
      // console.log(response?.data?.access_token, 'API TRUE RESPONSE');
      await setGenerateToken(response?.data?.access_token);  // Store the generated token
    } else {
      console.log(response?.data, 'API FALSE RESPONSE');
    }
    return response;
  } catch (error) {
    console.error(error.message, 2);
    throw error;
  }
};

// API Call to validate and issue token
export const apiCallforValidateandissuetoken = (data) => async (dispatch) => {
  console.log(data, 'FCM TOKEN PAYLOAD');

  try {
    const response = await axiosInstance.post("/validate_and_issue_token", data);
    if (response?.status) {
      if (response?.data?.response) {
        // setVerificationStatus('success');
        await setJustAccessToken(false);
        dispatch(setUserAccess(true))
        // navigation.navigate('BottomNavigation', { loginAccess: true });
        await setAccessToken(response?.data?.response?.access_token);  // Store the generated token
        await setRefreshToken(response?.data?.response?.refresh_token);  // Store the generated token
        window.location.reload()
      }
      else {
        console.log('No Response');
      }
    } else {
      console.log(response?.data, 'API RESPONSE');
    }
    return response?.data;
  } catch (error) {
    console.error(error.message, 2);
    throw error;
  }
};

// API Call for sending OTP (Mobile)
export const apiCallforSendMobileOtp = (data) => async (dispatch) => {
  console.log(data, 'Sending OTP Payload');

  try {
    const response = await axiosInstance.post("doctor_app/doctor/send_otp", data);
    console.log(response, 'API RESPONSE for Mobile OTP');

    if (response?.status) {
      return response;
    } else {
      console.log(response?.data, 'API FALSE RESPONSE');
    }
    return response;
  } catch (error) {
    console.error(error?.message, 'Error sending Mobile OTP');
    throw error;
  }
};

// API Call for sending OTP (Email)
export const apiCallforSendEmailOtp = (data) => async (dispatch) => {
  console.log('====================================');
  console.log(data, 'PAYLOAD');
  console.log('====================================');
  try {
    const response = await axiosInstance.post("/doctor_app/doctor/login_password", data);
    if (response?.status) {
      return response;
    } else {
    }
    return response;
  } catch (error) {
    console.error(error.message, 'Error sending Email OTP');
    throw error;
  }
};

// API Call for verifying Mobile OTP
export const apiforRegisterToken = (data) => async (dispatch) => {
  console.log(data, 'TOKEN VALA PAYLOAD');
  try {
    const response = await axiosInstance.post("doctor_app/doctor/register", data);
    return response
  } catch (error) {
    console.error(error.message, 'Error Register');
    throw error;
  }
};


export const apiCallforRegister = (data) => async (dispatch) => {
  console.log(data, 'TOKEN VALA PAYLOAD');

  try {
    const response = await axiosInstance.post("doctor_app/doctor/register", data);
    if (response?.status) {
      if (response?.data?.response?.uuid) {
        const data1 = {
          "uuid": response?.data?.response?.uuid,
          "push_token": data?.push_token
        }
        dispatch(apiCallforValidateandissuetoken(data1))
      }
      return response;
    } else {
    }
    return response
  } catch (error) {
    console.error(error.message, 'Error verifying Mobile OTP');
    throw error;
  }
};

// API Call for verifying Mobile OTP
export const apiCallforVerifyMobileOtp = (data) => async (dispatch) => {
  console.log(data, 'TOKEN VALA PAYLOAD');

  try {
    const response = await axiosInstance.post("doctor_app/doctor/verify_otp", data);
    if (response?.status) {
      if (response?.data?.response?.uuid) {
        const data1 = {
          "uuid": response?.data?.response?.uuid,
          "push_token": data?.push_token
        }
        dispatch(apiCallforValidateandissuetoken(data1))
      }
      return response;
    } else {
    }
    return response
  } catch (error) {
    console.error(error.message, 'Error verifying Mobile OTP');
    throw error;
  }
};

// API Call for verifying Email OTP
export const apiCallforVerifyEmailOtp = (data) => async (dispatch) => {
  console.log(data, 'TOKEN VALA PAYLOAD');

  try {
    const response = await axiosInstance.post("/customer_app/users/email_verify_otp", data);

    if (response?.status) {
      if (response?.data?.response?.uuid) {
        const data1 = {
          "uuid": response?.data?.response?.uuid,
          "push_token": data?.push_token
        }
        console.log('PAYLOAD WITH PUSH TOKEN');

        dispatch(apiCallforValidateandissuetoken(data1))
      }
    } else {
      console.log(response?.data, 'API FALSE RESPONSE');
    }
    return response;
  } catch (error) {
    console.error(error.message, 'Error verifying Email OTP');
    throw error;
  }
};

// API Call for user registration (Mobile)
export const apiCallforMobileUserRegistration = (data) => async (dispatch) => {
  try {
    const response = await axiosInstance.post("/customer_app/users/register", data);

    if (response?.status) {
      console.log(response?.data, 'API RESPONSE for Mobile User Registration');
    } else {
      console.log(response?.data, 'API FALSE RESPONSE');
    }
    return response;
  } catch (error) {
    console.error(error.message, 'Error during Mobile User Registration');
    throw error;
  }
};

// API Call for user registration (Email)
export const apiCallforEmailUserRegistration = (data) => async (dispatch) => {
  try {
    const response = await axiosInstance.post("/customer_app/users/register", data);

    if (response?.status) {
      console.log(response?.data, 'API RESPONSE for Email User Registration');
    } else {
      console.log(response?.data, 'API FALSE RESPONSE');
    }
    return response;
  } catch (error) {
    console.error(error.message, 'Error during Email User Registration');
    throw error;
  }
};

// basicApis.js
export const apiCallforRefreshTokenifValid = async (data = {}) => {

  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();
  const dattta = {
    refresh_token: refreshToken
  }
  // console.log('====================================');
  // console.log(accessToken, 'accessToken');
  // console.log(refreshToken, 'refreshToken');
  // console.log('====================================');

  try {
    const response = await axiosInstance.post("/refresh_token_if_valid", dattta);
    // console.log('====================================');
    // console.log(JSON.stringify(response), 'refresh_token_if_valid REFERSH TOKEN');
    // console.log('====================================');
    // if (response?.status == 403) {
    //   clearAllStoredData()
    // }
    // else if (response?.data?.status == 403) {
    //   clearAllStoredData()
    // }
    if (response?.data?.status) {
      console.log('Refresh token successful', response.data);
      await setAccessToken(response?.data?.response?.access_token);  // Store the generated token
      return response.data;
    }
    else {
      console.log('Refresh token failed', response?.data);
      throw new Error(response?.data?.message || 'Refresh token failed');
    }
  } catch (error) {
    // if (error.response?.status == 403) {
    //   clearAllStoredData()
    // }
    // if (error?.status == 403) {
    //   clearAllStoredData()
    // }
    console.error('Refresh token error:', error.message);
    throw error;
  }
};