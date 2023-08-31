import { View, Text, TouchableOpacity,ScrollView, TextInput, Modal, StyleSheet, Linking, Image, Platform } from 'react-native'
import React, { useState, useEffect, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'
import { updateCart, addToCart, addFreeProductToCart, updateCartTotal } from '../reducers/cartSlice';
import { logoutUser} from '../reducers/authSlice';
import { setNumeroCommande, setProducts, setOrderId } from '../reducers/orderSlice';
import CartItem from '../components/CardItems';
import CardItemFormule from '../components/CardItemsFormule';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { WebView } from 'react-native-webview';
import { checkStockFormule, checkStockForSingleProduct } from '../CallApi/api';
import FooterProfile from '../components/FooterProfile';
import ModaleOffre31 from '../components/ModaleOffre31';
import { fonts, colors} from '../styles/styles'
import StorePicker from '../components/StorePicker';
import CustomDatePicker from '../components/CustomDatePicker';
import { style } from '../styles/formules'; 
import ArrowLeft from '../SVG/ArrowLeft';
import LottieView from 'lottie-react-native';
import {  API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS } from '@env';


import { getFamilyOfProduct } from '../CallApi/api';

//fonctions
import { decrementhandler, removehandler } from '../Fonctions/fonctions'

const Panier = ({navigation}) => {

 //pour les test
 if (__DEV__) {
  if (Platform.OS === 'android') {
      API_BASE_URL = API_BASE_URL_ANDROID;
  } else if (Platform.OS === 'ios') {
      API_BASE_URL = API_BASE_URL_IOS;  
  }
}
  

  const dispatch = useDispatch()
  const webViewRef = useRef(null);
  const [promoCode, setPromoCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [checkoutSession, setCheckoutSession] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [productFamilies, setProductFamilies] = useState({});
  const [ paiement, setPaiement] = useState('online')
  const [loading, setLoading] = useState(false);

  const cart = useSelector((state) => state.cart.cart); //ou cartItems
  const user = useSelector((state) => state.auth.user)
  const selectedStore = useSelector(state => state.auth.selectedStore);
   const cartTotal = useSelector((state) => state.cart.cartTotal)

  const selectedDateString = useSelector((state) => state.cart.date)
  const selectedTime = useSelector((state) => state.cart.time)
  const numero_commande = useSelector((state) => state.order.numero_commande)

  let totalPrice = Number((cart.reduce((total, item) => {
    const prix = item.prix || item.prix_unitaire; // Utilisez la propriété "prix" si elle existe, sinon utilisez "prix_unitaire"
    return total + item.qty * prix;
  }, 0)).toFixed(2));
  

  const totalQuantity = cart.reduce((total, item) => total + item.qty, 0)


  const aggregatedCartItems = cart.reduce((accumulator, currentItem) => {

     // Vérifiez si le produit a une offre avant de continuer
     if (!currentItem.offre ){
      return accumulator; // Si le produit n'a pas d'offre, ignorez-le simplement
    }
    
    // Recherchez l'article dans l'accumulateur par idProduct
    const existingItem = accumulator.find(
      item => item.productId === currentItem.productId
    );

    if (existingItem) {
      // Si l'article existe déjà dans l'accumulateur, ajoutez simplement la quantité
      existingItem.qty += currentItem.qty;

      // Si l'élément actuel est gratuit, ajoutez une note à l'élément existant
      if (currentItem.isFree) {
        existingItem.isFree = true;
        existingItem.freeCount += currentItem.qty; // ajoutez la quantité de produits gratuits

      }

      // Conservez le nom de l'offre du produit (vous pouvez ajouter d'autres logiques si nécessaire)
      existingItem.offre = currentItem.offre;
    } else {
      // Sinon, ajoutez un nouvel élément à l'accumulateur
      accumulator.push({...currentItem,
        freeCount: currentItem.isFree ? currentItem.qty : 0 // Initialisez freeCount
      }); // Utilisez la déstructuration pour éviter les références croisées
    }
  
    return accumulator;
  }, []);  

  const handleBack = () => {
    navigation.navigate('home');
  };

  const handleAcceptOffer = () => {
    const lastProductAdded = cart[cart.length - 1];
  const freeProduct = {
    ...lastProductAdded,
    qty: 1,
    prix_unitaire: 0
  };
    dispatch(addFreeProductToCart(freeProduct));
  };

const incrementhandler = async (productIds, offre) => {
  const id = Array.isArray(productIds) ? productIds[0] : productIds; // Si productIds est un tableau, prenez le premier élément. Sinon, prenez productIds tel quel.

  // const productInCart = cart.find((item) => item.productId === id);
  const productInCart = cart.find((item) => Array.isArray(item.productIds) ? item.productIds[0] === id : item.productId === id);

  try {
    if (productInCart.type === 'formule') {
      const stocks = await checkStockFormule(productInCart.productIds);

      for (let stock of stocks) {
        if (stock[0].quantite <= productInCart.qty) {
          return Toast.show({
            type: 'error',
            text1: `Victime de son succès`,
            text2: 'Plus de stock disponible',
          });
        }
      }

      productInCart.qty = 1;
      dispatch(addToCart(productInCart));
    } else {
      const stockAvailable = await checkStockForSingleProduct(id);

      const remainingStock = stockAvailable[0].quantite - (productInCart ? productInCart.qty : 0);

      if (stockAvailable.length > 0 && remainingStock > 0) {
        dispatch(
          addToCart({
            productId: id,
            libelle: productInCart.libelle,
            image: productInCart.image,
            prix_unitaire: productInCart.prix,
            qty: 1,
            offre: offre,
          })
        );

        if (offre && offre.startsWith('offre31')) {
          const updatedCart = [...cart, { productId: id, libelle: productInCart.libelle, image: productInCart.image, prix_unitaire: productInCart.prix, qty: 1, offre: offre }];
          const sameOfferProducts = updatedCart.filter((item) => item.offre === offre);
          const totalQuantity = sameOfferProducts.reduce((total, product) => total + product.qty, 0);

          if (totalQuantity === 3 || (totalQuantity - 3) % 4 === 0) {
            setModalVisible(true);
          }
        }
      } else {
        return Toast.show({
          type: 'error',
          text1: `Victime de son succès`,
          text2: `Quantité maximale: ${stockAvailable[0].quantite}`,
        });
      }
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de l'incrémentation du stock :", error);
  }
};

// family produits - si une formules = famille "Formules"
useEffect(() => {
  const fetchFamilies = async () => {
    const productIds = cart.map(item => {
      //formule separement
      if (item.type === 'formule') {
        return null;  
      }
      return item.productId;
    }).filter(id => id !== null); 

    const fetchedFamilies = await Promise.all(productIds.map(async id => {
      const data = await getFamilyOfProduct(id);
      return {
        productId: id,
        family: data.FamillyProduct.nom_famille_produit
      };
    }));

    const familiesObject = fetchedFamilies.reduce((acc, item) => {
      acc[item.productId] = item.family;
      return acc;
    }, {});

    // famille "Formules" pour les formules
    cart.forEach(item => {
      if (item.type === 'formule') {
        familiesObject[item.productId] = "Formules";
      }
    });

    setProductFamilies(familiesObject);
  };

  fetchFamilies();
}, [cart]);


  const handleConfirm = async (newPaiement) => {

    if (user.role === 'client' ) {
      return Toast.show({
        type: 'error',
        text1: `Le Click and collect n'est pas disponible`,
        text2: `Nous vous préviendrons très vite par email` 
      });
    }
   
    setPaiement(newPaiement)
    const token = await AsyncStorage.getItem('userToken');

    axios.get(`${API_BASE_URL}/verifyToken`, {
      headers: {
          'x-access-token': token
      }
    })
    .then(response => {
   
    if (response.data.auth) {

      dispatch(setProducts(cart));

      //formater la date chaine de caractère -> format ISO
      // à l'heure 0:00
      const [day, month, year] = selectedDateString.split("/").map(Number);
      const formattedDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
      const dateForDatabase = formattedDate.toISOString();

      //prix Sun si collaborateur
      totalPrice = user.role === 'SUNcollaborateur' ? (totalPrice * 0.80).toFixed(2) : totalPrice;

      //paiement supérieur à 50cts
      if (totalPrice < 0.50) {
        //console.log('en dessous de 1euros')
        return Toast.show({
          type: 'error',
          text1: `Montant inférieur à 50 centimes`,
          text2: `N'hésitez pas à ajouter des articles ` 
        });
       
    }
      
      const orderData = {
        userRole: user.role, 
        firstname_client: user.firstname,
        lastname_client: user.lastname,
        prix_total: totalPrice,
        date: dateForDatabase, 
        heure: selectedTime,
        userId: user.userId,
        storeId: selectedStore.storeId,
        slotId: null,
        promotionId: null,
        paymentMethod: newPaiement,
        //plus utilisé
        //transforme mon array de productsIds en chaine de caractères
        //productIdsString: cartProductId.join(",")

        //plus utilisé
        //products: cartItems.map(item => ({ productId: item.productId, quantity: item.qty })) 

        products: (() => {

  
                    let products = [];
                    let processedProductIds = []; // Pour garder une trace des IDs de produits déjà traités

                    // Traitement des produits fusionnés avec des offres (3+1)
                    aggregatedCartItems.forEach(item => {
                      const productData = {
                        productId: item.productId,
                        quantity: item.qty
                      };

                      if (item.isFree) {
                        productData.offre = item.offre;
                      }

                      products.push(productData);
                      processedProductIds.push(item.productId); // Ajoutez l'ID du produit à la liste des produits traités
                    });

                    cart.forEach(item => {
                      // Si l'ID du produit a déjà été traité, sautez ce produit
                      //pour eviter les doublons dans le panier
                      if (processedProductIds.includes(item.productId)) return;

                    // Traitement des produits de type 'formule'
                    if (item.type === 'formule') {
                      ['option1', 'option2', 'option3'].forEach(option => {
                        if (item[option]) {
                          products.push({
                            productId: item[option].productId,
                            quantity: item.qty,
                            formule: item.libelle,
                            category: item[option].categorie
                          });
                        }
                      });
                    } 
                    // Traitement des produits réguliers (qui n'ont pas d'offre ou dont l'offre n'a pas été utilisée)
                    else if (!item.offre || (item.offre && item.qty < 4)) {
                      if (item.productId) { 
                        products.push({
                          productId: item.productId,
                          quantity: item.qty
                        });
                      }
                    }
                  });

                  return products;

                        })()
      };
    //console.log('orderdata', orderData) 

      const createOrder = async () => {
        //console.log(dateForDatabase) 
        try {
          const response =  await axios.post(`${API_BASE_URL}/createorder`, orderData);
          const numero_commande = response.data.numero_commande
          dispatch(setNumeroCommande(numero_commande));
          let userRole = user.role

          setOrderInfo({
            userRole,
            cart,
            user,
            selectedStore,
            totalPrice,
            totalQuantity,
            dateForDatabase, //(en format ISO))
            paiement
          });

          //console.log('response createOrder', response.data)
          const orderId = response.data.orderId;
          dispatch(setOrderId(orderId)); 
          //console.log('resp data', response.data)
          return response.data;
        } catch (error) {
          console.error(error);
          throw new Error('Erreur lors de la création de la commande');
        }
      }
     createOrder()
     //console.log('commande créé')
      } else {
          console.log('erreur ici', error)
      }
    })
    .catch(error => {
    //console.log('erreur', error)
    return Toast.show({
         type: 'error',
         text1: 'Date de livraison manquante',
         text2: 'Veuillez renseigner une date'
       });
    
    });  
}

// Vérifier l'état du paiement
const checkPaymentStatus = async () => {
  const interval = setInterval(async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paiementStatus?sessionId=${sessionId}`);
    const { status, transactionId, method } = response.data;
    c//onsole.log('response PaiementStatus', response.data)
     // retour : response data {"status": "paid", "transactionId": "pi_3NOFjcGnFAjiWNhK0KP6l8Nl"}
   
    if (status === 'paid') {
      
      clearInterval(interval);
      const paymentData = {
        method,
        status,
        transactionId
      };
  
      const updateResponse = await axios.post(`${API_BASE_URL}/createPaiement`, paymentData);
      //console.log('Response createPaiement:', updateResponse.data);
      const paymentId = updateResponse.data.paymentId

      const updateData = { numero_commande, status, paymentId}

      const response = await axios.post(`${API_BASE_URL}/updateOrder`, updateData);
      //console.log('response updateOrder', response.data)
      navigation.navigate('success')
    }
    
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'état du paiement :', error);
    // navigation.navigate('echec')
  }
}, 5000)
};

  

 //Promotion
  const handleApplyDiscount = async () => {

    axios.get(`${API_BASE_URL}/promocodes/${promoCode}`)
    .then(response => {
      const data = response.data;
      
      if (data && data.active) {
        const percentage = data.percentage;

        const updatedCart = cart.map(item => ({
          ...item,
          originalPrice: item.prix_unitaire,
          prix_unitaire: item.prix_unitaire - (item.prix_unitaire * percentage / 100)
        }));

        dispatch(updateCart(updatedCart));
        setPromoCode('');
      } else {
        console.log('Code promo invalide ou non actif.');
      }
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de l\'appel API :', error);
    });
  };
  
  // Restaurer le prix d'origine
  const handleRemoveDiscount = () => {
    const updatedCart = cart.map(item => ({
      ...item,
      prix_unitaire: item.originalPrice 
    }));
  
    dispatch(updateCart(updatedCart));
    setPromoCode('');
  };
  
//filtrage si formule ou produits
  const formules = cart.filter(item => item.type === 'formule');
  const produits = cart.filter(item => item.type !== 'formule');

//Regroupez les articles par offre
const groupedItems = produits.reduce((accumulator, item) => {

  let key;
  //pour différencier les produits par key
  if (item.offre) {
    key = item.offre;
  } else {
    key = 'product-' + item.productId;
  }

  if (!accumulator[key]) {
    // accumulator[key] = [item];
    accumulator[key] = {
      items: [item],
      freeCount: item.isFree ? 1 : 0
    };
  } else {
    // accumulator[key].push(item);
    accumulator[key].items.push(item);
    if (item.isFree) accumulator[key].freeCount++;
  }
  return accumulator;
}, {});

const groupedItemsArray = Object.values(groupedItems);

const itemsGroupedByFamily = groupedItemsArray.reduce((acc, group) => {
  if (group.items[0].type !== 'formule') {
    const familyName = productFamilies[group.items[0].productId];
    if (!acc[familyName]) {
      acc[familyName] = [];
    }
    acc[familyName].push(group);
  }
  return acc;
}, {});

useEffect(() => {
  if (orderInfo && paiement === 'online') {
    const submitOrder = async () => {
      const response = await axios.post(`${API_BASE_URL}/checkout_session`, { orderInfo, platform: Platform.OS,
        isDev: __DEV__ });
      const sessionUrl = response.data.session;
      const sessionId = response.data.id
      setSessionId(sessionId);
      const stripeCheckoutUrl = `${sessionUrl}`;
      setCheckoutSession(stripeCheckoutUrl);
      Linking.openURL(sessionUrl);
    };
    submitOrder();
  }
    }, [orderInfo, paiement]);

    useEffect(() => {
      if(paiement === 'online' && sessionId){
        checkPaymentStatus() 
      }
    }, [paiement, sessionId]); 

    useEffect(() => {
      if (orderInfo && paiement === 'onsite') {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          navigation.navigate('success');
        }, 3000);  
      }
    }, [orderInfo, paiement]);
  return (
   
      <>
          <View style={{ flex: 1, alignItems: 'center', backgroundColor: colors.color3}}>
              
              {loading ? (
                  <LottieView 
                      source={require('../assets/loaderpaiment.json')} 
                      autoPlay 
                      loop 
                      style={{
                        width: 300, 
                        aspectRatio: 300 / 600,
                        flexGrow: 1, 
                        alignSelf: 'center',
                      }} 
                  />
              ) : (
                  <>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 30, paddingHorizontal: 30, justifyContent: 'space-between', width: "100%" }}>


                          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10, fontFamily: fonts.font1, color: colors.color1 }}>Votre Panier</Text>
                          <TouchableOpacity onPress={handleBack} activeOpacity={1} style={{ backgroundColor: 'white', borderRadius: 25 }}>
                              <ArrowLeft fill={colors.color1} />
                          </TouchableOpacity>
                      </View>
  
                      <View style={{ width: "100%", height: 80, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 10 }}>
                          <View><StorePicker /></View>
                          <View><CustomDatePicker /></View>
                      </View>
  
                      <ScrollView style={{ marginVertical: 10, flex: 1 }} showsVerticalScrollIndicator={false}>
                          {/* - formules - */}
                          {formules.length > 0 && <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>Formules</Text>}
                          {formules.map((item, index) => {
                              if (item.type === 'formule') {
                                  return (
                                      <View key={index} style={{ backgroundColor: "white", borderRadius: 10, marginVertical: 5 }}>
                                          <CardItemFormule
                                              option1={item.option1}
                                              option2={item.option2}
                                              option3={item.option3}
                                              prix_unitaire={item.prix}
                                              incrementhandler={() => incrementhandler(item.productIds, item.offre)}
                                              decrementhandler={() => decrementhandler(item.productIds, dispatch)}
                                              removehandler={() => removehandler(item.id, dispatch, 'formule')}
                                              image={item.formuleImage}
                                              qty={item.qty}
                                              title={item.libelle}
                                              // key={item.id}
                                            />
                                      </View>
                                  );
                              }
                          })}
  
                          {/* - produits seuls ou avec offre - */}
                          {Object.entries(itemsGroupedByFamily).map(([familyName, items], index) => {
                              return (
                                  <View key={index}>
                                      <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>{familyName}</Text>
                                      {items.map((group, groupIndex) => (
                                          <View key={groupIndex} style={{ backgroundColor: "white", borderRadius: 10, marginVertical: 5 }}>
                                              <CartItem 
                                                  libelle={group.items[0].libelle}
                                                  prix_unitaire={group.items[0].prix || group.items[0].prix_unitaire}
                                                  qty={group.items.reduce((acc, item) => acc + item.qty, 0)} 
                                                  incrementhandler={() => incrementhandler(group.items[0].productId, group.items[0].offre)}
                                                  decrementhandler={() => decrementhandler(group.items[0].productId, dispatch)}
                                                  removehandler={() => removehandler(group.items[0].productId, dispatch) }
                                                  // image={group.items[0].image}
                                                  index={index}
                                                  isFree={group.items[0].isFree}
                                                  freeCount={group.freeCount}
                                              />
                                          </View>
                                      ))}
                                  </View>
                              );
                          })}
                      </ScrollView>
  
                      {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <TextInput
                       value={promoCode}
                      onChangeText={(value) => setPromoCode(value)}
                       placeholder="Code promo"
                       style={{ width: 150, marginVertical: 10, borderWidth: 1, borderColor: 'white', paddingHorizontal: 20, paddingVertical: 10 }}
                    />
                          <Icon name="done" size={20} color="#900" onPress={handleApplyDiscount} />
                          <Icon name="clear" size={20} color="#900" onPress={handleRemoveDiscount} />
                      </View> */}
  
  <                   View style={[style.menu, Platform.OS === 'android' && style.androidMenu]}>
                          <View style={{ flexDirection: 'row', paddingHorizontal: 30, justifyContent: 'center', gap: 10 }}>
                              <View>
                                  <Text style={{ fontWeight: "bold" }}>Votre total</Text>
                                  <Text style={{ color: colors.color2 }}>Total Avec<Image source={require('../assets/SUN.png')} style={{ width: 50, height: 20, resizeMode: 'contain' }} /></Text>
                              </View>
                              <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: "flex-end" }}>
                                  <Text>{totalPrice.toFixed(2)}€</Text>
                                  <Text style={{ color: colors.color2, fontWeight: "bold" }}>{(totalPrice * 0.8).toFixed(2)}€</Text>
                              </View>
                          </View>
                          <View style={{gap:10}}>
                              <TouchableOpacity onPress={() => handleConfirm('onsite')} style={style.btnPaiement}>
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
                                  <Image
                                      source={require('../assets/paiementsurplace.png')} 
                                      style={{ width: 20, height: 20, resizeMode:'contain' }}
                                  />
                                  <Text style={{ color:colors.color6, fontFamily:fonts.font3}}> Sur place</Text>
                                </View>
                                  
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => handleConfirm('online')} style={{ ...style.btnPaiement, backgroundColor: colors.color3 }}>
                              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
                                  <Image
                                      source={require('../assets/paiementenligne.png')} 
                                      style={{ width: 20, height: 20, resizeMode:'contain' }}
                                  />
                                  <Text style={{ color: colors.color1, fontFamily:fonts.font3}}> En ligne</Text>
                                </View>
                              </TouchableOpacity>
                          </View>
                      </View>
                      <ModaleOffre31 modalVisible={modalVisible} setModalVisible={setModalVisible} handleAcceptOffer={handleAcceptOffer} />
                      
                      <FooterProfile />
                  </>
              )}
          </View>
      </>
  );
  
  
}
export default Panier