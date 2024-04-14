import { View, Text, ActivityIndicator, Image } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Logo } from '../assets';
import { firebaseAuth, firestoreDB } from '../config/firebase.config';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { SET_USER } from '../context/actions/userActions';
import { useDispatch } from 'react-redux';

const Splashscreen = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()

    useLayoutEffect(() => {
        checkLoggedUser();

    }, [])

    const checkLoggedUser = async () => {
      firebaseAuth.onAuthStateChanged((userCred) => {
          if (userCred?.uid) {
              getDoc(doc(firestoreDB, 'users', userCred?.uid)).then(DocumentSnapshot => {
                  if (DocumentSnapshot.exists) {
                      console.log("User Data", DocumentSnapshot.data())
                      dispatch(SET_USER(DocumentSnapshot.data()));
                  }
              }).then(() => {
                  setTimeout(() => {
                      navigation.replace("Homescreen"); 
                  });
              })
          } else {
              setTimeout(() => {
                  navigation.replace("Loginscreen");
              }, 2000);
          }
      })
  }
  
  
  return (
    <View className = "flex-1 items-center justify-center space-y-24">
        <Image source = {Logo} className="w-24 h-24" resizeMode="contain"/>
        <ActivityIndicator size={"large"} color={"#0DC7BA"}/>

    </View>
   
  );
}

export default Splashscreen