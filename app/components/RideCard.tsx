import { View, Text, Image } from "react-native";
import { Ride } from "@/types/type";
import { icons } from "@/constants";
import { formatDate, formatTime } from "@/lib/utils";

const RideCard = ({
  ride: {
    destination_longitude,
    destination_latitude,
    origin_address,
    destination_address,
    created_at,
    ride_time,
    driver,
    payment_status,
  },
}: {
  ride: Ride;
}) => {
  // Ensure driver data is available
  const driverFirstName = driver?.first_name || "N/A"; // Fallback if undefined
  const driverLastName = driver?.last_name || "";
  const carSeats = driver?.car_seats || "Unknown";

  return (
    <View className="flex flex-col bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3 p-3">
    
      <View className="flex flex-row items-center">
        <Image
          source={{
            uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${destination_longitude},${destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_APIKEY}`,
          }}
          className="w-[80px] h-[90px] rounded-lg"
        />

        <View className="flex flex-col mx-5 flex-1 gap-y-3">
          <View className="flex flex-row items-center gap-x-2">
            <Image source={icons.to} className="w-5 h-5" />
            <Text className="text-md font-JakartaMedium" numberOfLines={1}>
              {origin_address}
            </Text>
          </View>

          <View className="flex flex-row items-center gap-x-2">
            <Image source={icons.point} className="w-5 h-5" />
            <Text className="text-md font-JakartaMedium" numberOfLines={1}>
              {destination_address}
            </Text>
          </View>
        </View>
      </View>

      {/* Ride Information */}
      <View className="w-full mt-5 bg-general-500 rounded-lg p-3">
        <View className="flex flex-row justify-between mb-3">
          <Text className="text-md font-JakartaMedium text-gray-500">Date & Time</Text>
          <Text className="text-md font-JakartaMedium text-gray-500">
            {formatDate(created_at)}, {formatTime(ride_time)}
          </Text>
        </View>

        <View className="flex flex-row justify-between mb-3">
          <Text className="text-md font-JakartaMedium text-gray-500">Driver</Text>
          <Text className="text-md font-JakartaMedium text-gray-500">
            {driverFirstName} {driverLastName}
          </Text>
        </View>

        <View className="flex flex-row justify-between mb-3">
          <Text className="text-md font-JakartaMedium text-gray-500">Car Seats</Text>
          <Text className="text-md font-JakartaMedium text-gray-500">{carSeats}</Text>
        </View>

        <View className="flex flex-row justify-between">
          <Text className="text-md font-JakartaMedium text-gray-500">Payment Status</Text>
          <Text
            className={`text-md capitalize font-JakartaMedium ${
              payment_status === "paid" ? "text-green-500" : "text-red-500"
            }`}
          >
            {payment_status}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RideCard;
