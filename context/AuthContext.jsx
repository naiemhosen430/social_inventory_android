import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiCall } from "../api/axiosConfig.js";
import socket from "../api/socketConnect.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [alluser, setAllUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("userToken");
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const response = await getApiCall("auth/me");
        if (response.data) {
          setUser(response.data?.data);
        } else {
          console.error("Failed to fetch user data");
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleNewMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };
    socket.on(`${user?._id}-newmessage`, handleNewMessage);

    return () => {
      socket.off(`${user?._id}-newmessage`, handleNewMessage);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, alluser, setAllUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
