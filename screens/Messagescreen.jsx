import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Logo2 } from "../assets";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { QuerySnapshot, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

const Messagescreen = () => {
  const navigation = useNavigation();


  const user = useSelector((state) => state.user.user);



  const [isLoading, setIsLoading] = useState(true);
  const [Chats, setChats] = useState(null);

  const moveToAddChatScreen = () => {
    navigation.navigate("AddTochatscreen");
  };

  useLayoutEffect(() => {
    const chatQuery = query(collection(firestoreDB, "chats"), orderBy("_id", "desc"));
  
    const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
      const chatRooms = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((room) => room.index === user._id); 
      setChats(chatRooms);
      setIsLoading(false);
    });
  
    return unsubscribe;
  }, []);

  const MessageCard = ({ room }) => {
    const currentUser = useSelector((state) => state.user.user);
  
    const isCurrentUserRoomCreator = currentUser._id === room.index;
  
    return (
      <TouchableOpacity className="border-primaryButton border rounded-xl mt-2" onPress={() => navigation.navigate("Chatscreen", { post: room })} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 }}>
        <View style={{ width: 60, height: 60, justifyContent: "center", alignItems: "center" }}>
          <Image source={{ uri: isCurrentUserRoomCreator ? room.user.profilePic : room.profilePic }} resizeMode="contain" style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: "#000000" }} />
        </View>
        <View>
          
        </View>
        <View style={{ flex: 1, justifyContent: "flex-start", marginLeft: 10 }}>
          <Text className="capitalize" style={{ fontSize: 16, color: "#333" }}>{room.jobName} Job</Text>
        </View>
       

      </TouchableOpacity>
    );
  };
  
  

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <SafeAreaView>
        
       
        <ScrollView className="h-full" style={{ paddingHorizontal: 10, paddingTop: 10 }}>
          <View className="h-full">
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10 }}>
              <Text style={{ fontSize: 20, color: "#268290" }}>Messages</Text>
             
            </View>
            {isLoading ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#268290" />
              </View>
            ) : (
              <>
                {Chats && Chats.length > 0 ? (
                  <>
                    {Chats.map((room, index) => <MessageCard key={index} room={room} />)}
                  </>
                ) : (
                  <View className="items-center">
                    <Text >No messages</Text>

                  </View>
                  
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  logo: {
    width: 1000,
    height: 50,
  },
});

export default Messagescreen;
