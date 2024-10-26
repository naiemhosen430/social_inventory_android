import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Get the base URL from environment variables
const apiBaseURL =
  process.env.API_URL || "https://social-backend-final.onrender.com";
// process.env.API_URL || "http://192.168.0.112:5000";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set the Authorization token dynamically
const setAuthToken = async () => {
  const token = await AsyncStorage.getItem("userToken");
  if (token) {
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers["Authorization"];
  }
};

// Call this function to set the token when the app starts or after login/logout
setAuthToken();

// Generic API call function
const apiCall = async (method, url, data = null) => {
  try {
    const response = await axiosInstance({
      method,
      url: `/api/v1/${url}`,
      data,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      error,
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "An error occurred while processing your request.",
    };
  }
};

// Exported API call functions
export const getApiCall = (url) => apiCall("get", url);
export const postApiCall = (url, data) => apiCall("post", url, data);
export const patchApiCall = (url, data) => apiCall("patch", url, data);
export const deleteApiCall = (url) => apiCall("delete", url);

// Export the axiosInstance and setAuthToken if needed elsewhere
export { axiosInstance, setAuthToken };
