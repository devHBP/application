import { View, Text , StyleSheet, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fonts, colors} from '../styles/styles'

const CartItem = ({libelle, prix, incrementhandler, decrementhandler, image, qty, prix_unitaire, isFree, freeCount }) => {

    const baseUrl = 'http://127.0.0.1:8080';
    //console.log('prix_unitaire', prix)

  return (
   
    <View style={styles.container}>
     
      <Image source={{ uri: `${baseUrl}/${image}` }} style={styles.image} 
    //   onPress={() => navigate.navigate("productdetails", { id })}
    />
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>{libelle}</Text>
       <Text style={styles.price}> {prix || prix_unitaire}€</Text>
        
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={decrementhandler}>
          <Icon name="remove-circle" size={25} color="#000" />
        </TouchableOpacity>
        <Text style={styles.qty}>{qty}</Text>
        <TouchableOpacity onPress={incrementhandler}>
          <Icon name="add-circle" size={25} color="#000" />
        </TouchableOpacity>
      </View>
   
      <Text style={styles.isFree}> 
        {/* {isFree = 'true' ? `Vous avez ${freeCount} produit gratuit` : 'sans offre'} */}
        {isFree = 'true'  ? `Vous avez ${freeCount} produit${freeCount > 1 ? 's' : ''} gratuit${freeCount > 1 ? 's' : ''}` : 'sans offre'}

      </Text>
      
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      image: {
        width: 80,
        height: 80,
        borderRadius: 5,
        marginRight: 10,
      },
      content: {
        width:150
      },
      title: {
        fontSize: 16,
        marginBottom: 5,
      },
      price: {
        fontSize: 14,
        color: '#888',
      },
      actions: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      qty: {
        fontSize: 16,
        paddingHorizontal: 10,
      },
      isFree:{
        position: "absolute",
        bottom: 0,
        right:0,
        color:colors.color9
      }
  });

export default CartItem