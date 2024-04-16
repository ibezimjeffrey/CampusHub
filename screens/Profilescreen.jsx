import * as React from 'react';
import { Text, View,SafeAreaView,TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
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
import { useFonts, Dosis_200ExtraLight, Dosis_400Regular, Dosis_800ExtraBold } from '@expo-google-fonts/dosis';
import { StyleSheet } from 'react-native';
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
    const [isLoading, setisLoading] = useState(true);

    useLayoutEffect(()=>{
      const msgQuery = query(
        collection(firestoreDB, "users", user._id
        , "details"),
      )
    
      const unsubscribe = onSnapshot(msgQuery, (QuerySnapshot)=>{
        const upMsg = QuerySnapshot.docs.map(doc => doc.data())
        setDetails(upMsg)
        setisLoading(false)
      })
  
      return unsubscribe
  
      
    })

    const styles = StyleSheet.create({
      dosisText: {
        fontFamily: 'Dosis_400Regular', 
        fontSize: 20,
       
      },
    });

    const [fontsLoaded] = useFonts({
      Dosis_200ExtraLight,
      Dosis_400Regular,
      Dosis_800ExtraBold,
    });

    

    
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








    <>
    
  

    {isLoading ? (
        <>
          <View className="w-full flex items-center justify-center">
            <ActivityIndicator size={"large"} color={"#43C651"} />
          </View>
        </>
      ) : (
        <>
          <View className="border border-y-emerald-600 top-4 py-9 flex-row items-center justify-between space-x-4 my-2">
            <Text style={styles.dosisText} className="text-xl text-primary">
              Course of study: 
              <Text style={styles.dosisText} className="text-xl text-primaryBold">
                {Details.length > 0 ? Details[0].Hostel : ''}
              </Text>
            </Text>
          </View>

          <View className="top-4 px-6">
            <Text style={styles.dosisText} className="text-black">
              {Details.length > 0 ? Details[0].About : ''}
            </Text>
          </View>

          <View className="border top-4 px-6 items-center justify-between space-x-4 my-6">
            <Text style={styles.dosisText}>Skills:</Text>
            <View>
              <View className="border-2 border-primaryText p-1 rounded-full">
                <Text>{Details.length > 0 ? Details[0].Skills : ''}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={logout} className="w-full px-6 py-4 flex-row items-center justify-center">
            <Text className="text-lg font-semibold text-primaryBold px-3">Logout</Text>
          </TouchableOpacity>

        
        </>
      )}

  </>




  
    </SafeAreaView>
    
 


  
  )
}

export default Profilescreen