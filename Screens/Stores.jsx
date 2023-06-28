import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button} from 'react-native-paper' 
import { defaultStyle} from '../styles/styles'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { updateSelectedStore } from '../reducers/authSlice';

const Stores = ({navigation}) => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [stores, setStores] = useState([]);

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  console.log('user dans Stores', user)
  //modif userId <= id
  const userId = useSelector(state => state.auth.user.userId)
   console.log('userId dans stores', userId),

  useEffect(() => {
    // Récupérer les magasins depuis la base de données
    axios.get('http://localhost:8080/getAllStores')
      .then(response => {
        setStores(response.data);
        // console.log('stores', response.data)
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des magasins:', error);
      });
  }, []);

  const handleStoreSelection = (store) => {
    setSelectedStore(store);
    console.log('store button selectionné:', store)
    dispatch(updateSelectedStore(store));
  };

  const  submitHandler = () => {
    // console.log('store validé', selectedStore)
    // console.log('user après validation', user);
    //update du user
    if (selectedStore && user) {
      const updatedUser = { ...user, storeId: selectedStore.storeId };
      console.log('update user',updatedUser)

      axios
        .put(`http://127.0.0.1:8080/updateOneUser/${userId}`, updatedUser)
        .then((response) => {
          console.log('User updated:', response.data);
          navigation.navigate('login');
        })
        .catch((error) => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        });
    }
    
  }

 

  return (
    <View style={defaultStyle}>
        <View style={style.container}>

            <Text>Veuillez choisir votre lieu de click and collect </Text>

            {stores.map(store => (
                <TouchableOpacity
                key={store.storeId}
                style={style.touchable}
                onPress={() => handleStoreSelection(store)}
                >
                <Text style={style.text}>{store.nom_magasin}</Text>
                <Text style={style.text}>{store.adresse_magasin}</Text>
                </TouchableOpacity>
            ))}
            
            {selectedStore !== null && (
                <View style={style.selection}>
                    <Text>Vous avez sélectionné le magasin :</Text>
                    <Text>{selectedStore.nom_magasin}</Text>
                    <Text>{selectedStore.adresse_magasin}</Text>
                </View>
                
            )}

            <Button
                        style={style.btn} 
                        textColor={'white'} 
                        disabled={selectedStore === "" }
                        onPress={() => {
                            submitHandler()
                        }}
                        >
                    VALIDER
            </Button>

        </View>
        
    </View>
  );
};


const style = StyleSheet.create({
container: {
    height:"100%",
    justifyContent:'center', 
    alignItems:'center',
    gap: 20,
},
touchable:{
    backgroundColor:'gray',
    paddingVertical:15,
    paddingHorizontal:25,
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center'
},
text:{
    color:'white'
},
btn: {
    backgroundColor: 'red',
    margin: 20,
    padding: 6,
  },
selection: {
    justifyContent:'center', 
    alignItems:'center'
}
})

export default Stores;
