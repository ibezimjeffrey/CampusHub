import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, TextInput, Image, Linking } from 'react-native';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { firestoreDB } from '../config/firebase.config';

const Chatscreen = ({ route }) => {
  const { post } = route.params;
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isHired, setIsHired] = useState(false);

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
  }, [post.idRoom]);

  useEffect(() => {
    const checkHiredStatus = async () => {
      const statusSnapshot = await getDocs(query(collection(firestoreDB, 'Status'), where('idRoom', '==', post.idRoom), where('user._id', '==', user._id)));
      setIsHired(!statusSnapshot.empty);
    };

    checkHiredStatus();
  }, [post.idRoom, user._id]);

  const sendMessage = async () => {
    const timeStamp = serverTimestamp();
    const newMessage = {
      _id: post.idRoom,
      roomId: post._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
      recipient: post.user._id,
      idRoom: post.idRoom
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

  const Employ = async () => {
    const id = `${user._id}-${Date.now()}`;
    const room_id = `${post.idRoom}-${Date.now()}-${new Date().getSeconds()}`;

    const hireStatus = {
      _id: id,
      user: user,
      recipient: post.user,
      status: true,
      idRoom: room_id
    };

    try {
      await addDoc(collection(firestoreDB, "Status"), hireStatus);
    } catch (error) {
      alert('Error sending message: ' + error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
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
                  {!Hired && status ? (
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
        
        <View style={{ flex: 1, backgroundColor: 'gray', padding: 20 }}>
          {/* Your message rendering code here */}
          
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {user._id !== post.index1 && (
              <>
                {!isHired && (
                  <TouchableOpacity onPress={Employ}>
                    <View style={{ borderWidth: 1, borderColor: 'red', borderRadius: 10, padding: 10 }}>
                      <Text>HIRE</Text>
                    </View>
                  </TouchableOpacity>
                )}
                {isHired && (
                  <View style={{ borderWidth: 1, borderColor: 'green', borderRadius: 10, padding: 10 }}>
                    <Text>HIRED</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Chatscreen;
