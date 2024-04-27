import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { firestoreDB } from '../config/firebase.config';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Entypo } from '@expo/vector-icons';

const Searchscreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false); // Track if search has been performed

  const clearSearch = () => {
    setSearchTerm('');
    setIsLoading(false);
    setSearchResults([]);
    setSearchPerformed(false); // Reset searchPerformed state
  };

  const handleSearch = () => {
    setIsLoading(true);
    setSearchPerformed(true); // Set searchPerformed to true when search is performed
    const msgQuery = query(collection(firestoreDB, 'postings'));
    onSnapshot(msgQuery, (QuerySnapshot) => {
      const postings = QuerySnapshot.docs.map((doc) => doc.data());
      const filteredPostings = postings.filter((post) =>
        post.JobDetails.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredPostings);
      setIsLoading(false);
    });
  };

  const handleKeyPress = (e) => {
    // Check if backspace key is pressed and searchTerm is empty
    if (e.nativeEvent.key === 'Backspace' && searchTerm === '') {
      clearSearch(); // Call clearSearch function
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View>
        <View style={{ flexDirection: 'row' }}>
          <View className="w-[325px] top-4 justify-between px-4 py-2">
            <View className="border-primary" style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, padding: 10 }}>
              <Entypo name='magnifying-glass' size={24} color={"rgb(67 198 81)"} style={{ marginRight: 10 }} />
              <TextInput
                style={{ flex: 1 }}
                placeholder="Search job title"
                value={searchTerm}
                keyboardType='web-search'
                onSubmitEditing={() => {
                  if (searchTerm.trim() !== '') { // Check if searchTerm is not empty
                    handleSearch(); // Call handleSearch only if searchTerm is not empty
                  }
                }}
                onChangeText={(text) => setSearchTerm(text)}
                onKeyPress={handleKeyPress} // Call handleKeyPress on key press
              />
            </View>

            <TouchableOpacity onPress={clearSearch}>
              <Text style={{ color: 'red' }}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {searchPerformed && !isLoading && searchResults.length === 0 && (
          <Text>No jobs available</Text>
        )}

        {isLoading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : searchResults.length > 0 ? (
          <ScrollView>
            {searchResults.map((result, index) => (
              <View className="rounded-xl w-[350px] flex py-2" key={index}>
                <TouchableOpacity onPress={() => {}}>
                  <View style={{ left: 30 }} className="bg-neutral-200 rounded-xl w-[350px] h-[150px] border-1 relative shadow">
                    <Image
                      source={{ uri: result.User.profilePic }}
                      resizeMode='cover'
                      className='w-12 h-12 relative top-2 left-12'
                    />
                    <Text className="text-black text-2xl absolute top-10 ">{result.JobDetails}</Text>
                    <Text style={{top:20}} className="text-gray-500 text-xl absolute">{result.Location}</Text>
                    <View style={{top:110}} className="w-full h-1 border bg-primaryBold absolute"></View>
                    <Text className="text-primary text-xl absolute bottom-2 left-2">{result.Type}</Text>
                    <Text className="text-primaryBold text-base absolute bottom-2 right-2">Fixed Price / ₦{result.Budget}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default Searchscreen;
