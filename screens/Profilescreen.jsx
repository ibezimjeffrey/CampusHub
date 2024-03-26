import * as React from 'react';
import { Text, View,SafeAreaView,TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Logo } from '../assets';
import { Image } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';


const Profilescreen = () => {
    const user = useSelector((state) => state.user.user)  
  return (
    <ScrollView>
   <View className="Flex-1">



    
<SafeAreaView>
  <View className="w-full flex-row items-center left-2 py-3">
  
  <TouchableOpacity className="w-32 h-32  rounded-full border border-primary flex">

  <Image 
  source={{uri:user?.profilePic}} resizeMode='cover' 
  className=' w-full h-full'
  /> 

  </TouchableOpacity>





  </View>
  <View className=" flex-row items-center left-2 relative top-1">
<Text className=" text-3xl text-black" >{user?.fullName}</Text>

</View>
<TouchableOpacity

         >

            <View  className="w-13 h-8 px-2 relative top-9 rounded-xl bg-gray-300 flex items-center justify-center">
                 <Text className='py-2 text-white text-xl font-semibold -my-2'>Edit Profile</Text>
            </View>

           


          </TouchableOpacity>



          <View className=" left-2 relative py-11 top-9">
    <Text className="text-3xl text-black">About Me</Text>

</View>
  
</SafeAreaView>





</View>

</ScrollView>
  )
}

export default Profilescreen