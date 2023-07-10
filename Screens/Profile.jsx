import { View, Text } from 'react-native'
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
    <View style={{ ...defaultStyle, alignItems: 'center', backgroundColor: 'white', margin: 30, paddingHorizontal: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
      
            <Icon name="arrow-back" size={30} color="#900"  onPress={handleBack}/>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>Mon Profil</Text>
          
      </View>
    </View>
  )
}

export default Profile