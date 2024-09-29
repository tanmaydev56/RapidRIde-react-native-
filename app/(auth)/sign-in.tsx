import { SafeAreaView } from "react-native-safe-area-context"
import { Alert, Image, ScrollView, Text, View } from "react-native"
import { icons, images } from "@/constants"
import InputField from "../components/InputField"
import CustomButton from "../components/CustomButton"
import { Link, useRouter } from "expo-router"
import OAuth from "../components/OAuth"
import { useCallback, useState } from "react"
import { useSignIn } from "@clerk/clerk-expo"


const SignIn = () =>{
    const router = useRouter();
    const { signIn, setActive, isLoaded } = useSignIn()
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
      });
      const onSignInPress = useCallback(async () => {
        if (!isLoaded) {
          return
        }
    
        try {
          const signInAttempt = await signIn.create({
            identifier:form.email,
             password:form.password,
          })
    
          if (signInAttempt.status === 'complete') {
            await setActive({ session: signInAttempt.createdSessionId })
            router.replace('/(root)/(tabs)/home')
          } else {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(signInAttempt, null, 2))
          }
        } catch (err: any) {
            Alert.alert('Error',err.errors[0].longMessage);
        }
      }, [isLoaded, form.email, form.password])
    

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image source={images.signUpCar} className="z-0 w-full h-[250px] 
                   
                    " />
                    <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">Welcome Back User!</Text>
                </View>
               
                    <View className=" p-5">
                    <InputField 
                        label="E-mail"
                        icon={icons.email}
                        value={form.email}
                        placeholder="Enter Your E-mail" 
                        onChangeText={(value)=>setForm({...form,email:value})}
                    />
                    </View>
                    <View className=" p-5">
                    <InputField 
                        label="Password"
                        icon={icons.lock}
                        value={form.password}
                        onChangeText={(value)=>setForm({...form,password:value})}
                        placeholder="Enter Your Password"
                    />
                     <CustomButton
                        title="Log In"
                        className="mt-5 "
                       onPress={onSignInPress}
                       
                        
                    />
                   <OAuth/>
                    <Link href="/sign-up"
                    className="text-lg text-center text-general-200 mt-2">
                        <Text className="">New here?  </Text>
                        <Text className="text-[#6f00ff]">Sign Up</Text>

                    </Link>
                    </View>
                    {/* verification model */}
                   
            </View>
        </ScrollView>
    )

}
export default SignIn