import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, TextInput, Image } from 'react-native';
import { Entypo, FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { firestoreDB } from '../config/firebase.config';

const Chatscreen = ({ route }) => {
  const { post } = route.params;
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, "chats", post._id, "messages"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(msgQuery, (querySnapshot) => {
      const upMsg = querySnapshot.docs.map(doc => doc.data());
      setMessages(upMsg);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const newMessage = {
      _id: id,
      roomId: post._id, // Updated to post._id instead of post.id
      timeStamp: timeStamp,
      message: message,
      user: user,
    };

    setMessage('');

    try {
      await addDoc(collection(doc(firestoreDB, 'chats', post._id), 'messages'), newMessage);
    } catch (error) {
      alert('Error sending message: ' + error);
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
                <View >
                  <Image source={{ uri: post.user.profilePic }} resizeMode="contain" className=" rounded-full w-12 h-12 border-2 border-primaryBold" />
                </View>
              </View>

              <View>
                <Text className="text-gray-50 text-base font-semibold capitalize">
                  {post.chatName}
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

        <View className="w-full bg-gray-100 px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10">
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={160}
          >
            <>
              <ScrollView>
                {isLoading ? (
                  <View className="w-full flex items-center justify-center">
                    <ActivityIndicator size={"large"} color={"#43C651"} />
                  </View>
                ) : (
                  <>
                    {messages?.map((msg, i) => (
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
