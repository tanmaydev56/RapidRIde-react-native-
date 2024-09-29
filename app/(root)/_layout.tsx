import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import Home from "./(tabs)/home";
import Profile from "./(tabs)/profile";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="find-ride"options={{ headerShown: false }}/>
       <Stack.Screen name="confirm-ride"options={{ headerShown: false }}/>
      <Stack.Screen name="book-ride"options={{ headerShown: false }}/> 
    </Stack>
  );
};

export default Layout;
