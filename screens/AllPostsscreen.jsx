import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { firestoreDB } from '../config/firebase.config';
import { useFonts, Dosis_400Regular } from '@expo-google-fonts/dosis';
import { StyleSheet } from 'react-native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const AllPostsscreen = ({route}) => {
    const { user } = route.params;
    const [Postings, setPostings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigation();
    useEffect(() => {
        const msgQuery = query(collection(firestoreDB, 'postings'));
        const unsubscribe = onSnapshot(msgQuery, (QuerySnapshot) => {
          const upMsg = QuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setPostings(upMsg.filter(post => post.User._id === user._id));
          setIsLoading(false);
        });
        return unsubscribe;
      }, [user._id]);
    
      const styles = StyleSheet.create({
        dosisText: {
          fontFamily: 'Dosis_400Regular',
          fontSize: 20,
        },
      });

      const PostingCard = ({ post }) => {
        const isCurrentUserPost = post.User._id === user._id;
    
        return (
          <View className="rounded-xl w-[350px] flex py-2">
            <TouchableOpacity onPress={() => navigate.navigate("DetailsScreen", { post })}>
              <View style={{ left: 30 }} className="bg-neutral-200 rounded-xl w-[350px] h-[150px] border-1 relative shadow">
                <Image source={{ uri: post.User.profilePic }} resizeMode="cover" className="w-12 h-12 relative top-2" style={{ alignSelf:'flex-end' }} />
                <Text className="text-black text-2xl absolute top-10">{post.JobDetails}</Text>
                <Text style={{ top: 20 }} className="text-gray-500 text-xl absolute">
                  {post.Location}
                </Text>
                <View style={{ top: 110 }} className="w-full h-1 border bg-primaryBold absolute"></View>
                <Text className="text-primary text-xl absolute bottom-2 left-2">{post.Type}</Text>
                <Text className="text-primaryBold text-base absolute bottom-2 right-2">Fixed Price / ₦{post.Budget}</Text>
             
              </View>
            </TouchableOpacity>
          </View>
        );
      };

    
  return (
    <SafeAreaView>

    
    <View>
        <ScrollView className="h-full"> 
        <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="chevron-left" size={32} color={"#000000"} />
            </TouchableOpacity>
        <View className="items-center">
            <Text className=" text-primaryBold text-xl">
              My Posts
            </Text>
          </View>

       
       {isLoading ? (
            <View className="w-full flex items-center justify-center">
              <ActivityIndicator size={'large'} color={'#43C651'} />
            </View>
          ) : (
            <View>
              {Postings.length > 0 ? (
                Postings.map((post, i) => (
                  <PostingCard key={i} post={post} />
                ))
              ) : (
                <View className=" flex flex-column justify-center align-middle items-center">
                <Text>You have no jobs posted</Text>
                </View>
              )}
            </View>
          )}
           </ScrollView>
    </View>
    </SafeAreaView>
  )
}

export default AllPostsscreen