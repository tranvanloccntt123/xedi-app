import { PermissionsAndroid, Platform } from "react-native";
import messaging from '@react-native-firebase/messaging';

let token: string = "";

export const registerNotification = async () => {
  try {
    let enabled = false;
    if (Platform.OS === "android") {
      const permissionStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      enabled = permissionStatus === "granted";
    } else if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission();
      enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    } else {
      // do nothing on other platforms
    }

    if (enabled) {
      await messaging().registerDeviceForRemoteMessages();
      token = await messaging().getToken();
    }
  } catch (error) {
    throw error;
  } finally {
    return token;
  }
};