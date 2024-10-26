import { io } from "socket.io-client";

// const socket = io("http://192.168.0.112:5000");
const socket = io("https://social-backend-final.onrender.com");

socket.on("connect", () => {
  console.log("i am connected");
});

export default socket;
