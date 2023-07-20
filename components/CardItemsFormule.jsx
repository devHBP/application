import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CardItemFormule = ({ option1, option2, option3,  incrementhandler, decrementhandler, image, qty }) => {
    console.log('test', option1, option2, option3)
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{option1.libelle}</Text>
        <Text style={styles.price}>{option1.prix_unitaire} €</Text>
        <Text style={styles.title}>{option2.libelle}</Text>
        <Text style={styles.price}>{option2.prix_formule} €</Text>
        <Text style={styles.title}>{option3.libelle}</Text>
        <Text style={styles.price}>{option3.prix_formule} €</Text>
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
    </View>
  );
};

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
});

export default CardItemFormule;
