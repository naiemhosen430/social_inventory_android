import React, { useState } from "react";
import { API_URL } from "react-native-dotenv";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import { postApiCall } from "../api/axiosConfig.js";

const HomeScreen = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (phone && password) {
      setLoading(true);

      try {
        const response = await postApiCall("auth/login", {
          phone,
          password,
        });

        if (response.data) {
          const token = response?.data?.token;
          await login(response.data?.data);
          await AsyncStorage.setItem("userToken", token);
          Alert.alert("Login successful!");

          navigation.navigate("Home");
        } else {
          Alert.alert("Login failed", response.message || "An error occurred");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Phone and password are required!");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          padding: 10,
          width: "100%",
          backgroundColor: loading ? "#ccc" : "#007BFF",
          alignItems: "center",
          borderRadius: 5,
        }}
        disabled={loading}
        accessibilityLabel="Login Button"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff" }}>Login</Text>
        )}
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
});

export default HomeScreen;
