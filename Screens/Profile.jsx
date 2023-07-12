import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image} from 'react-native'
import { Button, TextInput, Avatar } from 'react-native-paper'
import React, { useEffect, useState} from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux'
import { updateUser , updateSelectedStore,} from '../reducers/authSlice';
import { defaultStyle, inputStyling, colors, fonts } from '../styles/styles'
import  Picker  from 'react-native-picker-select';



import axios from 'axios'
import FooterProfile from '../components/FooterProfile';

//options des input
const inputOptions = {
  style:inputStyling,
  mode:"outlined",
  outlineColor:'white',
  paddingHorizontal:10,
}

const Profile =  ({navigation}) => {

  const [stores, setStores] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  

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
    //ajouter date de naissance
    
    const handleSubmit = () => {
      dispatch(updateUser({
        firstname,
        lastname,
        adresse,
        telephone,
        email,
        codepostal,
      }));
    };
   
  return (
    <>
    <View >
    <ScrollView showsVerticalScrollIndicator={false} style={{  marginHorizontal: 15, marginVertical:30}}>
      <View style={{  marginBottom: 20}}> 
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:10}}>
                <Text style={style.title}>Votre compte</Text>
                <TouchableOpacity onPress={handleBack} style={style.back}>
                  <Icon name="keyboard-arrow-left" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',marginVertical:10}}>
              <Avatar.Image size={60} source={require('../assets/avatar.png')} style={style.avatar}/>
              <View style={{width:"50%", flexDirection:'column', gap:10}}>
                <Text style={{color:colors.color2}}>#UserId {user.userId}</Text>
                <Text style={{fontSize:12}}>Ce code unique pour vous permet de vous identifier sur le réseau SUN</Text>
              </View>
             
          </View>
          
      </View>

       
      <Text style={style.title_section}>Votre information personnelle</Text>
      <View style={style.formulaire}>

       <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <TextInput {...inputOptions}  onChangeText={setLastname} style={style.short_input} placeholder='Nom'/>
          <TextInput {...inputOptions}  onChangeText={setFirstname} style={style.short_input} placeholder='Prenom' />
       </View>
       <View style={{flexDirection:'row', justifyContent:'space-between'}}>
       <TextInput {...inputOptions}  onChangeText={setTelephone} style={style.short_input} placeholder='N° téléphone'/>
          <TextInput {...inputOptions}  onChangeText={setCodepostal} style={style.short_input} placeholder='Code postal' />
       </View>
       <View style={{flexDirection:'row', justifyContent:'space-between'}}>
       <TextInput {...inputOptions}  style={style.short_input} placeholder='N° téléphone'/>
          
       </View>
       
       <View style={{flexDirection:'column', marginVertical:10}}>
          <Text style={style.label}>Votre email</Text>
          <TextInput {...inputOptions} placeholder='exemple.mail@email.com' onChangeText={setEmail} style={style.long_input}/>
        </View> 

        <View style={{flexDirection:'column', marginVertical:10}}>
          <Text style={style.label}>Votre adresse</Text>
          <TextInput {...inputOptions} placeholder='123 Direction de la rue' onChangeText={setAdresse} style={style.long_input}/>
        </View>

        </View>

        <Text style={style.title_section}>Votre information du compte</Text>
        <View style={style.formulaire}>
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
        <View style={{marginVertical:10}}>
          <TextInput {...inputOptions} placeholder='Ajoutez une allergie alimentaire'  style={style.long_input}/>
          <TextInput {...inputOptions} placeholder='Ajoutez un choix alimentaire'  style={style.long_input}/>
        </View>
        
        
        {/* role du user */}
        {/* <Text style={{marginVertical:5}}> Vous êtes un <Text style={style.role}> 
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
        </Text> */}

        <Text style={style.label}>Notifications</Text>

        <View>
          <View style={{marginVertical:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <Text>Recevoir les notifications par SMS</Text>
            <Switch
              trackColor={{false: colors.color8, true: colors.color9}}
              thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor= {colors.color8}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <View style={{marginVertical:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <Text>Recevoir les notifications par Email</Text>
            <Switch
              trackColor={{false: colors.color8, true: colors.color9}}
              thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor= {colors.color8}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <View style={{marginVertical:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <Text>Recevoir des notifications Push</Text>
            <Switch
              trackColor={{false: colors.color8, true: colors.color9}}
              thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor= {colors.color8}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>

        <Text style={style.label}>Gestion des cookies et données personnelles</Text>
        <View style={{flexDirection:'row'}}>
        <Button
                style={style.btn_cookies} 
                textColor={colors.color1} 
                
                >
                   Cookies
                  <View style={{width:8, paddingLeft:15}}>
                  <Image
                  source={require('../assets/arrow.png')} 
                  // Remplacez ces valeurs par les dimensions souhaitées
                />
                  </View>
               
            </Button>
            <Button
                style={style.btn_cookies} 
                textColor={colors.color1} 
                
                >
                   Données personnelles
                  <View style={{width:8, paddingLeft:15}}>
                  <Image
                  source={require('../assets/arrow.png')} 
                  // Remplacez ces valeurs par les dimensions souhaitées
                />
                  </View>
            </Button>
        </View>

        <Text style={style.label}>Informations légales</Text>
        <View style={{flexDirection:'row'}}>
        <Button
                style={style.btn_cookies} 
                textColor={colors.color1} 
                
                >
                   Mentions légales, CGU, CGV
                  <View style={{width:8, paddingLeft:15}}>
                  <Image
                  source={require('../assets/arrow.png')} 
                  // Remplacez ces valeurs par les dimensions souhaitées
                />
                  </View>
               
            </Button>
            
        </View>

        </View>
        <View style={style.last_formulaire}>
             <Button
                style={style.btn_formulaire} 
                textColor={'white'} 
                 onPress={handleSubmit}
                >
                Enregistrer
            </Button>
            <Button
                style={style.btn_formulaire} 
                textColor={'white'} 
                 onPress={handleSubmit}
                >
                Se deconnecter
            </Button>
        </View>
    </ScrollView>
    <View >
    
      
    </View>
   

    </View>
     <FooterProfile />

     </>
  )
}

const style = StyleSheet.create({

  title:{
    fontSize: 26, 
    fontWeight: 'bold',
    color:colors.color1,
    fontFamily: fonts.font1
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
    alignItems:'center',
    borderRadius:25
  },
  title_section:{
    fontWeight:'bold',
    color:colors.color2,
    marginVertical:20,
    paddingHorizontal:10
  }, 
  label:{
   fontWeight:'bold',
    color:colors.color1,
    paddingVertical:5
  },
  btn: {
    backgroundColor: colors.color2,
    margin: 5,
    padding: 6,
    borderRadius:6,
    marginHorizontal:40,
    marginTop:40,
    marginBottom:40
  },
  btn_cookies: {
    backgroundColor: colors.color4,
    margin: 5,
    paddingHorizontal: 2,
    borderRadius:6,
    borderColor:colors.color5,
    borderWidth:1,
    borderStyle:'solid',
   
  },
  btn_formulaire:{
    backgroundColor: colors.color4,
    margin: 30,
    borderRadius:6,
    borderColor:colors.color5,
    borderWidth:1,
    borderStyle:'solid',
    marginVertical:10
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
    width:"45%",
    fontSize:14,
    backgroundColor:colors.color4
  },
  long_input:{
    width:"100%",
    fontSize:14,
    backgroundColor:colors.color4
  },
  avatar:{
    backgroundColor:colors.color1,
    marginLeft:20
  },
  formulaire:{
    backgroundColor:colors.color6,
    borderRadius:10,
    padding:15
  },
  last_formulaire:{
    backgroundColor:colors.color6,
    borderRadius:10,
    marginVertical:10
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
    color: colors.color5,
    backgroundColor:colors.color4,
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