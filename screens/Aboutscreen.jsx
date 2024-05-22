import { View, Text, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { addDoc, collection, doc } from 'firebase/firestore';
import { firestoreDB } from '../config/firebase.config';
import { useSelector } from 'react-redux';

const Aboutscreen = () => {
  const [value, setvalue] = useState(""); 
  const [statevalue, setstatevalue] = useState("")

  const [value1, setvalue1] = useState(""); 
  const [statevalue1, setstatevalue1] = useState("")

  const [value2, setvalue2] = useState(""); 
  const [statevalue2, setstatevalue2] = useState("")

  
  const handleTextChange = (text) => {
    setvalue(text); 
    setstatevalue(text); 
  };

  const handleTextChange1 = (text) => {
    setvalue1(text); 
    setstatevalue1(text); 
  };

  const handleTextChange2 = (text) => {
    setvalue2(text); 
    setstatevalue2(text); 
  };

  const navigation= useNavigation();
  const user = useSelector((state) => state.user.user)

  let wordCount = value1.trim().split(/\s+/).filter(word => word.length > 0).length;
  let wordCount1 = value.trim().split(/\s+/).filter(word => word.length > 0).length;
  let wordCount2 = value2.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handleAbout = async () => {
    console.log("Button pressed"); // Debugging log
    console.log("Values:", value, value1, value2); 

    if (!value.trim() || !value1.trim() || !value2.trim()) {
      alert('Please fill in all details');
      return;
    }

    let wordCount = value1.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 15) {
      alert('Minimum of 15 words');
      return;
    }

    const skillsArray = value2.trim().split(',').map(skill => skill.trim());

    const _doc = {
      _id: user._id,
      Hostel: value,
      About: value1,
      Skills: skillsArray,
    };

    try {
      await addDoc(collection(doc(firestoreDB, "users", user._id), "details"), _doc);
      navigation.navigate("Homescreen");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white"> 
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView className="h-full">
          <View className="w-full h-full bg-white flex  justify-start py-6 space-y-6">
            <Text className="py-2 text-primaryText text-xl font-semibold">Let's get to know you</Text>
            <Text className="left-5 text-base ">What course are you studying?</Text>
            <TextInput
              className= {`border rounded-2xl w-[360px] left-5 px-4 py-9 flex-row items-center justify-between space-x-4 my-2 `}
              placeholder="e.g Business Administration..."
              onChangeText={handleTextChange}
              value={value}
            />
            <Text className="left-5 text-base">Tell us about yourself</Text>
            <TextInput
              className={`border rounded-2xl w-[360px] h-[215px] px-4 py-9 flex-row items-center justify-between space-x-8 left-5 my-2 `}
              placeholder= "(minimum of 15 words)"
              onChangeText={handleTextChange1}
              value={value1}
              multiline={true}
            />
            <Text className="left-5 text-base">What are your skills</Text>
            <TextInput
              className={`border rounded-2xl w-[360px]  px-4 py-9 flex-row items-center justify-between space-x-8 left-5 my-2 `}
              placeholder= "Coding, Graphic Design..."
              onChangeText={handleTextChange2}
              value={value2}
              multiline={true}
            />
            <TouchableOpacity 
              onPress={handleAbout}
              className="w-full px-4 rounded-xl bg-primaryButton my-3 flex items-center justify-center">
              <Text className='py-2 text-white text-xl font-semibold'>Ready to work!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Aboutscreen;
