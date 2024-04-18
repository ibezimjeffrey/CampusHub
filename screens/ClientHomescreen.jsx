import * as React from 'react';
import { Text, View,SafeAreaView,TouchableOpacity, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Logo } from '../assets';
import { Image } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { firestoreDB } from '../config/firebase.config';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
import { useFonts, Dosis_200ExtraLight, Dosis_400Regular, Dosis_800ExtraBold } from '@expo-google-fonts/dosis';
import { StyleSheet } from 'react-native';


const ClientHomescreen = () => {
    const user = useSelector((state) => state.user.user)
      const [greeting, setGreeting] = useState('');
      const navigate = useNavigation()
      
      
      useEffect(() => {
        const date = new Date();
        const hours = date.getHours();
    
        let greetingMessage = '';
    
        if (hours >= 5 && hours < 12) {
          greetingMessage = '  Good morning, ';
        } else if (hours >= 12 && hours < 18) {
          greetingMessage = '  Good afternoon, ';
        } else {
          greetingMessage = '  Good evening, ';
        }
    
        setGreeting(greetingMessage);
      }, []);

      const [Postings, setPostings] = useState(null)
      const [isLoading, setisLoading] = useState(true);
      const navigation =useNavigation()

      React.useLayoutEffect(()=>{
        const msgQuery = query(
          collection(firestoreDB, "postings"),
        )
      
        const unsubscribe = onSnapshot(msgQuery, (QuerySnapshot)=>{
          const upMsg = QuerySnapshot.docs.map(doc => doc.data())
          setPostings(upMsg)
          setisLoading(false)
        })
    
        return unsubscribe
    
        
      })


      const styles = StyleSheet.create({
        dosisText: {
          fontFamily: 'Dosis_400Regular', 
          fontSize: 20,
         
        },
      });
  
      const [fontsLoaded] = useFonts({
        Dosis_200ExtraLight,
        Dosis_400Regular,
        Dosis_800ExtraBold,
      });

      const PostingCard = ({ post, index }) => {
        return (
          <TouchableOpacity onPress={() => navigation.navigate("Chatscreen", { userID: user._id })} className="w-full flex-row items-center justify-start py-2">
            <View className="w-16 h-16 rounded-full flex items-center border-2 border-primary p-1 justify-center">
              <Text>{post.Type}</Text>
              <Text>{post.Budget}</Text>
            </View>
           
          </TouchableOpacity>
        );
      };
      
      
    
  

    
  
  return (
   <View className="Flex-1 bg-white">
    
<SafeAreaView>
  <View className="w-full flex-row items-center justify-between px-4 py-2 bg-white">
  

 



 


  </View>

  <View >
    <Text className=" text-2xl text-primary ">{greeting} 
    <Text className=" text-2xl text-primaryBold " >{user?.fullName}</Text> </Text>
   
  </View>

  <View className="top-11 bottom-11 mb-11">

<Text className="text-2xl text-black">Available Jobs</Text>
  </View>
  







  <>
  
    
  

    {isLoading ? (
        <>
          <View className="w-full flex items-center justify-center">
            <ActivityIndicator size={"large"} color={"#43C651"} />
          </View>
        </>
      ) : (
        <>
          <View className="border border-y-emerald-600 top-4 py-9 flex-row items-center justify-between space-x-4 my-2">
            
              <Text style={styles.dosisText} className="text-xl text-primaryBold">
                {Postings.length > 0 ? (<>
                  {Postings.map((post, i) => (
  <PostingCard key={i} post={post} index={i} />
))}
                </>
                
                ) : ''}
              </Text>
         
          </View>
        </>
      )}

  </>





  
</SafeAreaView>

</View>
  )
}

export default ClientHomescreen