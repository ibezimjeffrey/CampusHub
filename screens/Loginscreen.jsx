import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { BGImage, Logo, Logo1 } from '../assets'
import { Userinput } from '../components'
import { useNavigation } from '@react-navigation/native'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth, firestoreDB } from '../config/firebase.config'
import { DocumentSnapshot, doc, getDoc } from 'firebase/firestore'
import { useDispatch } from 'react-redux'
import { SET_USER } from '../context/actions/userActions'
import { ScrollView } from 'react-native'
import { ActivityIndicator } from 'react-native'
const Loginscreen = () => {
  const screenwidth = Math.round(Dimensions.get("window").width)
  const [isApplying, setIsApplying] = useState(false); 

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [getEmailValidationStatus, setgetEmailValidationStatus] = useState(false)

  const [alert, setalert] = useState(false)
  const [alertMessage, setalertMessage] = useState(null)

  const dispatch =  useDispatch()

  const HandleLogin = async () =>{
    setIsApplying(true);
    if (getEmailValidationStatus && email!= ""){

      await signInWithEmailAndPassword(firebaseAuth, email,password).then(userCred =>{
        if (userCred){
          console.log("User ID", userCred?.user.uid);

          
          getDoc(doc(firestoreDB, 'users', userCred?.user.uid )).then(DocumentSnapshot =>{
            if(DocumentSnapshot.exists){
              console.log("User Data", DocumentSnapshot.data())
              dispatch(SET_USER(DocumentSnapshot.data()))
        
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

          if (err.message.includes("network-request-failed"))
          {
            setalert(true)
            setalertMessage("Check Internet Connection")
           
            setInterval(() => {
              setalert(false)
              
            }, 9000);
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
    <ScrollView className="h-full bg-white">

   
      <View className= 'flex-1 bg-white items-center justify-start'>
     
       

            


            <View style={{top:100}} className= 'w-full h-full bg-white flex items-center justify-start py-12 px-6 space-y-6'> 
            <Image source = {Logo} className="w-12 h-12" resizeMode="cover"/>
            
            

   

        <View style={{marginTop:150}} className="w-full flex items-center justify-center">

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

          

          
          <TouchableOpacity onPress={HandleLogin} className="w-full px-4  rounded-xl bg-primaryButton my-3 flex items-center justify-center">

          {isApplying ? (
            <ActivityIndicator className="py-3" size="small" color="#ffffff" />
          ) : (
            <Text className='py-2 text-white text-xl font-semibold'>Sign in</Text>
          )}

 
          </TouchableOpacity>

          <View className="w-full flex-row py-2 justify-center space-x-2">
            <Text className="text-base font-thin text-primaryText">Don't have an Account?</Text>
          </View>

          <TouchableOpacity onPress={()=> navigation.navigate("Signupscreen")} >
            <Text className=" text-base font-semibold text-primaryButton">Create here</Text>
          </TouchableOpacity>
        



        </View>

            </View>
    </View>
    </ScrollView>
  )
  
}

export default Loginscreen