import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fonts, colors} from '../styles/styles'
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { Button} from 'react-native-paper'
import { addToCart, addFreeProductToCart} from '../reducers/cartSlice';
import { useSelector, useDispatch } from 'react-redux'
import { style } from '../styles/formules'; 
import { styles } from '../styles/home'; 
import axios from 'axios'
import { checkStockForSingleProduct } from '../CallApi/api';
import FooterProfile from '../components/FooterProfile';
import ModalePageOffre31 from '../components/ModalePageOffre';
import ArrowLeft from '../SVG/ArrowLeft';
import ProductCard from '../components/ProductCard';
import {  API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS } from '@env';
import { getStyle } from '../Fonctions/stylesFormule';
import FastImage from 'react-native-fast-image';
import Check from '../SVG/Check';

const Offre31 = ({navigation}) => {
  
  const [offre31Products, setOffre31ProductNames] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // const [familyProductDetails, setFamilyProductDetails] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  //pensez à mettre toutes les familles
  // const familyProductIds = [1, 2, 3,4,5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17]; 

    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart.cart);

    const handleBack = () => {
        navigation.navigate('home')
      }

      useEffect(() => {
          const fetchData = async () => {
            try {
            const response = await axios.get(`${API_BASE_URL}/getAllProductsClickandCollect`);
          
            const updatedProducts = response.data.map((product) => ({
              ...product,
              qty: 0, 
            }));

            //on conserve cette logique pour filtrer avec "vente a distance"
            const productsOffre = updatedProducts.filter(product => product.offre && product.offre.startsWith("offre31_") && product.vente_a_distance === true);
            // const productsOffre = updatedProducts.filter(product => 
            //   product.offre && 
            //   product.offre.startsWith("offre31_") && 
            //   !product.offre.toLowerCase().includes("pizza")
            //   );            
            setOffre31ProductNames(productsOffre);

          } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des produits:', error);
          }
        };
    
        fetchData();
    }, [])

  //   useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //           const responses = await Promise.all(
  //             familyProductIds.map((id) => getFamilyProductDetails(id))
  //           );

  //           const familleProductDetailsMap = {};
  //           responses.forEach((famille) => {
  //             if (famille) {
  //               familleProductDetailsMap[famille.id] =
  //                 famille.name;
  //             }
  //           });
  //           setFamilyProductDetails(familleProductDetailsMap);
  //           console.log(familleProductDetailsMap)
  //         } catch (error) {
  //           console.error(
  //             "Une erreur s'est produite lors de la récupération des familles de produits:",
  //             error
  //           );
  //         }
  //     };
  
  //     fetchData();
  // }, []);

  useEffect(() => {
    if (selectedProduct) {
      setTotalPrice(selectedProduct.prix_unitaire * 3);  
    }
  }, [selectedProduct]);

  const handleProduct = (product) => {
        if (selectedProduct?.productId === product.productId) {
            setSelectedProduct(null)
            setTotalPrice(0);  

        } else {
          setSelectedProduct(product)
        }
}
      
const handleAcceptOffer = async () => {
   //verifier le stock
try {
  const productStock = await checkStockForSingleProduct(selectedProduct.productId);
  //console.log(productStock)
  const cartQty = cart.reduce((sum, cartItem) => {
    return cartItem.productId === selectedProduct.productId ? sum + cartItem.qty : sum;
  }, 0);
  const remainingStock = productStock[0]?.quantite - cartQty || 0;

  if ( remainingStock >= 4){
    // Ajoutez le produit trois fois
  for (let i = 0; i < 3; i++) {
    dispatch(addToCart({ 
      productId: selectedProduct.productId, 
      libelle: selectedProduct.libelle, 
      image: selectedProduct.image, 
      prix_unitaire: selectedProduct.prix_unitaire, 
      qty: 1 , 
      offre: selectedProduct.offre
    }));
  }
  //le produit gratuit
  dispatch(addFreeProductToCart(selectedProduct));

  Toast.show({
    type: 'success',
    text1: 'Offre 3+1 ajouté au panier',
  });
  }else {
    Toast.show({
      type: 'error',
      position: 'bottom',
      text1: 'Victime de son succès',
      text2: `Quantité maximale: ${productStock[0].quantite}`,
      
    });
  } 

}
catch (error) {
  console.error("Une erreur s'est produite lors de la vérification du stock :", error);

}  
 
};

const handleCart = () => {
  setModalVisible(true);
}
  return (

    <View style={{flex:1}}>
      <View style={{paddingTop:50}}></View>

      <ScrollView>
        <View>
            {/* <Image
                    source={require('../assets/Croissant_offre31.jpg')} 
                    style={{ width: "100%", height: 330, resizeMode:'cover' }}
                /> */}
                  <FastImage
              source={require('../assets/Croissant_offre31.jpg')}
              style={{ width: "100%", height: 330, resizeMode:'cover' }}
             
            />
            <Image
                source={require('../assets/offre31.jpg')} 
                style={ styles.pastilleOffre31}
                />
             <View style={{flexDirection:'row',justifyContent:'space-between', width:"100%" , alignItems:'center', position:'absolute', top:30, paddingHorizontal:30}}>
                    <Text style={style.titleProduct}>Notre offre 3+1</Text>
                    <TouchableOpacity  onPress={handleBack} activeOpacity={1} style={{ backgroundColor:'black', borderRadius:25}}>
                      <ArrowLeft fill="white"/>
                    </TouchableOpacity>
                  </View>
        </View>
        <View style={{paddingHorizontal:30, paddingTop:60, paddingBottom:30}}>
            <Text style={style.title}>3 produits + 1 offert</Text>
            <Text style={styles.texteOffre}>Pour l'achat de 3 produits de cette catégorie, vous aurez droit à 1 produit du même type gratuit</Text>
        </View>
        {/* choix produits*/}
        <View style={{ gap: 10 }}>
          {/* {Object.values(
            offre31Products.reduce((groups, product) => {
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
          ).map((group) => ( */}
       
            <View >
              {/* <Text style={{marginLeft:30, marginVertical:10, color:colors.color1, fontFamily:fonts.font2, fontWeight:"700"}}>{familyProductDetails[group.id_famille_produit]}</Text> */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent:'center' }}>
              {offre31Products.map( (product, index) => (
                
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
                        showPromo={false}
                        ingredients={product.ingredients}
                      />
                      {selectedProduct?.productId === product.productId && <Check color={colors.color9}/>}

                      </View>
                   
                </TouchableOpacity>
                ))}
                 
                </View>
            </View>
         
        </View>
        
        
    </ScrollView>

    <View style={style.menu}>
        <View>
          <View style={style.bandeauFormule}>
          <Text style={{ fontWeight:"bold", color:colors.color1}}>Prix de l'offre</Text>
         <Text style={{  color:colors.color1}}> {totalPrice.toFixed(2)}€</Text>
          </View>
          <View style={style.bandeauFormule}>
            <View style={{flexDirection:'row'}}>
            <Text style={{  color:colors.color1}}>Avec</Text><Image source={require('../assets/sun.jpg')} style={{ width: 50, height: 20, resizeMode:'contain' }}/>
            </View>
         <Text style={{color:colors.color2, fontWeight:"bold"}}> {(totalPrice*0.8).toFixed(2)}€</Text>
          </View>
        </View>
      <Button
                style={style.btn}
                textColor={'white'} 
                // disabled={!selectedSandwich}
                onPress={handleCart}
                >Choisir cette offre</Button>
    </View>
    <FooterProfile />
    <ModalePageOffre31 modalVisible={modalVisible} setModalVisible={setModalVisible} handleAcceptOffer={handleAcceptOffer} selectedProduct={selectedProduct}/>

    </View> 
  )
}

export default Offre31