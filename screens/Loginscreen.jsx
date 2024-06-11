import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { BGImage, Logo, Logo1 } from '../assets';
import { Userinput } from '../components';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseAuth, firestoreDB } from '../config/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { SET_USER } from '../context/actions/userActions';

const Loginscreen = () => {
  const screenwidth = Math.round(Dimensions.get("window").width);
  const [isApplying, setIsApplying] = useState(false);

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [getEmailValidationStatus, setgetEmailValidationStatus] = useState(false);

  const [alert, setalert] = useState(false);
  const [alertMessage, setalertMessage] = useState(null);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const HandleLogin = async () => {
    setIsApplying(true);
    if (getEmailValidationStatus && email !== "") {
      try {
        const userCred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        if (userCred) {
          await userCred.user.reload();
          

          console.log("User ID", userCred?.user.uid);

          const userDoc = await getDoc(doc(firestoreDB, 'users', userCred?.user.uid));
          if (userDoc.exists) {
            console.log("User Data", userDoc.data());
            dispatch(SET_USER(userDoc.data()));
           
          }
        }
      } catch (err) {
        console.log("Error: ", err.message);

        setIsApplying(false);
        setalert(true);

        if (err.message.includes("invalid-credential")) {
          setalertMessage("Wrong credentials");
        } else if (err.message.includes("network-request-failed")) {
          setalertMessage("Check Internet Connection");
          setTimeout(() => {
            setalert(false);
          }, 9000);
        } else if (err.message.includes("user-not-found")) {
          setalertMessage("User not found");
          setTimeout(() => {
            setalert(false);
          }, 2000);
        } else {
          setalertMessage("Invalid Email Address");
          setTimeout(() => {
            setalert(false);
          }, 2000);
        }
      } finally {
        setIsApplying(false);
      }
    } else {
      setIsApplying(false);
      setalert(true);
      setalertMessage("Please enter a valid email.");
      setTimeout(() => {
        setalert(false);
      }, 2000);
    }
  };


  return (
    <ScrollView className="h-full bg-white">
      <View className='flex-1 bg-white items-center justify-start'>
        <View style={{ top: 100 }} className='w-full h-full bg-white flex items-center justify-start py-12 px-6 space-y-6'>
          <Image source={Logo} className="w-12 h-12" resizeMode="cover" />
          <View style={{ marginTop: 150 }} className="w-full flex items-center justify-center">
            {alert && (
              <Text className="text-base text-red-500">{alertMessage}</Text>
            )}
            <Userinput
              Placeholder="Email"
              isPass={false}
              setstateValue={setemail}
              setgetEmailValidationStatus={setgetEmailValidationStatus}
            />
            <Userinput
              Placeholder="Password"
              isPass={true}
              setstateValue={setpassword}
            />
            <TouchableOpacity onPress={HandleLogin} className="w-full px-4 rounded-xl bg-primaryButton my-3 flex items-center justify-center">
              {isApplying ? (
                <ActivityIndicator className="py-3" size="small" color="#ffffff" />
              ) : (
                <Text className='py-2 text-white text-xl font-semibold'>Sign in</Text>
              )}
            </TouchableOpacity>
            <View className="w-full flex-row py-2 justify-center space-x-2">
              <Text className="text-base font-thin text-primaryText">Don't have an Account?</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Signupscreen")}>
              <Text className="text-base font-semibold text-primaryButton">Create here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default Loginscreen;
