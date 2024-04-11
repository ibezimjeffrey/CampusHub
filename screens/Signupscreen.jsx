import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { BGImage, Logo } from '../assets'
import { Userinput } from '../components'
import { useNavigation } from '@react-navigation/native'
import { avatars } from '../utils/support';
import { MaterialIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth, firestoreDB } from '../config/firebase.config'
import { doc, setDoc } from 'firebase/firestore'
import {CheckBox} from 'react-native-elements'



const Signupscreen = () => {
  const screenwidth = Math.round(Dimensions.get("window").width)
  const screenHeight = Math.round(Dimensions.get("window").height)
  const [avatar, setavatar] = useState(avatars[0]?.image.asset.url)
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [name, setname] = useState("")
  const [AVATARmenu, setAVATARmenu] = useState(false)
  const [getEmailValidationStatus, setgetEmailValidationStatus] = useState(false)


  const HandleAVATAR = (item) => {
   
    setavatar(item?.image?.asset?.url)
    setAVATARmenu(false)
  }

  const handleSignup = async () => {
    if (getEmailValidationStatus && email!= ""){
      await createUserWithEmailAndPassword(firebaseAuth, email,password).then(userCred =>{
        const data = {
          _id: userCred?.user.uid,
          fullName: name,
          profilePic: avatar,
          email: email,
          providerData: userCred.user.providerData,
     
          


        };

        setDoc(doc(firestoreDB, "users", userCred?.user.uid), data).then(
          ()=>{
            navigation.navigate("Loginscreen")
          }
        )
      })
    }

  };


  const navigation= useNavigation();
  return (
    
      <View className= 'flex-1 items-center justify-start'>
       
        <Image 
        source={BGImage} resizeMode='cover' 
        className='h-20'
        style={{width: screenwidth}}/> 

        {AVATARmenu && (
          <>
          <View className="absolute inset-0 z-10" style={{width: screenwidth, height: screenHeight}}>
  
  
          <ScrollView>
            <BlurView className="w-full h-full px-4 py-16 flex-row flex-wrap items-center justify-evenly" tint='light' intensity={40} style={{width: screenwidth, height: screenHeight}} >
  
            {avatars?.map((item) => (
          <TouchableOpacity onPress={() => HandleAVATAR(item)}
          key={item._id} style={{ width: 100, height: 100, margin: 10, borderRadius: 50, borderWidth: 2 }} className="border-primary">
            <Image source={{ uri: item?.image?.asset?.url }} style={{ width: '100%', height: '100%', borderRadius: 50 }} resizeMode='cover' />
          </TouchableOpacity>
        ))}
  
            </BlurView>
            
            
  
          </ScrollView>
  
  
          </View>
          
          </>


        )}
        
            <View className= 'w-full h-full bg-white relative flex items-center justify-start py-6 px-6 space-y-6'> 
            <Text className="py-2 text-primaryText text-xl font-semibold">Join CampusHub</Text>
            <View className="w-full flex items-center justify-center relative -my-4">
      <TouchableOpacity onPress={()=> setAVATARmenu(true)}
      className="w-20 h-20 p-1 rounded-full border-2 border-primary relative">

        <Image source={{uri: avatar}} className="w-full h-full" resizeMode="contain" />

        <View className="w-6 h-6 bg-primary rounded-full absolute top-0 right-0 flex items-center justify-center">

          <MaterialIcons name='edit' size={10} color={'#fff'}/>

        </View>


      </TouchableOpacity>


    </View>

        

        <View className="w-full flex items-center justify-center">

       



        <Userinput
       Placeholder="Full Name"
       isPass={false} 
       setstateValue ={setname}
        />

          <Userinput
           Placeholder="Email"
           isPass={false} 
           setstateValue ={setemail}
           setgetEmailValidationStatus={setgetEmailValidationStatus}
            />

          <Userinput
           Placeholder="Password"
           isPass={true} 
           setstateValue ={setpassword}
            />



          {/* {login button} */}

          <View className="w-full px-4  my-3 flex items-center flex-row justify-center">


            
       


          </View>



          <TouchableOpacity onPress={handleSignup}
          className="w-full px-4 px-2 rounded-xl bg-primary my-3 flex items-center justify-center">

            <Text className='py-2 text-white text-xl font-semibold'>Sign up</Text>


          </TouchableOpacity>

          <View className="w-full flex-row py-2 justify-center space-x-2">
            <Text className="text-base text-primaryText">Have an Acoount?</Text>
          </View>

          <TouchableOpacity onPress={()=> navigation.navigate("Loginscreen")} >
            <Text className=" text-base font-semibold text-primaryBold">Login here</Text>
          </TouchableOpacity>
        



        </View>

            </View>
      
    </View>
  )
}

export default Signupscreen