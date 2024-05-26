import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground, Alert } from 'react-native';
import { Image } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { firebaseAuth, firestoreDB } from '../config/firebase.config';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useFonts, Dosis_400Regular } from '@expo-google-fonts/dosis';
import { MaterialIcons } from '@expo/vector-icons';

const Profilescreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [jobCount, setJobCount] = useState(0);
  const [allHires, setAllHires] = useState(0);
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);

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
      console.log('Image URI:', result.assets[0].uri);
      setBackgroundImage(result.assets[0].uri);
    } else {
      console.log('Image selection canceled');
    }
  };
  

  const logout = async () => {
    setIsApplying(true);
    await firebaseAuth.signOut().then(() => {
      dispatch(SET_USER_NULL());
      navigation.replace('Loginscreen');
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <ImageBackground source={backgroundImage ? { uri: backgroundImage } : null} style={{ flex: 1 }}>
        <ScrollView className="p-4">
          <View className="flex-row justify-between pt-4">
            <TouchableOpacity onPress={logout}>
              {isApplying ? (
                <ActivityIndicator className="py-3 w-8 h-12" size="large" color="#268290" />
              ) : (
                <Text style={{ color: "#268290" }} className="font-bold text-lg">Logout</Text>
              )}
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#268290" />
            </View>
          ) : (
            <>
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
                <Text className="text-base font-thin">{details.length > 0 ? details[0].About : ''}</Text>
              </View>

              <View className="mt-4" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {details.length > 0 && typeof details[0].Skills === 'string' && (
                  details[0].Skills.split(', ').map((skill, index) => (
                    <View key={index} style={{ borderColor: "#268290", borderWidth: 1, borderRadius: 20, padding: 8, margin: 4 }}>
                      <Text className="capitalize">{skill}</Text>
                    </View>
                  ))
                )}
              </View>
                
              <TouchableOpacity onPress={pickImage}>
              <View className="w-full flex-row items-center ">
              <Text className="mt-5 font-semibold">Portfolio</Text>
              <View className=" left-2 top-2 w-6 h-6 bg-primaryButton rounded-full  flex items-center justify-center">
                  <MaterialIcons name='edit' size={10} color={'#fff'} />
                </View>

              </View>

              </TouchableOpacity>
             
              

              <View className=" left-6" style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
  {details.length > 0 && details[0].image && Array.isArray(details[0].image) && details[0].image.length > 0 ? (
    details[0].image.map((imageUri, index) => (
      <Image key={index} resizeMode="cover" style={{ width: 100, height: 100, margin: 5 }} source={{ uri: imageUri }} />
    ))
  ) : (
    <View className="  w-full items-center">
      <Text className="font-extralight italic" style={{ fontSize: 16 }}>Nothing on portfolio</Text>
      
    </View>
    
  )}
</View>


            </>
          )}

    
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Profilescreen;
