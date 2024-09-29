import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import RideLayout from "../components/RideLayout";
import { icons, images } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore } from "@/store";
import CustomButton from "../components/CustomButton";
import ReactNativeModal from "react-native-modal";
import { router } from "expo-router";

const BookRide = () => {
    const { user } = useUser();
    const { userAddress, destinationAddress } = useLocationStore();
    const { drivers, selectedDriver } = useDriverStore();
    const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility

    const driverDetails = drivers?.filter(
        (driver) => +driver.id === selectedDriver,
    )[0];

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <RideLayout snapPoints={""} title="Book Ride">
            <>
                <Text className="text-xl font-JakartaSemiBold mb-3">
                    Ride Information
                </Text>

                <View className="flex flex-col w-full items-center justify-center mt-10">
                    <Image
                        source={{ uri: driverDetails?.profile_image_url }}
                        className="w-28 h-28 rounded-full"
                    />

                    <View className="flex flex-row items-center justify-center mt-5 space-x-2">
                        <Text className="text-lg font-JakartaSemiBold">
                            {driverDetails?.title}
                        </Text>

                        <View className="flex flex-row items-center space-x-0.5">
                            <Image
                                source={icons.star}
                                className="w-5 h-5"
                                resizeMode="contain"
                            />
                            <Text className="text-lg font-JakartaRegular">
                                {driverDetails?.rating}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
                    <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                        <Text className="text-lg font-JakartaRegular">Ride Price</Text>
                        <Text className="text-lg font-JakartaRegular text-[#0CC25F]">
                            ${driverDetails?.price}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                        <Text className="text-lg font-JakartaRegular">Pickup Time</Text>
                        <Text className="text-lg font-JakartaRegular">
                            {formatTime(driverDetails?.time!)}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center justify-between w-full py-3">
                        <Text className="text-lg font-JakartaRegular">Car Seats</Text>
                        <Text className="text-lg font-JakartaRegular">
                            {driverDetails?.car_seats}
                        </Text>
                    </View>
                </View>

                <View className="flex flex-col w-full items-start justify-center mt-5">
                    <View className="flex flex-row items-center justify-start mt-3 border-t border-b border-general-700 w-full py-3">
                        <Image source={icons.to} className="w-6 h-6" />
                        <Text className="text-lg font-JakartaRegular ml-2">
                            {userAddress}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center justify-start border-b border-general-700 w-full py-3">
                        <Image source={icons.point} className="w-6 h-6" />
                        <Text className="text-lg font-JakartaRegular ml-2">
                            {destinationAddress}
                        </Text>
                    </View>
                    <CustomButton
                        title="Confirm Ride"
                        className="w-full shadow-none"
                        onPress={toggleModal} // Open modal on button press
                    />
                </View>

                {/* Modal for Ride Confirmation */}
                <ReactNativeModal
                    isVisible={isModalVisible}
                    onBackdropPress={toggleModal} // Close modal when clicking outside
                    backdropTransitionOutTiming={0}
                >
                    <View className="bg-white p-5 rounded-lg items-center">
                        <Text className="text-lg font-JakartaSemiBold">
                            Your ride has been confirmed!
                        </Text>
                        <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5" />
                        
                        <CustomButton
                            title="Browse Home"
                            onPress={() => {
                                toggleModal(); // Close modal when "Close" is pressed
                                router.push("/(root)/(tabs)/home"); // Redirect to home
                            }}
                            className="mt-3"
                        />
                    </View>
                </ReactNativeModal>
            </>
        </RideLayout>
    );
};

export default BookRide;
