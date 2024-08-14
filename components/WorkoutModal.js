import React from 'react';
import { View, Text, Modal, Button, ScrollView, StyleSheet } from 'react-native';
import { format } from 'date-fns';

export default function WorkoutModal({ workout, modalVisible, closeModal }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {workout && (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <>
                <Text style={styles.modalTitle}>Workout Details</Text>
                <Text style={styles.modalDate}>Date: {format(new Date(workout.date), 'dd/MM/yyyy')}</Text>
                <Text style={styles.sectionTitle}>Exercises:</Text>
                {Object.keys(workout.exerciseDetails).map((exerciseName, index) => (
                  <View key={index} style={styles.exerciseContainer}>
                    <Text style={styles.exerciseName}>{exerciseName}</Text>
                    {workout.exerciseDetails[exerciseName].map((set, setIndex) => (
                      <View key={setIndex} style={styles.setContainer}>
                        <Text style={styles.setText}>Set {setIndex + 1}:</Text>
                        <Text style={styles.weightText}>Weight: {set.weight}</Text>
                        <Text style={styles.repsText}>Reps: {set.reps}</Text>
                      </View>
                    ))}
                  </View>
                ))}
                <Button title="Close" onPress={closeModal} />
              </>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '80%',
    maxWidth: 400,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDate: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  exerciseContainer: {
    marginBottom: 10,
  },
  exerciseName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  setContainer: {
    marginBottom: 5,
  },
  setText: {
    fontWeight: 'bold',
  },
  weightText: {
    marginLeft: 10,
  },
  repsText: {
    marginLeft: 10,
  },
});
