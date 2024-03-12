import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { BGImage, Logo } from '../assets'
import { Userinput } from '../components'
import { useNavigation } from '@react-navigation/native'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth, firestoreDB } from '../config/firebase.config'
import { DocumentSnapshot, doc, getDoc } from 'firebase/firestore'
const Loginscreen = () => {
  const screenwidth = Math.round(Dimensions.get("window").width)

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [getEmailValidationStatus, setgetEmailValidationStatus] = useState(false)

  const [alert, setalert] = useState(false)
  const [alertMessage, setalertMessage] = useState(null)

  const HandleLogin = async () =>{
    if (getEmailValidationStatus && email!= ""){

      await signInWithEmailAndPassword(firebaseAuth, email,password).then(userCred =>{
        if (userCred){
          console.log("User ID", userCred?.user.uid);
          getDoc(doc(firestoreDB, 'users', userCred?.user.uid )).then(DocumentSnapshot =>{
            if(DocumentSnapshot.exists){
              console.log("User Data", DocumentSnapshot.data())
        
            }
            
          })
        }
      }).catch(err =>{
          console.log("Error: ", err.message); 

          if (err.message.includes("invalid-credential"))
          {
            setalert(true)
            setalertMessage("Wrong credentials")
           
          }

          else if (err.message.includes("user-not-found")) {
            setalert(true)
          setalertMessage("User not found")
          
        setInterval(() => {
          setalert(false)
          
        }, 2000);
          }

          else{
            setalert(true)
            setalertMessage("Invalid Email Address")

          }

          setInterval(() => {
            setalert(false)
            
          }, 2000);
      })
    }
  }

  const navigation= useNavigation();
  return (
      <View className= 'flex-1 items-center justify-start'>
        <Image 
        source={BGImage} resizeMode='cover' 
        className='h-96'
        style={{width: screenwidth}}/> 

       

            


            <View className= 'w-full h-full bg-white rounded-tl-[190] -mt-44 flex items-center justify-start py-6 px-6 space-y-6'> 

            <Image 
        source={Logo} resizeMode='contain' 
        style={{width: 136, height: 136}}/> 

        <Text className="py-2 text-primaryText text-xl font-semibold">Welcome Back</Text>

        <View className="w-full flex items-center justify-center">

          {alert && (
             <Text className="text-base text-red-500">{alertMessage}</Text>

          )}

       


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


          <TouchableOpacity onPress={HandleLogin} className="w-full px-4 px-2 rounded-xl bg-primary my-3 flex items-center justify-center">

            <Text className='py-2 text-white text-xl font-semibold'>Sign in</Text>


          </TouchableOpacity>

          <View className="w-full flex-row py-2 justify-center space-x-2">
            <Text className="text-base text-primaryText">Don't have an Acoount?</Text>
          </View>

          <TouchableOpacity onPress={()=> navigation.navigate("Signupscreen")} >
            <Text className=" text-base font-semibold text-primaryBold">Create here</Text>
          </TouchableOpacity>
        



        </View>

            </View>
    </View>
  )
}

export default Loginscreen