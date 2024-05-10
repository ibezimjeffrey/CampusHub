import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Provider } from 'react-redux';
import "react-native-reanimated"
const Stack = createNativeStackNavigator();
import {AllPostsscreen,ViewProfilescreen, Aboutscreen, AddTochatscreen, Chatscreen, DetailsScreen, Homescreen, Messagescreen, Postscreen, Searchscreen, Splashscreen } from './screens';
import { Loginscreen } from './screens';
import { Signupscreen } from './screens';
import Store from './context/store';
import {Profilescreen} from './screens';
import { LogBox } from 'react-native';


export default function App() {
  LogBox.ignoreAllLogs()
  return (
<NavigationContainer>
  <Provider store={Store}>

          <Stack.Navigator screenOptions={{headerShown: false}}>

            
          <Stack.Screen name="Splashscreen" component={Splashscreen} />
          <Stack.Screen name="Signupscreen" component={Signupscreen} />
          <Stack.Screen name="Loginscreen" component={Loginscreen} />
          <Stack.Screen name="Aboutscreen" component={Aboutscreen} />
          <Stack.Screen name="Homescreen" component={Homescreen} />
      
        
        <Stack.Screen name="AddTochatscreen" component={AddTochatscreen} />
        <Stack.Screen name="Chatscreen" component={Chatscreen} />
        <Stack.Screen name="Messagescreen" component={Messagescreen} />
        <Stack.Screen name="Profilescreen" component={Profilescreen} />
        <Stack.Screen name="Postscreen" component={Postscreen} />
        <Stack.Screen name="Searchscreen" component={Searchscreen} />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
        <Stack.Screen name="ViewProfilescreen" component={ViewProfilescreen} />
        <Stack.Screen name="AllPostsscreen" component={AllPostsscreen} />
        

      </Stack.Navigator>
  
  </Provider>
  </NavigationContainer> 
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
