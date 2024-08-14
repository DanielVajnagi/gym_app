import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Button, TextInput, TouchableWithoutFeedback, Keyboard, Platform, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function SettingsScreen() {
  const isFocused = useIsFocused();

  const [settings, setSettings] = useState({
    trainingTypes: {
      Chest: true,
      Back: true,
      Abs: false,
      Legs: true,
      Biceps: true,
      Triceps: false,
      Cardio: false,
      Deltoids: false,
      Shoulders: false,
    },
    exerciseCount: '5',
    errorMessage: '',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('settings');
        if (savedSettings !== null) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, [isFocused]);

  const handleToggleTrainingType = (type) => {
    const updatedSettings = {
      ...settings,
      trainingTypes: {
        ...settings.trainingTypes,
        [type]: !settings.trainingTypes[type],
      },
    };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  const handleExerciseCountChange = (count) => {
    const exerciseCount = parseInt(count);
    if (!isNaN(exerciseCount)) {
      if (exerciseCount >= 1 && exerciseCount <= 10) {
        const updatedSettings = { ...settings, exerciseCount: exerciseCount.toString(), errorMessage: '' };
        setSettings(updatedSettings);
        saveSettings(updatedSettings);
      } else {
        setSettings({ ...settings, exerciseCount: '', errorMessage: 'Please enter a number between 1 and 10' });
      }
    } else {
      setSettings({ ...settings, exerciseCount: '', errorMessage: 'Please enter a valid number' });
    }
  };

  const saveSettings = async (updatedSettings) => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to clear all data?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: clearAllData,
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      setSettings({
        trainingTypes: {
          Chest: true,
          Back: true,
          Abs: false,
          Legs: true,
          Biceps: true,
          Triceps: false,
          Cardio: false,
          Deltoids: false,
          Shoulders: false,
        },
        exerciseCount: '5',
        errorMessage: '',
      });
      console.log('AsyncStorage data cleared successfully.');
    } catch (error) {
      console.error('Error clearing AsyncStorage data:', error);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={true}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subTitle}>Number of Exercises:</Text>
        <TextInput
          style={styles.input}
          value={settings.exerciseCount}
          onChangeText={handleExerciseCountChange}
          keyboardType="numeric"
          placeholder="Enter number of exercises"
        />
        <Text style={styles.errorMessage}>{settings.errorMessage}</Text>
        <Text style={styles.subTitle}>Training Types:</Text>
        {Object.keys(settings.trainingTypes).map((type) => (
          <View key={type} style={styles.setting}>
            <Text>{type.charAt(0).toUpperCase() + type.slice(1)}:</Text>
            <Switch
              value={settings.trainingTypes[type]}
              onValueChange={() => handleToggleTrainingType(type)}
            />
          </View>
        ))}
        <TouchableOpacity onPress={handleClearData}>
          <View style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All Data</Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
