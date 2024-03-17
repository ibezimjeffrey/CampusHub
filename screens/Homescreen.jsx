import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { Logo } from '../assets';


const Homescreen = () => {

  const user = useSelector((state) => state.user.user);
  console.log("Logged user:", user)

  return (


    <NavigationContainer>


          <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Splashscreen" component={Splashscreen} />
          <Stack.Screen name="Homescreen" component={Homescreen} />
      
        <Stack.Screen name="Signupscreen" component={Signupscreen} />
        <Stack.Screen name="Loginscreen" component={Loginscreen} />
       
      </Stack.Navigator>
  
  </NavigationContainer> 


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






  )
}

export default Homescreen