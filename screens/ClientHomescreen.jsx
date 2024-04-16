import * as React from 'react';
import { Text, View,SafeAreaView,TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Logo } from '../assets';
import { Image } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';


const ClientHomescreen = () => {
    const user = useSelector((state) => state.user.user)
      const [greeting, setGreeting] = useState('');
      const navigate = useNavigation()
      
      
      useEffect(() => {
        const date = new Date();
        const hours = date.getHours();
    
        let greetingMessage = '';
    
        if (hours >= 5 && hours < 12) {
          greetingMessage = '  Good morning, ';
        } else if (hours >= 12 && hours < 18) {
          greetingMessage = '  Good afternoon, ';
        } else {
          greetingMessage = '  Good evening, ';
        }
    
        setGreeting(greetingMessage);
      }, []);

    
  
  return (
   <View className="Flex-1 bg-white">
    
<SafeAreaView>
  <View className="w-full flex-row items-center justify-between px-4 py-2 bg-white">
  

 

  <TouchableOpacity onPress={()=>{navigate.navigate("Profilescreen")}} className="w-12 h-12 left-80 rounded-full border border-primary flex" >
  <Image 
  source={{uri:user?.profilePic}} resizeMode='cover' 
  className=' w-full h-full'
  /> 


  </TouchableOpacity>

 


  </View>

  <View >
    <Text className=" text-2xl text-primary ">{greeting} 
    <Text className=" text-2xl text-primaryBold " >{user?.fullName}</Text> </Text>
   
  </View>

  <View className=' w-20 -inset-y-18 inset-x-10 
   text-cyan-700 relative h-20'>
 
  </View>

  
</SafeAreaView>

</View>
  )
}

export default ClientHomescreen