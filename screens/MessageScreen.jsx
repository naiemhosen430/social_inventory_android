// screens/HomeScreen.js
import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../context/AuthContext";
import Global from "../layout/Global";

const MessageScreen = ({ navigation }) => {
  const { user } = useAuth();
  return (
    <Global>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Hello: {user?.fullname}</Text>
      </View>
    </Global>
  );
};

export default MessageScreen;
