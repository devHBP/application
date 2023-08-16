import { View, Text , StyleSheet, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fonts, colors} from '../styles/styles'
import Svg, { Path } from 'react-native-svg';

const CartItem = ({libelle, prix, incrementhandler, decrementhandler, image, qty, prix_unitaire, isFree, freeCount }) => {

  let API_BASE_URL = 'http://127.0.0.1:8080';

  if (Platform.OS === 'android') {
    if (__DEV__) {
        API_BASE_URL = 'http://10.0.2.2:8080'; // Adresse pour l'émulateur Android en mode développement
    } 
}
    //console.log('prix_unitaire', prix)

  return (
   
    <View style={styles.container}>
     
      {/* <Image source={{ uri: `${API_BASE_URL}/${image}` }} style={styles.image} 
    //   onPress={() => navigate.navigate("productdetails", { id })}
    /> */}
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>{libelle}</Text>
       <Text style={styles.price}>{prix || prix_unitaire }€</Text>
        
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={decrementhandler} style={styles.container_gray}>
          {/* <Icon name="remove-circle" size={25} color="#000" /> */}
       
           <Svg width={7} height={4} viewBox="0 0 7 4">
              <Path
                d="M0.666748 3.8V0.733337H6.80008V3.8H0.666748Z"
                fill="#273545"
              />
            </Svg>
                
        </TouchableOpacity>

        <View style={styles.container_gray}> 
          <Text style={styles.qty}>{qty}</Text>
        </View>
       
        <TouchableOpacity onPress={incrementhandler} style={{...styles.container_gray, backgroundColor:colors.color2}}>
          {/* <Icon name="add-circle" size={25} color="#000" /> */}
            <Svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M10 4.05197V6.48141H6.63702V9.86669H4.14375V6.48141H0.800049V4.05197H4.14375V0.666687H6.63702V4.05197H10Z" fill="#ECECEC"/>
            </Svg>
        </TouchableOpacity>
      </View>
   
      <Text style={styles.isFree}> 
        {/* {isFree = 'true' ? `Vous avez ${freeCount} produit gratuit` : 'sans offre'} */}
        {isFree = 'true' && freeCount > 0 ? `Vous avez ${freeCount} produit${freeCount > 1 ? 's' : ''} gratuit${freeCount > 1 ? 's' : ''}` : ''}

      </Text>
      
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        // borderBottomWidth: 1,
        // borderBottomColor: '#ccc',
        padding:10,
        width:300,
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
        gap:10
      },
      qty: {
        fontSize: 16,
        paddingHorizontal: 10,
        color:colors.color1,
        textAlign:'center'
      },
      container_gray:{
        backgroundColor:'lightgray',
        width:30, height:25,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
      },
      isFree:{
        position: "absolute",
        bottom: 0,
        right:0,
        color:colors.color9
      }
  });

export default CartItem