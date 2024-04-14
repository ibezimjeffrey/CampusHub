import * as React from 'react';
import { Text, View,SafeAreaView,TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Logo } from '../assets';
import { Image } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { useState,  } from 'react';
import { useEffect } from 'react';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { firebaseAuth, firestoreDB } from '../config/firebase.config';
import { useLayoutEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
const Profilescreen = () => {
   const navigation =useNavigation()
    const user = useSelector((state) => state.user.user)  
    const dispatch = useDispatch()
    const logout = async() =>{
      await firebaseAuth.signOut().then(()=>{
        dispatch(SET_USER_NULL())
        navigation.replace("Loginscreen")


      })
    }

    const [Details, setDetails] = useState("")

    useLayoutEffect(()=>{
      const msgQuery = query(
        collection(firestoreDB, "users", user._id
        , "details"),
      )
    
      const unsubscribe = onSnapshot(msgQuery, (QuerySnapshot)=>{
        const upMsg = QuerySnapshot.docs.map(doc => doc.data())
        setDetails(upMsg)
      })
  
      return unsubscribe
  
      
    })

    
  return (

    <SafeAreaView className="flex-1 "> 

    <View className="w-full flex-row items-center justify-between px-4">
    <TouchableOpacity onPress={()=>{navigation.goBack()}}>
      <MaterialIcons name='chevron-left' size={32} color={"#555"}/>
    </TouchableOpacity>

    <TouchableOpacity>
      <Entypo name='dots-three-vertical' size={24} color={"#555"}/>
    </TouchableOpacity>
    
    </View>

    <View className="items-center justify-center">
      <View className="relative border-2 border-primary p-1 rounded-full">
      <Image 
   source={{uri:user?.profilePic}} resizeMode='cover' 
  className=' w-24 h-24'
  /> 

      </View>

      <Text className="text-xl font-semibold pt-3">{user.fullName}</Text>
      <Text className="text-base font-semibold text-primaryText">{user.email}</Text>

    </View>

    <TouchableOpacity onPress={logout} className="w-full px-6 py-4 flex-row items-center justify-center">
    <Text className="text-lg font-semibold text-primaryBold px-3">Logout</Text>
    </TouchableOpacity>



 
  <View>
  <Text>{Details.length > 0 ? Details[0].Hostel : ''}</Text>
</View>

  
    </SafeAreaView>
    
 


  
  )
}

export default Profilescreen