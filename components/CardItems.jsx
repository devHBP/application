import { View, Text , StyleSheet, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';

const CartItem = ({libelle, prix, incrementhandler, decrementhandler, image, qty}) => {

    const baseUrl = 'http://127.0.0.1:8080';
    //console.log('prix_unitaire', prix)

  return (
    <View
        style={{
        flexDirection: "row",
        height: 100,
        marginVertical: 20,
        justifyContent:'center',
        alignItems:'center',
        // width:100
        }}
     >
        <View
        style={{
            width: 100,
            height:100,
        }}
        >
             <Image
                source={{
                    uri: `${baseUrl}/${image}`
                }}
                style={styles.img}
            /> 
        </View>
        <View
        style={{
            // width: "60%",
            paddingHorizontal: 25,
        }}
        >
        <Text
            numberOfLines={1}
            style={{
            fontSize: 17,
            }}
            // onPress={() => navigate.navigate("productdetails", { id })}
        >
            {libelle}
        </Text>

        <Text
            numberOfLines={2}
            style={{
            fontSize: 17,
            fontWeight: "900",
            }}
        >
            {prix}€
        </Text>
        </View>

        <View style={styles.qtyContainer}>
            <TouchableOpacity
                onPress={ incrementhandler}
            >
                <Icon name="add" size={30} color="#000" />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{qty}</Text>

            <TouchableOpacity
                onPress={ decrementhandler}
            >
                <Icon name="remove" size={30} color="#000" />
            </TouchableOpacity>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
    img: {
      width: 100,
      height: "100%",
      resizeMode: "contain",
    },
    qtyText: {
      backgroundColor: 'white',
      height: 25,
      width: 25,
      textAlignVertical: "center",
      textAlign: "center",
      borderWidth: 1,
      borderRadius: 5,
      borderColor: 'black',
    },
    qtyContainer: {
      alignItems: "center",
      width: "20%",
      height: 80,
      justifyContent: "space-between",
      alignSelf: "center",
    },
  });

export default CartItem