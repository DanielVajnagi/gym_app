import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import {useIsFocused} from '@react-navigation/native';

const HomeScreen = () => {
  const [lastWorkoutDate, setLastWorkoutDate] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const existingWorkoutsJson = await AsyncStorage.getItem('workouts');
        if (existingWorkoutsJson) {
          const existingWorkouts = JSON.parse(existingWorkoutsJson);
          if (existingWorkouts.length > 0) {
            const newestDate = existingWorkouts.reduce((maxDate, workout) => {
              const currentDate = new Date(workout.date);
              return currentDate > maxDate ? currentDate : maxDate;
            }, new Date(0));
            setLastWorkoutDate(newestDate);
          }
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to Gym App!</Text>
      <Text style={styles.title}>Last Workout:</Text>
      {lastWorkoutDate ? (
        <Text style={styles.date}>{format(lastWorkoutDate, 'MMMM dd, yyyy')}</Text>
      ) : (
        <Text>No workouts recorded.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
  },
});

export default HomeScreen;
