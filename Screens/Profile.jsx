import { View, TouchableOpacity } from 'react-native'
import React, { useEffect} from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { defaultStyle} from '../styles/styles'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

const Profile =  ({navigation}) => {

    const handleBack = () => {
        navigation.navigate('home');
    };

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const userId = user.userId
    const selectedStore = useSelector((state) => state.auth.selectedStore);
    console.log('user role', user)
    console.log('selectestore', selectedStore)

    //modifier nom
    //modifier prenom
    //modifier adresse
    //modifier telephone
    //modifier store préféré

    //lister toutes les commandes
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const resp = await axios.get(`http://localhost:8080/ordersOfUser/${userId}`)
                console.log(resp.data)
            }
            catch (error){
                console.log(error)
            }
        };

        fetchOrders();
    }, [userId]);
    

  return (
    <View style={{...defaultStyle, padding:20}}>
      <TouchableOpacity onPress={handleBack}>
           <Icon name="arrow-back" size={30} color="#900" />
         </TouchableOpacity>
    </View>
  )
}

export default Profile