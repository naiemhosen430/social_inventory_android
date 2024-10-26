import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Appbar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "react-native-vector-icons";

export default function BottomBar({ title }) {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [bar_state, set_bar_state] = useState(false);

  return (
    <>
      <Appbar style={styles.container}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => set_bar_state(true)}>
            <Icon name="bars" size={30} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text>{title}</Text>
        </View>
      </Appbar>

      {/* SideBar */}
      {bar_state && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => set_bar_state(false)}
        >
          <View style={styles.sidebar} onStartShouldSetResponder={() => true}>
            <TouchableOpacity
              onPress={() => {
                set_bar_state(false);
                navigation.navigate("Home");
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                borderBottomWidth: 0.5,
              }}
            >
              <Icon name="home" size={30} color="#000" />

              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>

            {user?.access_routes?.flat().map((menu) => (
              <TouchableOpacity
                onPress={() => {
                  // Add your logic here
                }}
                key={menu?._id}
                style={styles.menuItem}
              >
                {/* {menu?.name ? (
                  <Icon name={menu.name} size={30} color="#000" />
                ) : (
                )} */}
                <Icon name={menu.name} size={30} color="#000" />

                <Text style={styles.menuText}>{menu?.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => logout()}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                alignItems: "center",
              }}
            >
              <Text style={styles.menuText}>LogOut</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
  },
  iconContainer: {
    width: "10%",
    alignItems: "center",
    paddingVertical: 5,
  },
  titleContainer: {
    width: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 35,
    left: 0,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sidebar: {
    height: "100%",
    width: "70%",
    left: 0,
    backgroundColor: "white",
    padding: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.5,
  },
  menuText: {
    marginLeft: 10,
  },
});
