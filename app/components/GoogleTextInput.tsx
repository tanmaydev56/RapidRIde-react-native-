import { View, TextInput, Image, TouchableOpacity } from "react-native";
import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";
import { useState } from "react";
import { router } from "expo-router"; // Using Expo Router
import { useLocationStore } from "@/store";

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
}: GoogleInputProps) => {
  const [inputValue, setInputValue] = useState("");
const {setDestinationLocation} = useLocationStore();
  // Function to handle redirection based on input
  const handleDestinationPress = () => {
    if (inputValue.toLowerCase().includes("kota,rajasthan")) {
      console.log("Redirecting to find-ride page...");
      const location = {
        latitude: 25.2138, // Kota latitude
        longitude: 75.8648, // Kota longitude
        address: "Kota,Rajasthan",
      };
      setDestinationLocation(location);

      router.push({
        pathname: "/(root)/find-ride", // Navigate to find-ride page
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
        },
      });
    } else {
      console.log("Location entered but no redirection:", inputValue);
    }
  };

  return (
    <View className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          backgroundColor: textInputBackgroundColor || "white",
          borderRadius: 20,
          shadowColor: "#d4d4d4",
          paddingHorizontal: 10,
        }}
      >
        {/* Left Icon */}
        <Image source={icon ? icon : icons.search} style={{ width: 24, height: 24, marginRight: 10 }} />

        {/* Text Input */}
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: "600",
            backgroundColor: textInputBackgroundColor || "white",
            borderRadius: 20,
            padding: 10,
          }}
          placeholder={initialLocation ?? "Where do you want to go?"}
          placeholderTextColor="gray"
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
        />

        {/* Search Button */}
        <TouchableOpacity onPress={handleDestinationPress}>
          <Image source={icons.search} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GoogleTextInput;
