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

  const handleAbout = async () => {
   
      
        const _doc = {
          _id: user._id,
          Hostel: value,
          About: value1,
          Skills: value2,
          

        };

        console.log(_doc)

        
        await addDoc(collection(doc(firestoreDB, "users", user._id), "details"),_doc).then(()=>{navigation.navigate("Homescreen")}).catch(err => alert(err))

        

  };





  return (
    <SafeAreaView>
      <KeyboardAvoidingView
          
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          
        >

          <>
          <ScrollView>
          <View className="w-full h-full bg-white flex  justify-start py-6 space-y-6">
          <Text className="py-2 text-primaryText text-xl font-semibold">Let's get to know you</Text>
          <Text className="left-5 text-xl">What hostel are you in?</Text>

          <TextInput
        className="border rounded-2xl w-[360px] left-5 px-4 py-9 flex-row items-center justify-between space-x-4 my-2"
        placeholder="e.g Pod Living..."
        onChangeText={handleTextChange}
        value={value}
        
      
      />


      <Text className="left-5 text-xl">Tell us about yourself</Text>


      <TextInput
        className="border rounded-2xl w-[360px] h-[215px] px-4 py-9 flex-row items-center justify-between space-x-8 left-5 my-2"
        placeholder= "I am a..."
        onChangeText={handleTextChange1}
        value={value1}
        multiline={true}
        
      
      />

<Text className="left-5 text-xl">What are your skills</Text>


<TextInput
  className="border rounded-2xl w-[360px]  px-4 py-9 flex-row items-center justify-between space-x-8 left-5 my-2"
  placeholder= "Coding, Graphic Design..."
  onChangeText={handleTextChange2}
  value={value2}
  multiline={true}
  

/>

      

<TouchableOpacity onPress={handleAbout}
          className="w-full px-4 rounded-xl bg-primary my-3 flex items-center justify-center">

            <Text className='py-2 text-white text-xl font-semibold'>Ready to work!</Text>


          </TouchableOpacity>

    </View>
            
          </ScrollView>
          
          </>
          



        </KeyboardAvoidingView>
          
    </SafeAreaView>
   )
}

export default Aboutscreen