import { View, Text, Platform, TextInput } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native'
import { KeyboardAvoidingView } from 'react-native'
import { ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { firestoreDB } from '../config/firebase.config'

const Postscreen = () => {
  const [isJob, setisJob] = useState(false)
  const [value, setvalue] = useState(""); 
  const [statevalue, setstatevalue] = useState("")
  const [value1, setvalue1] = useState(""); 
  const [statevalue1, setstatevalue1] = useState("")
  const [value2, setvalue2] = useState(""); 
  const [statevalue2, setstatevalue2] = useState("")
  const [value3, setvalue3] = useState(""); 
  const [statevalue3, setstatevalue3] = useState("")
  const [value4, setvalue4] = useState(""); 
  const [statevalue4, setstatevalue4] = useState("")
  const navigation= useNavigation();
  const user = useSelector((state) => state.user.user)

  const handleTextChange = (text) => {
    setvalue(text); 
    setstatevalue(text); 
    {
      value.length > 18 ? (
        console.log("bad boy")
      ) : (
        console.log("good boy")
      )
    }
  };

  const handleTextChange1 = (text) => {
    setvalue1(text); 
    setstatevalue1(text); 
  };

  const handleTextChange2 = (text) => {
    setvalue2(text); 
    setstatevalue2(text); 
  };

  const handleTextChange3 = (text) => {
    setvalue3(text);
    switch(text.toLowerCase()) {
      case "remote":
        console.log("good remote");
        setisJob(true);
        break;
      case "physical":
        console.log("good physical");
        setisJob(true);
        break;
      default:
        setisJob(false);
    }
    if (statevalue3.toLowerCase() === "physical" && text.toLowerCase() !== "physical") {
      setisJob(false);
    }
    setstatevalue3(text);
  };

  const handleTextChange4 = (text) => {
    setvalue4(text); 
    setstatevalue4(text); 
  };

  const handlePost = async () => {
    const id = `${user._id}-${Date.now()}`; // Generate a unique ID
    const _doc = {
      _id: id,
      JobDetails: value,
      Description: value1,
      Location: value2,
      Type: value3,
      Budget: value4,
      User: user
    };

    await addDoc(collection(firestoreDB, "postings"), _doc)
      .then(() => {
        setvalue("");
        setvalue1("");
        setvalue2("");
        setvalue3("");
        setvalue4("");
        navigation.navigate("Home");
      })
      .catch(err => alert(err));
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView>
          
          <View className="w-full h-full bg-white flex  justify-start py-6 space-y-6">
          <View className="items-center">
            <Text className=" text-primaryBold text-xl">
              Create Post
            </Text>
          </View>
            <Text className="left-5 text-xl">Job Details</Text>
            <TextInput
              className="border border-primary rounded-2xl w-[360px] left-5 px-4 py-9 flex-row items-center justify-between space-x-4 my-2"
              placeholder="Title Here"
              onChangeText={handleTextChange}
              value={value}
            />

            <Text className="left-5 text-xl">Description</Text>
            <TextInput
              className="border border-primary rounded-2xl w-[360px] h-[215px] px-4 py-9 flex-row items-center justify-between space-x-8 left-5 my-2"
              placeholder= "Describe the job"
              multiline={true}
              onChangeText={handleTextChange1}
              value={value1}
            />

            <Text className="left-5 text-xl">Location</Text>
            <TextInput
              className="border border-primary rounded-2xl w-[360px]  px-4 py-9 flex-row items-center justify-between space-x-8 left-5 my-2"
              placeholder= "Where the freelancer would do the Job"
              onChangeText={handleTextChange2}
              value={value2}
            />

            <Text className="left-5 text-xl">Job Type</Text>
            <TextInput
              className={`border rounded-2xl w-[360px]  px-4 py-9 flex-row items-center justify-between space-x-8 left-5 my-2 ${!isJob && value3.length > 0 ? "border-red-500" : "border-primary"}`}
              placeholder= "Remote or Physical"
              onChangeText={handleTextChange3}
              value={value3}
            />

            <Text className="left-5 text-xl">Budget</Text>
            <View className=" bottom-5">
              <Text style={{ position: 'relative', left: 24,top: 55, color: 'black', fontSize: 16 }}> ₦</Text>
              <TextInput
                className="border border-primary rounded-2xl w-[360px]  px-4 py-9 flex-row items-center justify-between space-x-8 left-5 "
                placeholder= "  Amount of money willing to pay"
                onChangeText={handleTextChange4}
                value= {value4}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity onPress={handlePost} className="w-full px-4 rounded-xl bg-primary my-3 flex items-center justify-center">
              <Text className='py-2 text-white text-xl font-semibold'>Post Job</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Postscreen;
