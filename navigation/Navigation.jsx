import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import { useAuth } from "../context/AuthContext";
import MessageScreen from "../screens/MessageScreen";
import SingleMessage from "../screens/SingleMessage.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "../api/socketConnect.js";
import { getApiCall } from "../api/axiosConfig.js.js";
import {
  configurePushNotifications,
  showNotification,
} from "../service/notificationService.js";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, alluser, setAllUser } = useAuth();
  const [token, set_token] = useState(null);

  useEffect(() => {
    configurePushNotifications();
  }, []);

  useEffect(() => {
    if (!token) {
      const fan = async () => {
        const token_data = await AsyncStorage.getItem("userToken");
        set_token(token_data);
      };
      fan();
    }
  }, [token]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getApiCall("message/getallsupports");
        setAllUser(response?.data?.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchMessages();
    }
  }, [token]);

  useEffect(() => {
    const handleNewSupportMessage = (data) => {
      console.log(data);
      setAllUser((prevAllUser) => {
        return prevAllUser.map((s_data) => {
          if (data?.id === s_data?._id) {
            const updatedChats = [...s_data.chats];
            updatedChats.push(data.data);

            return {
              ...s_data,
              chats: updatedChats,
            };
          }
          return s_data;
        });
      });
      showNotification("New Message", data?.data?.text);
    };

    if (user) {
      socket.on(`${user._id}-newmessage`, handleNewSupportMessage);

      return () => {
        socket.off(`${user._id}-newmessage`, handleNewSupportMessage);
      };
    }
  }, [user, alluser, socket]);

  useEffect(() => {
    const handleNewSupportMessage = (data) => {
      console.log(data);
      setAllUser((prevAllUser) => {
        return [...prevAllUser, data];
      });
      showNotification("New Message", data?.chats[0]?.text);
    };

    if (user) {
      socket.on(`${user._id}-newmessageobj`, handleNewSupportMessage);

      return () => {
        socket.off(`${user._id}-newmessageobj`, handleNewSupportMessage);
      };
    }
  }, [user, alluser, socket]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user || token ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Message" component={MessageScreen} />
            <Stack.Screen name="SingleMessage" component={SingleMessage} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
