import { router } from "expo-router";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Map from "./Map";
import BottomSheet, { BottomSheetScrollView,BottomSheetView } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { icons } from "@/constants";

const RideLayout = ({ title, children, snapPoints }: { title: string; children: React.ReactNode; snapPoints: string }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        {/* Top Header Section */}
        <View className="flex flex-col h-screen bg-[#6f00ff]">
          <View className="flex flex-row absolute z-10 top-16 items-center justify-start px-5">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                <Image source={icons.backArrow} className="w-6 h-6" resizeMode="contain" />
              </View>
            </TouchableOpacity>
            <Text className="text-xl font-semibold ml-5 text-[#000]">{title || "Go back"}</Text>
          </View>

          {/* Map Component */}
          <View className="flex-1">
            <Map />
          </View>
        </View>

       
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints || ["40%", "85%"]}
          index={0}
        >
          {title === "Choose a Rider" ? (
            <BottomSheetView
              style={{
                flex: 1,
                padding: 20,
              }}
            >
              {children}
            </BottomSheetView>
          ) : (
            <BottomSheetScrollView
              style={{
                flex: 1,
                padding: 20,
              }}
            >
              {children}
            </BottomSheetScrollView>
          )}
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default RideLayout;
