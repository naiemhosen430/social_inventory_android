import React, { useEffect, useState } from "react";
import { API_URL } from "react-native-dotenv";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import BottomBar from "../_components/shared/BottomBar";

const HomeScreen = ({ navigation }) => {
  const { user, alluser, loading, setAllUser } = useAuth();

  const ChatCard = ({ chat }) => {
    const lastChatData = chat.chats[chat.chats.length - 1];
    const lastChat = lastChatData[0];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("SingleMessage", {
            chatId: chat.msg_id,
            text: lastChat ? lastChat.text : "No messages yet",
          })
        }
      >
        <Image
          source={{ uri: chat.customer_obj.avatar || "default_avatar_url" }}
          style={styles.avatar}
        />
        <View style={styles.content}>
          <Text style={styles.name}>{chat.user_name || "N/A"}</Text>
          <Text style={styles.message}>
            {lastChat ? lastChat.text : "No messages yet"}
          </Text>
          <Text style={styles.date}>
            {lastChat ? new Date(lastChat.date).toLocaleDateString() : ""}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  console.log(alluser?.length);
  return (
    <SafeAreaView style={styles.container}>
      <BottomBar />
      <View
        style={{
          padding: 5,
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : !alluser || alluser?.length === 0 ? (
          <Text style={styles.noMessages}>No messages yet.</Text>
        ) : (
          alluser?.map((chat) => <ChatCard key={chat.msg_id} chat={chat} />)
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 30,
  },
  greeting: {
    fontSize: 20,
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    width: "100%",
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  content: {
    flexDirection: "column",
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "#555",
  },
  date: {
    fontSize: 9,
    color: "gray",
  },
  noMessages: {
    fontSize: 16,
    color: "gray",
  },
});

export default HomeScreen;
