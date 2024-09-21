import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { firebaseAuth } from '../config/firebase.config'
import { ActivityIndicator } from 'react-native'
import { useState } from 'react'


const Settings = () => {

    const logout = async () => {
        
        await firebaseAuth.signOut().then(() => {
            setIsApplying(true);
          dispatch(SET_USER_NULL());
          navigation.replace('Loginscreen');
        });
      };

    const navigation = useNavigation();
    const [isApplying, setIsApplying] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
    <SafeAreaView>

      
     
      <ScrollView className="h-full" style={{ paddingHorizontal: 10, paddingTop: 10 }}>
        <View className="h-full">
          <View className = "right-6" style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-4">
          <MaterialIcons name='chevron-left' size={32} color={"#268290"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-4">
        <Text className="left-8" style={{ fontSize: 20, color: "#268290" }}></Text>
          
        </TouchableOpacity>
          </View>

          <View className="items-center mt-8">
              

              <Text className="text-3xl font-bold pt-4">N154,720.87</Text>
              <Text className="text-base font-bold text-gray-500">Available Balance</Text>
            </View>

            <View 
  className="border-primaryButton border rounded-xl mt-2 " 
  style={{ 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", // Aligns the items to the left
    paddingVertical: 10, 
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 90 // Reduced the padding to bring the items closer
  }}
>
    <View>
    <TouchableOpacity className="left-2 w-11 h-11 border border-primaryButton  rounded-full flex items-center justify-center">
                  <MaterialIcons name='add' size={26} color={'#268290'} />
                </TouchableOpacity>
                <Text className="left-4 top-1 font-extrlight">Add</Text>

    </View>

    <View>
    <TouchableOpacity className="left-2  w-11 h-11 border border-primaryButton rounded-full flex items-center justify-center">
                  <MaterialIcons name='publish' size={26} color={'#268290'} />
                </TouchableOpacity>
                <Text className="top-1 font-extrlight">Withdraw</Text>

    </View>


               

</View>

          
        </View>

        
    <View className="flex-row justify-center pt-4">
          <TouchableOpacity onPress={logout}>
            
          {isApplying ? (
              <ActivityIndicator className="py-3 w-8 h-12" size="large" color="#268290" />
            ) : (
              <Text style={{ color: "#268290" }} className="font-bold text-lg">Logout</Text>
            )}
          </TouchableOpacity>
        </View>
    
      </ScrollView>
    </SafeAreaView>
  </View>
  )
}

export default Settings