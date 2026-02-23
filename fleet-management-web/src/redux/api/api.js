// api.js
import axios from 'axios';
import { getHost, getHeaders } from './savetoken.js';

const axiosInstance = axios.create({
  baseURL: getHost(),
  headers: {},
});

let currentLanguageCache = 'en';

const getCurrentLanguage = async () => {
  try {
    // Return cached value if available
    if (currentLanguageCache) return currentLanguageCache;

    const language = await AsyncStorage.getItem('user-language');
    currentLanguageCache = language || 'en'; // Update cache
    return currentLanguageCache;
  } catch (error) {
    console.error('Error getting language:', error);
    return 'en';
  }
};

// Update language cache when it changes
export const updateLanguageCache = (newLanguage) => {
  currentLanguageCache = newLanguage || 'en';
};

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {

    let token = localStorage?.getItem("clerk_token");

    if (!token) {
      console.warn("⚠️ Token missing in localStorage. Attempting to retrieve from Clerk...");
      try {
        if (window.Clerk && window.Clerk.session) {
          token = await window.Clerk.session.getToken();
          if (token) {
            console.log("✅ Retrieved new token from Clerk. Saving to localStorage.");
            localStorage.setItem("clerk_token", token);
          }
        } else {
          console.error("❌ Clerk session not found on window object.");
        }
      } catch (err) {
        console.error("❌ Failed to retrieve token from Clerk:", err);
      }
    }

    if (!token) {
      console.warn("API Call attempted without Clerk Token! Request might fail.");
    }
    // console.log(token, 'tokentokentokentokentokentoken');

    const currentLanguage = await getCurrentLanguage()

    config.headers = {
      ...getHeaders(config.url),
      'Accept-Language': currentLanguage,
    };

    // if (token != null) {
    //   config.headers['auth-token'] = token;
    // }
    if (token != null) {
      config.headers['authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status == 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the refresh token API if need
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError);
        // Handle refresh token failure (e.g., redirect to login)
        return Promise.reject(refreshError);
      }
    }
    else {
      console.error('Something not Correct', error);
    }

    return Promise.reject(error);
  }
);
export { axiosInstance };