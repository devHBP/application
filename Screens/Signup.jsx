import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState} from 'react'
import { Button, TextInput } from 'react-native-paper' 
import axios from 'axios'
import { defaultStyle, inputStyling, fonts, colors } from '../styles/styles'
import { registerUser } from '../reducers/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';
import { validateLastName, validateFirstName, validateEmail, validatePassword, validatePostalCode, validateGenre, validateDateOfBirth, validateIdSun} from '../validation/validationInput'
import ArrowLeft from '../SVG/ArrowLeft'

const inputOptions = {
    style:inputStyling,
    mode:"outlined",
    outlineColor:'white',
}


const Signup = ({navigation}) => {

  let API_BASE_URL = 'http://127.0.0.1:8080';

  if (Platform.OS === 'android') {
    if (__DEV__) {
        API_BASE_URL = 'http://10.0.2.2:8080'; // Adresse pour l'émulateur Android en mode développement
    } 
}

  const dispatch = useDispatch()
  const selectedStore = useSelector((state) => state.auth.selectedStore);

  const [lastname, setLastName] = useState('')
  const [firstname, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cp, setCodePostal] = useState('')
  const [genre, setGenre] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false)
  const [formattedDate, setFormattedDate] = useState('');
  const [idSUN, setIdSun] = useState('')

  const [error, setError] = useState({lastname: '', firstname: '', email: '', password: '', cp:'', genre:'', date:'', idSUN:''});

  const  submitHandler = () => {

    const clientData = {
      lastname,
      firstname,
      email,
      password,
      //modif ici id_magasin : null au lieu de '' (vide)
      storeId: selectedStore ? selectedStore.storeId : null,
      cp: parseInt(cp, 10),
      genre,
      date_naissance: date.toISOString(),
      idSUN
    }
    //appel axios post pour s'enregister
    axios.post(`${API_BASE_URL}/signup`, clientData)
    .then(response => {
      //console.log('client data', clientData)
       //console.log('response.data', response.data)
      const userId = response.data.id
      const user = { userId:userId ,firstname, lastname, email, password, cp, genre,date: date.toISOString(), idSUN}; 
       
      dispatch(registerUser(user)); 
      
       navigation.navigate('stores')
       return Toast.show({
        type: 'success',
        text1: `Inscription validée`,
        text2: `Bienvenue ${user.firstname} ${user.lastname} ` 
      });
    })
    .catch(function (error) {
    //console.log('erreur signup',error);
    if (error.response && error.response.status === 400) {
      console.log(error.response.data.error);
      Toast.show({
        type: 'error',
        text1: `Erreur d'inscription`,
        text2: error.response.data.error[0].message 
      });
    }
    //console.log(clientData)
    });
  }

  const handleBack = () => {
    navigation.navigate('login')
  }
 

  return (
    <View style={style.container}>

      <ScrollView showsVerticalScrollIndicator={false}>
      <View >
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:30}}>
           
              <Text style={style.title}>Création de compte</Text>
              <TouchableOpacity onPress={handleBack} activeOpacity={1} style={{ backgroundColor:'black', borderRadius:25}}>
                    <ArrowLeft fill="white"/>
                  </TouchableOpacity>
       
        </View>

      <View style={{paddingBottom:30}}>
        {/* Email */}
      <Text style={style.label}>Votre mail</Text>
      <TextInput 
        {...inputOptions}
        placeholder='exemple.mail@email.com'
        keyboardType='email-address'
        value={email}
        // onChangeText={setEmail}
        onChangeText={(value) => {
          setEmail(value);
          setError({...error, email: validateEmail(value)});
        }}
        style={error.email ? {...inputOptions.style, borderColor: 'red'} : inputOptions.style}
      />
       {/* {error.email ? <Text style={{color: 'red', textAlign:'center'}}>{error.email}</Text> : null} */}
    
    {/* Mot de passe */}
      <Text style={style.label}>Votre mot de passe</Text>
      <TextInput 
        {...inputOptions}
        placeholder='Mot de passe'
        secureTextEntry={true}
        value={password}
        // onChangeText={setPassword}
        onChangeText={(value) => {
          setPassword(value);
          setError({...error, password: validatePassword(value)});
        }}
        style={error.password ? {...inputOptions.style, borderColor: 'red'} : inputOptions.style}
      />
      {/* {error.password ? <Text style={{color: 'red', textAlign:'center'}}>{error.password}</Text> : null} */}
      <Text style={style.reglePwd}>Le mot de passe doit inclure au moins 8 caractères, avec au moins 1 lettre majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial</Text>
      </View>
      

      <View style={{marginBottom:30}}>
      <Text style={style.label}>Votre information personnelle</Text>

      {/* genre */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap:5, marginVertical:10, justifyContent:'space-around' }}>
      <Text style={style.texteGenre}>Vous êtes :</Text>
      <TouchableOpacity 
          style={style.radioButtonOut}
          onPress={() => { setGenre('femme'); }}>
          {
            genre === 'femme' &&
            <View style={style.radioButtonIn} />
          }
        </TouchableOpacity>
        <Text style={style.texteGenre}>Mme.</Text>
        <TouchableOpacity 
          style={style.radioButtonOut}
          onPress={() => { setGenre('homme'); }}>
          {
            genre === 'homme' &&
            <View style={style.radioButtonIn} />
          }
        </TouchableOpacity>
        <Text style={style.texteGenre}>M.</Text>
        <TouchableOpacity 
          style={style.radioButtonOut}
          onPress={() => { setGenre('nbinaire'); }}>
          {
            genre === 'nbinaire' &&
            <View style={style.radioButtonIn} />
          }
        </TouchableOpacity>
        <Text style={style.texteGenre}>Non-binaire</Text>
      </View>

      {/* Nom */}
      {/* <Text style={style.label}>Nom</Text> */}
      <TextInput 
       {...inputOptions}
        placeholder='Nom'
        keyboardType='default'
        value={lastname}
        // onChangeText={setLastName}
        onChangeText={(value) => {
          setLastName(value);
          setError({...error, lastname: validateLastName(value)});
        }}
        style={error.lastname ? {...inputOptions.style, borderColor: 'red'} : inputOptions.style}
      />
      {/* {error.lastname ? <Text style={{color: 'red', textAlign:'center'}}>{error.lastname}</Text> : null} */}

      {/* Prenom */}
      {/* <Text style={style.label}>Prénom</Text> */}
      <TextInput 
        {...inputOptions}
        placeholder='Prénom'
        keyboardType='default'
        value={firstname}
        // onChangeText={setFirstName}
        onChangeText={(value) => {
          setFirstName(value);
          setError({...error, firstname: validateFirstName(value)});
        }}
        style={error.firstname ? {...inputOptions.style, borderColor: 'red'} : inputOptions.style}
      />
      {/* {error.firstname ? <Text style={{color: 'red', textAlign:'center'}}>{error.firstname}</Text> : null} */}

        {/* code postal */}
        {/* <Text style={style.label}>Code postal</Text> */}
        <TextInput 
        {...inputOptions}
        placeholder='Code postal'
        keyboardType='numeric'
        value={cp}
        // onChangeText={setPassword}
        onChangeText={(value) => {
          setCodePostal(value);
          setError({...error, cp: validatePostalCode(value)});
        }}
        style={error.cp ? {...inputOptions.style, borderColor: 'red'} : inputOptions.style}
      />
      {/* {error.cp ? <Text style={{color: 'red', textAlign:'center'}}>{error.cp}</Text> : null} */}

      {/* date de naissance */}
      {/* <Text style={style.label}>Date de naissance</Text> */}
      <TextInput 
          {...inputOptions}
          value={formattedDate}
          editable={false}  // Empêche l'utilisateur de taper manuellement dans ce champ
          placeholder="Date de naissance"
          onTouchStart={() => setOpen(true)}  // Ouvre le date picker lorsque le champ est touché
      />
      <DatePicker
          modal
          mode='date'
          minimumDate={new Date(1900, 0, 1)}  // 1 Janvier 1900
          maximumDate={new Date()}
          open={open}
          date={date}
          onConfirm={(date) => {
            setOpen(false);
            setDate(date);
            const formatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            setFormattedDate(formatted);
            setError({...error, date: validateDateOfBirth(date)});
        }}        
          onCancel={() => {
              setOpen(false);
          }}
      />
      {/* {error.date ? <Text style={{color: 'red', textAlign:'center'}}>{error.date}</Text> : null} */}

      </View>

      {/* numero client SUN */}
      <View>
        <Text style={style.label}>Êtes vous client SUN</Text>
        <TextInput 
          {...inputOptions}
          placeholder='Votre numéro de compte SUN'
          keyboardType='numeric'
          value={idSUN}
          onChangeText={(value) => {
            setIdSun(value);
            setError({...error, idSUN: validateIdSun(value)});

          }}
          style={inputOptions.style}
        />
      </View>
      
    <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
    <Button
        style={style.btn} 
        textColor={'white'} 
        disabled={lastname === "" || firstname === ""||  email === "" ||  password === ""  }
        onPress={() => {
          submitHandler()
        }}
        >
      Suivant
      </Button>
    </View>
      
        <View style={{marginBottom:50}}>
          <TouchableOpacity onPress={() => navigation.navigate('login')}>
            <Text style={style.login}>Vous avez déja un compte ?</Text>
          </TouchableOpacity>
        </View>
      
    </View>

     </ScrollView> 
</View>
  )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        paddingTop:30,
        paddingHorizontal:20,
        justifyContent:'center',
        //reajustement margin pour laisser de la place au footer
        // marginBottom:70,
        backgroundColor:colors.color1
    },
  inputOpts : {
    height:50,
    marginHorizontal:20,
    marginVertical:10,
  },
  btn: {
    backgroundColor: colors.color2,
    paddingHorizontal: 10,
    paddingVertical:0,
    borderRadius:6,
    marginVertical:10,
  },
  back:{
    backgroundColor: colors.color1,
    width:40,
    height:40,
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center',
  },
  title:{
    marginVertical:5,
    color:colors.color6,
    fontSize:24,
    fontWeight: "900",
    fontFamily:fonts.font1,
    width:"60%"
  },
  login:{
    textAlign:'center',
    color:colors.color6,
    marginVertical:10,
    textDecorationLine:'underline'
  },
  label:{
    // marginLeft:20,
    marginTop:10,
    color:colors.color2,
    fontWeight:fonts.font2,
    fontWeight:"700"
  },
  radioButtonOut:{
    height: 15,
    width: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor:colors.color6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.color6
  },
  radioButtonIn:{
    height: 10,
    width: 10,
    borderRadius: 6,
    backgroundColor: colors.color1,
  },
  reglePwd:{
    color: colors.color3,
    fontSize:10,
    marginVertical:5
  },
  texteGenre:{
    color:colors.color6
  }
})

export default Signup