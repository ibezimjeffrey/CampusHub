import { Text, View,SafeAreaView,TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Logo } from '../assets';
import { Image } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { useState,  } from 'react';
import { useEffect } from 'react';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { firebaseAuth, firestoreDB } from '../config/firebase.config';
import { useLayoutEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useFonts, Dosis_200ExtraLight, Dosis_400Regular, Dosis_800ExtraBold } from '@expo-google-fonts/dosis';
import { StyleSheet } from 'react-native';

const ViewProfilescreen = ({ route }) => {
    const { post } = route.params;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [jobCount, setJobCount] = useState(0);

    const [Details, setDetails] = useState("");
    const [isLoading, setisLoading] = useState(true);
    const [AllHires, setAllHires] = useState(0)


    useEffect(() => {
      const unsubscribe = onSnapshot(query(collection(firestoreDB, 'Status'), where('receipient._id', '==', post.user._id)), (QuerySnapshot) => {
        setAllHires(QuerySnapshot.docs.length);
        
      });
      return unsubscribe;
    }, [post._id]);

    useLayoutEffect(() => {
        const msgQuery = query(
            collection(firestoreDB, "users", post.user._id, "details"),
        );

        const unsubscribe = onSnapshot(msgQuery, (QuerySnapshot) => {
            const upMsg = QuerySnapshot.docs.map((doc) => doc.data());
            setDetails(upMsg);
            setisLoading(false);
        });

        return unsubscribe;
    }, [post.user._id]);

    const styles = StyleSheet.create({
        dosisText: {
            fontFamily: 'Dosis_400Regular',
            fontSize: 20,
        },
    });

    const [fontsLoaded] = useFonts({
        Dosis_200ExtraLight,
        Dosis_400Regular,
        Dosis_800ExtraBold,
    });

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="h-full">
                <View className="w-full flex-row items-center justify-between px-4 bg-white"></View>

                <View className="items-center justify-center">
                    <View className="relative border-2 border-primary p-1 rounded-full">
                        <Image
                            source={{ uri: post.user.profilePic }}
                            resizeMode="cover"
                            className="w-24 h-24"
                        />
                    </View>

                    <Text className="text-xl font-semibold pt-3">{post.user.fullName}</Text>
                    <Text className="text-base font-semibold text-primaryText">{post.user.email}</Text>
                </View>
                <View className="">
      
      <View className=" top-8  justify-start flex-row">

      <Text className=" mr-11 text-2xl">
        {jobCount}
      </Text>
      </View>


      <View  className=" items-end justify-end flex-row">
      <Text className=" text-2xl ">
        {AllHires}
      </Text>

      </View>

      

      
      </View>

      <View className="justify-between items-center flex-row mt-3 mb-8">
      
      <Text className="text-base text-gray-500" style={styles.dosisText1}>
        Jobs posted
      </Text>

      <Text  className="text-base text-gray-500" style={styles.dosisText1}>
        Hires
      </Text>
    </View>


                <>
                    {isLoading ? (
                        <>
                            <View className="w-full flex items-center justify-center">
                                <ActivityIndicator size={"large"} color={"#43C651"} />
                            </View>
                        </>
                    ) : (
                        <>
                            <View className="border border-y-emerald-600 top-4 py-9 flex-row items-center justify-between space-x-4 my-2">
                                <Text style={styles.dosisText} className="text-xl text-primary">
                                    Course of study:
                                    <Text style={styles.dosisText} className="text-xl text-primaryBold">
                                        {Details.length > 0 ? Details[0].Hostel : ''}
                                    </Text>
                                </Text>
                            </View>

                            <View className="top-4 px-6">
                                <Text style={styles.dosisText} className="text-black">
                                    {Details.length > 0 ? Details[0].About : ''}
                                </Text>
                            </View>

                            <View className="border top-4 px-6 items-center justify-between space-x-4 my-6">
                                <Text style={styles.dosisText}>Skills:</Text>
                                <View>
                                    <View className="border-2 border-primaryText p-1 rounded-full">
                                        <Text>{Details.length > 0 ? Details[0].Skills : ''}</Text>
                                    </View>
                                </View>
                            </View>
                        </>
                    )}
                </>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ViewProfilescreen;