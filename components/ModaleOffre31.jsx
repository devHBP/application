import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const ModaleOffre31 = ({ modalVisible, setModalVisible, handleAcceptOffer }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>Vous bénéficier de l'offre 3+1</Text>
          <Text style={{ textAlign: 'center' }}>Voulez vous ajouter le 4e produit gratuitement ?</Text>
          <View style={{ flexDirection: 'row' }}>
            <Button
              onPress={() => {
                handleAcceptOffer(); // call handleAcceptOffer directly on Button's onPress
                setModalVisible(!modalVisible);
              }}
            >
              <Text>Confirmer</Text>
            </Button>

            <Button
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text>Refuser</Text>
            </Button>
          </View>
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
    //backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'lightgrey',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ModaleOffre31;
