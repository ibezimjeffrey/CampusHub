import React from 'react';
import { Image } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DetailsScreen = ({ route }) => {
  const { post } = route.params;

  return (
    <View style={styles.container}>
        <View className="bottom-2">
        <Image source={{ uri: post.User.profilePic }} resizeMode="contain" className="w-24 h-24 relative top-2"/>


        </View>
        <Text style={styles.detailText}>{post.User.fullName}</Text>

      <Text style={styles.title}>{post.JobDetails}</Text>
      <Text style={styles.description}>{post.Description}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Location: {post.Location}</Text>
        <Text style={styles.detailText}>Type: {post.Type}</Text>
        <Text style={styles.detailText}>Budget: ₦{post.Budget}</Text>
        
      </View>
      <TouchableOpacity style={styles.applyButton} onPress={() => {}}>
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default DetailsScreen;
