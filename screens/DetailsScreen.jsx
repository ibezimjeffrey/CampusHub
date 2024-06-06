import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { deleteDoc, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { firestoreDB } from '../config/firebase.config';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DetailsScreen = ({ route }) => {
  const { post } = route.params;
  const user = useSelector((state) => state.user.user);
  const [isUserPosted, setIsUserPosted] = useState(post.User._id === user._id);
  const room_id = `${user._id}-${post._id}`;
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const navigation = useNavigation();
  const identifier =  `${user._id}-${post.User._id}-${post._id}`;

  useEffect(() => {
    const checkIfApplied = async () => {
      const chatQuery = query(
        collection(firestoreDB, 'chats'),
        where('idRoom', '==', room_id)
      );

      const querySnapshot = await getDocs(chatQuery);
      if (!querySnapshot.empty) {
        setHasApplied(true);
      }
    };

    checkIfApplied();
  }, [user._id, room_id]);

  const othersideview = async () => {
    const newid = `${post.User._id}-${Date.now()}`;

    const _doc1 = {
      index: post.User._id,
      _id: newid,
      user: user,
      chatName: post.User.fullName,
      jobName: post.JobDetails,
      profilePic: post.User.profilePic,
      idRoom: room_id,
      index1: user._id
    };

    try {
      await setDoc(doc(firestoreDB, "chats", newid), _doc1);
      navigation.navigate("Homescreen", { post: post });
      alert(post.User.fullName + ' has been added to chats');
    } catch (err) {
      alert("Error: " + err);
    }
  }

  const removePost = async (postIdToRemove) => {
    setIsApplying(true);
    try {
      await deleteDoc(doc(firestoreDB, 'postings', postIdToRemove));
      alert('Post successfully removed');
      navigation.navigate("Homescreen");
    } catch (error) {
      console.error('Error removing document: ', error);
    }
  };

  const createNewChat = async () => {
    setIsApplying(true);

    // Check if the user has already applied
    const chatQuery = query(
      collection(firestoreDB, 'chats'),
      where('idRoom', '==', room_id)
    );

    const querySnapshot = await getDocs(chatQuery);
    if (!querySnapshot.empty) {
      setIsApplying(false);
      alert("You have already applied for this job.");
      return;
    }

    const id = `${user._id}-${Date.now()}`;

    const _doc = {
      index: user._id,
      _id: id,
      user: post.User,
      chatName: post.User.fullName,
      jobName: post.JobDetails,
      idRoom: room_id,
      index1: user._id
    };

    try {
      await setDoc(doc(firestoreDB, "chats", id), _doc);
      setIsApplying(false);
      othersideview();
    } catch (err) {
      setIsApplying(false);
      alert("Error: " + err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-center mt-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-4">
          <MaterialIcons name='chevron-left' size={32} color={"#000"} />
        </TouchableOpacity>
        <Text className="text-2xl font-light">Job Details</Text>
      </View>

      <View className="items-center mt-5">
        <Image style={{borderColor:"#268290"}} source={{ uri: post.User.profilePic }} resizeMode="cover" className="w-40 h-40 rounded-full border-2 " />
        <Text className="text-xl font-extralight mt-2">{post.User.fullName}</Text>
      </View>

      <View className="px-4 mt-5">
        <Text className="text-2xl text-gray-500 capitalize">{post.JobDetails}</Text>
        <Text className="text-base mt-2">{post.Description}</Text>
      </View>

      <View className="flex-row justify-around mt-5">
        <View className="flex items-center">
          <MaterialIcons name='location-on' size={24} color={"#268290"} />
          <Text className="text-base text-primaryButton mt-1">{post.Location}</Text>
        </View>
        <View className="flex items-center">
          <MaterialIcons name='calendar-month' size={24} color={"#268290"} />
          <Text className="text-base text-primaryButton mt-1">{post.Type}</Text>
        </View>
        <View className="flex items-center">
          <MaterialIcons name='attach-money' size={24} color={"#268290"} />
          <Text className="text-base text-primaryButton mt-1">{post.Budget}</Text>
        </View>
      </View>

      {!isUserPosted ? (
        hasApplied ? (
          <View className="bg-gray-300 py-3 rounded-lg mt-5 mx-4 items-center">
            <Text className="text-white font-bold">Already Applied</Text>
          </View>
        ) : (
          <TouchableOpacity className="bg-primaryButton py-3 rounded-lg mt-5 mx-4 items-center" onPress={createNewChat}>
            {isApplying ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white font-bold">Apply Now</Text>
            )}
          </TouchableOpacity>
        )
      ) : (
        <TouchableOpacity className="bg-red-500 py-3 rounded-2xl mt-5 mx-4 items-center" onPress={() => removePost(post.id)}>
          {isApplying ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white font-bold">Remove Job</Text>
          )}
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default DetailsScreen;
