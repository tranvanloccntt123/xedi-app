import "@expo/metro-runtime";
import { App } from "expo-router/build/qualified-entry";
import { renderRootComponent } from "expo-router/build/renderRootComponent";
import { startNetworkLogging } from "react-native-network-logger";

startNetworkLogging();

renderRootComponent(App);
