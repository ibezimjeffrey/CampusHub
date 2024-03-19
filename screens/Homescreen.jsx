import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Splashscreen} from './index.js';
import {useSelector} from 'react-redux'

  const user = useSelector((state) => state.user.user);

  const username = useSelector((state) => state.user.fullName);
function Home() {
  return (
  <Splashscreen/>
  );
}

function Search() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <p>{username}</p>
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Messages </Text>
    </View>
  );
}

function Settings() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();


const Homescreen = () => {






  return (


    <NavigationContainer independent={true}> 
      <Tab.Navigator screenOptions={{headerShown: false}}>
          
        <Tab.Screen name="Home"  component={Home} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Post" component={Post} />
        <Tab.Screen name="Messages" component={Messages} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );


// <View className="Flex-1">
// <SafeAreaView>
//   <View className="w-full flex-row items-center justify-between px-4 py-2">
  
//   <TouchableOpacity>
//   <Image 
//   source={Logo} resizeMode='contain' 
//   className=' w-20 h-20'
//   /> 

//   </TouchableOpacity>
 

//   <TouchableOpacity className="w-12 h-12 rounded-full border border-primary flex">

//   <Image 
//   source={{uri:user?.profilePic}} resizeMode='cover' 
//   className=' w-full h-full'
//   /> 


//   </TouchableOpacity>

//   </View>
// </SafeAreaView>

// </View>






  
}

export default Homescreen