// components/Global.js
import React from "react";
import { View } from "react-native";
import BottomBar from "../_components/shared/BottomBar";

const Global = ({ children }) => {
  return (
    <View>
      <BottomBar />
      <View>{children}</View>
    </View>
  );
};

export default Global;
