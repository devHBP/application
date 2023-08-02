import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Switch, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { fonts, colors} from '../styles/styles'
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { Button, RadioButton} from 'react-native-paper'
import { addToCart} from '../reducers/cartSlice';
import { useSelector, useDispatch } from 'react-redux'
import { style } from '../styles/formules'; 
import { styles } from '../styles/home'; 
import axios from 'axios'

const Offre31 = ({navigation}) => {

  const baseUrl = 'http://127.0.0.1:8080';

  const [offre31ProductNames, setoffre31ProductNames] = useState([])

    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart.cart);
    //console.log('cart', cart)

    const handleBack = () => {
        navigation.navigate('home')
      }

      useEffect(() => {
        //les produits ayant une offre 3+1
        const fetchData = async () => {
            try {
            const response = await axios.get('http://127.0.0.1:8080/getAllProducts');
          
            const updatedProducts = response.data.map((product) => ({
              ...product,
              qty: 0, 

            }));
            console.log('upd', updatedProducts)
          //produits offre 3+1
          const productsOffre = updatedProducts.filter(product => product.offre && product.offre.startsWith("offre31_"))
          const productsOffreNames = productsOffre.map(product => product.libelle)
          console.log(productsOffreNames)

          const sortedProducts = productsOffre.sort((a, b) =>
          a.id_famille_produit - (b.id_famille_produit)
        );
    
        const productsByFamily = {};
        sortedProducts.forEach((product) => {
          const { id_famille_produit, libelle } = product;
          if (!productsByFamily[id_famille_produit]) {
            productsByFamily[id_famille_produit] = {
              title: id_famille_produit,
              products: [],
            };
          }
          productsByFamily[id_famille_produit].products.push({ libelle });
        });

        console.log('productsByFamily', productsByFamily);
          setoffre31ProductNames(productsOffreNames)

          } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des produits:', error);
          }
        };
    
        fetchData();
    }, [])
      
  return (
    <View style={{flex:1}}>
      <ScrollView>
        <View>
            <Image
                    source={require('../assets/Croissant_offre31.jpg')} 
                    style={{ width: "100%", height: 330, resizeMode:'cover' }}
                />
            <Image
                source={require('../assets/offre31.png')} 
                style={ styles.pastilleOffre31}
                />
            <TouchableOpacity  onPress={handleBack} activeOpacity={1} style={{position:'absolute', right:20, top:20, backgroundColor:'white', borderRadius:25}}>
                    <Icon name="keyboard-arrow-left" size={40} color="#000" style={{}}  />
                </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal:30, paddingVertical:60}}>
            <Text style={style.title}>3 produits + 1 offert</Text>
            <Text style={styles.texteOffre}>Pour l'achat de 3 produits de cette catégorie, vous aurez droit à 1 produit du même type gratuit</Text>
        </View>
        {/* choix produits*/}
        {Object.values(offre31ProductNames).map((family) => (
          <View key={family.title}>
            <Text>{family.title}</Text>
            <ScrollView horizontal>
            {family.products && family.products.length > 0 ? (
              family.products.map((product) => (
                <View key={product.libelle} style={{ padding: 10 }}>
                  <Text>{product.libelle}</Text>
                  {/* ... (Display other information about the product if needed) */}
                </View>
              ))
            ) : (
              <Text>No products in this family</Text>
            )}
            </ScrollView>
          </View>
        ))}
        
        
    </ScrollView>

    <View style={style.menu}>
        <View>
          <View style={style.bandeauFormule}>
          <Text style={{ fontWeight:'bold'}}>Prix de la formule</Text>
         <Text> €</Text>
          </View>
          <View style={style.bandeauFormule}>
            <View style={{flexDirection:'row'}}>
            <Text>Avec</Text><Image source={require('../assets/SUN.png')} style={{ width: 50, height: 20, resizeMode:'contain' }}/>
            </View>
         <Text style={{color:colors.color2, fontWeight:'bold'}}> €</Text>
          </View>
        </View>
      <Button
                style={style.btn}
                textColor={'white'} 
                // disabled={!selectedSandwich}
                >Choisir cette offre</Button>
    </View>
    </View> 
  )
}

export default Offre31