import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {
  addToCart,
  clearCart,
  addPromo,
  resetPromo,
  acceptOffer,
  setCart,
  getCart,
  getTotalCart,
  removeFromCartAfterCountDown,
  updateCart,
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
  updateStock,
  getPrefCommande,
  getCartItemId,
  getItemsOffre31,
  addStock,
  addStockAntigaspi,
  clearUserCart,
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
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useCountdown} from '../components/CountdownContext';
import ModaleOffreSUN from '../components/ModaleOffreSUN';
import ModaleModifProfile from '../components/ModaleModifProfile';
import Location from '../SVG/Location';

import Picker from 'react-native-picker-select';
import SelectDropdown from 'react-native-select-dropdown';
import {updateUser} from '../reducers/authSlice';
// import { styles } from '../styles/home';

//fonctions
import {
  decrementhandler,
  incrementhandler,
  createOrder,
  openStripe,
  checkPaymentStatus,
  formatToDateISO,
  handleRemoveDiscount,
  countdownStock,
  calculateFormulePrice,
} from '../Fonctions/fonctions';

const Panier = ({navigation}) => {
  const dispatch = useDispatch();
  const webViewRef = useRef(null);
  const [promoCode, setPromoCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [checkoutSession, setCheckoutSession] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [productFamilies, setProductFamilies] = useState({});
  const [paiement, setPaiement] = useState('online');
  const [loading, setLoading] = useState(false);
  const [selectStore, setSelectStore] = useState('');
  const [isModalSunVisible, setIsModalSunVisible] = useState(false);
  const [isOffreSunInCart, setIsOffreSunInCart] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [erreurCodePromo, setErreurCodePromo] = useState(false);
  const [erreurCodePromoUsed, setErreurCodePromoUsed] = useState(false);
  const [modalProfile, setModalProfile] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [currentPromoCode, setCurrentPromoCode] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

  const cart = useSelector(state => state.cart.cart);
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
      // Appel du panier via redux
      await dispatch(getCart(user.userId));
      await dispatch(getTotalCart(user.userId));
      setLoading(false); 
    };
    loadCart();
  }, [user.userId, dispatch]);

  const [stores, setStores] = useState([]);
  const [selectedStoreDetails, setSelectedStoreDetails] = useState({});

  useEffect(() => {
    if (user && user.role) {
      axios
        .post(`${API_BASE_URL}/getStore`, {
          role: user.role,
          storeId: user.storeId,
        })
        .then(response => {
          if (response.data.stores) {
            setStores(response.data.stores);
          }
          if (response.data.selectedStore) {
            setSelectedStoreDetails(response.data.selectedStore);
          }
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données :', error);
        });
    }
  }, [user.role, user.storeId]);

  const totalSum = Array.isArray(cart)
    ? cart.reduce((sum, item) => {
      let totalPrice = item.totalPrice;
      /* Correctif Bug affichage, le prix affiché n'était pas correct */
      if(item.type === "formule"){
        totalPrice = item.quantity * item.unitPrice;
      }
      return sum + Number(totalPrice)
    }, 0)
    : 0;

  //TODO Ici aussi il me semble, que la logique est encore en dur alors que nous possédons dans l'objet product le prix_remise_collaborateur
  const totalSumForCollabAndAntigaspi = Array.isArray(cart)
    ? cart.reduce((total, product) => {  
        let adjustedPrice = product.totalPrice;
        if (userRole === 'SUNcollaborateur' && product.type !== 'antigaspi') {
          /* Correctif Bug affichage */
          if(product.type === 'formule'){
            // Switch de adjustedPrice 
            adjustedPrice = product.unitPrice;
            // On check si la formule contient l'option2 et l'option3
            if(product.option2ProductId && product.option3ProductId){
              adjustedPrice = calculateFormulePrice(4, adjustedPrice, 0.8)
            }
            // Sinon si elle à option2 ou option3
            else if(product.option2ProductId || product.option3ProductId){
              adjustedPrice = calculateFormulePrice(2, adjustedPrice, 0.8)
            }
            // Sinon c'est un sandwich seul
            else{
              adjustedPrice *= 0.8;
            }
            // On ajuste le prix par la quantitée 
            adjustedPrice *= product.quantity;
          }
          else{
            adjustedPrice *= 0.8;
          }
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
      // console.log('stock', stockCheck);

      if (stockCheck[0].quantite <= 0) {
        return Toast.show({
          type: 'error',
          text1: 'Victime de son succès',
          text2: 'Plus de stock disponible',
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
      const optionIds = [item.option1, item.option2, item.option3].filter(
        Boolean,
      );
      // console.log(optionIds);
      for (const optionId of optionIds) {
        await updateStock({productId: optionId, qty: 1});
      }
    }
    await dispatch(getCart(user.userId));
    await dispatch(getTotalCart(user.userId));
    resetCountdown();
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
      // console.log(optionIds);
      for (const optionId of optionIds) {
        await addStock({productId: optionId, qty: 1});
      }
      await dispatch(getCart(user.userId));
    }
    dispatch(getTotalCart(user.userId));
  };

  const removeProduct = async item => {
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
      await decrementhandler(
        user.userId,
        item.productId,
        item.totalQuantity,
        item.type,
        cartItemId[0],
        item.key,
      );
      dispatch(getCart(user.userId));
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
    dispatch(getTotalCart(user.userId));
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
    await updateStock({...currentItem, qty: 1});
    await dispatch(getCart(user.userId));
    await dispatch(getTotalCart(user.userId));
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
        // console.log('Le panier est vide ou non défini.');
        setProductFamilies({}); // Reset des familles si le panier est vide
        return;
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

  // Logique d'affichage du macaron offreSUN en fonction de la date pickée
  const checkIfOrderExistsForDate = async (userId, date) => {
    const orderSunExists = await checkIfUserOrderedOffreSUNToday(userId, date);
    return orderSunExists;
  };
  useEffect(() => {
    const checkOrder = async () => {
      if(selectedDateString){
        const dateStringFromRedux = selectedDateString;
        const [day, month, year] = dateStringFromRedux.split('/');
        const formatedDate = `${year}-${month}-${day}`;
        const orderSunExists = await checkIfOrderExistsForDate(user.userId, formatedDate)
        setIsOffreSunInCart(orderSunExists);
        }
      };
    console.log(selectedDateString, isOffreSunInCart);
    checkOrder();
  }, [selectedDateString]);


  // 1. je clique sur le bouton "En ligne"
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
      promotionId: promotionId,
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
        return Toast.show({
          type: 'error',
          text1: 'Baguette gratuite déja commandée ...',
          text2: "Reviens demain pour bénéficier de l'offre à nouveau",
        });
      }
    }
    //si montant inférieur à 0 avec la baguette gratuite - autorise la commande
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
      await clearUserCart(user.userId);
      dispatch(getTotalCart(user.userId));

      setTimeout(() => {
        navigation.navigate('success');
        setLoading(false);
      }, 2000);

      return;
      // si montant inférieur à 50centimes sans la baguette gratuite
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
      console.log('info', info)
      // j'allonge le temps à 20min
      resetForPaiementCountdown();

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
    }
  };

  const handleSignup = () => {
    navigation.navigate('signup');
  };

  useEffect(() => {
    async function handleCartActions() {
      if (countdown === 0) {
        // fin de compte à rebours
        countdownStock(cart, user, dispatch);
        setAppliedPromo(null);
        setCurrentPromoCode(null);
        setPromoCode('');
        dispatch(resetPromo());
      }
    }
    handleCartActions();
  }, [countdown]);

  //transforme le countdown en minutes
  const formatCountdown = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${
      remainingSeconds < 10 ? '0' : ''
    }${remainingSeconds}`;
  };

  // application code promo
  const handleApplyDiscount = async () => {
    if (currentPromoCode) {
      alert('Un code promo est déjà appliqué à cette commande.');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/handleApplyDiscount`, {
        promoCode,
        cartItems: cart,
      });
      const updatedCart = response.data;
      dispatch(updateCart(updatedCart));
      setPromoCode('');
      // Déterminer le type de réduction et la stocker
      const updatedCartItems = response.data;
      const promoInfo = updatedCartItems[0].promo;

      let promoType, promoValue;
      if (promoInfo && promoInfo.percentage != null) {
        promoType = 'percentage';
        promoValue = promoInfo.percentage;
      } else if (promoInfo && promoInfo.fixedAmount != null) {
        promoType = 'fixedAmount';
        promoValue = promoInfo.fixedAmount;
      }
      // ajout du promotionId dans le store redux
      dispatch(addPromo(promoInfo.promotionId));
      setAppliedPromo({code: promoCode, type: promoType, value: promoValue});
      setCurrentPromoCode(promoCode);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // console.log(error.response.data.message);
        return Toast.show({
          type: 'error',
          text1: error.response.data.message,
        });
      } else {
        console.error("Erreur lors de l'application du code promo:", error);
      }
    }
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
                  {/* <StorePicker /> */}
                  <View
                    style={{
                      width: 160,
                      height: 80,
                      backgroundColor: 'white',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View style={{flexDirection: 'column'}}>
                      {user.role == 'SUNcollaborateur' && (
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingBottom: Platform.OS === 'ios' ? 8 : 0,
                          }}>
                          <Location />
                          <Text
                            style={{
                              ...styles.textPickerDate,
                              textAlign: 'center',
                            }}>
                            Livraison
                          </Text>
                        </View>
                      )}
                      {Platform.OS === 'android' ? (
                        <SelectDropdown
                          key={selectedStoreDetails.nom_magasin}
                          data={stores.map(store => store.nom_magasin)}
                          onSelect={(selectedItem, index) => {
                            const selected = stores.find(
                              store => store.nom_magasin === selectedItem,
                            );
                            if (selected) {
                              dispatch(
                                updateUser({
                                  ...user,
                                  storeId: selected.storeId,
                                }),
                              );
                              // dispatch(updateSelectedStore(selected));
                              setSelectedStoreDetails(selected);
                              axios
                                .put(
                                  `${API_BASE_URL}/updateOneUser/${user.userId}`,
                                  {storeId: selected.storeId},
                                )
                                .then(response => {
                                  // console.log('Le choix du magasin a été mis à jour avec succès dans la base de données');
                                })
                                .catch(error => {
                                  console.error(
                                    'Erreur lors de la mise à jour du choix du magasin dans la base de données - erreur ici:',
                                    error,
                                  );
                                });
                            } else {
                              console.log('pas de magasin sélectionné encore');
                            }
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem;
                          }}
                          rowTextForSelection={(item, index) => {
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item;
                          }}
                          buttonStyle={{
                            backgroundColor: 'transparent',
                            width: 160,
                            height: 30,
                            padding: 0,
                          }}
                          buttonTextStyle={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: colors.color2,
                            padding: 0,
                          }}
                          // defaultButtonText={selectedStore.nom_magasin}
                          defaultButtonText={
                            selectedStoreDetails
                              ? selectedStoreDetails.nom_magasin
                              : 'faites votre choix'
                          }
                          rowTextStyle={{fontSize: 10}}
                          // rowStyle={{width:20}}
                        />
                      ) : (
                        <Picker
                          placeholder={{
                            label: 'Choisissez un magasin',
                          }}
                          value={selectedStoreDetails.nom_magasin}
                          // value={selectedStore.nom_magasin}
                          onValueChange={value => {
                            const selected = stores.find(
                              store => store.nom_magasin === value,
                            );

                            if (selected) {
                              // dispatch(updateSelectedStore(selected));
                              dispatch(
                                updateUser({
                                  ...user,
                                  storeId: selected.storeId,
                                }),
                              );
                              setSelectedStoreDetails(selected);
                              axios
                                .put(
                                  `${API_BASE_URL}/updateOneUser/${user.userId}`,
                                  {storeId: selected.storeId},
                                )
                                .then(response => {
                                  // console.log('Le choix du magasin a été mis à jour avec succès dans la base de données');
                                })
                                .catch(error => {
                                  console.error(
                                    'Erreur lors de la mise à jour du choix du magasin dans la base de données (ici) - erreur ici:',
                                    error,
                                  );
                                });
                            } else {
                              // console.log('pas de magasin selectionné encore')
                            }
                          }}
                          items={stores.map(store => ({
                            label: store.nom_magasin,
                            value: store.nom_magasin,
                          }))}
                          style={pickerSelectStyles}
                          doneText="OK"
                        />
                      )}

                      {user.role == 'client' ||
                        (user.role == 'invite' && (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                            }}>
                            <View>
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: colors.color1,
                                  width: 130,
                                }}>
                                {selectedStoreDetails.adresse_magasin}
                              </Text>
                              <Text
                                style={{fontSize: 10, color: colors.color1}}>
                                {selectedStoreDetails.cp_magasin}{' '}
                                {selectedStoreDetails.ville_magasin}
                              </Text>
                            </View>
                          </View>
                        ))}
                    </View>
                    {/* </View> */}
                  </View>
                </View>
                <View>
                  <CustomDatePicker 
                    // value={selectedDateString}
                    // onChange={(newDate) => {
                    //   setSelectedDate(newDate);
                    // }}
                  />
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

                {/* code promo  */}
                <View
                  style={{
                    width: '100%',
                    marginVertical: 15,
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      justifyContent: 'center',
                      marginVertical: 10,
                    }}>
                    <TextInput
                      value={promoCode}
                      onChangeText={value => setPromoCode(value)}
                      placeholder="Code promo"
                      style={{
                        width: 150,
                        borderWidth: 1,
                        borderColor: colors.color3,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 5,
                        color: colors.color1,
                        fontWeight: 'bold',
                        fontSize: 14,
                        textAlignVertical: 'center',
                        backgroundColor: colors.color6,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => handleApplyDiscount()}
                      disabled={isCartEmpty}>
                      <ApplyCode
                        color={isCartEmpty ? colors.color3 : colors.color9}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        handleRemoveDiscount(
                          cart,
                          dispatch,
                          setAppliedPromo,
                          setCurrentPromoCode,
                          setPromoCode,
                        )
                      }
                      disabled={isCartEmpty}>
                      <DeleteCode
                        color={isCartEmpty ? colors.color3 : colors.color5}
                      />
                    </TouchableOpacity>
                  </View>
                  {appliedPromo && !isCartEmpty && (
                    <Text style={{color: colors.color2, fontSize: 12}}>
                      Réduction de{' '}
                      {appliedPromo.type === 'percentage'
                        ? `${appliedPromo.value}%`
                        : `${appliedPromo.value}€`}{' '}
                      sur votre panier
                    </Text>
                  )}
                  <View>
                    {erreurCodePromo && promoCode && (
                      <Text style={{color: colors.color8}}>
                        Code promo non valide !
                      </Text>
                    )}
                    {erreurCodePromoUsed && promoCode && (
                      <Text style={{color: colors.color8}}>
                        Code promo déja utilisé !{' '}
                      </Text>
                    )}
                  </View>
                </View>
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
                    <Text style={{color: colors.color2}}>
                      Total Avec
                      <Image
                        source={require('../assets/sun.jpg')}
                        style={{width: 50, height: 20, resizeMode: 'contain'}}
                      />
                    </Text>
                  </View>
                  <View style={styles.contentTotalPrice}>
                    <Text style={{color: colors.color1}}>
                      {totalSum.toFixed(2)}€
                    </Text>
                    <Text style={styles.orangeBoldText}>
                      {totalSumForCollabAndAntigaspi.toFixed(2)} €
                    </Text>
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

              { !isOffreSunInCart && <PulseAnimation onPress={handlePress} />}

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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 12,
    color: colors.color2,
    textAlign: 'center',
    marginVertical: 2,
  },
  inputAndroid: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    color: colors.color1,
  },
});

const pickerStyles = Platform.select({
  ios: pickerSelectStyles.inputIOS, // Styles pour iOS
  android: pickerSelectStyles.inputAndroid, // Styles pour Android
});
export default Panier;
