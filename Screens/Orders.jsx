import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fonts, colors} from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import axios from 'axios';
import FooterProfile from '../components/FooterProfile';
import ArrowLeft from '../SVG/ArrowLeft';
import TextTicker from 'react-native-text-ticker';
import LottieView from 'lottie-react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS} from '@env';

//call Api
import {getStoreById} from '../CallApi/api';
import ArrowDown from '../SVG/ArrowDown';
import {AntiGaspi} from '../SVG/AntiGaspi';

const Orders = ({navigation}) => {
  const user = useSelector(state => state.auth.user);
  const userId = user.userId;
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);
  const [cancelledOrder, setCancelledOrder] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [hasOrder, setHasOrder] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    navigation.navigate('home');
  };

  // const handleCancel = async orderId => {
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/cancelOrder`, {
  //       orderId,
  //     });
  //     setCancelledOrder(orderId);
  //   } catch (error) {
  //     console.error(
  //       'An error occurred while updating the order status:',
  //       error,
  //     );
  //   }
  // };
  // const handleReorder = () => {
  //   if (isDisabled) {
  //     return;
  //   }
  //   console.log('reorder');
  // };

  //mise à jour des commandes si commande annulée
  // useEffect(() => {
  //   if (cancelledOrder !== null) {
  //     allMyOrders();
  //   }
  // }, [cancelledOrder]);

  const allMyOrders = async () => {
    try {

      const response = await axios.get(
        `${API_BASE_URL}/ordersOfUserWithProducts/${userId}`,
      );
      const ordersWithDetails = response.data;
      // console.log(response.data)
      if (ordersWithDetails.length > 0) {
        setHasOrder(true);
        // console.log(ordersWithDetails)
      }

      const enrichedOrdersWithStore = await Promise.all(
        ordersWithDetails.map(async order => {
          const store = await getStoreById(order.storeId);
          return {...order, store};
        }),
      );

      const sortedOrders = enrichedOrdersWithStore.sort(
        (a, b) => new Date(b.orderId) - new Date(a.orderId),
      );
      setLastOrder(sortedOrders[0]);
      setPreviousOrders(sortedOrders.slice(1));
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      // console.error("Une erreur s'est produite :", error);
      console.log(error.response.status)
    }
  };

  useEffect(() => {
    allMyOrders();
  }, []);

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    // return `${day}-${month}-${year} ${hours}:${minutes}`;
    return `${day}/${month}/${year} `;
  };

  //autres commandes
  const renderOrder = (item, index, lastOrder = false) => {
    //calcul de l'ancien prix avant la remise SUNCollaborateur
    const prixUnitaires = item.products.map(product => {
      // conversion  string en number
      const prixUnitaire = parseFloat(product.prix_unitaire);
      return isNaN(prixUnitaire) ? 0 : prixUnitaire;
    });
    const sommePrixUnitaires = prixUnitaires.reduce(
      (acc, prix) => acc + prix,
      0,
    );

    // console.log('item commandes antérieures', JSON.parse(item.cartString));
    const cart = JSON.parse(item.cartString);
    // console.log('cart commandes anterieurs', cart);
    return (
      <View style={lastOrder ? style.lastOrderContainer : style.backOldOrder}>
        <TouchableOpacity
          style={style.oldOrderRow}
          onPress={() => {
            if (expandedOrderIds.includes(item.orderId)) {
              setExpandedOrderIds(prevIds =>
                prevIds.filter(id => id !== item.orderId),
              );
            } else {
              setExpandedOrderIds(prevIds => [...prevIds, item.orderId]);
            }
            // console.log('exp', expandedOrderIds);
          }}
          activeOpacity={1}>
          <View style={style.contentOlderOder}>
            <View style={style.flexStart}>
              <Text style={style.title}>
                {item.status.charAt(0).toUpperCase() + item.status.substring(1)}
              </Text>
              <Text style={style.underlineText}>
                OrderID: {item.orderId}
              </Text>
            </View>
            <View style={style.textTicker}>
              <TextTicker
                style={style.title}
                duration={10000}
                repeatSpacer={50}
                marqueeDelay={1000}>
                {item.store && item.store.nom_magasin}
              </TextTicker>
              <Text style={style.underlineText}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
            <View style={style.flexStart}>
              <Text style={style.newPrice}>
                {item.prix_total}€
              </Text>
              <Text style={style.underlineText}>
                {item.productIds.split(',').length}x Articles
              </Text>
            </View>
            <View
              style={style.backArrow}>
              <ArrowDown />
            </View>
          </View>
        </TouchableOpacity>
        {expandedOrderIds.includes(item.orderId) && (
          <View style={style.expandedOrders}>
            <Text style={style.detailsOrderTitle}>
              Détails de la commande
            </Text>

            <View>
              {Array.isArray(cart) &&
                cart.map((product, index) => {
                  const {
                    type,
                    antigaspi,
                    option1,
                    option2,
                    option3,
                    qty,
                    prix_unitaire,
                    libelle,
                    prix,
                  } = product;
                  const key = product.id || index;

                  if (type === 'formule') {
                    return (
                      <View key={key}>
                        <View style={style.orderFormule}>
                          <View>
                            <Text style={style.title}>
                              {libelle}
                            </Text>
                            {option1 && (
                              <View style={style.optionStyle}>
                                <Text style={style.text}>
                                  {option1.libelle}
                                </Text>
                                <Text style={style.text}>
                                  {/* {option1.prix_unitaire}€ */}
                                </Text>
                              </View>
                            )}
                            {option2 && (
                              <View style={style.optionStyle}>
                                <Text style={style.text}>
                                  {option2.libelle}
                                </Text>
                                {/* <Text style={style.optionFormule}>
                                {option2.prix_formule}€
                              </Text> */}
                              </View>
                            )}
                            {option3 && (
                              <View style={style.optionStyle}>
                                <Text style={style.text}>
                                  {option3.libelle}
                                </Text>
                                {/* <Text style={style.optionFormule}>
                                {option3.prix_formule}€
                              </Text> */}
                              </View>
                            )}
                          </View>
                          <View style={style.orderPrices}>
                            <Text style={style.oldPrice}>
                              {prix.toFixed(2)}€
                            </Text>
                            <Text style={style.newPrice}>
                              {(prix * 0.8).toFixed(2)}€
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  } else if (antigaspi) {
                    // si produit antigaspi
                    return (
                      <View key={key}>
                        <View style={style.orderDetails}>
                          <Text
                            style={style.textWidth}>
                            <AntiGaspi /> {qty}x {libelle}
                          </Text>
                          <View style={style.orderPrices}>
                            <Text style={style.oldPrice}>
                              {(prix_unitaire / 0.3).toFixed(2)}€
                            </Text>
                            <Text style={style.newPrice}>{(prix_unitaire).toFixed(2)}€</Text>
                          </View>
                        </View>
                      </View>
                    );
                  } else {
                    // Logique de rendu pour les produits classiques
                    return (
                      <View key={key}>
                        <View style={style.orderDetails}>
                          <Text
                            style={style.textWidth}>
                            {qty}x {libelle}
                          </Text>
                          <View style={style.orderPrices}>
                            <Text style={style.oldPrice}>
                              {prix_unitaire * qty}€
                            </Text>
                            <Text style={style.newPrice}>
                              {(prix_unitaire * qty * 0.8).toFixed(2)}€
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  }
                })}
            </View>

            <View style={style.rowTotal}>
              <Text
                style={style.title}>
                Votre total:
              </Text>
              <View>
                {/* ici somme des prix unitaire */}
                {/* <Text style={style.oldPrice}>
                  {sommePrixUnitaires.toFixed(2)}€
                </Text> */}
                <Text style={style.newPrice}>
                  {item.prix_total}€
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };
  //derniere commande
  const renderLastOrder = (item, index) => {
    const parsedItem = JSON.parse(item.cartString);
    // console.log('parsedItem', parsedItem[0].type);
    // console.log('item derniere commande', parsedItem);

    let prixUnitaires;

    if (parsedItem[0].type === 'formule') {
      prixUnitaires = parsedItem.map(formule => {
        let prixOptions = 0;

        // Ajouter le prix pour l'option 1
        if (formule.option1) {
          const prixOption1 = parseFloat(formule.option1.prix_unitaire);
          prixOptions += isNaN(prixOption1) ? 0 : prixOption1;
        }

        // Ajouter le prix pour l'option 2
        if (formule.option2) {
          const prixOption2 = parseFloat(formule.option2.prix_formule);
          prixOptions += isNaN(prixOption2) ? 0 : prixOption2;
        }

        // Ajouter le prix pour l'option 3
        if (formule.option3) {
          const prixOption3 = parseFloat(formule.option3.prix_formule);
          prixOptions += isNaN(prixOption3) ? 0 : prixOption3;
        }

        return prixOptions;
      });
    } else {
      // Si ce n'est pas une formule
      prixUnitaires = item.products.map(product => {
        const prixUnitaire = parseFloat(product.prix_unitaire);
        return isNaN(prixUnitaire) ? 0 : prixUnitaire;
      });
    }

    // Calcul de la somme totale des prix unitaires
    const sommePrixUnitaires = prixUnitaires.reduce(
      (acc, prix) => acc + prix,
      0,
    );

    return (
      <>
        <View>
          <Text
            style={style.lastOrderTitle}>
            Votre derniere commande
          </Text>
          <View
            style={style.lastOrderView}>
            <View
              style={style.orderDetails}>
              <View>
                <Text style={style.underlineText}>
                  OrderID: {item.orderId}
                </Text>
                <Text style={style.underlineText}>
                  {formatDate(item.createdAt)}
                </Text>
                <Text style={style.underlineText}>{item.status}</Text>
              </View>
              <View>
                <Text
                  style={style.storeTitle}>
                  {item.store && item.store.nom_magasin}
                </Text>
              </View>
            </View>

            <View>
              <Text
                style={style.detailsOrderTitle}>
                Details de la commande
              </Text>
              <View>
                <View>
                  {Array.isArray(parsedItem) &&
                    parsedItem.map((product, index) => {
                      const {
                        type,
                        antigaspi,
                        option1,
                        option2,
                        option3,
                        qty,
                        prix_unitaire,
                        libelle,
                        prix,
                      } = product;
                      const key = product.id || index;

                      // si on a une formule
                      if (type === 'formule') {
                        return (
                          <View key={key}>
                            <View style={style.orderFormule}>
                              <View>
                                <Text
                                  style={{...style.text, fontWeight: 'bold'}}>
                                  {libelle}
                                </Text>
                                {option1 && (
                                  <View style={style.optionStyle}>
                                    <Text style={style.text}>
                                      {option1.libelle}
                                    </Text>
                                    {/* <Text style={style.text}>
                                    {option1.prix_unitaire}€
                                  </Text> */}
                                  </View>
                                )}
                                {option2 && (
                                  <View style={style.optionStyle}>
                                    <Text style={style.text}>
                                      {option2.libelle}
                                    </Text>
                                    {/* <Text style={style.optionFormule}>
                                    {option2.prix_formule}€
                                  </Text> */}
                                  </View>
                                )}
                                {option3 && (
                                  <View style={style.optionStyle}>
                                    <Text style={style.text}>
                                      {option3.libelle}
                                    </Text>
                                    {/* <Text style={style.optionFormule}>
                                    {option3.prix_formule}€
                                  </Text> */}
                                  </View>
                                )}
                              </View>
                              <View style={style.orderPrices}>
                                <Text style={style.oldPrice}>{prix} €</Text>
                                <Text style={style.newPrice}>
                                  {(prix * 0.8).toFixed(2)}€
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      } else if (antigaspi) {
                        // si on a un produit antigaspi
                        return (
                          <View key={key}>
                            <View style={style.orderDetails}>
                              <Text
                                style={style.textWidth}>
                                <AntiGaspi /> {qty}x {libelle}
                              </Text>
                              <View style={style.orderPrices}>
                                <Text style={style.oldPrice}>
                                  {(prix_unitaire / 0.3).toFixed(2)}€
                                </Text>
                                <Text style={style.newPrice}>
                                  {prix_unitaire.toFixed(2)}€
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      } else {
                        // si on a un produit classqiue avec prix SUNcollaborateur
                        return (
                          <View key={key}>
                            <View style={style.orderDetails}>
                              <Text
                                style={style.textWidth}>
                                {qty}x {libelle}
                              </Text>
                              <View style={style.orderPrices}>
                                <Text style={style.oldPrice}>
                                  {(prix_unitaire * qty).toFixed(2)}€
                                </Text>
                                <Text style={style.newPrice}>
                                  {(prix_unitaire * qty * 0.8).toFixed(2)}€
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      }
                    })}
                </View>
              </View>

              <View style={style.rowTotal}>
                <Text
                  style={style.title}>
                  Votre total:
                </Text>
                <View>
                  {/* ici somme des prix unitaire */}
                  {/* <Text style={style.oldPrice}>
                    {sommePrixUnitaires.toFixed(2)}€
                  </Text> */}
                  <Text style={style.newPrice}>{item.prix_total}€</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };

  const ListHeader = ({lastOrder}) => (
    <View>
      {lastOrder && renderLastOrder(lastOrder)}
      <Text
        style={style.lastOrderTitle}>
        Vos commandes antérieures
      </Text>
    </View>
  );

  return (
    <>
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
      ) : hasOrder ? (
        <SafeAreaProvider
          style={{flex: 1, paddingTop: 50, backgroundColor: colors.color4}}>
          {/* <View style={{ alignItems: 'center', backgroundColor:colors.color3}}> */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 30,
              marginVertical: 10,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                fontFamily: fonts.font1,
                color: colors.color1,
              }}>
              Vos commandes
            </Text>

            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.8}
              style={{backgroundColor: 'white', borderRadius: 25}}>
              <ArrowLeft fill={colors.color1} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={previousOrders}
            renderItem={({item, index}) => renderOrder(item, index)}
            keyExtractor={item => item.orderId.toString()}
            ListHeaderComponent={
              lastOrder ? <ListHeader lastOrder={lastOrder} /> : null
            }
          />

          {/* </View> */}
        </SafeAreaProvider>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: colors.color3,
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 70,
                marginVertical: 30,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  fontFamily: fonts.font1,
                }}>
                Vos commandes
              </Text>
              <TouchableOpacity onPress={handleBack} style={style.back}>
                <Icon name="keyboard-arrow-left" size={30} color="#fff" />
              </TouchableOpacity>
            </View>

            <View
              style={{
                backgroundColor: 'white',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 100,
                borderRadius: 20,
              }}>
              <Text style={{color: colors.color1}}>
                Pas de commandes encore
              </Text>
            </View>
          </View>
        </View>
      )}

      <FooterProfile />
    </>
  );
};

const style = StyleSheet.create({
  btn: {
    backgroundColor: colors.color2,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  back: {
    backgroundColor: colors.color1,
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  btnReorder: {
    backgroundColor: colors.color2,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    textDecorationColor: colors.color5,
    color: colors.color5,
  },
  newPrice: {
    color: colors.color2,
    fontWeight: 'bold',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  orderFormule: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderPrices: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  text: {
    color: colors.color1,
  },
  textWidth:{
    width: '70%',
    flexWrap: 'wrap',
    color: colors.color1,
  },
  title: {
    color: colors.color1,
    fontWeight: 'bold',
  },
  optionFormule: {
    color: colors.color9,
  },
  optionStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  oldOrderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    gap: 10,
  },
  backOldOrder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: colors.color6,
    marginVertical: 5,
  },
  contentOlderOder: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    gap: 20,
    height: 70,
  },
  textTicker: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.color4,
    paddingHorizontal: 10,
    width: 125,
  },
  flexStart: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  underlineText:{
    color: colors.color5,
    fontSize: 10,
    textTransform: 'capitalize'
  },
  backArrow:{
    backgroundColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
  },
  expandedOrders:{
      flex: 1,
      paddingLeft: 10,
      marginVertical: 10,
      marginHorizontal: 30,
  },
  lastOrderTitle:{
    paddingLeft: 30,
    marginVertical: 20,
    fontFamily: fonts.font3,
    fontWeight: '600',
    color: colors.color1,
    fontSize: 16,
  }, 
  storeTitle:{
    color: colors.color1,
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsOrderTitle:{
    marginVertical: 10,
    color: colors.color2,
    fontFamily: fonts.font2,
    fontWeight: '700',
  },
  lastOrderView:{
    backgroundColor: colors.color6,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  
});

export default Orders;
