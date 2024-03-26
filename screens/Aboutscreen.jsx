import { View, Text, SafeAreaView, TextInput } from 'react-native'
import React, { useState } from 'react'

const Aboutscreen = () => {
  const [value, setvalue] = useState(""); // Initialize state for input value

  const handleTextChange = (text) => {
    setvalue(text); // Update input value state
    setstateValue(text); // Pass the new value to the parent component
  };


  return (
    <SafeAreaView>
          <View>

      <Text>Tell us about yourself</Text>


      <TextInput
        className="flex-1 text-base text-primaryText font-semibold -mt-1"
        placeholder="I am a..."
        onChangeText={handleTextChange}
        value={value}
        
      
      />

      <Text>Interests</Text>
      
    </View>



 

    </SafeAreaView>
   )
}

export default Aboutscreen