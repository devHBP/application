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
import { getFamilyProductDetails, checkStockForSingleProduct } from '../CallApi/api';
import FooterProfile from '../components/FooterProfile';
import ArrowLeft from '../SVG/ArrowLeft';
import LinearGradient from 'react-native-linear-gradient';



const Solanid = ({navigation}) => {

  let API_BASE_URL = 'http://127.0.0.1:8080';

  if (Platform.OS === 'android') {
    if (__DEV__) {
        API_BASE_URL = 'http://10.0.2.2:8080'; // Adresse pour l'émulateur Android en mode développement
    } 
}

  
  const [solanidProducts, setSolanidProductNames] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [familyProductDetails, setFamilyProductDetails] = useState({});
  const familyProductIds = [10, 13];  // Remplacez cela par vos réels ID de famille de produits


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
            const response = await axios.get(`${API_BASE_URL}/getAllProducts`);
          
            const updatedProducts = response.data.map((product) => ({
              ...product,
              qty: 0, 

            }));
            //console.log('upd', updatedProducts)
          //produits offre 3+1
          const solanidProducts = updatedProducts.filter(product => product.reference_fournisseur === "Solanid");
          const solanidProductNames = solanidProducts.map(product => product.libelle)
          //console.log(solanidProductNames)

    
          setSolanidProductNames(solanidProducts)

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
              //console.log('responses', responses)
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
        setSelectedProduct(product)
    }

    const handleCart = async () => {
      try{
        const productStock = await checkStockForSingleProduct(selectedProduct.productId);
        const cartQty = cart.reduce((sum, cartItem) => {
          return cartItem.productId === selectedProduct.productId ? sum + cartItem.qty : sum;
        }, 0);
        console.log('qty in cart', cartQty)
        const remainingStock = productStock[0]?.quantite - cartQty || 0;

        console.log('remain', remainingStock)
        if ( remainingStock > 0) {
           
            dispatch(addToCart({ productId: selectedProduct.productId, libelle: selectedProduct.libelle, image: selectedProduct.image, prix_unitaire: selectedProduct.prix_unitaire, qty: 1 , offre: selectedProduct.offre}));
           
            Toast.show({
              type: 'success',
              text1: 'Produit ajouté au panier',
            });
            
          }else {
            Toast.show({
              type: 'error',
              position: 'bottom',
              text1: 'Victime de son succès',
              text2: `Quantité maximale: ${productStock[0].quantite}`,
              
            });
          } 
          
         
      }  catch (error) {
        console.error("Une erreur s'est produite lors de la vérification du stock :", error);
      
      }  
    
}   
  return (
    <View style={{flex:1}}>
      <ScrollView>
        <View>
            <Image
                    source={require('../assets/fond_halles.jpg')} 
                    style={{ width: "100%", height: 330, resizeMode:'cover' }}
                />
            <Image
                source={require('../assets/halles_solanid.png')} 
                style={{ ...styles.pastilleOffre31, transform: [{rotate: '15deg'}]}}
                />
              
                {/* <View style={{flexDirection:'row',justifyContent:'space-between', width:"100%" , alignItems:'center', position:'absolute', top:0, paddingHorizontal:30,paddingVertical:30,  backgroundColor:'pink'}}>
                    <Text style={{...style.titleProduct, width:"90%"}}>Les produits des Halles Solanid</Text>
                    <TouchableOpacity  onPress={handleBack} activeOpacity={1} style={{ backgroundColor:'black', borderRadius:25}}>
                      <ArrowLeft fill="white"/>
                    </TouchableOpacity>
                  </View> */}
                  <LinearGradient
                  colors={['#273545', 'transparent']}
                  style={{flexDirection:'row', justifyContent:'space-between', width:"100%", alignItems:'center', position:'absolute', top:0, paddingHorizontal:30, paddingVertical:30}}
                >
                  <Text style={{...style.titleProduct, width:"90%"}}>Les produits des Halles Solanid</Text>
                  <TouchableOpacity onPress={handleBack} activeOpacity={1} style={{ backgroundColor:'black', borderRadius:25}}>
                    <ArrowLeft fill="white"/>
                  </TouchableOpacity>
                </LinearGradient>
           
        </View>
        <View style={{paddingHorizontal:30, paddingTop:50}}>
            <Text style={style.title}>Les halles Solanid</Text>
            <Text style={styles.texteOffre}>Texte pour les produits les halles Solanid</Text>
        </View>
        {/* choix produits*/}
        <View>
      
        <ScrollView>
    <View style={{ gap: 20 }}>
      {Object.values(
        solanidProducts.reduce((groups, product) => {
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
          <Text style={{marginLeft:30, marginVertical:10}}>{familyProductDetails[group.id_famille_produit]}</Text>
          <ScrollView >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent:'center' }}>
            {group.products.map((product) => (
              <View key={product.libelle} style={{ gap: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                <Image
                  source={{ uri: `${API_BASE_URL}/${product.image}` }}
                  style={style.sandwichImage}
                />
                <Text>{product.libelle}</Text>
                <TouchableOpacity
                  style={[
                    style.checkButton,
                    selectedProduct?.productId === product.productId && { backgroundColor: 'white' } 
                  ]}
                  onPress={() => handleProduct(product)}
                >
                  {selectedProduct?.productId === product.productId && <View style={style.checkInnerCircle} />}
                </TouchableOpacity>
              </View>
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
          <Text style={{ fontWeight: "bold"}}>Prix du produit</Text>
         <Text>{selectedProduct ? selectedProduct.prix_unitaire : 0} €</Text>
          </View>
          <View style={style.bandeauFormule}>
            <View style={{flexDirection:'row'}}>
            <Text>Avec</Text><Image source={require('../assets/SUN.png')} style={{ width: 50, height: 20, resizeMode:'contain' }}/>
            </View>
         <Text style={{color:colors.color2, fontWeight:"bold"}}>{selectedProduct ?  Number(selectedProduct.prix_remise_collaborateur) : 0} €</Text>
          </View>
        </View>
      <Button
                style={style.btn}
                textColor={'white'} 
                disabled={!selectedProduct}
                onPress={handleCart}
                >Choisir cet produit</Button>
                
    </View>
    <FooterProfile />
    </View> 
  )
}

export default Solanid