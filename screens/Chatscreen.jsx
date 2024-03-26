import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Chatscreen = (route) => {
    const {room} = route.params;
    const navigation = useNavigation()
  return (
    <View className= "flex-1">
    <View className="w-full bg-primary px-4 py-6 flex-[0.20]">
    <View className="flex-row items-center justify-between w-full py-12 px-4 ">

    <TouchableOpacity onPress={() => navigation.goBack()}>
      <MaterialIcons name='chevron-left' size={32} color={"#fbfbfb"}/>

    </TouchableOpacity>

    <View className="flex-row items-center justify-center space-x-3">

    <View className="w-12 h-12 rounded-full border border-white flex items-center justify-between">
    <FontAwesome name='users' size={24} color={"#fbfbfb"}/>
    </View>

    <View>
        <Text className="text-gray-50 text-base font-semibold capitalize">{room.chatName.length > 16 ? `${room.chatName.slice(0,16)}..`: room.chatName}{""}</Text>
        <Text className="text-gray-100 text-sm font-semibold capitalize">online</Text>
    </View>


    </View>

  

    <View className="flex-row items-center justify-center space-x-3">

      


    </View>
    </View>
    </View>


<View className="w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10">




</View>


  </View>
  )
}

export default Chatscreen