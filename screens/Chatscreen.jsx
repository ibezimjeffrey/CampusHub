import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, TextInput, Image, Linking, Alert } from 'react-native';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { firestoreDB } from '../config/firebase.config';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';

const Chatscreen = ({ route }) => {
  const { post } = route.params;
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading1, setIsLoading1] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isHired, setIsHired] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);


  
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
        const statusSnapshot = await getDocs(query(collection(firestoreDB, 'Status'), where('post._id', '==', post._id)));
        setIsHired(!statusSnapshot.empty);
        setIsLoading1(false)
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking hired status:', error);
      }
    };

    checkHiredStatus();
  }, [post.idRoom]);

  const sendImage = async (imageUri) => {
    const timeStamp = serverTimestamp();
    const newImageMessage = {
      _id: post.idRoom,
      roomId: post._id,
      post: post,
      timeStamp: timeStamp,
      user: user,
      receipient: post.user._id,
      idRoom: post.idRoom,
      image: imageUri,
    };

    try {
      await addDoc(collection(firestoreDB, "messages"), newImageMessage);
      console.log("Image sent");
    } catch (error) {
      alert('Error sending image: ' + error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      alert('Please enter a message.');
      return;
    }

    const timeStamp = serverTimestamp();
    const newMessage = {
      _id: post.idRoom,
      roomId: post._id,
      post: post,
      timeStamp: timeStamp,
      message: message,
      user: user,
      receipient: post.user._id,
      idRoom: post.idRoom,
    };

    setMessage('');

    try {
      await addDoc(collection(firestoreDB, "messages"), newMessage);
    } catch (error) {
      alert('Error sending message: ' + error);
    }
  };

  const viewProfile = () => {
    navigation.navigate("ViewProfilescreen", { post: post });
  };

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
        idRoom: room_id,
        post: post,
      };
      await addDoc(collection(firestoreDB, 'Status'), hireStatus);
      setIsHired(true);
    } catch (error) {
      console.error('Error hiring:', error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access the camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setSelectedImages(prevImages => [...prevImages, imageUri]);
      sendImage(imageUri);
    }
  };



  return (
    <View style={{ flex: 1 }}>
      
      <View className="flex-1">
        
      <BlurView className="w-full bg-slate-300 px-4 py-1" tint='extraLight' intensity={40}>
  <View className="flex-row items-center justify-between w-full py-12 px-4">
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
    </TouchableOpacity>

    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <TouchableOpacity onPress={viewProfile}>
          <View>
            <Image source={{ uri: post.user.profilePic }} resizeMode="contain" className="rounded-full  w-12 h-12" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={viewProfile}>
          <View>
            <Text className="text-black text-base font-light capitalize shadow">
              {post.user.fullName}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>

    <View style={{ alignItems: 'flex-end' }}>
      {isLoading1 ? (
        <View>
          </View>
      ) : (
        user._id !== post.index1 && (
          <>
            {isHired ? (
              <TouchableOpacity onPress={() => { }}>
                <View style={{ left: 20 }} className="relative">
                  <View style={{ backgroundColor: "#b8ccee" }} className="border-1 left-7 mr-8 border-emerald-950 rounded-lg p-4">
                    <Text className="font-bold text-zinc-950">HIRED</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={Employ}>
                <View style={{ left: 20 }} className="relative">
                  <View className="border-1 left-7 bg-red-400 border-emerald-950 mr-8 rounded-lg p-4">
                    <Text className="font-bold text-zinc-950">HIRE</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </>
        )
      )}
    </View>
  </View>
</BlurView>


        <View className="w-full bg-gray-100 px-4 py-6 flex-1 -mt-10">
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={140}
          
          >
            <>
              <ScrollView className="h-full">
                {isLoading ? (
                  <View className="w-full flex items-center justify-center">
                    <ActivityIndicator size={"large"} color={"#268290"} />
                  </View>
                ) : (
                  
                  <>
                  {messages?.map((msg, i) => (
  <View className='m-1' key={i}>
    {msg.user._id === user._id ? (
      <View style={{ alignSelf: "flex-end" }}>

              {msg.image ? (
          <Image source={{ uri: msg.image }} style={{ width: 150, height: 150, borderRadius: 10 }} />
        ) : (
          <View  className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-blue-400 w-auto relative ">

          <Text className="text-base font-semibold text-white">
            {msg.message}
          </Text>
          </View>
        )}
   
      </View>
    ) : (
      <View  style={{ alignSelf: "flex-start" }}>
              {msg.image ? (
          <Image source={{ uri: msg.image }} style={{ width: 150, height: 150, borderRadius: 10 }} />
        ) : (
          <View className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl bg-gray-300 w-auto relative ">

          <Text className="text-base  text-black">
            {msg.message}
          </Text>
          </View>
          
        )}
      </View>
   
    )}
    <View style={{ alignSelf: msg.user._id === user._id ? "flex-end" : "flex-start" }}>
      {msg?.timeStamp?.seconds && (
        <Text className="text-[12px] text-black ">
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
                  <TouchableOpacity onPress={pickImage}>
                    <Entypo name="camera" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity className="pl-4" onPress={sendMessage}>
                  <FontAwesome name="send" size={24} color="light-blue" />
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

