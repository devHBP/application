import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Svg, { Path } from 'react-native-svg';
import { colors} from '../styles/styles'

const CardItemFormule = ({ option1, option2, option3,  incrementhandler, decrementhandler, image, qty }) => {
  return (
    <View style={styles.container}>
      {/* <Image source={image} style={styles.image} /> */}
      <View style={styles.content}>
        {option1 && <Text style={styles.title}>{option1.libelle}</Text>}
        {option1 &&<Text style={styles.price}>{option1.prix_unitaire} €</Text>}
        {option2 &&<Text style={styles.title}>{option2.libelle}</Text>}
        {option2 &&<Text style={styles.price}>{option2.prix_formule} €</Text>}
        {option3 &&<Text style={styles.title}>{option3.libelle}</Text>}
        {option3 &&<Text style={styles.price}>{option3.prix_formule} €</Text>}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    padding: 10,
    width:300,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
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
  },
  container_gray:{
    backgroundColor:'lightgray',
    width:30,
     height:25,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
});

export default CardItemFormule;
