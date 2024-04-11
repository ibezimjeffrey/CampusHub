import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React from "react";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import { firestoreDB } from "../config/firebase.config";
import { useLayoutEffect } from "react";
import { Image } from "react-native";

const Chatscreen = ({ route }) => {
  
  const { room } = route.params;
  const [isLoading, setisLoading] = useState(true);
  const [message, setmessage] = useState("")
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user)
  const [messages, setmessages] = useState("")



  const sendmessage = async() => {
    const timeStamp = serverTimestamp()
    const id = `${Date.now()}`
    const _doc = {
      _id : id,
      roomId : room._id,
      timeStamp: timeStamp,
      message: message,
      user: user
    }
    setmessage("")
    await addDoc(collection(doc(firestoreDB, "chats", room._id), "messages"),_doc).then(()=>{}).catch(err => alert(err))

  } 

  useLayoutEffect(()=>{
    const msgQuery = query(
      collection(firestoreDB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    )
  
    const unsubscribe = onSnapshot(msgQuery, (QuerySnapshot)=>{
      const upMsg = QuerySnapshot.docs.map(doc => doc.data())
      setmessages(upMsg)
      setisLoading(false)
    })

    return unsubscribe

    
  })
  return (
    <View className="flex-1">
      <View className="w-full bg-primary px-4 py-6 flex-[0.20]">
        <View className="flex-row items-center justify-between w-full py-12 px-4 ">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
          </TouchableOpacity>

          <View className="flex-row items-center justify-center space-x-3">
            <View className="w-12 h-12 rounded-full border border-white flex items-center justify-between">
              <View className="top-3">
                <FontAwesome name="users" size={24} color={"#fbfbfb"} />
              </View>
            </View>

            <View>
              <Text className="text-gray-50 text-base font-semibold capitalize">
                {room.chatName.length > 16
                  ? `${room.chatName.slice(0, 16)}..`
                  : room.chatName}
                {""}
              </Text>
              <Text className="text-gray-100 text-sm font-semibold capitalize">
                online
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-center space-x-3">
            <TouchableOpacity>
              <FontAwesome5 name="video" size={24} color={"#fbfbfb"} />
            </TouchableOpacity>

            <TouchableOpacity>
              <FontAwesome name="phone" size={24} color={"#fbfbfb"} />
            </TouchableOpacity>

            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={24} color={"#fbfbfb"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={160}
        >
          <>
            <ScrollView>
              
              {isLoading ? (
                 <>
                 <View className="w-full flex items-center justify-center">
                 <ActivityIndicator size={"large"} color={"#0DC7BA"}/>

                 </View>
                 
            
                 </>

              )
              
             
            : 

            (
            
            <>
            {
              messages?.map((msg,i)=> 
              msg.user.email === user.email ? (
                <View className='m-1' key={i}>
                  <View style={{alignSelf:"flex-end"}}
                  className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-primary w-auto relative ">
                    <Text className="text-base font-semibold text-white">
                      {msg.message}

                    </Text>

                  </View>

                  <View style={{alignSelf: "flex-end"}}>
                    {msg?.timeStamp?.seconds && (
                      <Text className="text-[12px] text-black font-semibold">
                        {new Date(
                          parseInt(msg?.timeStamp?.seconds)*1000).toLocaleTimeString("en-US",
                        {
                          hour:"numeric",
                          minute:"numeric",
                          hour12: false,
                        })
                        }

                      </Text>
                    )}

                  </View>

                </View>
              )
              :
              (

                <View className="flex items-center justify-start space-x-2" style={{alignSelf: "flex-start"}} key={i}>
                  <View className="flex-row items-center justify-center space-x-2">
                    <Image
                    className="w-12 h-12 rounded-full"
                    resizeMode="cover"
                    source={{uri:msg?.user?.profilePic}}/>

<View className='m-1' >
                  <View 
                  className="px-4 py-2 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl bg-gray-300 w-auto relative ">
                    <Text className="text-base font-semibold text-white">
                      {msg.message}

                    </Text>

                  </View>

                  <View style={{alignSelf: "flex-start"}}>
                    {msg?.timeStamp?.seconds && (
                      <Text className="text-[12px] text-black font-semibold">
                        {new Date(
                          parseInt(msg?.timeStamp?.seconds)*1000).toLocaleTimeString("en-US",
                        {
                          hour:"numeric",
                          minute:"numeric",
                          hour12: false,
                        })
                        }

                      </Text>
                    )}

                  </View>

                </View>
                    

                  </View>


                </View>
              )
            )
            }
            
            
            
            </>
            
            
            )}
            
            </ScrollView>















            <View className='w-full flex-row items-center justify-center px-8'>

              <View className="bg-gray-200 rounded-2xl px-4 space-x-4 py-2 flex-row items-center justify-center">

                <TouchableOpacity> 

                <Entypo name="emoji-happy" size={24} color= "#555"/>

                </TouchableOpacity>

                <TextInput className="flex-1 h-8 text-base text-primaryText font-semibold" placeholder="Type here..." placeholderTextColor={"#999"} value={message} onChangeText={(text) => {setmessage(text)}}>

                </TextInput>

                <TouchableOpacity>
                  <Entypo name="mic" size={24} color={"#43c651"}/>
                </TouchableOpacity>

                




              </View>
              <TouchableOpacity className="pl-4" onPress={sendmessage}>
                  <FontAwesome name="send" size={24} color={"#43c651"}/>
                </TouchableOpacity>

            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default Chatscreen;
