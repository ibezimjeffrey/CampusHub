import * as React from 'react';
import { Text, View,SafeAreaView,TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
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
          <View className="rounded-xl w-[350px] flex py-2">
            <TouchableOpacity onPress={() => {}}>
              <View style={{ left: 30 }} className="bg-neutral-200 rounded-xl w-[350px] h-[150px] border-1 relative">
                <Image
                  source={{ uri: post?.user?.profilePic }}
                  resizeMode='cover'
                  className='w-24 h-24 absolute top-2 left-2'
                />
                <Text className="text-black text-2xl absolute top-2 ">{post.JobDetails}</Text>
                <Text className="text-gray-500 text-xl absolute top-9">{post.Location}</Text>
                <View style={{top:110}} className="w-full h-1 border bg-primaryBold absolute"></View>
                <Text className="text-primary text-xl absolute bottom-2 left-2">{post.Type}</Text>
                <Text className="text-primaryBold text-xl absolute bottom-2 right-2">₦{post.Budget}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      };
      
    
  

    
  
  return (
   <View className="Flex-1 bg-white">

    
<SafeAreaView>
<ScrollView >

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
         
            
              <Text style={styles.dosisText} className="text-xl text-primaryBold">
                {Postings.length > 0 ? (<>
                  {Postings.map((post, i) => (
  <PostingCard key={i} post={post} index={i} />
))}
                </>
                
                ) : ''}
              </Text>
         
         
        </>
      )}

  </>


  </ScrollView>


  
</SafeAreaView>

</View>
  )
}

export default ClientHomescreen