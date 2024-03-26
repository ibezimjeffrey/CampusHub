import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {AddTochatscreen, ClientHomescreen, Messagescreen, Profilescreen} from './index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'; 


function Home() {
  return (
  <ClientHomescreen/>
  );
}

function Search() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Search</Text>
    </View>
  );
}

function Post() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Post</Text>
    </View>
  );
}

function Messages() {
  return (
  <Messagescreen/>
  );
}

function Profile() {
  return (
 <Profilescreen/>
  );
}


function Chat() {
  return (
 <AddTochatscreen/>
  );
}

const Tab = createBottomTabNavigator();

const Homescreen = () => {
  return (
    <NavigationContainer independent={true}> 
      <Tab.Navigator 
        screenOptions={({ route } ) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Post') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Messages') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

      
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'green',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Post" component={Post} />
        <Tab.Screen name="Messages" component={Chat} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default Homescreen;