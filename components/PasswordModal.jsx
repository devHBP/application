import { View, Text, Modal, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import React, { useState} from 'react';
import { Button  } from 'react-native-paper'

import {fonts, colors} from '../styles/styles'
import {  API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS } from '@env';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

const PasswordModal = ({ isVisible, onClose, onChangePassword }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const user = useSelector((state) => state.auth.user);
    const userId = user.userId
  
    const handlePasswordChange = async () => {
      console.log('new', newPassword)
      console.log('confirm', confirmPassword)
      console.group('userId', userId)
      if (newPassword !== confirmPassword) {
        // Afficher une alerte ou un message indiquant que les mots de passe ne correspondent pas
        Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
        return;
      }
      
      try {
        await axios.put(`${API_BASE_URL}/updatePassword`, {  
          userId,
          newPassword
        });
        
        Alert.alert('Succès', 'Mot de passe mis à jour avec succès');
        onClose();
      } catch (error) {
        // Gérer les erreurs ici - peut-être afficher une alerte ou un message à l'utilisateur
        Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du mot de passe');
        console.error(error);
      } 
    };
  
    return (
    <View style={style.container}>
      <Modal visible={isVisible} onRequestClose={onClose} transparent={true} animationType="slide">
        
        <View style={style.centeredView}>
          
          <View style={style.modalView}>
          <TouchableOpacity onPress={onClose} >
            <Text style={{ fontSize: 30, color:colors.color1}}>&times;</Text>
          </TouchableOpacity>
            <Text style={style.title}>Changer votre mot de passe</Text>
            <TextInput 
              secureTextEntry 
              placeholder='Nouveau mot de passe'
              style={style.input}
              onChangeText={setNewPassword}
              value={newPassword}
            />
            <TextInput 
              secureTextEntry 
              placeholder='Confirmer le mot de passe'
              style={style.input}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />
        <View style={style.container_btn}>
        <Button
                    style={style.btn_enregistrer} 
                    textColor={'white'} 
                    onPress={handlePasswordChange}
                    >
                    Valider
                </Button>
            <Button
                    style={style.btn_deconnexion} 
                    textColor={'white'} 
                    onPress={onClose}
                    >
                   Annuler
                </Button>
        </View>
            
          </View>
        </View>
      </Modal>
      </View>
    );
  };
  
  const style = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        justifyContent:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
        height:"60%",
    },
    input: {
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1,
        marginBottom: 20, 
        width: '100%', 
        paddingHorizontal: 10,
        borderRadius: 5
    },
    title:{
      marginVertical:30,
      fontFamily:fonts.font2,
      color: colors.color2,
      fontWeight:"700",
      fontSize:16,
      textAlign:'center'
    },
    btn_deconnexion:{
      backgroundColor: colors.color8,
      borderRadius:6,
      borderColor:colors.color5,
      borderWidth:1,
      borderStyle:'solid',
      marginVertical:10,
    },
    btn_enregistrer:{
      backgroundColor: colors.color9,
      borderRadius:6,
      borderColor:colors.color9,
      borderWidth:1,
      borderStyle:'solid',
      marginVertical:10,
    },
    container_btn:{
      flexDirection:'row', 
      justifyContent:'center',
      gap:30
    }
    
});


export default PasswordModal

