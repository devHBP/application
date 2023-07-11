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
  paddingHorizontal:10
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
    const [date_naissance, setDateNaissance] = useState(user.date_naissance);
    
    const handleSubmit = () => {
      dispatch(updateUser({
        firstname,
        lastname,
        adresse,
        telephone,
        email,
        date_naissance,
      }));
    };
   
  return (
    <View style={{ ...defaultStyle, backgroundColor: colors.color3, margin: 30, paddingHorizontal: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent:'space-between'}}> 
            <View>
              <Text style={style.title}>Mon compte</Text>
              <Text style={style.role}> 
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
          </View>
          <TouchableOpacity onPress={handleBack} style={style.back}>
           <Icon name="keyboard-arrow-left" size={20} color="#fff" />
         </TouchableOpacity>
  
      </View>

      

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={style.label}>Nom</Text>
        <TextInput {...inputOptions} value={lastname} onChangeText={setLastname} />
        <Text style={style.label}>Prénom</Text>
        <TextInput {...inputOptions} value={firstname} onChangeText={setFirstname} />
        <Text style={style.label}>Email</Text>
        <TextInput {...inputOptions} value={email} onChangeText={setEmail} />
        <Text style={style.label}>Date de naissance</Text>
        <TextInput {...inputOptions} value={date_naissance} onChangeText={setDateNaissance} />
        <Text style={style.label}>Adresse</Text>
        <TextInput {...inputOptions} value={adresse} onChangeText={setAdresse} />
        <Text style={style.label}>Téléphone</Text>
        <TextInput {...inputOptions} value={telephone} onChangeText={setTelephone} />

        <Picker
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
    color:colors.color2 
  },
  role:{
    fontStyle:'italic'
  },
  back:{
    backgroundColor: colors.color1,
    width:40,
    height:40,
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center'
  },
  label:{
    marginLeft:20,
    marginTop:10,
    color:colors.color2
  },
  btn: {
    backgroundColor: colors.color2,
    margin: 5,
    padding: 6,
    borderRadius:6,
    marginHorizontal:40,
    marginTop:40
  },
});

export default Profile