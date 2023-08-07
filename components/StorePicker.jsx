import {View, Image, Text, Platform, StyleSheet } from 'react-native'
import  Picker  from 'react-native-picker-select';
import React, {useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateSelectedStore, updateUser} from '../reducers/authSlice';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { fonts, colors} from '../styles/styles'

//import { pickerSelectStyles } from '../styles/home';

const StorePicker = () => {

    const [stores, setStores] = useState([]);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const selectedStore = useSelector((state) => state.auth.selectedStore);

    let API_BASE_URL = 'http://127.0.0.1:8080';

    if (Platform.OS === 'android') {
      if (__DEV__) {
          API_BASE_URL = 'http://10.0.2.2:8080'; // Adresse pour l'émulateur Android en mode développement
      } 
  }



    const allStores = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/getAllStores`);
          setStores(response.data);
        } catch (error) {
          console.error("Une erreur s'est produite, erreur stores :", error);
        }
    };

    useEffect(() => {
        allStores();
    }, []);
    
    return (
        <View style={{ width:"100%", height:80, backgroundColor:'white', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <View style={{ flexDirection:'row', gap:5, alignItems:'center', }}>
                <Image
                    source={require('../assets/store.png')} 
                    style={{ width: 24, height: 25, resizeMode:'contain' }}
                />
                <View>   
                    <Picker
                        placeholder={{
                            label: "Choisissez un magasin"
                        }}
                        value={selectedStore.nom_magasin}
                        onValueChange={(value) => {
                            const selected = stores.find((store) => store.nom_magasin === value);

                            if (selected) {
                                dispatch(updateSelectedStore(selected));
                                dispatch(updateUser({ ...user, storeId: selected.storeId }));

                                axios.put(`${API_BASE_URL}/updateOneUser/${user.userId}`, {storeId: selected.storeId})
                                .then(response => {
                                    console.log('Le choix du magasin a été mis à jour avec succès dans la base de données');
                                })
                                .catch(error => {
                                    console.error('Erreur lors de la mise à jour du choix du magasin dans la base de données (ici) - erreur ici:', error);
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
                        style={pickerSelectStyles}
                    /> 
                    <View style={{flexDirection:'row'}}>
                        <View >
                            <Text style={{fontSize:10, color:colors.color1}}>
                                {selectedStore.adresse_magasin}   
                            </Text>
                            <Text  style={{fontSize:10, color:colors.color1}}>{selectedStore.cp_magasin} {selectedStore.ville_magasin}</Text>
                        </View>
                    </View>  
                </View>
            </View>
        </View>
    )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 20,
    color: colors.color1,
    fontWeight: "bold",
  },
  inputAndroid: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    color: colors.color1,
  },
});

const pickerStyles = Platform.select({
    ios:  pickerSelectStyles.inputIOS ,  // Styles pour iOS
    android: pickerSelectStyles.inputAndroid   // Styles pour Android
});


export default StorePicker;
