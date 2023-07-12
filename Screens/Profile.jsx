import { View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import React, { useEffect, useState} from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux'
import { updateUser , updateSelectedStore,} from '../reducers/authSlice';
import { defaultStyle, inputStyling, colors } from '../styles/styles'
import  Picker  from 'react-native-picker-select';


import axios from 'axios'

//options des input
const inputOptions = {
  style:inputStyling,
  mode:"outlined",
  outlineColor:'white',
  paddingHorizontal:10,
}

const Profile =  ({navigation}) => {

  const [stores, setStores] = useState([]);
  

    const handleBack = () => {
        navigation.navigate('home');
    };

    const allStores = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8080/getAllStores');
        setStores(response.data);
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
      }
    };
    useEffect(() => {
      allStores();
    }, []);

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const userId = user.userId
    const selectedStore = useSelector((state) => state.auth.selectedStore);
    //console.log('store', userStore)
     // Initialisation des états locaux pour les champs du formulaire
    const [firstname, setFirstname] = useState(user.firstname);
    const [lastname, setLastname] = useState(user.lastname);
    const [adresse, setAdresse] = useState(user.adresse);
    const [telephone, setTelephone] = useState(user.telephone);
    const [email, setEmail] = useState(user.email);
    const [codepostal, setCodepostal] = useState(user.codepostal);
    const [idSun, setIdSun] = useState(user.idSun);
    
    const handleSubmit = () => {
      dispatch(updateUser({
        firstname,
        lastname,
        adresse,
        telephone,
        email,
        codepostal,
        idSun
      }));
    };
   
  return (
    <View style={{ ...defaultStyle, backgroundColor: colors.color3, margin: 30, paddingHorizontal: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent:'space-between'}}> 
            <View>
              <Text style={style.title}>Votre compte</Text>
              <Text style={style.title_section}>#UserId {user.userId}</Text>
              <Text>Ce code unique pour vous permet de vous identifier sur le réseau SUN</Text>
          </View>
          <TouchableOpacity onPress={handleBack} style={style.back}>
           <Icon name="keyboard-arrow-left" size={20} color="#fff" />
         </TouchableOpacity>
  
      </View>

      

      <ScrollView showsVerticalScrollIndicator={false}>
       
      <Text style={style.title_section}>Votre information personnelle</Text>
       <View style={{flexDirection:'row',gap:50, marginVertical:10}}>
          <TextInput {...inputOptions}  onChangeText={setLastname} style={style.short_input} placeholder='Nom'/>
          <TextInput {...inputOptions}  onChangeText={setFirstname} style={style.short_input} placeholder='Prenom' />
       </View>
       <View style={{flexDirection:'row',gap:50}}>
       <TextInput {...inputOptions}  onChangeText={setTelephone} style={style.short_input} placeholder='N° téléphone'/>
          <TextInput {...inputOptions}  onChangeText={setCodepostal} style={style.short_input} placeholder='Code postal' />
       </View>
       
       <View style={{flexDirection:'column', marginVertical:10}}>
          <Text style={style.label}>Votre email</Text>
          <TextInput {...inputOptions} placeholder='exemple.mail@email.com' onChangeText={setEmail} style={style.long_input}/>
        </View> 

        <View style={{flexDirection:'column', marginVertical:10}}>
          <Text style={style.label}>Votre adresse</Text>
          <TextInput {...inputOptions} placeholder='123 Direction de la rue' onChangeText={setAdresse} style={style.long_input}/>
        </View>

        <Text style={style.title_section}>Votre information du compte</Text>
        <Text style={style.label}>Votre restaurant favori</Text>
        <Picker
          style={pickerSelectStyles}
              placeholder={{
                  label: "Modifier votre magasin"
                
                }}
              value={selectedStore.nom_magasin}
              onValueChange={(value) => {
                const selected = stores.find((store) => store.nom_magasin === value);
                //console.log('user', user)

                if (selected) {
                  dispatch(updateSelectedStore(selected));
                // dispatch(updateUser({ ...user, id_magasin: selected.id_magasin }));
                dispatch(updateUser({ ...user, storeId: selected.storeId }));

                axios.put(`http://127.0.0.1:8080/updateOneUser/${user.userId}`, {storeId: selected.storeId})
                .then(response => {
                  // console.log('Le choix du magasin a été mis à jour avec succès dans la base de données');
                  // console.log(response.data)
                })
                .catch(error => {
                  console.error('Erreur lors de la mise à jour du choix du magasin dans la base de données - erreur ici:', error);
                });
              }
            else {
              console.log('pas de magasin selectionné encore')
            }}
            }
              items={stores.map((store) => ({
                label: store.nom_magasin,
                value: store.nom_magasin,
              }))}
            /> 

        <Text style={style.label}>Vos préférences alimentaires</Text>
        <TextInput {...inputOptions} placeholder='preferences alimentaires'  style={style.long_input}/>
        

        <Text style={style.label}>Votre compte SUN</Text>
        <TextInput {...inputOptions} placeholder='#ID SUN' onChangeText={setIdSun} style={style.long_input}/>
        
        <Text style={{marginVertical:5}}> Vous êtes un <Text style={style.role}> 
              {
                user.role === 'collaborateur' ? 
                  <Text>Collaborateur</Text> 
                : 
                user.role === 'client' ? 
                  <Text>Client</Text> 
                : 
                null
              }
             </Text>
             </Text>
    </ScrollView>
    <View >
    
      <Button
                style={style.btn} 
                textColor={'white'} 
                 onPress={handleSubmit}
                >
                Enregistrer
            </Button>
    </View>

    </View>
  )
}

const style = StyleSheet.create({

  title:{
    fontSize: 20, 
    fontWeight: 'bold',
    color:colors.color1 
  },
  role:{
    color: colors.color2
  },
  back:{
    backgroundColor: colors.color1,
    width:40,
    height:40,
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center'
  },
  title_section:{
    fontWeight:'bold',
    color:colors.color2,
    marginVertical:20,
  }, 
  label:{
   fontWeight:'bold',
    color:colors.color1
  },
  btn: {
    backgroundColor: colors.color2,
    margin: 5,
    padding: 6,
    borderRadius:6,
    marginHorizontal:40,
    marginTop:40
  },
  picker:{
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  short_input:{
    width:"40%",
    fontSize:14
  },
  long_input:{
    width:"97%",
    fontSize:14
  }

});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
    backgroundColor:'white',
    height:50,
    width:'97%'
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
  },
});

export default Profile