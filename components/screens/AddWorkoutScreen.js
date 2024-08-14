import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import exerciseData from '../../data/exerciseData';
import DateTimePicker from "@react-native-community/datetimepicker";
import {useIsFocused} from '@react-navigation/native';

export default function AddWorkoutScreen() {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [numExercisesToSelect, setNumExercisesToSelect] = useState(5);
  const [exerciseDetails, setExerciseDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showNewButton, setShowNewButton] = useState(false);
  const isFocused = useIsFocused();
  const [favouriteIds, setFavouriteIds]=useState([])
  const [muscleTypes, setMuscleType]=useState({})
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const count = await AsyncStorage.getItem('settings');
        const favouriteIdsJson = await AsyncStorage.getItem('favoriteExercises');
        const favouriteIds = JSON.parse(favouriteIdsJson) || [];
        setFavouriteIds(favouriteIds);
        if (count) {
          const settings = JSON.parse(count);
          const exerciseCount = parseInt(settings.exerciseCount);
          const muscleTypes=settings.trainingTypes;
          setMuscleType(muscleTypes);
          if (!isNaN(exerciseCount)) {
            setNumExercisesToSelect(exerciseCount);
          }
        }
      } catch (error) {
        console.error('Error fetching exercise count setting:', error);
      }
    };
 if (isFocused) {
      fetchSettings();
    }
  }, [isFocused]);



  const selectRandomExercises = async () => {
    try {
      // Фільтруємо випадкові вправи лише з улюблених
      const shuffledExercises = [...exerciseData]
        .filter(exercise => favouriteIds.includes(exercise.id)&&
        Object.keys(muscleTypes).some(muscle => muscleTypes[muscle] && exercise.primaryMuscle === muscle)).sort(() => 0.5 - Math.random());
      // Вибираємо потрібну кількість вправ
      const selected = shuffledExercises.slice(0, numExercisesToSelect);
      setSelectedExercises(selected)
      const initialDetails = selected.reduce((acc, exercise) => {
        acc[exercise.name] = [{ weight: '', reps: '' }];
        return acc;
      }, {});
      setExerciseDetails(initialDetails);
      setShowSaveButton(true);
    } catch (error) {
      console.error('Error selecting random exercises:', error);
    }
  };
  

  const handleInputChange = (exerciseName, setIndex, field, value) => {
    setExerciseDetails(prevState => ({
      ...prevState,
      [exerciseName]: prevState[exerciseName].map((set, index) => {
        if (index === setIndex) {
          return { ...set, [field]: value };
        }
        return set;
      }),
    }));
  };

  const addSet = (exerciseName) => {
    setExerciseDetails(prevState => ({
      ...prevState,
      [exerciseName]: [...prevState[exerciseName], { weight: '', reps: '' }],
    }));
  };

  const renderSets = (exerciseName) => {
    return exerciseDetails[exerciseName].map((set, setIndex) => (
      <View key={setIndex} style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Weight"
          value={set.weight}
          onChangeText={text => handleInputChange(exerciseName, setIndex, 'weight', text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Reps"
          value={set.reps}
          onChangeText={text => handleInputChange(exerciseName, setIndex, 'reps', text)}
          keyboardType="numeric"
        />
      </View>
    ));
  };
  const saveWorkout = async () => {
    try {
      const existingWorkoutsJson = await AsyncStorage.getItem('workouts');
      let existingWorkouts = existingWorkoutsJson ? JSON.parse(existingWorkoutsJson) : [];
  
      if (!Array.isArray(existingWorkouts)) {
        existingWorkouts = [];
      }
  
      const newWorkout = {
        date: selectedDate,
        exerciseDetails: exerciseDetails,
      };
  
      existingWorkouts.push(newWorkout);
  
      await AsyncStorage.setItem('workouts', JSON.stringify(existingWorkouts));
  
      setShowSavedMessage(true);
      setShowSaveButton(false);
      clearWorkout();
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };
  
  

  const clearWorkout = () => {
    setSelectedExercises([]);
    setExerciseDetails({});
    setSelectedDate(new Date());
    
  };

  const reloadPage = () => {
    clearWorkout;
    setShowSavedMessage(false);
    
  };
  const onChange = (e, selectedDate) => {
    setSelectedDate(selectedDate);
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Add Workout</Text>
        
        <DateTimePicker
        value={selectedDate}
        mode={"date"}
        is24Hour={true}
        onChange={onChange}
        />
        <Button title="Generate Random Exercises" onPress={selectRandomExercises} />
        
        <View style={{ marginTop: 20 }}>
          
          {selectedExercises.map((exercise, index) => (
           
            <View key={index} style={styles.exerciseContainer}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Selected Exercises:</Text> 
              <Text>{exercise.name}</Text>
              {renderSets(exercise.name)}
              <TouchableOpacity onPress={() => addSet(exercise.name)} style={styles.addButton}>
                <Text>Add Set</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {showSavedMessage && (
          <Text style={{ marginTop: 20, color: 'green' }}>Workout saved successfully!</Text>
        )}

        <View style={{ marginTop: 20 }}>
        {showSaveButton &&(
          <Button title="Save Workout" onPress={saveWorkout} />
        )}
        {showNewButton &&(
          <Button title="New Workout" onPress={reloadPage} />
        )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseContainer: {
    marginBottom: 10,
    width: '90%', 
    flexDirection: 'column', 
    alignItems: 'flex-start', 
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  input: {
    flex: 1, 
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  addButton: {
    alignSelf: 'stretch', 
    marginTop: 10,
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    
    borderRadius: 5,
    alignItems: 'center',
  },
  
  DateTimePickerButton: {
    marginTop: 20,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});
