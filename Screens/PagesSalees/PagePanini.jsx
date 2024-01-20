import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState} from 'react'
import { style } from '../../styles/formules'; 
import { styles } from '../../styles/produits'
import axios from 'axios'
import { fonts, colors} from '../../styles/styles'
import { Button} from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import FooterProfile from '../../components/FooterProfile';
import { addToCart, decrementOrRemoveFromCart } from '../../reducers/cartSlice';
import ArrowLeft from '../../SVG/ArrowLeft';
//call API
import { checkStockForSingleProduct } from '../../CallApi/api.js';
import ProductCard from '../../components/ProductCard';
import { API_BASE_URL } from '../../config';
// import {  API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS } from '@env';
import FastImage from 'react-native-fast-image';
import { getStyle } from '../../Fonctions/stylesFormule';


const PagePanini = ({navigation}) => {


    const [products, setProducts] = useState([]); 
    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [stock, setStock] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [productCount, setProductCount] = useState(0);

    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart.cart);
   
    
    const getProductQtyInCart = (productId) => {
      const productInCart = cart.find(item => item.productId === productId);
      return productInCart ? productInCart.qty : 0;
    };
    useEffect(() => {
      const totalPrice = products.reduce((acc, product) => {
        const qtyInCart = getProductQtyInCart(product.productId); 
        return acc + (qtyInCart * product.prix_unitaire);
      }, 0);
      setTotalPrice(totalPrice);
    }, [products, cart]);
    
    useEffect(() => {
      const totalCount = cart.reduce((acc, product) => acc + product.qty, 0);
      setProductCount(totalCount);
    }, [cart]);

    useEffect(() => {
      const fetchStock = async () => {
        const updatedStock = []; 

        for (const product of products) {

          //sous forme d'un seul tableau
          //[{"productId": 45, "quantite": 50}, {"productId": 46, "quantite": 30}, {"productId": 47, "quantite": 30}, {"productId": 48, "quantite": 30}, 
          //{"productId": 49, "quantite": 30}, {"productId": 50, "quantite": 30}, {"productId": 51, "quantite": 30}]
          const [productStock] = await checkStockForSingleProduct(product.productId); 
          updatedStock.push(productStock); 
        }

        setStock(updatedStock);
      };

      if (products.length > 0) {
        fetchStock();
      }
    }, [products]);


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
       
      
        const products = updatedProducts.filter(product => product.categorie === "Paninis")
        setProducts(products)
          
          } catch (error) {
            console.error('Une erreur s\'est produite, error products :', error);
          }
        };
        fetchData(); 
      }, []);
    

    const openFormulePanini = () => {
      navigation.navigate('formulepanini')
  }
  const handleCart = () => {
    navigation.navigate('panier')
  }


    //pour capitaliser la premiere lettre
    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const capitalizeIngredients = (ingredients) => {
      return ingredients.split(', ').map(capitalizeFirstLetter).join(',  ');
  }

  return (
    <View style={{flex:1}} >
      <View style={{paddingTop:50}}></View>
       <ScrollView>
        <View>
            {/* <Image
                    source={require('../../assets/panini.jpg')} 
                    style={{ width: "100%", height: 330, resizeMode:'cover' }}
                /> */}
            <FastImage
              source={require('../../assets/panini.jpg')}
              style={{ width: "100%", height: 330, resizeMode:'cover' }}
            />
             <Text style={styles.titleProduct}>Panini</Text>
             <TouchableOpacity  onPress={handleBack} activeOpacity={1} style={{position:'absolute', right:20, top:20, backgroundColor:'black', borderRadius:25}}>
                    <ArrowLeft fill="white"/>
              </TouchableOpacity>
        </View>
        

        {/* les options */}
        <View style={{marginHorizontal:30, marginVertical:20}}>
            <Text style={styles.titleOptions}>Les options</Text>
            <ScrollView horizontal={true} style={{marginVertical:20}}>
            {products.map((product, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedProduct(product)} style={{marginVertical:10}}>
            
                <View style={getStyle(selectedProduct, product)} key={index}>
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
                        showPromo={false}
                        showButtons={true}
                        ingredients={product.ingredients}
                      />
                    </View>
                </TouchableOpacity>
            ))}
            </ScrollView >
            <Text style={styles.descriptionProduit}>
          {selectedProduct ? selectedProduct.descriptionProduit : "Sélectionnez un produit pour avoir sa description"}
          </Text>        
          </View>

        {/* les ingredients */}
        <View style={{marginHorizontal:30}}>
            <Text style={styles.titleOptions}>Ingrédients</Text>
            {
              selectedProduct && 
              <Text style={styles.libelle}>{selectedProduct.libelle}</Text> 
            } 
            {/* {selectedProduct && selectedProduct.ingredients && ( */}
        <View style={styles.ingredients}>
        <Text style={styles.listeIngredients}>
        {selectedProduct ? capitalizeIngredients(selectedProduct.ingredients) : "Veuillez sélectionner un produit pour voir ses ingrédients."}
          {/* {selectedProduct ? selectedProduct.ingredients : "Veuillez sélectionner un produit pour voir ses ingrédients."} */}
        </Text>
      </View>

            
            {/* {selectedProduct && <Text>{selectedProduct.description}</Text>} */}
            {
                selectedProduct && 
                selectedProduct.description && 
                selectedProduct.description.toLowerCase().includes('halal') && 
                <View style={styles.description}>
                    <Image
                    source={require('../../assets/halal.png')}
                    style={{ width: 42, height: 42, resizeMode:'cover' }}
                    />
                    <Text style={{color: colors.color1}}>Ce produit est certifié Halal !</Text>
                </View>
            }
            {
                selectedProduct && 
                selectedProduct.description && 
                selectedProduct.description.toLowerCase().includes('vegan') && 
                <View style={styles.description}>
                    <Image
                    source={require('../../assets/vegan.png')}
                    style={{ width: 42, height: 42, resizeMode:'cover' }}
                    />
                    <Text style={{color: colors.color1}}>Ce produit est vegan !</Text>
                </View>
            }

        
        </View>
        <View>
          <View style={styles.bandeau}>
            <Text style={styles.textBandeau}>Faites vous plaisir !</Text>
          </View>
          <View style={{margin:30, flexDirection:'column', justifyContent:'flex-start', gap:20}}>
            <Text style={styles.texteFormule}>Choisissez une formule pour avoir un dessert et/ou une boisson</Text>
            <TouchableOpacity style={{marginRight:10}} onPress={openFormulePanini} activeOpacity={0.8}>
            <View style={{width:320}}> 
                    {/* <Image
                            source={require('../../assets/Formule55.jpg')} 
                            style={{ resizeMode:'cover',  width: 320, height: 200, }}
                            /> */}
                            <FastImage
              source={require('../../assets/Formule55.jpg')}
              style={{ resizeMode:'cover',  width: 320, height: 200, }}
              />
                    <View style={styles.cardTitle}>
                        <Text style={styles.titleFormule}>Formule Panini</Text>
                        <Text style={styles.textFormule}>Un panini, un dessert et une boisson</Text>
                    </View>
              </View>
                </TouchableOpacity>
          </View>
        </View>
       
        </ScrollView>

        {/* redirection vers formule*/}  
        <View style={style.menu}>
                <View >
                <View style={style.bandeauFormule}>
                <Text style={{ fontWeight:"bold", color:colors.color1}}>{productCount < 2 ? 'Prix du produit' : 'Prix des produits'}</Text>
               <Text style={{color:colors.color1}}>{totalPrice.toFixed(2)} €</Text>
                </View>
                <View style={style.bandeauFormule}>
                    <View style={{flexDirection:'row'}}>
                    <Text style={{color:colors.color1}}>Avec</Text><Image source={require('../../assets/sun.jpg')} style={{ width: 50, height: 20, resizeMode:'contain' }}/>
                    </View>
               <Text style={{color:colors.color2, fontWeight:"bold"}}>{(totalPrice*0.8).toFixed(2)}€</Text>
                </View>
                </View>
            <Button
                        style={style.btn}
                        textColor={'white'} 
                        // disabled={!selectedProduct}
                        onPress={handleCart}
                        >Allez au panier</Button>
            </View>
    <FooterProfile />
    </View>
  )
}

export default PagePanini