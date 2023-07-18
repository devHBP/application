import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { fonts, colors} from '../styles/styles'
import { getProductsByCategory, fetchOneProduct } from '../CallApi/api.js';

const FormuleSandwich = ({navigation}) => {

    const handleBack = () => {
        navigation.navigate('home')
      }

      useEffect(() => {
        const fetchProducts = async () => {
          try {
            const category = 'Sandwichs'; 
            const products = await getProductsByCategory(category);
            products.forEach((product) => {
                console.log(product.libelle, product.prix_unitaire);
              });
          } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des produits:', error);
          }
        };
    
        fetchProducts();

        const getOneProduct = async () => {
            try {
                const productIds = [10, 15]; // Remplacez par l'ID du produit souhaité
                const productPromises = productIds.map((productId) => fetchOneProduct(productId));
                const products = await Promise.all(productPromises);
                    products.forEach((product) => {
                    console.log(product.libelle, product.prix_formule);
                    });
            } catch (error) {
              console.error('Une erreur s\'est produite lors de la récupération du produit:', error);
            }
          };
         getOneProduct()

      }, []);
  return (
    <ScrollView>
        <View>
            <Image
                    source={require('../assets/Formule36.jpg')} 
                    style={{ width: "100%", height: 330, resizeMode:'cover' }}
                />

            <TouchableOpacity  onPress={handleBack} activeOpacity={1} style={{position:'absolute', right:20, top:20, backgroundColor:'white', borderRadius:25}}>
                    <Icon name="keyboard-arrow-left" size={28} color="#000" style={{}}  />
                </TouchableOpacity>
        </View>
        <View style={{padding:30}}>
            <Text style={style.title}>Sandwich</Text>
            <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa sunt accusantium cum veniam sequi molestiae! Qui, perferendis ab magni enim veritatis
            oluptates, quis earum?</Text>
        </View>
        <View style={{backgroundColor:colors.color3}}>
            <Text style={style.choixTitle}>Votre choix de sandwich</Text>
        </View>
    </ScrollView>
    
  )
}
const style = StyleSheet.create({
    title:{
        fontFamily:fonts.font1,
        fontSize:20,
        paddingBottom:10
    },
    choixTitle:{
        textAlign:'center',
        fontSize:20,
        padding:10
    }

})
export default FormuleSandwich