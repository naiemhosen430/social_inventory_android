// App.js
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./navigation/Navigation";
import { AuthProvider } from "./context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
