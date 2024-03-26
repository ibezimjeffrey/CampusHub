import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Logo } from "../assets";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { QuerySnapshot, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";



const Messagescreen = () => {
  const navigation =useNavigation()
  const user = useSelector((state) => state.user.user);
  const [isLoading, setisLoading] = useState(false);
  const [Chats, setChats] = useState(null)


  const Move = () =>{
    navigation.navigate("Loginscreen")
  }

  useLayoutEffect(() => {
    const chatQuery = query(
      collection(firestoreDB, "chats"),
      orderBy("_id", "desc")
    )
  
    const unsubscribe = onSnapshot(chatQuery, (QuerySnapshot)=>{
      const chatRooms = QuerySnapshot.docs.map(doc => doc.data())
      setChats(chatRooms)
      setisLoading(false)
    })

    return unsubscribe
  }, [])

  const MessageCard = ({room}) => {
    return (
      <TouchableOpacity onPress={()=>navigation.navigate("Chatscreen", {room:room})} className="w-full flex-row items-center justify-start py-2">
        <View className="w-16 h-16 rounded-full flex items-center border-2 border-primary p-1 justify-center">
          <FontAwesome name="users" size={24} color={"#555"} />
        </View>

        <View className="flex-1 flex items-start justify-start ml-4 ">
          <Text className="text-[#333] text-base font-semibold capitalize">
            {room.chatName}
          </Text>

          <Text className="text-primaryText text-sm">
            hello hello hello hello hello hello hello
          </Text>
        </View>

        <Text className="text-primary px-4 text-base font-semibold"> 27 min</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1">
      <SafeAreaView>



        <View className=" flex-row py-2">

        
          <Image 
            source={Logo}
            resizeMode="contain"
            className=" w-full h-full absolute left-6"
          />



          <TouchableOpacity className="w-12 h-12 rounded-full border border-primary flex">
            <Image
              source={{ uri: user?.profilePic }}
              resizeMode="cover"
              className=" w-full h-full"
            />
          </TouchableOpacity>
        </View>





        <ScrollView className="w-full px-4 py-4">
          <View className="w-full">
            <View className="w-full flex-row items-center justify-between px-2">
              <Text className="text-primaryText text-base font-extrabold pb-2">
                Messages
              </Text>

              <TouchableOpacity onPress={Move}>
                <Ionicons name="chatbox" size={20} color={"#555"} />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              
                <View className="w-full flex items-center justify-center">
                  <ActivityIndicator size={"large"} color={"#0DC7BA"} />
                </View>
           
              
              
              
            ) : (
              <>
              {
                chats && chats?.length > 0 ?(<>
                {chats?.map(room => {<MessageCard key={room._id} room={room} />})}
                
                </>
                
                ):(
                  <>
                  </>
                )
              }
                

              </>
            

              
            )}


            
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Messagescreen;
