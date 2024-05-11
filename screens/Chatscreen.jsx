import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, TextInput, Image, Linking } from 'react-native';
import { Entypo, FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { firestoreDB } from '../config/firebase.config';

const Chatscreen = ({ route }) => {
  const { post } = route.params;
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [Hired, setHired] = useState(true)
  const [isBoss, setisBoss] = useState(post.user._id === user._id)
const [status, setstatus] = useState(post.user_id === post.idRoom)

const [isHired, setIsHired] = useState(false)
  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, 'messages'),
      
      where('idRoom', '==', post.idRoom), 
      orderBy("timeStamp", "asc")
    );
  
    const unsubscribe = onSnapshot(msgQuery, (querySnapshot) => {
      const upMsg = querySnapshot.docs.map(doc => doc.data());
      setMessages(upMsg);
      setIsLoading(false);
    });
  
    
    return unsubscribe;
  }, [post._id]); 
  

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, 'messages'),
      
      where('idRoom', '==', post.idRoom), 
      orderBy("timeStamp", "asc")
    );
  
    const unsubscribe = onSnapshot(msgQuery, (querySnapshot) => {
      const upMsg = querySnapshot.docs.map(doc => doc.data());
      setMessages(upMsg);
      setIsLoading(false);
    });
  
    
    return unsubscribe;
  }, [post._id]); 



  useEffect(() => {
    const checkHiredStatus = async () => {
      try {
        const statusSnapshot = await getDocs(query(collection(firestoreDB, 'Status'), where('idRoom', '==', post.idRoom)));
        setIsHired(!statusSnapshot.empty);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking hired status:', error);
      }
    };

    checkHiredStatus();
  }, [post.idRoom]);



  

  const sendMessage = async () => {
    const timeStamp = serverTimestamp();
    const newMessage = {
      _id: post.idRoom,
      roomId: post._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
      receipient: post.user._id,
      idRoom: post.idRoom
    };

    setMessage('');
   

    try {
      await addDoc(collection(firestoreDB, "messages"), newMessage)
      
    } catch (error) {
      alert('Error sending message: ' + error);
    }
  };

  const viewProfile = () =>{
    navigation.navigate("ViewProfilescreen",{ post: post })

  }

  const makePhoneCall = () => {
   
    Linking.openURL(`tel:${post.user.email}`);
  };

  const Employ = async () => {
    try {
      const id = `${post.user._id}-${Date.now()}`;
      const room_id = `${user._id}-${Date.now()}-${new Date().getSeconds()}`;
      const hireStatus = {
        _id: id,
        user: user,
        receipient: post.user,
        status: true,
        idRoom: room_id
      };
      await addDoc(collection(firestoreDB, 'Status'), hireStatus);
      setIsHired(true);
    } catch (error) {
      console.error('Error hiring:', error);
    }
  };



  return (
    <View style={{ flex: 1 }}>
      <View className="flex-1">
        <View className="w-full bg-primary px-4 py-6 flex-[0.20]">
          <View className="flex-row items-center justify-between w-full py-12 px-4 ">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
            </TouchableOpacity>

            <View className="flex-row items-center justify-center space-x-3">
              

             
              <View>
              <TouchableOpacity onPress={viewProfile}>
                <View >
                  <Image source={{ uri: post.user.profilePic }} resizeMode="contain" className=" rounded-full w-12 h-12 border-2 border-primaryBold" />
                </View>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity onPress={viewProfile}>
                <Text className="text-gray-50 text-base font-semibold capitalize">
                  {post.user.fullName}
                </Text>

                </TouchableOpacity>

                
              </View>



              {user._id !== post.index1 && (
                <>
                  {isHired ? (
                    <TouchableOpacity onPress={() => {}}>
                      <View>
                        <View className="border-1 left-7 bg-emerald-300 border-emerald-950 rounded-lg p-4">
                          <Text className="font-bold text-zinc-950">HIRED</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={Employ}>
                      <View>
                        <View className="border-1 left-7 bg-red-400 border-emerald-950 rounded-lg p-4">
                          <Text className="font-bold text-zinc-950">HIRE</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                </>
              )}
              


              
            </View>

            <View className="flex-row items-center justify-center space-x-3">
            
              

             
            </View>
          </View>
        </View>

        <View className="w-full bg-gray-100 px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10">
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={160}
          >
            <>
              <ScrollView className="h-full">
                {isLoading ? (
                  <View className="w-full flex items-center justify-center">
                    <ActivityIndicator size={"large"} color={"#43C651"} />
                  </View>
                ) : (
                  
                  <>
                  {messages?.map((msg, i) => (
                    msg.user._id === user._id ? (
                      <View className='m-1' key={i}>
                        <View style={{ alignSelf: "flex-end" }} className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-primary w-auto relative ">
                          <Text className="text-base font-semibold text-white">
                            {msg.message}
                          </Text>
                        </View>
                        <View style={{ alignSelf: "flex-end" }}>
                          {msg?.timeStamp?.seconds && (
                            <Text className="text-[12px] text-black font-semibold">
                              {new Date(parseInt(msg?.timeStamp?.seconds) * 1000).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: false,
                              })}
                            </Text>
                          )}
                        </View>
                      </View>
                    ) : (
                      <View className='m-1' key={i}>
                        <View style={{ alignSelf: "flex-start" }} className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl bg-gray-400 w-auto relative ">
                          <Text className="text-base font-semibold text-white">
                            {msg.message}
                          </Text>
                        </View>
                        <View style={{ alignSelf: "flex-start" }}>
                          {msg?.timeStamp?.seconds && (
                            <Text className="text-[12px] text-black font-semibold">
                              {new Date(parseInt(msg?.timeStamp?.seconds) * 1000).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: false,
                              })}
                            </Text>
                          )}
                        </View>
                      </View>
                    )
                  ))}
                </>
                )}
              </ScrollView>

              <View className='w-full flex-row items-center justify-center px-8'>
                <View className="bg-gray-200 rounded-2xl px-4 space-x-4 py-2 flex-row items-center justify-center">
                  <TouchableOpacity>
                    <Entypo name="emoji-happy" size={24} color="#555" />
                  </TouchableOpacity>
                  <TextInput
                    className="flex-1 h-8 text-base text-primaryText font-semibold"
                    placeholder="Type here..."
                    placeholderTextColor="#999"
                    value={message}
                    onChangeText={(text) => { setMessage(text) }}
                  />
                  <TouchableOpacity>
                    <Entypo name="mic" size={24} color="#43c651" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity className="pl-4" onPress={sendMessage}>
                  <FontAwesome name="send" size={24} color="#43c651" />
                </TouchableOpacity>
              </View>
            </>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
};

export default Chatscreen;

