import { View, Text } from 'react-native'
import React from 'react'
import { defaultStyle} from '../styles/styles'
import Icon from 'react-native-vector-icons/MaterialIcons';

const Orders = ({navigation}) => {

    const handleBack = () => {
        navigation.navigate('home');
      };
  return (
    <View style={{ ...defaultStyle, alignItems: 'center', backgroundColor: 'white', margin: 30, paddingHorizontal: 5 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        
            <Icon name="arrow-back" size={30} color="#900" onPress={handleBack} />
        
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>Mes commandes</Text>
        </View>
    </View>
  )
}

export default Orders