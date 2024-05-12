import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { firebaseAuth, firestoreDB } from '../config/firebase.config';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useFonts, Dosis_200ExtraLight, Dosis_400Regular, Dosis_800ExtraBold } from '@expo-google-fonts/dosis';
import { MaterialIcons } from '@expo/vector-icons';

const ViewProfilescreen = ({ route }) => {
  const { post } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [jobCount, setJobCount] = useState(0);
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [allHires, setAllHires] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(firestoreDB, 'Status'), where('receipient._id', '==', post.user._id)), (querySnapshot) => {
      setAllHires(querySnapshot.docs.length);
    });
    return unsubscribe;
  }, [post._id]);

  useLayoutEffect(() => {
    const msgQuery = query(collection(firestoreDB, 'users', post.user._id, 'details'));
    const unsubscribe = onSnapshot(msgQuery, (querySnapshot) => {
      const upMsg = querySnapshot.docs.map((doc) => doc.data());
      setDetails(upMsg);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [post.user._id]);

  const [fontsLoaded] = useFonts({
    Dosis_200ExtraLight,
    Dosis_400Regular,
    Dosis_800ExtraBold,
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <View className="flex-row items-center justify-between pt-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color="blue" />
          </TouchableOpacity>
        </View>
        
        <View className="items-center mt-8">
          <View className="rounded-full p-1">
            <Image source={{ uri: post.user.profilePic }} resizeMode="cover" style={{ width: 100, height: 100 }} />
          </View>

          <Text className="text-2xl capitalize font-bold pt-4">{post.user.fullName}</Text>
          <Text className="text-base font-bold text-gray-500">{post.user.email}</Text>
        </View>

        <View className="flex-row justify-between mt-4">
          <View className="items-center">
            <Text className="text-2xl">{jobCount}</Text>
            <Text className="text-gray-500">Jobs posted</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl">{allHires}</Text>
            <Text className="text-gray-500">Hires</Text>
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-base text-gray-500">Course of study: <Text className="text-base font-bold">{details.length > 0 ? details[0].Hostel : ''}</Text></Text>
        </View>

        <View className="mt-4">
          <Text className="text-base">{details.length > 0 ? details[0].About : ''}</Text>
        </View>

        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-base font-bold">Skills:</Text>
          <View className="border-2 border-blue-500 rounded-full p-1">
            <Text>{details.length > 0 ? details[0].Skills : ''}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewProfilescreen;
