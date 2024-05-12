import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { firebaseAuth, firestoreDB } from '../config/firebase.config';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useFonts, Dosis_400Regular } from '@expo-google-fonts/dosis';

const Profilescreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [jobCount, setJobCount] = useState(0);
  const [allHires, setAllHires] = useState(0);
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(firestoreDB, 'Status'), where('receipient._id', '==', user._id)), (querySnapshot) => {
      setAllHires(querySnapshot.docs.length);
    });
    return unsubscribe;
  }, [user._id]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(firestoreDB, 'AllPostings'), where('User._id', '==', user._id)), (querySnapshot) => {
      setJobCount(querySnapshot.docs.length);
    });
    return unsubscribe;
  }, [user._id]);

  useEffect(() => {
    const msgQuery = query(collection(firestoreDB, 'users', user._id, 'details'));
    const unsubscribe = onSnapshot(msgQuery, (querySnapshot) => {
      const upMsg = querySnapshot.docs.map((doc) => doc.data());
      setDetails(upMsg);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    await firebaseAuth.signOut().then(() => {
      dispatch(SET_USER_NULL());
      navigation.replace('Loginscreen');
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <View className="flex-row justify-between pt-4">
          <TouchableOpacity onPress={logout}>
            <Text style={{color:"#268290"}} className=" font-bold text-lg">Logout</Text>
          </TouchableOpacity>
        </View>
        
        <View className="items-center mt-8">
          <View className="rounded-full p-1">
            <Image source={{ uri: user?.profilePic }} resizeMode="cover" style={{ width: 100, height: 100 }} />
          </View>

          <Text className="text-2xl font-bold pt-4">{user.fullName}</Text>
          <Text className="text-base font-bold text-gray-500">{user.email}</Text>
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
          <Text className="text-base text-gray-500">Course of study: <Text className="font-bold">{details.length > 0 ? details[0].Hostel : ''}</Text></Text>
        </View>

        <View className="mt-4">
          <Text className="text-base">{details.length > 0 ? details[0].About : ''}</Text>
        </View>

        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-base font-bold">Skills:</Text>
          <View style={{borderColor:"#268290"}} className="border-2 rounded-full p-1">
            <Text>{details.length > 0 ? details[0].Skills : ''}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profilescreen;
