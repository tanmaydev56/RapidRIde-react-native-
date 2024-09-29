import { SafeAreaView } from "react-native-safe-area-context"
import { Alert, Image, ScrollView, Text, View } from "react-native"
import { icons, images } from "@/constants"
import InputField from "../components/InputField"
import CustomButton from "../components/CustomButton"
import { Link, router } from "expo-router"
import OAuth from "../components/OAuth"
import { useState } from "react"
import { useSignUp } from "@clerk/clerk-expo"
import ReactNativeModal from "react-native-modal"
import { fetchAPI } from "@/lib/fetch"

const SignUp = () =>{
    
    const { isLoaded, signUp, setActive } = useSignUp();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
      });
      const [verification,setverification] = useState({
        state:"default",
        error:"",
        code:""
      })

    const onSignUpPress = async () => {
        if (!isLoaded) {
          return
        }
    
        try {
          await signUp.create({
            emailAddress:form.email,
            password:form.password,
          })
    
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
    
         setverification({
            ...verification,
            state:"pending",

         })
        } catch (err: any) {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
        Alert.alert('Error',err.errors[0].longMessage);
            
                }
      }

    
      const onPressVerify = async () => {
        if (!isLoaded) {
          return;
        }
    
        try {
          const completeSignUp = await signUp.attemptEmailAddressVerification({
            code:verification.code,
          })
    
          if (completeSignUp.status === 'complete') {
            //ToDo: Create a database User!
            await fetchAPI("/(api)/user", {
              method: "POST",
              body: JSON.stringify({
                name: form.name,
                email: form.email,
                clerkId: completeSignUp.createdUserId,
              }),
            });
            await setActive({ session: completeSignUp.createdSessionId })
           setverification({
            ...verification,
            state:"success",

           })
          } else {
            setverification({
              ...verification,
              error:"verification failed",
              state:"failed",
            })
          }
        } catch (err: any) {
            setverification({
                ...verification,
                error:err.errors[0].longMessage,
                state:"failed",
              })
        }
      }
   

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image source={images.signUpCar} className="z-0 w-full h-[250px] 
                   
                    " />
                    <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">Create Your Account</Text>
                </View>
                <View className=" p-5">
                    <InputField 
                        label="Name"
                        icon={icons.person}
                        value={form.name}
                        onChangeText={(value)=>setForm({...form,name:value})}
                        placeholder="Enter Your Name"   
                    />
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
                        title="Sign Up"
                        className="mt-5 "
                       onPress={onSignUpPress}
                       
                        
                    />
                   <OAuth/>
                    <Link href="/sign-in"
                    className="text-lg text-center text-general-200 mt-2">
                        <Text className="">Already have an account?  </Text>
                        <Text className="text-[#6f00ff]">Log In</Text>

                    </Link>
                    </View>
                    <ReactNativeModal 
                   isVisible={verification.state==="pending"}
                    onModalHide={()=>setverification({
                        ...verification,
                        state:'success'
                    })}
                   >
                        <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                            <Text className="text-2xl font-JakartaExtraBold mb-2">Verifcation</Text>
                            <Text className="font-Jakarta mb-5">
                                We have sent a Verifiaction code to {form.email}
                            </Text>
                            <InputField
                            label="Code"
                            value={verification.code}
                            icon={icons.lock}
                            onChangeText={(value)=>setverification({...verification,code:value})}
                            placeholder="12345"
                            keyboardType="numeric"

                            />
                            {verification.error && (
                                <Text className="text-red-600 text-sm mt-1">{
                                    verification.error
                                }</Text>
                            )}
                            <CustomButton
                            title="Verify"
                            className="mt-5 bg-success-500"
                            onPress={onPressVerify}

                            />
                            </View> 
                    </ReactNativeModal>
                   <ReactNativeModal 
                   isVisible={verification.state==="success"}

                   >
                    <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                        <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5"/>
                        <Text className="text-3xl font-JakartaBold text-center">
                        Verified
                    </Text>
                    <Text className="text-base text-gray-400 font-JakartaSemiBold text-center mt-2">you have successfully verifeid!</Text>
                    <CustomButton
                    title="Browse Home"
                    className="mt-5"
                    onPress={()=>{
                       
                        router.replace('/(root)/(tabs)/home')}}
                    />
                    </View>
                    

                   </ReactNativeModal>

                   
            </View>
        </ScrollView>
    )

}
export default SignUp