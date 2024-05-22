import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { firestoreDB } from '../config/firebase.config';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const DetailsScreen = ({ route }) => {
  const { post } = route.params;
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const [isUserPosted, setIsUserPosted] = useState(post.User._id === user._id);
  const room_id = `${user._id}-${Date.now()}-${new Date().getSeconds()}`;

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
    try {
      await deleteDoc(doc(firestoreDB, 'postings', postIdToRemove));
      alert('Post successfully removed');
      navigation.navigate("Homescreen")
    } catch (error) {
      console.error('Error removing document: ', error);
    }
  };

  const createNewChat = async () => {
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
      othersideview()
    } catch (err) {
      alert("Error: " + err);
    }
  };

  
  return (
    
    <View style={styles.container}>
       <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name='chevron-left' size={32} color={"black"}/>

      </TouchableOpacity>
      
      
      <View className="bottom-2">
        <Image source={{ uri: post.User.profilePic }} resizeMode="contain" className="w-24 h-24 relative top-2"/>     
      </View>
     
      <Text className="capitalize" style={styles.detailText}>{post.User.fullName}</Text>
      <Text style={styles.title}>{post.JobDetails}</Text>
      <Text className="first-letter:capitalize" style={styles.description}>{post.Description}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Location: {post.Location}</Text>
        <Text style={styles.detailText}>Type: {post.Type}</Text>
        <Text style={styles.detailText}>Budget: ₦{post.Budget}</Text>
      </View>
      {!isUserPosted && (
        <TouchableOpacity
          style={styles.applyButton}
          onPress={createNewChat}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      )}

{isUserPosted && (
        <TouchableOpacity
          style={styles.applyButton1}
          onPress={()=>removePost(post.id)}>
          <Text style={styles.applyButtonText}>Remove Job</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  applyButton1: {
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default DetailsScreen;
