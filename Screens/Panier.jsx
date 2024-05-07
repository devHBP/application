import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Image,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {
  updateCart,
  addToCart,
  clearCart,
  addPromo,
  resetPromo,
  acceptOffer,
  setCart,
  getCart,
  getTotalCart,
} from '../reducers/cartSlice';
import {setNumeroCommande, setProducts} from '../reducers/orderSlice';
import CartItem from '../components/CardItems';
import CardItemFormule from '../components/CardItemsFormule';
import CartItemAntigaspi from '../components/CardItemsAntiGaspi';
import CartItemSUN from '../components/CardItemsSUN';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {
  checkStockFormule,
  checkStockForSingleProduct,
  getFamilyOfProduct,
  checkIfUserOrderedOffreSUNToday,
  fetchAllProductsClickAndCollect,
  updateAntigaspiStock,
  updateStock,
  getPrefCommande,
  getCartItemId,
  getItemsOffre31,
  addStock,
  addStockAntigaspi,
  //getCart,
} from '../CallApi/api';
import FooterProfile from '../components/FooterProfile';
import ModaleOffre31 from '../components/ModaleOffre31';
import PulseAnimation from '../components/PulseAnimation';
import {fonts, colors} from '../styles/styles';
import StorePicker from '../components/StorePicker';
import CustomDatePicker from '../components/CustomDatePicker';
import {style} from '../styles/formules';
import {styles} from '../styles/panier';
import {stylesInvite} from '../styles/invite';
import ArrowLeft from '../SVG/ArrowLeft';
import Signup from '../SVG/Signup';
import {DeleteCode} from '../SVG/DeleteCode';
import {ApplyCode} from '../SVG/ApplyCode';
import CardPaiement from '../SVG/CardPaiement';
import LottieView from 'lottie-react-native';
import {API_BASE_URL} from '../config';
// import {API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS} from '@env';
import Svg, {Path} from 'react-native-svg';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useCountdown} from '../components/CountdownContext';
import ModaleOffreSUN from '../components/ModaleOffreSUN';
import ModaleModifProfile from '../components/ModaleModifProfile';

//fonctions
import {
  decrementhandler,
  incrementhandler,
  removehandler,
  removeCartCountDown,
  removehandlerafterCountdown,
  handleOfferCalculation,
  createOrder,
  openStripe,
  checkPaymentStatus,
  formatToDateISO,
  handleApplyDiscount,
  handleRemoveDiscount,
} from '../Fonctions/fonctions';
import LogoSun from '../SVG/LogoSun';
import InputPromo from '../components/InputPromo';

const Panier = ({navigation}) => {
  const dispatch = useDispatch();
  const webViewRef = useRef(null);
  const [promoCode, setPromoCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [checkoutSession, setCheckoutSession] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [productFamilies, setProductFamilies] = useState({});
  const [paiement, setPaiement] = useState('online');
  const [loading, setLoading] = useState(false);
  const [selectStore, setSelectStore] = useState('');
  const [isModalSunVisible, setIsModalSunVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [erreurCodePromo, setErreurCodePromo] = useState(false);
  const [usedPromoCodes, setUsedPromoCodes] = useState([]);
  const [erreurCodePromoUsed, setErreurCodePromoUsed] = useState(false);
  const [modalProfile, setModalProfile] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [currentPromoCode, setCurrentPromoCode] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

  const cart = useSelector(state => state.cart.cart);
  // const [cart, setCart] = useState([]);
  const promotionId = useSelector(state => state.cart.promotionId);
  const user = useSelector(state => state.auth.user);
  const cartTotal = useSelector(state => state.cart.cartTotal);
  const selectedDateString = useSelector(state => state.cart.date);
  const selectedTime = useSelector(state => state.cart.time);
  const numero_commande = useSelector(state => state.order.numero_commande);

  const {countDownNull, countdown, resetCountdown, resetForPaiementCountdown} =
    useCountdown();

  // panier vide
  const isCartEmpty = cart.length === 0;

  let userRole = user.role;
  const emailConfirmOrder = user.email;
  const firstnameConfirmOrder = user.firstname;

  const handleBack = () => {
    navigation.navigate('home');
  };

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      // appel du panier via redux
      dispatch(getCart(user.userId));
      dispatch(getTotalCart(user.userId));

      setLoading(false);
      console.log('boucle ici');
    };

    loadCart();
  }, [user.userId, dispatch]);

  const totalSum = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + Number(item.totalPrice), 0)
    : 0;

  const totalSumForCollabAndAntigaspi = Array.isArray(cart)
    ? cart.reduce((total, product) => {
        let adjustedPrice = product.totalPrice;
        if (userRole === 'SUNcollaborateur' && product.type !== 'antigaspi') {
          adjustedPrice *= 0.8;
        }
        return total + Number(adjustedPrice);
      }, 0)
    : 0;

  const addProduct = async item => {
    // verif du stock
    let productIds = [];
    if (item.type === 'formule') {
        productIds = [item.option1, item.option2, item.option3].filter(Boolean);
    } else {
        productIds = [item.productId];
    }
    for (const productId of productIds) {
        const stockCheck = await checkStockForSingleProduct(productId);
        console.log('stock', stockCheck);

        if (stockCheck[0].quantite <= 0) {
            return Toast.show({
                type: 'error',
                text1: 'Victime de son succès',
                text2: 'Plus de stock disponible'
            });
        }
    }

    if (item.type === 'offre31') {
      if (
        item.qtyPaid % 3 === 0 &&
        item.qtyFree < Math.floor(item.qtyPaid / 3)
      ) {
        setModalVisible(true);
        setCurrentItem(item);
      } else {
        await incrementhandler(
          user.userId,
          item.productId,
          1,
          item.unitPrice,
          item.type,
          false,
          null,
          null,
          null,
          null,
          null,
          item.categorie,
          null,
          item.libelle,
        );
        await updateStock({...item, qty: 1});
      }
    }
    if (item.type === 'simple') {
      await incrementhandler(
        user.userId,
        item.productId,
        1,
        item.unitPrice,
        item.type,
        false,
        null,
        null,
        null,
        null,
        null,
        item.libelle,
        null,
        item.product,
      );
      await updateStock({...item, qty: 1});
    }
    if (item.type === 'formule') {
      await incrementhandler(
        user.userId,
        null,
        1,
        item.unitPrice,
        item.type,
        false,
        item.option1,
        item.option2,
        item.option3,
        null,
        null,
        item.libelle,
        item.key,
        item.libelle,
      );
      const optionIds = [
        item.option1,
        item.option2,
        item.option3,
      ].filter(Boolean);
      console.log(optionIds)
      for (const optionId of optionIds) {
        await updateStock({productId: optionId, qty: 1});
      }
    }
    await dispatch(getCart(user.userId));
    await dispatch(getTotalCart(user.userId));
  };

  const reduceProduct = async item => {
    if (item.type === 'simple') {
      const cartItemId = await getCartItemId(
        user.userId,
        item.productId,
        item.type,
      );
      // console.log(cartItemId)
      await decrementhandler(
        user.userId,
        item.productId,
        1,
        item.type,
        cartItemId[0],
        item.key,
      );
      await addStock({...item, qty: 1});
      await dispatch(getCart(user.userId));
    }
    if (item.type === 'offre31') {
      const items = await getItemsOffre31(item.productId);
      // console.log('items', items)
      decrementhandler(
        user.userId,
        item.productId,
        1,
        item.type,
        items[0].cartItemId,
        null,
      );
      await addStock({...item, qty: 1});
      await dispatch(getCart(user.userId));
    }
    if (item.type === 'formule') {
      const cartItemId = await getCartItemId(
        user.userId,
        item.productId,
        item.type,
        item.key,
      );
      // console.log(cartItemId)
      await decrementhandler(
        user.userId,
        item.productId,
        1,
        item.type,
        cartItemId[0],
        item.key,
      );
      const optionIds = [item.option1, item.option2, item.option3].filter(
        Boolean,
      );
      console.log(optionIds);
      for (const optionId of optionIds) {
        await addStock({productId: optionId, qty: 1});
      }
      await dispatch(getCart(user.userId));
    }
    dispatch(getTotalCart(user.userId));
  };

  const removeProduct = async item => {
    console.log(item);
    if (
      item.type === 'formule' ||
      item.type === 'simple' ||
      item.type === 'offreSUN' ||
      item.type === 'antigaspi'
    ) {
      const cartItemId = await getCartItemId(
        user.userId,
        item.productId,
        item.type,
        item.key,
      );
      // console.log(cartItemId);
      await decrementhandler(
        user.userId,
        item.productId,
        item.totalQuantity,
        item.type,
        cartItemId[0],
        item.key,
      );
      await dispatch(getCart(user.userId));
    }
    if (item.type === 'offre31') {
      const items = await getItemsOffre31(item.productId);
      for (const item of items) {
        await decrementhandler(
          user.userId,
          item.productId,
          item.quantity,
          item.type,
          item.cartItemId,
          item.key,
        );
      }
      dispatch(getCart(user.userId));
    }
    dispatch(getTotalCart(user.userId));
    // remise du stock
    if (item.type === 'antigaspi') {
      await addStockAntigaspi({
        productId: item.productId,
        qty: item.totalQuantity,
      });
    }
    if (item.type === 'formule') {
      const optionIds = [item.option1, item.option2, item.option3].filter(
        Boolean,
      );
      console.log(optionIds);
      for (const optionId of optionIds) {
        await addStock({productId: optionId, qty: item.totalQuantity});
      }
    }
    if (item.type === 'simple') {
      await addStock({productId: item.productId, qty: item.totalQuantity});
    }
    if (item.type === 'offre31') {
      const total = item.qtyFree + item.qtyPaid;
      await addStock({productId: item.productId, qty: total});
    }
  };

  // Construire un objet agrégé qui a des productId comme clés
  const groupedItems = Array.isArray(cart)
    ? cart.reduce((acc, item) => {
        // const key = `${item.productId}-${item.type}`;
        const key =
          item.type === 'formule'
            ? `${item.cartItemId}-${item.type}`
            : `${item.productId}-${item.type}`;
        if (!acc[key]) {
          acc[key] = {
            productId: item.productId,
            product: item.product,
            type: item.type,
            libelle: item.libelle,
            qtyPaid: item.isFree ? 0 : item.quantity,
            qtyFree: item.isFree ? item.quantity : 0,
            totalQuantity: item.quantity,
            unitPrice: item.unitPrice,
            option1: item.option1ProductId,
            option2: item.option2ProductId,
            option3: item.option3ProductId,
            key: item.key,
          };
        } else {
          // Ajoute à la quantité existante
          if (item.isFree) {
            acc[key].qtyFree += item.quantity;
          } else {
            acc[key].qtyPaid += item.quantity;
          }
          acc[key].totalQuantity += item.quantity;
        }

        return acc;
      }, {})
    : 0;
  // Convertissez l'objet regroupé en tableau pour le rendu.
  const groupedItemsArray = Object.values(groupedItems);
  // console.log('groupedItemsArray', groupedItemsArray);

  const groupedByLibelle = groupedItemsArray.reduce((acc, item) => {
    // Créer une clé unique pour chaque groupe
    const key = item.libelle;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);
    return acc;
  }, {});

  /** offre 3+1 */
  const handleAcceptOffer = async item => {
    await incrementhandler(
      user.userId,
      currentItem.productId,
      1,
      0,
      'offre31',
      true,
      null,
      null,
      null,
      null,
      null,
      currentItem.categorie,
      null,
      currentItem.libelle,
    );
    updateStock({...currentItem, qty: 1});
    dispatch(getCart(user.userId));
  };

  const handlePress = async () => {
    const allProductsClickandCollect = await fetchAllProductsClickAndCollect();
    const offreSunProduct = allProductsClickandCollect.find(
      product => product.type_produit === 'offreSUN',
    );
    // offre dans le panier déja présente ?
    const isOffreSunInCart = cart.some(item => item.typeProduit === 'offreSUN');
    // je veux ajouter le produit : offreSunProduct si pas encore présent dans le panier
    if (offreSunProduct && !isOffreSunInCart) {
      setIsModalSunVisible(true);
      setSelectedProduct(offreSunProduct);
    }
    if (isOffreSunInCart) {
      return Toast.show({
        type: 'error',
        text1: 'Offre déjà ajoutée',
        text2: "Vous avez déjà une baguette 'offreSUN' dans votre panier",
      });
    }
  };
  /** fin offre 3+1 */

  // family produits - si une formule = famille "Formules"
  //va chercher le store à chaque changement dans le store picker
  useEffect(() => {
    const fetchFamilies = async () => {
      if (!cart || cart.length === 0) {
        console.log('Le panier est vide ou non défini.');
        setProductFamilies({}); // Reset des familles si le panier est vide
        return; // Stop l'exécution si le panier est vide
      }

      const productIds = cart
        .map(item => {
          //formule separement
          if (item.type === 'formule') {
            return null;
          }
          return item.productId;
        })
        .filter(id => id !== null);

      const fetchedFamilies = await Promise.all(
        productIds.map(async id => {
          const data = await getFamilyOfProduct(id);
          return {
            productId: id,
            family: data.FamillyProduct.nom_famille_produit,
          };
        }),
      );

      const familiesObject = fetchedFamilies.reduce((acc, item) => {
        acc[item.productId] = item.family;
        return acc;
      }, {});

      // famille "Formules" pour les formules
      cart.forEach(item => {
        if (item.type === 'formule') {
          familiesObject[item.productId] = 'Formules';
        }
      });
      const getStore = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/getOne/${user.userId}`,
          );
          setSelectStore(response.data.storeId);
        } catch (error) {
          console.error(error);
          throw new Error('Erreur lors de la recupération du store');
        }
      };
      getStore();
      setProductFamilies(familiesObject);
    };

    fetchFamilies();
  }, [cart, user.storeId]);

  // modale choix preference commande : remboursement ou remplacement
  const verfiPrefCommande = async userId => {
    const prefCommande = await getPrefCommande(userId);
    if (prefCommande.preference_commande == null) {
      setModalProfile(true);
    }
  };
  useEffect(() => {
    verfiPrefCommande(user.userId);
  }, []);

  // une offre sun dans le panier
  const hasOffreSUN = Array.isArray(cart)
    ? cart.some(produit => produit.typeProduit === 'offreSUN')
    : 0;
  // une offre sun dans la journée

  // console.log('hasOffreSUN', hasOffreSUN)
  // 1. je clicque sur le bouton "En ligne"
  const handleConfirm = async newPaiement => {
    // verif si presence de la date
    if (!selectedDateString) {
      Toast.show({
        type: 'error',
        text1: 'Date manquante',
        text2: 'Veuillez sélectionner une date avant de confirmer.',
      });
      return;
    }
    // verif du role
    if (user.role === 'client') {
      return Toast.show({
        type: 'error',
        text1: `Le Click and collect n'est pas disponible`,
        text2: `Nous vous préviendrons très vite par email`,
      });
    }

    setPaiement(newPaiement);
    dispatch(setProducts(cart));

    console.log('je commande en ligne');

    // creation de la commande
    const orderData = {
      cart: cart,
      userRole: user.role,
      firstname_client: user.firstname,
      lastname_client: user.lastname,
      prix_total: totalSumForCollabAndAntigaspi,
      date: formatToDateISO(selectedDateString),
      heure: selectedTime ? selectedTime : null,
      userId: user.userId,
      storeId: selectStore,
      slotId: null,
      promotionId: null,
      products: (() => {
        let products = [];
        let processedProductIds = []; // Pour garder une trace des IDs de produits déjà traités

        cart.forEach(item => {
          // Gérer les formules spécifiquement
          if (item.type === 'formule') {
            // Ajouter chaque composant de la formule comme produit individuel
            if (item.option1ProductId) {
              products.push({
                productId: item.option1ProductId,
                quantity: item.quantity,
                prix_unitaire: item.unitPrice,
              });
            }
            if (item.option2ProductId) {
              products.push({
                productId: item.option2ProductId,
                quantity: item.quantity,
                prix_formule: 2,
              });
            }
            if (item.option3ProductId) {
              products.push({
                productId: item.option3ProductId,
                quantity: item.quantity,
                prix_formule: 2,
              });
            }
          } else {
            // Pour les produits normaux
            if (!processedProductIds.includes(item.productId)) {
              if (item.productId) {
                products.push({
                  productId: item.productId,
                  quantity: item.quantity,
                  prix_unitaire: item.unitPrice,
                });
                processedProductIds.push(item.productId);
              }
            }
          }
        });
        return products;
      })(),
    };

    const checkOffreSUN = await checkIfUserOrderedOffreSUNToday(
      user.userId,
      formatToDateISO(selectedDateString),
    );

    // offre SUn deja prise aujourdhui ?
    if (checkOffreSUN) {
      // Vérifier si le panier actuel contient le produit 'offreSUN'
      const offreSUNInCart = cart.some(item => item.typeProduit === 'offreSUN');

      if (offreSUNInCart) {
        // L'utilisateur a déjà commandé 'offreSUN' aujourd'hui et tente de le commander à nouveau
        return Toast.show({
          type: 'error',
          text1: 'Baguette gratuite déja commandée ...',
          text2: "Reviens demain pour bénéficier de l'offre à nouveau",
        });
      }
    }
    //si montant inférieur à 0 avec la baguette gratuite
    if (hasOffreSUN && totalSumForCollabAndAntigaspi == 0) {
      const createorder = await createOrder(orderData);

      const callApi = await axios.get(
        `${API_BASE_URL}/getOneStore/${user.storeId}`,
      );
      // console.log('data', callApi.data);
      const point_de_vente = callApi.data.nom_magasin;

      const res = await axios.post(`${API_BASE_URL}/confirmOrder`, {
        email: emailConfirmOrder,
        firstname: firstnameConfirmOrder,
        numero_commande: createorder.numero_commande,
        date: orderData.date,
        point_de_vente,
      });
      setLoading(true);

      // vider panier

      setTimeout(() => {
        navigation.navigate('success');
        setLoading(false);
      }, 2000);

      return;
      // si montant inférieur à 50centimes sans la baguette gratuite
      // toast message
    } else if (totalSumForCollabAndAntigaspi < 0.5) {
      return Toast.show({
        type: 'error',
        text1: `Montant inférieur à 50 centimes`,
        text2: `N'hésitez pas à ajouter des articles `,
      });
    } else {
      const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      const createorder = await createOrder(orderData);
      const orderId = createorder.orderId;
      const numero_commande = createorder.numero_commande;
      const callApi = await axios.get(
        `${API_BASE_URL}/getOneStore/${user.storeId}`,
      );
      // console.log('data', callApi.data);

      // info pour stripe
      const info = {
        userRole,
        cart,
        user,
        selectStore,
        totalSumForCollabAndAntigaspi,
        totalQuantity,
        dateForDatabase: formatToDateISO(selectedDateString),
        paiement,
        orderId,
        numero_commande,
      };
      // console.log('info', info)
      if (paiement === 'online') {
        const sessionId = await openStripe(
          info,
          setSessionId,
          setCheckoutSession,
        );
        if (sessionId) {
          checkPaymentStatus(
            sessionId,
            navigation,
            dispatch,
            countDownNull,
            resetCountdown,
            user,
          );
        }
      }

      // vider panier
    }
  };

  const handleSignup = () => {
    navigation.navigate('signup');
  };

  // useEffect(() => {
  //   if (countdown === 0) {
  //     // removeCartCountDown(cart, countdown, dispatch);
  //     console.log(
  //       'jeleve les produits et je remets en stock a lexpiration du compteur',
  //     );
  //   }
  //   if (isCartEmpty) {
  //     countDownNull();
  //   }
  // }, [countdown, cart]);

  //transforme le countdown en minutes
  const formatCountdown = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${
      remainingSeconds < 10 ? '0' : ''
    }${remainingSeconds}`;
  };

  return (
    <>
      <SafeAreaProvider style={styles.safeAreaProvider}>
        <View style={styles.contentSafeArea}>
          {loading ? (
            <LottieView
              source={require('../assets/loaderpaiment.json')}
              autoPlay
              loop
              style={styles.lottieJson}
            />
          ) : (
            <>
              <View style={styles.headerCart}>
                <Text style={styles.contentHeader}>Votre Panier</Text>
                <TouchableOpacity
                  onPress={handleBack}
                  activeOpacity={1}
                  style={{backgroundColor: 'white', borderRadius: 25}}>
                  <ArrowLeft fill={colors.color1} />
                </TouchableOpacity>
              </View>

              <View style={styles.contentPickers}>
                <View>
                  <StorePicker />
                </View>
                <View>
                  <CustomDatePicker />
                </View>
              </View>

              <ScrollView
                style={{marginVertical: 10, flex: 1}}
                showsVerticalScrollIndicator={false}>
                {/* {groupedItemsArray.map((item, index) => { */}
                {Object.keys(groupedByLibelle).map(libelle => (
                  <View key={libelle}>
                    <Text
                      style={{
                        paddingVertical: 5,
                        paddingTop: 10,
                        fontWeight: 'bold',
                        color: colors.color1,
                      }}>
                      {libelle}
                    </Text>
                    {groupedByLibelle[libelle].map((item, index) => {
                      const key = `${item.type}-${item.cartItemId || index}`;

                      if (item.type === 'simple' || item.type === 'offre31') {
                        return (
                          <CartItem
                            key={key}
                            libelle={item.product}
                            prix_unitaire={item.unitPrice}
                            qty={item.totalQuantity}
                            incrementhandler={() => addProduct(item)}
                            decrementhandler={() => reduceProduct(item)}
                            removehandler={() => removeProduct(item)}
                            index={index}
                            isFree={item.isFree}
                            type={item.type}
                            item={item}
                            qtyPaid={item.qtyPaid}
                            qtyFree={item.qtyFree}
                          />
                        );
                      } else if (item.type === 'offreSUN') {
                        return (
                          <CartItemSUN
                            key={key}
                            libelle={item.product}
                            qty={item.totalQuantity}
                            removehandler={() => removeProduct(item)}
                          />
                        );
                      } else if (item.type === 'antigaspi') {
                        return (
                          <CartItemAntigaspi
                            key={key}
                            libelle={item.product}
                            qty={item.totalQuantity}
                            removehandler={() => removeProduct(item)}
                            item={item}
                          />
                        );
                      } else if (item.type === 'formule') {
                        return (
                          <CardItemFormule
                            key={key}
                            title={item.libelle}
                            libelle={item.product}
                            qty={item.totalQuantity}
                            incrementhandler={() => addProduct(item)}
                            decrementhandler={() => reduceProduct(item)}
                            removehandler={() => removeProduct(item)}
                            item={item}
                          />
                        );
                      }
                    })}
                  </View>
                ))}
              </ScrollView>

              {!isCartEmpty && (
                <View style={style.contentGlobal}>
                  <View style={style.contentCountDown}>
                    <Text style={style.countDown}>
                      Délai du panier: {formatCountdown(countdown)}
                    </Text>
                  </View>
                </View>
              )}

              <View
                style={[
                  style.menu,
                  Platform.OS === 'android' && style.androidMenu,
                ]}>
                <View style={styles.contentTotalMenu}>
                  <View>
                    <Text style={styles.boldText}>Votre total</Text>
                    {/* {cart.length !== 1 || antigaspiProductsCount !== 1 ?  */}
                    {/* ( */}
                    <Text style={{color: colors.color2}}>
                      Total Avec
                      <Image
                        source={require('../assets/sun.jpg')}
                        style={{width: 50, height: 20, resizeMode: 'contain'}}
                      />
                    </Text>
                    {/* ) */}
                    {/* : null} */}
                  </View>
                  <View style={styles.contentTotalPrice}>
                    <Text style={{color: colors.color1}}>
                      {totalSum.toFixed(2)} €
                    </Text>
                    {/* {cart.length !== 1 || antigaspiProductsCount !== 1 ?  */}
                    {/* ( */}
                    <Text style={styles.orangeBoldText}>
                      {totalSumForCollabAndAntigaspi.toFixed(2)} €
                    </Text>
                    {/* )  */}
                    {/* : null} */}
                  </View>
                </View>
                <View>
                  {user.role == 'invite' ? (
                    <View style={{width: 180, gap: 5}}>
                      <TouchableOpacity
                        style={stylesInvite.btn}
                        onPress={handleSignup}>
                        <Signup />
                        <Text style={stylesInvite.textBtn}>Inscription</Text>
                      </TouchableOpacity>
                      <Text style={{fontSize: 11}}>
                        Inscrivez vous pour commander et profiter de tout les
                        avantages !
                      </Text>
                    </View>
                  ) : (
                    <View style={{gap: 10}}>
                      <TouchableOpacity
                        onPress={() => handleConfirm('online')}
                        style={styles.buttonOnline}>
                        <CardPaiement />
                        <Text style={styles.whiteBoldText}>En ligne</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                {modalProfile && (
                  <ModaleModifProfile
                    modalVisible={modalProfile}
                    setModalVisible={setModalProfile}
                  />
                )}
              </View>

              <PulseAnimation onPress={handlePress} />

              <ModaleOffre31
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                handleAcceptOffer={() => handleAcceptOffer(currentItem)}
              />

              <ModaleOffreSUN
                modalVisible={isModalSunVisible}
                setModalVisible={setIsModalSunVisible}
                product={selectedProduct}
              />

              <FooterProfile />
            </>
          )}
        </View>
      </SafeAreaProvider>
    </>
  );
};
export default Panier;
