import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Provider } from 'react-redux';

const Stack = createNativeStackNavigator();
import { Aboutscreen, AddTochatscreen, Chatscreen, Homescreen, Splashscreen } from './screens';
import { Loginscreen } from './screens';
import { Signupscreen } from './screens';
import Store from './context/store';


export default function App() {
  return (
<NavigationContainer>
  <Provider store={Store}>

          <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Splashscreen" component={Splashscreen} />
          <Stack.Screen name="Aboutscreen" component={Aboutscreen} />
          <Stack.Screen name="Homescreen" component={Homescreen} />
      
        <Stack.Screen name="Signupscreen" component={Signupscreen} />
        <Stack.Screen name="Loginscreen" component={Loginscreen} />
        <Stack.Screen name="AddTochatscreen" component={AddTochatscreen} />
        <Stack.Screen name="Chatscreen" component={Chatscreen} />
        
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
