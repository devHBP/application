import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts} from '../styles/styles'

const CardItemFormule = ({ option1, option2, option3,  incrementhandler, decrementhandler, image, qty , title, removehandler}) => {
  return (
    <View style={styles.container}>
      {/* <Image source={image} style={styles.image} /> */}
      

      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
      <Text style={styles.titleLibelle}>{title}</Text>
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

        <TouchableOpacity onPress={removehandler} style={{...styles.container_gray, backgroundColor:'transparent'}}>
          {/* <Icon name="add-circle" size={25} color="#000" /> */}
          <Svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1216 1312">
            <Path fill='lightgray' d="M1202 1066q0 40-28 68l-136 136q-28 28-68 28t-68-28L608 976l-294 294q-28 28-68 28t-68-28L42 1134q-28-28-28-68t28-68l294-294L42 410q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294l294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68L880 704l294 294q28 28 28 68z"/>
          </Svg>

        </TouchableOpacity>
      </View>
      </View>
      
      <View style={styles.content}>
        
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          {option1 && <Text style={styles.title}>{qty}x {option1.libelle}</Text>}
          {option1 &&<Text style={styles.price}>{option1.prix_unitaire} €</Text>}
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          {option2 &&<Text style={{...styles.title, color:colors.color9}}>{qty}x {option2.libelle}</Text>}
          {option2 &&<Text style={{...styles.price, color:colors.color9}}>+{option2.prix_formule} €</Text>}
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          {option3 &&<Text style={{...styles.title, color:colors.color9}}>{qty}x {option3.libelle}</Text>}
          {option3 &&<Text style={{...styles.price, color:colors.color9}}>+{option3.prix_formule} €</Text>}
        </View>
        
        
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent:'center',
    paddingVertical:20,
        paddingHorizontal:10,
    width:340,
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
    width:"100%",
    marginTop:30
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
    gap:5,
  
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
  titleLibelle:{
    color:colors.color2,
    fontFamily:fonts.font2,
    fontWeight:"700"
  }
});

export default CardItemFormule;
