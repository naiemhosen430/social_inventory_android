import PushNotification from "react-native-push-notification";

const configurePushNotifications = () => {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
    },
  });
};

const showNotification = (title, message) => {
  PushNotification.localNotification({
    title: title,
    message: message,
  });
};

export { configurePushNotifications, showNotification };
