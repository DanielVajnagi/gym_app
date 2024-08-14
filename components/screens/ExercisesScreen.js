import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, TouchableOpacity, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExerciseItem from '../ExerciseItem';
import exercisesData from '../../data/exerciseData';
import { useIsFocused } from '@react-navigation/native';

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState(exercisesData);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedMuscles, setSelectedMuscles] = useState([]); // Array for selected muscle groups
  const isFocused = useIsFocused();

  useEffect(() => {
    const screenWidth = Dimensions.get('window').width;
    setIsSmallScreen(screenWidth < 600);
  }, [isFocused]);

  const toggleFavorite = async (exerciseId) => {
  try {
    const updatedExercises = exercises.map((exercise) => {
      if (exercise.id === exerciseId) {
        const isFavorite = !exercise.isFavorite;
        return { ...exercise, isFavorite };
      }
      return exercise;
    });

    // Отримуємо всі id улюблених вправ
    const favoriteIds = updatedExercises.filter(exercise => exercise.isFavorite).map(exercise => exercise.id);

    // Зберігаємо усі id улюблених вправ під одним ключем
    await AsyncStorage.setItem('favoriteExercises', JSON.stringify(favoriteIds));

    setExercises(updatedExercises);
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};


useEffect(() => {
const loadFavorites = async () => {
  try {
    const favoriteIdsJson = await AsyncStorage.getItem('favoriteExercises');
    const favoriteIds = JSON.parse(favoriteIdsJson) || [];

    // Оновлюємо вправи, встановлюючи isFavorite на основі наявності id у масиві улюблених вправ
    const updatedExercises = exercises.map((exercise) => ({
      ...exercise,
      isFavorite: favoriteIds.includes(exercise.id),
    }));

    setExercises(updatedExercises);
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
};

    loadFavorites();
  }, [isFocused]);

  const renderExerciseItem = ({ item }) => {
    return (
      <ExerciseItem
        item={item}
        toggleFavorite={toggleFavorite}
        isSmallScreen={isSmallScreen}
      />
    );
  };

  const filterExercisesByMuscles = () => {
    if (selectedMuscles.length === 0) {
      return exercises;
    } else {
      return exercises.filter(exercise => selectedMuscles.includes(exercise.primaryMuscle));
    }
  };

  const toggleMuscleSelection = (muscle) => {
    if (selectedMuscles.includes(muscle)) {
      setSelectedMuscles(selectedMuscles.filter(item => item !== muscle));
    } else {
      setSelectedMuscles([...selectedMuscles, muscle]);
    }
  };

  const muscleGroups = ['Chest', 'Back', 'Legs', 'Abs', 'Shoulders','Biceps','Triceps','Cardio','Deltoids'];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterContainer}>
          {muscleGroups.map((muscle, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.filterButton, selectedMuscles.includes(muscle) && styles.activeFilterButton]}
              onPress={() => toggleMuscleSelection(muscle)}>
              <Text style={[styles.filterButtonText, selectedMuscles.includes(muscle) && styles.activeFilterButtonText]}>
                {muscle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <FlatList
        data={filterExercisesByMuscles()}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    height: 40,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 10,
    justifyContent: 'center', 

  },
  activeFilterButton: {
    backgroundColor: '#007bff',
  },
  filterButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
});
