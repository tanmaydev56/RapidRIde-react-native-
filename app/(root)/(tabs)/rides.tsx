import { useUser } from "@clerk/clerk-expo";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RideCard from "@/app/components/RideCard";
import { images } from "@/constants";

// Define temporary mock data for rides
const ridesData = [
  {
    id: 1,
    driverName: "John Doe",
    pickupLocation: "123 Main St",
    dropoffLocation: "456 Oak St",
    price: "$15.00",
    date: "2024-09-01",
  },
  {
    id: 2,
    driverName: "Jane Smith",
    pickupLocation: "789 Pine St",
    dropoffLocation: "101 Maple St",
    price: "$20.00",
    date: "2024-09-05",
  },
  {
    id: 3,
    driverName: "Michael Johnson",
    pickupLocation: "100 Elm St",
    dropoffLocation: "200 Cedar St",
    price: "$18.50",
    date: "2024-09-10",
  },
];

const Rides = () => {
  const { user } = useUser(); // Optional if you still need user data for other reasons

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={ridesData} // Use mock data
        renderItem={({ item }) => <RideCard ride={item}/>}
        keyExtractor={(item, index) => index.toString()}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            <Image
              source={images.noResult}
              className="w-40 h-40"
              alt="No recent rides found"
              resizeMode="contain"
            />
            <Text className="text-sm">No recent rides found</Text>
          </View>
        )}
        ListHeaderComponent={
          <>
            <Text className="text-2xl font-JakartaBold my-5">All Rides</Text>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default Rides;
