import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import React, {useState} from 'react'
import { inputStyling, colors, fonts } from '../styles/styles'
import { Button, TextInput } from 'react-native-paper'
 import { useDispatch, useSelector} from 'react-redux'
 import { loginUser, updateSelectedStore } from '../reducers/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  let API_BASE_URL = 'http://127.0.0.1:8080';

  if (Platform.OS === 'android') {
    if (__DEV__) {
        API_BASE_URL = 'http://10.0.2.2:8080'; // Adresse pour l'émulateur Android en mode développement
    } else {
        // Vous pouvez définir ici l'URL de production pour Android si nécessaire
    }
}

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

            const res = await axios.post(`${API_BASE_URL}/login`, clientData)
            //const res = await axios.post('http://10.0.2.2:8080/login', clientData)
            const user = res.data.user


            const token = res.data.token;
            //console.log('token login', token)
            await AsyncStorage.setItem('userToken', token);

            const selectedStoreId = user.storeId;


            //  console.log('2- selected store id', selectedStoreId)
            // navigation.navigate('loaderhome')
            axios.get(`${API_BASE_URL}/getOneStore/${selectedStoreId}`)
            //axios.get(`http://10.0.2.2:8080/getOneStore/${selectedStoreId}`)
                .then(storeResponse => {
                    const selectedStore = storeResponse.data;


                     dispatch(updateSelectedStore(selectedStore));
                     dispatch(loginUser(user))
        
                    navigation.navigate('home')
                  //   setTimeout(() => {
                  //     navigation.navigate('home');
                  //     Toast.show({
                  //         type: 'success',
                  //         text1: `Connexion ok`,
                  //         text2: `Bienvenue ${user.firstname} ${user.lastname}`
                  //     });
                  // }, 5000);  
              

                    //setEmail('');
                    //setPassword('');
                    return Toast.show({
                        type: 'success',
                        text1: `Connexion ok`,
                        text2: `Bienvenue ${user.firstname} ${user.lastname}`
                      });
                })
                .catch(error => {
                     console.error('Erreur lors de la récupération des informations du magasin:', error);
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
    
  return (
   
      
      <View style={style.container}>

              <View style={{flexDirection:'row', justifyContent:'center', marginBottom:20}}>
                <Image
                  source={require("../assets/logo_pdj.png")} // Remplacez 'my-image' par le nom de votre image
                  style={{ width: 140, height: 140, resizeMode:"contain" }} // Remplacez ces valeurs par les dimensions souhaitées
                />
              </View>
              
              <View style={{marginVertical:10}}>
                <Text style={style.title1}>Connexion</Text>
                <Text style={style.title2}>Connectez vous à votre compte</Text>
              </View>
             
          
            <Text style={style.label}>Adresse e-mail</Text>
            <TextInput
                {...inputOptions} 
                placeholder='exemple.mail@email.com' 
                placeholderTextColor={colors.color1}
                keyboardType='email-address'
                value={email} 
                onChangeText={setEmail}
            />

            <Text style={style.label}>Mot de passe</Text> 
            <TextInput 
                {...inputOptions} 
                placeholder='Mot de passe' 
                placeholderTextColor={colors.color1}
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
                Se connecter
            </Button>

            <TouchableOpacity onPress={() => navigation.navigate('signup')}>
                <Text style={style.signup}>Vous n'avez pas encore de compte ?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('pwd')}>
                <Text style={{...style.signup, fontSize:12}}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

    
    </View>
  )
}
const style = StyleSheet.create({
    
    container:{
        flex:1,
        padding:20,
        paddingHorizontal:30,
        justifyContent:'center',
        //reajustement margin pour laisser de la place au footer
        // marginBottom:70,
        backgroundColor:colors.color1,
    },
    // title:{
    //     textAlign:'center',
    //     margin: 20,
    // },
    title1:{
        marginVertical:5,
        color:colors.color6,
        fontSize:32,
        fontFamily:fonts.font1,
      },
      title2:{
        fontSize:18,
        color:colors.color6,
        fontFamily:fonts.font3,
        fontWeight:"700"
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
        padding: 2,
        borderRadius:6,
        marginHorizontal:80,
        marginTop:40
      },
    signup:{
        textAlign:'center',
        color:colors.color6,
        marginVertical:10, 
        textDecorationLine: 'underline',
        fontSize:14
    },
    label:{
       fontSize:14,
       marginTop:10,
       color:colors.color2,
       fontFamily:fonts.font2,
      fontWeight:"700"
      }
})

export default Login