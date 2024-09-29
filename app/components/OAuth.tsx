import { Alert, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";
import { useOAuth } from "@clerk/clerk-expo";
import { useCallback } from "react";
import { googleOAuth } from "@/lib/auth";
import { router } from "expo-router";

const OAuth = ()=>{
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const result = await googleOAuth(startOAuthFlow)
      if(result.code==="Session_exists"){
        Alert.alert("Success","Session Exists. Redirecting to Home page");
        router.push("/(root)/(tabs)/home")
      }
      Alert.alert(result.success?'Success':'Error',result.message)

    } catch (err) {
      console.error('OAuth error', err)
    }
  }, [])
    return(
        <View>
        <View className="flex flex-row justify-center items-center mt-2 gap-x-3">
            <View className="flex-1 h-[1px] bg-general-200 mt-[2px]"/>  
            <Text className="text-md">Or</Text>
            <View  className="flex-1 h-[1px] bg-general-200 mt-[2px]"/>    
        </View>
        <CustomButton 
        title="Continue With Google"
        className="mt-[12px] w-full shadow-none"
        IconLeft={()=>(
            <Image source={icons.google} resizeMode="contain" className="w-5 h-5 mx-2"/>
           
    )}
    bgVariant="outline"
    textVariant="primary"
    onPress={handleGoogleSignIn}
        
        />
        </View>

    )

}
export default OAuth;