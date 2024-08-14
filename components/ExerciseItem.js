import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; // Import StyleSheet
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';

export default function ExerciseItem ({ item, toggleFavorite=true, isSmallScreen }) {
  return (
    <View style={styles.exerciseContainer}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Text style={styles.exerciseDescription}>{item.description}</Text>
      <Text style={styles.exerciseText}>Primary Muscle: {item.primaryMuscle}</Text>
      <View style={isSmallScreen ? styles.videosContainerSmall : styles.videosContainer}>
        <View style={styles.videoWrapper}>
          <Video
            source={{ uri: item.videos[0] }}
            style={styles.video}
            resizeMode="contain"
            useNativeControls
            isLooping
          />
        </View>
        <View style={styles.videoWrapper}>
          <Video
            source={{ uri: item.videos[1] }}
            style={styles.video}
            resizeMode="contain"
            useNativeControls
            isLooping
          />
        </View>
      </View>
      <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.favoriteIcon}>
        <Ionicons name={item.isFavorite ? "star" : "star-outline"} size={24} color="gold" />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({ 
  exerciseContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseDescription: {
    marginBottom: 5,
  },
  exerciseText: {
    marginBottom: 3,
  },
  videosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  videosContainerSmall: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  videoWrapper: {
    width: '100%',
    marginBottom: 10,
  },
  video: {
    flex: 1,
    aspectRatio: 16 / 9,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
