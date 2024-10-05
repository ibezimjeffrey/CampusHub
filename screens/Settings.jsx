import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { firebaseAuth, firestoreDB } from '../config/firebase.config';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Added getDocs import
import  { Paystack }  from 'react-native-paystack-webview';

const Settings = () => {
  const user = useSelector((state) => state.user.user);

  const [start, setstart] = useState(false)

  const [Balance, setBalance] = useState('0.00');
  const [Payed, setPayed] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const navigation = useNavigation();

  const Begin =()=>{
    setstart(true)
  }
  useEffect(() => {
    const getUserBalances = async () => {
      try {
        const balancesQuery = query(
          collection(firestoreDB, 'Status'),
          where('receipient._id', '==', user._id)
        );
    
        const querySnapshot = await getDocs(balancesQuery);
        let totalBalance = 0;
    
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const cleanedPrice = data.price.replace(/,/g, ''); 
         
          if (cleanedPrice) { 
            totalBalance += parseFloat(cleanedPrice); 
          }
        });

        setBalance(totalBalance); 
      } catch (error) {
        console.error("Error fetching balances: ", error);
      }
    };
    

    getUserBalances();
  }, [user._id]);

  const logout = async () => {
    await firebaseAuth.signOut().then(() => {
      setIsApplying(true);
      dispatch(SET_USER_NULL());
      navigation.replace('Loginscreen');
    });
  };



  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <SafeAreaView>
        <ScrollView className="h-full" style={{ paddingHorizontal: 10, paddingTop: 10 }}>
          <View className="h-full">
            <View
              className="right-6"
              style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10 }}
            >
              <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-4">
                <MaterialIcons name='chevron-left' size={32} color={"#268290"} />
              </TouchableOpacity>
            </View>

            <View className="items-center mt-8">
  {Payed ? (
    <Text className="text-3xl font-bold pt-4">N{Balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
  ) : (
    <Text className="text-3xl font-bold pt-4">N{Balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
  )}
  <Text className="text-base font-bold text-gray-500">Available Balance</Text>
</View>


            <View
              className="border-primaryButton border rounded-xl mt-2"
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 10,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 90
              }}
            >
              <View>
                <TouchableOpacity className="left-2 w-11 h-11 border border-primaryButton rounded-full flex items-center justify-center">
                  <MaterialIcons name='add' size={26} color={'#268290'} />
                </TouchableOpacity>
                <Text className="left-4 top-1 font-extrlight">Add</Text>
              </View>

              <View>
                <TouchableOpacity onPress={Begin} className="left-2 w-11 h-11 border border-primaryButton rounded-full flex items-center justify-center">
                  <MaterialIcons name='publish' size={26} color={'#268290'} />
                </TouchableOpacity>
                <Text className="top-1 font-extrlight">Withdraw</Text>
              </View>


                {
                  start?
                 (
                  <Paystack  
  paystackKey="pk_test_bb056f19149cb6867f38cb9019f7f94defd87bc0"  
  amount={Balance} 
  billingEmail="jeff.ibezim@gmail.com"
  onCancel={(e) => {
    console.log("Transaction canceled:", e);
    setstart(false);
  }}
  onSuccess={(res) => {
    console.log("Transaction successful:", res);
    setstart(false);
    // Handle successful payment here
  }}
  autoStart={true}
/>


                 ):
                 (
                  <>
                    </>

                 )
                }
              
              


            </View>
          </View>

          <View className="flex-row justify-center pt-4">
            <TouchableOpacity onPress={logout}>
              {isApplying ? (
                <ActivityIndicator className="py-3 w-8 h-12" size="large" color="#268290" />
              ) : (
                <Text style={{ color: "#268290" }} className="font-bold text-lg">Logout</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Settings;
