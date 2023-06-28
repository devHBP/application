import { View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import { defaultStyle, inputStyling, colors } from '../styles/styles'
import { Button, TextInput } from 'react-native-paper'
 import { useDispatch, useSelector} from 'react-redux'
 import { loginUser, updateSelectedStore } from '../reducers/authSlice';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import Icon from 'react-native-vector-icons/MaterialIcons';

import axios from 'axios'

//options des input
const inputOptions = {
    style:inputStyling,
    mode:"outlined",
    outlineColor:'white',
}


const Login = ({navigation}) => {

     const dispatch = useDispatch()
     const selectedStoreRedux = useSelector(state => state.auth.selectedStore);
    // console.log('1- selected store in login', selectedStoreRedux)
   

     const [email, setEmail] = useState("")
     const [password, setPassword] = useState("")

    const submitHandler = async () => {

        const clientData = {
            email,
            password
        }

        try{
            //appel axios pour se loger
            const res = await axios.post('http://localhost:8080/login', clientData)
            const user = res.data.user

            // //stockage du token dans asyncstorage
            // const token = res.data.token;
            // console.log('token', token)
            // await AsyncStorage.setItem('userToken', token);

            const selectedStoreId = user.storeId;
            // const selectedStoreId = selectedStoreRedux.id_magasin;

            //  console.log('2- selected store id', selectedStoreId)

            axios.get(`http://localhost:8080/getOneStore/${selectedStoreId}`)
                .then(storeResponse => {
                    const selectedStore = storeResponse.data; // Récupérez les détails du magasin choisi
                    // console.log('3- store selectionné' ,selectedStore)
                    // Dispatchez l'action pour mettre à jour le magasin choisi dans le store
                     dispatch(updateSelectedStore(selectedStore));
                     dispatch(loginUser(user))
        
                    navigation.navigate('home')
                    //champs de connexion vide (une fois connecté)
                    //setEmail('');
                    //setPassword('');
                    return Toast.show({
                        type: 'success',
                        text1: `Connexion réussie`,
                        text2: `Bienvenue ${user.firstname} ${user.lastname} ` 
                      });
                })
                .catch(error => {
                    // console.error('Erreur lors de la récupération des informations du magasin:', error);
                });
  
           
        }catch (error){
            console.log(error)
            return Toast.show({
                type: 'error',
                text1: `Echec de connexion`,
                text2: `Rentrez correctement votre email et mot de passe` 
              });
        }
    }
    const handleBack = () => {
        navigation.navigate('app');
      };
    
  return (
    <View style={defaultStyle}>
        {/* <TouchableOpacity  onPress={() => navigation.navigate('signup') }>
          <MaterialIcons name="arrow-back" />
        </TouchableOpacity> */}
      
      <View style={style.container}>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginVertical:20}}>
            <View>
              <Text style={style.title}>Connexion</Text>
              <Text style={style.pain}>Le pain du jour</Text>
            </View>
          <TouchableOpacity onPress={handleBack} style={style.back}>
           <Icon name="keyboard-arrow-left" size={20} color="#fff" />
         </TouchableOpacity>
        </View>
            <Text style={style.label}>Adresse e-mail</Text>
            <TextInput
                {...inputOptions} 
                // placeholder='Email' 
                keyboardType='email-address'
                value={email} 
                onChangeText={setEmail}
            />

            <Text style={style.label}>Mot de passe</Text> 
            <TextInput 
                {...inputOptions} 
                // placeholder='Mot de passe' 
                secureTextEntry={true}
                value={password} 
                onChangeText={setPassword}
                
            />
            <Button
                style={style.btn} 
                textColor={'white'} 
                //inactif si email ou password vide
                disabled={email === "" || password === ""}
                 onPress={submitHandler}
                >
                SE CONNECTER
            </Button>

            <Text style ={{textAlign:'center'}}>Pas encore de compte ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('signup')}>
                <Text style={style.signup}>S'enregistrer</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}
const style = StyleSheet.create({
    
    container:{
        flex:1,
        padding:20,
        justifyContent:'center',
        //reajustement margin pour laisser de la place au footer
        // marginBottom:70,
        backgroundColor:colors.color3,
        borderRadius:10,
    },
    // title:{
    //     textAlign:'center',
    //     margin: 20,
    // },
    title:{
        marginVertical:5,
        color:colors.color2,
        fontSize:33,
        fontWeight:900,
      },
      pain:{
        fontStyle:'italic',
        fontSize:22,
      },
      back:{
        backgroundColor: colors.color1,
        width:40,
        height:40,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
      },
    btn: {
        backgroundColor: colors.color2,
        margin: 5,
        padding: 6,
        borderRadius:6,
        marginHorizontal:40,
        marginTop:40
      },
    signup:{
        textAlign:'center',
        color:colors.color2,
        fontWeight:'bold',
        marginVertical:10
    },
    label:{
        // marginLeft:20,
       marginTop:10,
        color:colors.color2
      }
})

export default Login