import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiCallforAuthtoken } from './basicApis'; // Your API call function
import { setGenerateToken } from './savetoken'; // Import method to save token to AsyncStorage

export default function GenereateAuthToken({ setIsLogined }) {
  const [authTokenResponse, setAuthTokenResponse] = useState(null);
  const dispatch = useDispatch();

  // Handle Token Generation
  const handleAuthToken = async () => {
    try {
      const response = await dispatch(apiCallforAuthtoken());

      if (response?.data?.access_token) {
        setGenerateToken(response.data.access_token); // Save token to AsyncStorage
        // setAuthTokenResponse(response.data.access_token); // Store the token in state
        // setIsLogined(true); // If token is generated, set login status to true
      } else {
        // setAuthTokenResponse('Failed to generate token');
        // setIsLogined(false); // If no token, set login status to false
      }
    } catch (error) {
      console.error('Server Responded with error:', error);
      // Alert.alert('Server Responded with error', 'Failed to retrieve auth token.');
      // setIsLogined(false); // Set login status to false in case of an error
    }
  };

  useEffect(() => {
    handleAuthToken(); // Generate token on mount
  }, []); // Empty dependency array means this only runs once

  return null; // No UI is returned from this component
}
