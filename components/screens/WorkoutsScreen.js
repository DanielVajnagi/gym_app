import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkoutModal from '../WorkoutModal';
import { format } from 'date-fns';
import {useIsFocused} from '@react-navigation/native';

export default function WorkoutsScreen({ navigation }) {
  const [workoutDates, setWorkoutDates] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const existingWorkoutsJson = await AsyncStorage.getItem('workouts');
        if (existingWorkoutsJson) {
          const existingWorkouts = JSON.parse(existingWorkoutsJson);
          existingWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date));
          setWorkoutDates(existingWorkouts);
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, [isFocused]);

  const handleWorkoutPress = (workout) => {
    setSelectedWorkout(workout);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workouts:</Text>
      {workoutDates.length === 0 ? (
        <Text>No workouts saved yet.</Text>
      ) : (
        <FlatList
          data={workoutDates}
          renderItem={({ item }) => (
            <View style={styles.dateContainer}>
              <Button title={format(new Date(item.date), 'MMMM dd, yyyy')} onPress={() => handleWorkoutPress(item)} />
            </View>
          )}
          keyExtractor={(workout) => workout.date.toString()}
        />
      )}

      <WorkoutModal workout={selectedWorkout} modalVisible={modalVisible} closeModal={closeModal} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  dateContainer: {
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
});
