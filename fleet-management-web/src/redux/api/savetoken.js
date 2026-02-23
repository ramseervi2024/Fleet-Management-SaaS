
// Get Methods
export const getRefreshToken = async () => {
  try {
    const refreshToken = await localStorage.getItem('refresh_token');
    return refreshToken;
  } catch (error) {
    return null;
  }
};

export const getAccessToken = async () => {
  try {
    const accessToken = await localStorage.getItem('access_token');
    return accessToken;
  } catch (error) {
    return null;
  }
};

export const getGenerateToken = async () => {
  try {
    const generateToken = await localStorage.getItem('generate_token');
    return generateToken;
  } catch (error) {
    return null;
  }
};

// Set Methods
export const setRefreshToken = async (refreshToken) => {
  try {
    await localStorage.setItem('refresh_token', refreshToken);
  } catch (error) {
    console.error('Error saving refresh token: ', error);
  }
};
export const setJustAccessToken = async (value) => {
  try {
    await localStorage.setItem('just_access_token', String(value));
  } catch (error) {
    console.error('Error saving refresh token: ', error);
  }
};

export const getJustAccessToken = async () => {
  try {
    const generateToken = await localStorage.getItem('just_access_token');
    return generateToken;
  } catch (error) {
    return null;
  }
};
export const setUUID = async (value) => {
  try {
    await localStorage.setItem('uuid', String(value));
  } catch (error) {
    console.error('Error saving refresh token: ', error);
  }
};

export const getUUID = async () => {
  try {
    const generateToken = await localStorage.getItem('uuid');
    return generateToken;
  } catch (error) {
    return null;
  }
};

export const setAccessToken = async (accessToken) => {
  try {
    await localStorage.setItem('access_token', accessToken);
  } catch (error) {
    console.error('Error saving access token: ', error);
  }
};

export const setGenerateToken = async (generateToken) => {
  try {
    await localStorage.setItem('generate_token', generateToken);
  } catch (error) {
    console.error('Error saving generate token: ', error);
  }
};

// Method to clean all stored tokens and data from localStorage
export const clearAllStoredData = async () => {
  try {
    await localStorage.removeItem('refresh_token');
    await localStorage.removeItem('access_token');
    // await localStorage.removeItem('generate_token');
    console.log('All tokens and data have been cleared.');
    // RNRestart.Restart(); 
  } catch (error) {
    console.error('Error clearing stored data: ', error);
  }
};

// Get the host URL (API base URL)
const is_Live = true
const STAGING_URL = 'http://43.205.18.14:8091/v1/';
const LIVE_URL = 'http://43.205.18.14:8091/v1/';


// const live_environment="PRODUCTION"
const live_environment="PRODUCTION"
const test_environment="TEST"

export const GOOGLE_API_KEY = 'AIzaSyAwhW-oxoIPQo_lbiO5Izr7m2Sal6h51os';

export const ENVIRONMENT_TYPE = is_Live ? live_environment : test_environment
export const HOST = is_Live ? LIVE_URL : STAGING_URL
export const getHost = () => HOST;

// Get headers for API requests
export const getHeaders = () => {
  return {
    "Content-Type": "application/json",
    "Accept-Language": "en",
  };
};
