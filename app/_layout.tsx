import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="black" />
      {/* This view ensures the status bar area has a black background */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 32, // Height for status bar area
        backgroundColor: 'black',
        zIndex: 999,
      }} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
