import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const Pwd = ({ navigation }) => {

  let API_BASE_URL = 'http://127.0.0.1:8080';

  if (Platform.OS === 'android') {
    if (__DEV__) {
        API_BASE_URL = 'http://10.0.2.2:8080'; // Adresse pour l'émulateur Android en mode développement
    } else {
        // Vous pouvez définir ici l'URL de production pour Android si nécessaire
    }
}
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/forgotPassword`, {
        email,
      });

      if (response.status === 200) {
        Alert.alert('Succès', 'Vérifiez votre boîte de réception pour les instructions de réinitialisation du mot de passe.');
        navigation.navigate('login')
      } else {
        Alert.alert('Erreur', response.data.message || 'Quelque chose a mal tourné.');
      }
    } catch (error) {
      Alert.alert('Erreur', (error.response && error.response.data.message) || 'Quelque chose a mal tourné. Veuillez réessayer.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réinitialisation du mot de passe</Text>
      <TextInput
        style={styles.input}
        placeholder="Adresse e-mail"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Réinitialiser le mot de passe" onPress={handleForgotPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default Pwd;
