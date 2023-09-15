import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Switch, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fonts, colors} from '../styles/styles'
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { Button, RadioButton} from 'react-native-paper'
import { addToCart} from '../reducers/cartSlice';
import { useSelector, useDispatch } from 'react-redux'
import { style } from '../styles/formules'; 
import { styles } from '../styles/home'; 
import { getStyle } from '../Fonctions/stylesFormule';
import axios from 'axios'
import { getFamilyProductDetails, checkStockForSingleProduct } from '../CallApi/api';
import FooterProfile from '../components/FooterProfile';
import ArrowLeft from '../SVG/ArrowLeft';
import LinearGradient from 'react-native-linear-gradient';
import ProductCard from '../components/ProductCard';
import {  API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS } from '@env';
import Cloche from '../SVG/Cloche';
import FastImage from 'react-native-fast-image';
import Check from '../SVG/Check';

const Antigaspi = ({navigation}) => {

  const [clickProducts, setclickProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [familyProductDetails, setFamilyProductDetails] = useState({});
  const familyProductIds = [1];  // Mettre toutes les familles


    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart.cart);

    const handleBack = () => {
        navigation.navigate('home')
      }
    
      useEffect(() => {
        //les produits ayant le champ "clickandcollect" à true
        const fetchData = async () => {
            try {
            const response = await axios.get(`${API_BASE_URL}/getAllProductsClickandCollect`);
          
            const updatedProducts = response.data.map((product) => ({
              ...product,
              qty: 0, 

            }));
            //console.log('upd', updatedProducts)
          //produits ayant la valeur "clickandcollect" à true et "antigaspi" à true
          const clickProducts = updatedProducts.filter(product => product.antigaspi === true && product.clickandcollect === true);
          const clickProductNames = clickProducts.map(product => product.libelle)
            //console.log('click product', clickProductNames)
            //stock sup ou egale à 1
            const updatedStockProducts = clickProducts.filter(product => product.stockantigaspi >= 1)
          setclickProducts(updatedStockProducts)

          } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des produits:', error);
          }
        };
    
        fetchData();
    }, [])


    useEffect(() => {
        const fetchData = async () => {
            try {
              const responses = await Promise.all(
                familyProductIds.map((id) => getFamilyProductDetails(id))
              );
              const familleProductDetailsMap = {};
              responses.forEach((famille) => {
                if (famille) {
                  familleProductDetailsMap[famille.id] =
                    famille.name;
                }
              });
              setFamilyProductDetails(familleProductDetailsMap);
            } catch (error) {
              console.error(
                "Une erreur s'est produite lors de la récupération des familles de produits:",
                error
              );
            }
        };
    
        fetchData();
      }, []);
    
    const handleProduct = (product) => {
      if (selectedProduct?.productId === product.productId) {
        setSelectedProduct(null)
      

    } else {
      setSelectedProduct(product)
      
    }
    }

    //verifier le stock ?
    const handleCart = async () => {
      // try{
      //   const productStock = await checkStockForSingleProduct(selectedProduct.productId);
      //   const cartQty = cart.reduce((sum, cartItem) => {
      //     return cartItem.productId === selectedProduct.productId ? sum + cartItem.qty : sum;
      //   }, 0);
      //   const remainingStock = productStock[0]?.quantite - cartQty || 0;

      //   if ( remainingStock > 0) {
           
            // dispatch(addToCart({ productId: selectedProduct.productId, libelle: selectedProduct.libelle, image: selectedProduct.image, prix_unitaire: selectedProduct.prix_unitaire, qty: 1 , offre: selectedProduct.offre}));
            dispatch(addToCart({ productId: selectedProduct.productId, libelle: selectedProduct.libelle, image: selectedProduct.image, prix_unitaire: selectedProduct.prix_unitaire * 0.5, qty: 1 , offre: selectedProduct.offre, antigaspi: true}));

            Toast.show({
              type: 'success',
              text1: 'Produit ajouté au panier',
            });
            
      //     }else {
      //       Toast.show({
      //         type: 'error',
      //         position: 'bottom',
      //         text1: 'Victime de son succès',
      //         text2: `Quantité maximale: ${productStock[0].quantite}`,
              
      //       });
      //     } 
          
         
      // }  catch (error) {
      //   console.error("Une erreur s'est produite lors de la vérification du stock :", error);
      
      // }  
    
}   
  return (
    <View style={{flex:1}}>
      <View style={{paddingTop:50}}></View>

      <ScrollView>
        <View>
            {/* <Image
                    source={require('../assets/antigaspi.jpg')} 
                    style={{ width: "100%", height: 330, resizeMode:'cover' }}
                /> */}
                <FastImage
              source={require('../assets/antigaspi.jpg')}
              style={{ width: "100%", height: 330, resizeMode:'cover' }}
             
            />
          <Image
                source={require('../assets/pastille_antigaspi.png')} 
                style={ {...styles.pastilleOffre31, resizeMode:'contain', width:90, right:20, top:250}}
                />
              
                  <View
                 
                  style={{flexDirection:'row', justifyContent:'space-between', width:"100%", alignItems:'center', position:'absolute', top:0, paddingHorizontal:30, paddingVertical:30}}
                >
                  <Text style={{...style.titleProduct, width:"90%"}}>Notre offre anti-gaspillage</Text>
                  <TouchableOpacity onPress={handleBack} activeOpacity={1} style={{ backgroundColor:'black', borderRadius:25}}>
                    <ArrowLeft fill="white"/>
                  </TouchableOpacity>
                </View>
           
        </View>
        <View style={{paddingHorizontal:30, paddingTop:50}}>
            <Text style={{...style.title, fontSize:19 }}>Sélection Anti-Gaspillage</Text>
            <Text style={styles.texteOffre}>Chaque produit ici joue un rôle vital dans la réduction du gaspillage alimentaire. </Text>
            <Text style={styles.texteOffre}>Dépêchez-vous, il n'y en aura pas pour tout le monde.</Text>
            <Text style={styles.texteOffre}>Faites un choix conscient et 
            contribuez à un futur plus durable.</Text>
        </View>
        {/* choix produits*/}
        <View>
      
        <ScrollView>
    <View style={{ gap: 20 , marginBottom:100}}>
      {Object.values(
        clickProducts.reduce((groups, product) => {
          const { id_famille_produit } = product;
          if (!groups[id_famille_produit]) {
            groups[id_famille_produit] = {
              id_famille_produit: id_famille_produit,
              products: [],
            };
          }
          groups[id_famille_produit].products.push(product);
          return groups;
        }, {})
      ).map((group) => (
        <View key={group.id_famille_produit}>
          {/* <Text style={{margin:30}}>{group.id_famille_produit}</Text> */}
          <Text style={{marginLeft:30, marginVertical:10, color:colors.color1, fontFamily:fonts.font2, fontWeight:"700"}}>{familyProductDetails[group.id_famille_produit]}</Text>
          <ScrollView >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent:'center' }}>
            {group.products.map((product, index) => (
                 <TouchableOpacity  key={index}
                 onPress={() => handleProduct(product)} activeOpacity={0.8}>
               <View style={StyleSheet.flatten([getStyle(selectedProduct, product), { width:170, marginHorizontal:5, marginVertical:10 }])} key={index}>

                      <ProductCard
                        libelle={product.libelle}
                        key={product.productId}
                        id={product.productId}
                        index={index}
                        image={product.image}
                        prix={product.prix_unitaire}
                        prixSUN={product.prix_remise_collaborateur}
                        qty={product.qty}
                        stock={product.stock}
                        offre={product.offre}
                        showButtons={false} 
                        ingredients={product.ingredients}
                      />
                      {selectedProduct?.productId === product.productId && <Check color={colors.color9}/>}

                      <View style={styles.stockantigaspi}>
                        <Cloche />
                        <Text style={styles.textestockantigaspi}>{product.stockantigaspi} en stock !</Text>
                      </View>
                      </View>
                
              </TouchableOpacity>
            ))}
            </View>
          </ScrollView>
          
        </View>
      ))}
    </View>
  </ScrollView>
      </View>
        
        
    </ScrollView>

    <View style={style.menu}>
        <View>
          <View style={style.bandeauFormule}>
          <Text style={{ fontWeight: "bold", color:colors.color1}}>Prix du produit</Text>
        <Text style={{ color:colors.color1}}>{selectedProduct ? (selectedProduct.prix_unitaire * 0.5).toFixed(2) : 0} €</Text>

          </View>
          {/* <View style={style.bandeauFormule}>
            <View style={{flexDirection:'row'}}>
            <Text>Avec</Text><Image source={require('../assets/sun.jpg')} style={{ width: 50, height: 20, resizeMode:'contain' }}/>
            </View>
         <Text style={{color:colors.color2, fontWeight:"bold"}}>{selectedProduct ?  Number(selectedProduct.prix_remise_collaborateur) : 0} €</Text>
          </View>*/}
        </View> 
      <Button
                style={style.btn}
                textColor={'white'} 
                disabled={!selectedProduct}
                onPress={handleCart}
                >Choisir ce produit</Button>
                
    </View>
    <FooterProfile />
    </View> 
  )
}

export default Antigaspi