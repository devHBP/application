import { View, TouchableOpacity, Image, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { defaultStyle} from '../styles/styles'

const ProductDetails = ({navigation, route}) => {

    const { product } = route.params;
    console.log('product', product)

    const baseUrl = 'http://127.0.0.1:8080';

    const handleBack = () => {
        navigation.navigate('home');
      };
     
  return (
    <View style={{...defaultStyle, padding:35}}>
      <TouchableOpacity onPress={handleBack}>
           <Icon name="arrow-back" size={30} color="#900" />
         </TouchableOpacity>


         <View>
            <Image source={{ uri: `${baseUrl}/${product.image}` }} style={{width: 100, height: 100}} />
            <Text>{product.libelle}</Text>
            <Text>{product.prix_unitaire}</Text>
            {/* Render other product details */}
        </View>

    </View>
  )
}

export default ProductDetails