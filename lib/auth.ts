import * as SecureStore from 'expo-secure-store'
import * as Linking from 'expo-linking'
import { fetchAPI } from './fetch';
export const tokenCache = {
    async getToken(key: string) {
        try {
            const item = await SecureStore.getItemAsync(key);
            if (item) {
                console.log(`${key} was used 🔐 \n`);
            } else {
                console.log('No values stored under key: ' + key);
            }
            return item;
        } catch (error) {
            console.error('SecureStore get item error: ', error);
            await SecureStore.deleteItemAsync(key);
            return null;
        }
    },
    async saveToken(key: string, token: string) {
        try {
            await SecureStore.setItemAsync(key, token);
            console.log(`${key} was saved 🔐 \n`);
        } catch (error) {
            console.error('SecureStore set item error: ', error);
        }
    },
};

export const googleOAuth = async (startOAuthFlow: any) => {
    try {
        const { createdSessionId, setActive, signUp } = await startOAuthFlow({
          redirectUrl: Linking.createURL("/(root)/(tabs)/home"),
        });
    
        if (createdSessionId) {
          if (setActive) {
            await setActive({ session: createdSessionId });
    
            if (signUp.createdUserId) {
              await fetchAPI("/(api)/user", {
                method: "POST",
                body: JSON.stringify({
                  name: `${signUp.firstName} ${signUp.lastName}`,
                  email: signUp.emailAddress,
                  clerkId: signUp.createdUserId,
                }),
              });
            }
    
            return {
              success: true,
              code: "success",
              message: "You have successfully signed in with Google",
            };
          }
        }
    
        return {
          success: false,
          message: "An error occurred while signing in with Google",
        };
      } catch (err: any) {
        console.error(err);
        return {
          success: false,
          code: err.code,
          message: err?.errors[0]?.longMessage,
        };
      }
};