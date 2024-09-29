import { useAuth } from "@clerk/clerk-expo";
import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { Alert, Image, Text, View, ActivityIndicator } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "./CustomButton";
import { images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useLocationStore } from "@/store";
import { PaymentProps } from "@/types/type";

const Payment = ({ fullName, email, amount, driverId, rideTime }: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const {
    userAddress,
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationAddress,
    destinationLongitude,
  } = useLocationStore();

  const { userId } = useAuth();
  const [success, setSuccess] = useState<boolean>(false);
  const [isPaymentSheetInitialized, setIsPaymentSheetInitialized] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const openPaymentSheet = async () => {
    if (!isPaymentSheetInitialized) {
      Alert.alert("Error", "Payment sheet is not initialized yet.");
      return;
    }

    const { error } = await presentPaymentSheet();
    if (error) {
      console.log("Payment sheet error:", error);
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setSuccess(true);
    }
  };

  const initializePaymentSheet = async () => {
    try {
      // First create the payment intent on the backend
      const { paymentIntent, customer } = await fetchAPI("/(api)/(stripe)/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName || email.split("@")[0],
          email: email,
          amount: parseInt(amount) * 100,
        }),
      });

      if (!paymentIntent?.client_secret) {
        throw new Error("Failed to create payment intent");
      }

      // Initialize Stripe payment sheet with the client secret from the backend
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        paymentIntentClientSecret: paymentIntent.client_secret, // Use client_secret directly
        customerId: customer.id, // Assuming customer object contains an id
        currencyCode: "usd",
        amount: parseInt(amount) * 100,
        returnURL: "myapp://book-ride", // Ensure this is set up in your app
      });

      if (error) {
        console.error("Error initializing payment sheet:", error);
        Alert.alert("Payment Sheet Error", error.message);
      } else {
        // Payment sheet initialized successfully
        setIsPaymentSheetInitialized(true);
      }
    } catch (error) {
      console.error("Error initializing payment sheet:", error);
      Alert.alert("Payment Initialization Error", error.message);
    } finally {
      // End the loading state
      setLoading(false);
    }
  };

  // Call initializePaymentSheet when the component mounts or when needed
  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <CustomButton
          title="Confirm Ride"
          className="my-10"
          onPress={openPaymentSheet}
          disabled={!isPaymentSheetInitialized} // Disable button if not initialized
        />
      )}

      <ReactNativeModal
        isVisible={success}
        onBackdropPress={() => setSuccess(false)}
      >
        <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
          <Image source={images.check} className="w-28 h-28 mt-5" />

          <Text className="text-2xl text-center font-JakartaBold mt-5">
            Booking placed successfully
          </Text>

          <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
            Thank you for your booking. Your reservation has been successfully placed. Please proceed with your trip.
          </Text>

          <CustomButton
            title="Back Home"
            onPress={() => {
              setSuccess(false);
              router.push("/(root)/(tabs)/home");
            }}
            className="mt-5"
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default Payment;
