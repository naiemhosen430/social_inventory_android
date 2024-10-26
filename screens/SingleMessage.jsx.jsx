import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "react-native-dotenv";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext.jsx";
import socket from "../api/socketConnect.js";
import BottomBar from "../_components/shared/BottomBar.jsx";
import { getApiCall } from "../api/axiosConfig.js";

const SingleMessage = ({ navigation, route }) => {
  const { user, alluser, setAllUser } = useAuth();
  const { chatId } = route.params;
  const [messagesFull, setMessagesFull] = useState(null);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId) {
        if (alluser) {
          const findedData = alluser?.find(
            (s_chat) => s_chat?.msg_id === chatId
          );
          setMessagesFull(findedData);
          setMessages(findedData?.chats?.flat());
        } else {
          try {
            setLoading(true);
            const response = await getApiCall("message/getallsupports");
            const filtered_data = response?.data?.data?.find(
              (s_chat) => s_chat?.msg_id === chatId
            );
            setAllUser(response?.data?.data);
            setMessages(filtered_data?.chats?.flat());
            setMessagesFull(filtered_data);
          } catch (error) {
            console.error("Error fetching messages:", error);
          } finally {
            setLoading(false);
          }
        }
      }
    };

    fetchMessages();
  }, [chatId, alluser]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    const messageData = {
      chatId,
      date: Date.now(),
      type: "agent",
      text: newMessage,
      senderId: user._id,
    };

    try {
      socket.emit("sendMessage", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setAllUser((prevAllUser) => {
        return prevAllUser.map((s_data) => {
          if (messagesFull?._id === s_data?._id) {
            const updatedChats = [...s_data.chats];
            updatedChats.push(messageData);

            return {
              ...s_data,
              chats: updatedChats,
            };
          }
          return s_data;
        });
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, []);

  // Scroll to the end when component mounts
  useEffect(() => {
    if (messages) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <BottomBar title={messagesFull?.user_name || "N/A"} />
      <View
        style={{
          width: "100%",
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{
            height: "82%",
            width: "100%",
            paddingHorizontal: 10,
            marginBottom: 60,
          }}
        >
          {loading ? (
            <View style={{ paddingVertical: 200 }}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : messages?.length === 0 ? (
            <Text style={styles.noMessages}>No messages yet.</Text>
          ) : (
            <View>
              {messages?.map((msg, i) => (
                <View
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: msg?.type === "bot" ? "flex-start" : "flex-end",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      marginVertical: 5,
                      alignSelf:
                        msg?.type === "bot" ? "flex-start" : "flex-end",
                    }}
                  >
                    <View
                      style={{
                        padding: 10,
                        borderRadius: 10,
                        backgroundColor:
                          msg?.type === "bot" ? "#e0e0e0" : "#e0ede0",
                        maxWidth: "80%",
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{msg.text}</Text>
                      <Text style={{ fontSize: 9 }}>
                        {new Date(msg.date).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message"
          />
          <TouchableOpacity style={styles.button} onPress={sendMessage}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
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
  noMessages: {
    fontSize: 16,
    color: "gray",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    width: "95%",
    padding: 10,
  },
  button: {
    backgroundColor: "#ccc",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    paddingVertical: 13,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
  },
});

export default SingleMessage;
