import { View, Text, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { addDoc, collection, doc } from 'firebase/firestore';
import { firestoreDB } from '../config/firebase.config';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

const Aboutscreen = () => {
  const [isApplying, setIsApplying] = useState(false); 
  const [value, setvalue] = useState(""); 
  const [statevalue, setstatevalue] = useState("")
  const [Imagee, setImagee] = useState(null)
  const [selectedImages, setSelectedImages] = useState([]);


  const [value1, setvalue1] = useState(""); 
  const [statevalue1, setstatevalue1] = useState("")

  const [value2, setvalue2] = useState(""); 
  const [statevalue2, setstatevalue2] = useState("")

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access the camera roll is required!');
      return;
    }
  
    let selecting = true;
    let images = [];
  
    
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        images.push(result.assets[0].uri);
      } else {
        selecting = false;
      }
    
  
    if (images.length > 0) {
      setSelectedImages(prevImages => [...prevImages, ...images]);
      alert("Images successfully added");
    } else {
      console.log('Image selection canceled');
    }
  };
  

  
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
    setIsApplying(true);
   

    if (!value.trim() || !value1.trim() || !value2.trim()) {
      alert('Please fill in all details');
      setIsApplying(false);
      return;
    }

    let wordCount = value1.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 15) {
      alert('Minimum of 15 words');
      setIsApplying(false);
      return;
    }

    const skillsArray = value2.trim().split(',').map(skill => skill.trim());

    const _doc = {
      _id: user._id,
      Hostel: value,
      About: value1,
      Skills: skillsArray.join(', '),
      image: selectedImages
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
    
            <Picker
            className="left-5"
  selectedValue={value}
  onValueChange={(itemValue) => handleTextChange(itemValue)}
  style={{ 
    borderWidth: 1,
    borderColor: value.length > 0 ? "#268290" : "gray",
    borderRadius: 20,
    paddingHorizontal: 18, 
    width:360,
    left:20
  }}
>
  <Picker.Item label="Course" value="" />
  <Picker.Item label="Mass Communication" value="Mass Communication" />
  <Picker.Item label="ISMS" value="ISMS" />
  <Picker.Item label="Mechanical Engineering" value="Mechanical Engineering" />
  <Picker.Item label="Business Administration" value="Business Administration" />
  <Picker.Item label="Computer Science" value="Computer Science" />
  <Picker.Item label="Electrical Engineering" value="Electrical Engineering" />
  <Picker.Item label="Economics" value="Economics" />
  <Picker.Item label="Software Engineering" value="Software Engineering" />
  <Picker.Item label="Finance" value="Finance" />
  <Picker.Item label="Accounting" value="Accounting" />
</Picker>

            
            <Text className="left-5 text-base">Tell us about yourself</Text>
            <TextInput
              className={`border rounded-2xl w-[360px] h-[215px] px-4 py-9 flex-row items-center justify-between space-x-8 left-5 my-2 `}
              placeholder= "(minimum of 15 words)"
              onChangeText={handleTextChange1}
              value={value1}
              multiline={true}
            />
            <Text className="left-5 text-base" >What are your skills</Text>
            <TextInput
              className={`border rounded-2xl w-[360px]  px-4 py-9 flex-row items-center justify-between space-x-8 left-5 my-2 `}
              placeholder= "Coding, Graphic Design..."
              onChangeText={handleTextChange2}
              value={value2}
              multiline={true}
            />

<TouchableOpacity 
  style={{
    width: 200,
    height: 200,
    borderColor: '#268290',
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  }} 
  className="self-center"
  onPress={pickImage} 
>
  <View>
    <Text style={{ color: '#268290', textAlign: 'center', marginBottom: 10 }} className="text-base">
      Upload Images of your work
    </Text>
  </View>
</TouchableOpacity>


            
<View className="left-5 flex-row flex-wrap">
            {selectedImages.map((imageUri, index) => (
              <Image key={index} resizeMode="cover" style={{ width: 100, height: 100, margin: 5 }} source={{ uri: imageUri }} />
            ))}
          </View>
           
            

            <TouchableOpacity 
              onPress={handleAbout}
              className="w-full px-4 rounded-xl bg-primaryButton my-3 flex items-center justify-center">
              {isApplying ? (
            <ActivityIndicator className="py-3" size="small" color="#ffffff" />
          ) : (
            <Text className='py-2 text-white text-xl font-semibold'>Ready to work!</Text>
          )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Aboutscreen;
