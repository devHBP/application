import React, {useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { defaultStyle} from '../styles/styles'
import { Button} from 'react-native-paper'
import { logoutUser} from '../reducers/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { WebView } from 'react-native-webview';

const OrderConfirmation = ({navigation}) => {

  const dispatch = useDispatch()
  const webViewRef = useRef(null);


  const user = useSelector(state => state.auth.user);
  //console.log('user', user)
  const selectedStore = useSelector(state => state.auth.selectedStore);
  const cartItems = useSelector(state => state.cart.cart); 
  const selectedDateString = useSelector((state) => state.cart.date)
  //const selectedTime = useSelector((state) => state.cart.time)
  const paiement = useSelector((state) => state.cart.paiement)
  //console.log('date store', selectedDateString)
  //console.log('time store', selectedTime)
  //console.log('paiement store', paiement)
  //console.log('cart items', cartItems)
  // const totalPrice = cartItems.reduce((total, item) => total + item.qty * item.prix, 0);
  const totalPrice = (cartItems.reduce((total, item) => total + item.qty * item.prix_unitaire, 0)).toFixed(2);

//   console.log(totalPrice)
const totalQuantity = cartItems.reduce((total, item) => total + item.qty, 0)
// console.log('qty', totalQuantity)

const [orderInfo, setOrderInfo] = useState(null);
const [checkoutSession, setCheckoutSession] = useState(null);
const [sessionId, setSessionId] = useState(null);
const [paymentStatus, setPaymentStatus] = useState(null);

const handleLogout = () => {
  dispatch(logoutUser(selectedStore));
  navigation.navigate('app')
}
const handleBack = () => {
  navigation.navigate('home');
};

useEffect(() => {
  if (orderInfo && paiement === 'online') {
    const submitOrder = async () => {
      const response = await axios.post('http://localhost:8080/checkout_session', { orderInfo });
      const sessionUrl = response.data.session;
      const sessionId = response.data.id
      //console.log('data id', sessionId)
      setSessionId(sessionId);
      const stripeCheckoutUrl = `${sessionUrl}`;
      setCheckoutSession(stripeCheckoutUrl);
      Linking.openURL(sessionUrl);
    };

    submitOrder();
  }
}, [orderInfo, paiement]);

useEffect(() => {
  if (checkoutSession) {
    checkPaymentStatus();
  }
}, [checkoutSession]);


//ENVOI DE LA COMMANDE VERS LE SERVER
  const submitHandler = async () => {
    console.log('******')
    console.log('Envoi de la commande au serveur - test')
    console.log('Contenu du panier :', cartItems);
    console.log('Nom:', user.lastname);
    console.log('Prénom', user.firstname)
    console.log('Magasin sélectionné :', selectedStore);
    console.log('Prix total :', totalPrice);
    console.log('Nb de produits:', totalQuantity);
    console.log('Jour sélectionné', selectedDateString);
    //console.log('Heure de retrait', selectedTime)
    console.log('type de paiement', paiement)
    console.log('******')

    setOrderInfo({
      cartItems,
      user,
      selectedStore,
      totalPrice,
      totalQuantity,
      selectedDateString,
      paiement
    });
    
  }

  useEffect(() => {
    let id = null;
  
    if (sessionId) {
      // Vérifiez l'état du paiement toutes les 2 secondes
      id = setInterval(() => {
        checkPaymentStatus();
      }, 2000);
    }
  
    // Nettoyez l'intervalle lorsque le composant est démonté ou lorsque l'ID de session change
    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [sessionId]);

// Vérifier l'état du paiement
const checkPaymentStatus = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/paiementStatus?sessionId=${sessionId}`);
    //console.log('response front', response)
     const { status } = response.data;
     //rajouter idPayment
   
  //   if (status === 'paid') {
  //     setSessionId(null); // Cela déclenchera le nettoyage de l'intervalle dans le hook useEffect
  //     console.log('stop interval')
  //     navigation.navigate('success')
  //     //mettre à jour commande avec idpayment
  //   }
    
  //   setPaymentStatus(status);
  //   // console.log('Payment ID:', paymentId);
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'état du paiement :', error);
    // navigation.navigate('echec')
  }
};


  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const day = date.getDate().toString().padStart(2, '0');
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   const year = date.getFullYear().toString();
  //   const hours = date.getHours().toString().padStart(2, '0');
  //   const minutes = date.getMinutes().toString().padStart(2, '0');
  //   return `${day}-${month}-${year} ${hours}h${minutes}`;
  // };

   return (
    <View style={{ ...defaultStyle, alignItems: 'center', backgroundColor: 'white', margin: 30, paddingHorizontal: 5 , paddingTop:10}}>

      <View style={{flexDirection:'row', justifyContent:'space-between', width:"100%"}}>
            <Icon name="arrow-back" size={30} color="#900" onPress={handleBack}/>
            <Icon name="logout" size={30} color="#000" onPress={() => handleLogout()}/>
      </View>
      <ScrollView vertical showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
      <Text>Contenu du panier :</Text>
      {cartItems.map(item => (
        <View key={item.productId} style={styles.itemContainer}>
          <Text>{item.libelle}</Text>
          <Text>Prix unitaire : {item.prix_unitaire}</Text>
          <Text>Quantité : {item.qty}</Text>
          
        </View>
      ))}
      <View>
        <Text> Prix total: {totalPrice} euros</Text>
        <Text>Nb de produits: {totalQuantity}</Text>
      </View>
      <View style={{marginVertical:40}}>    
        <Text>Informations Client:</Text>
        <Text>Utilisateur : {user.firstname} {user.lastname}</Text>
        {
            user.adresse ? <Text>Adresse : {user.adresse}</Text> : <Text>Adresse : <Text style={{color:'lightgray', fontStyle:'italic'}}>Non renseigné</Text></Text>
        }
        {
            user.telephone ? <Text>Telephone : {user.telephone}</Text> : <Text>Telephone : <Text style={{color:'lightgray', fontStyle:'italic'}}>Non renseigné</Text></Text>
        }
        {
          selectedDateString ? <Text>Retrait: {selectedDateString }</Text> : <Text>Retrait : <Text style={{color:'lightgray', fontStyle:'italic'}}>Non renseigné</Text></Text>
        }
        {/* non visible pour les collaborateurs car tournée du camion */}
        {/* {
          selectedTime ? <Text>Heure: {selectedTime }</Text> : <Text>Heure : <Text style={{color:'lightgray', fontStyle:'italic'}}>Non renseigné</Text></Text>
        } */}
        
        {
          paiement ? 
          (
          <>
          { paiement === 'online'? ( <Text>Choix du paiement: En ligne</Text> ) : null }
          { paiement === 'onsite'? ( <Text>Choix du paiement: Sur place</Text> ) : null }
          </>
          ) 
          : <Text>Choix du paiement : <Text style={{color:'lightgray', fontStyle:'italic'}}>Non renseigné</Text></Text>
        }
        
      <Text>Magasin : {selectedStore.nom_magasin}</Text>
      </View>
      <Button
                style={styles.btn} 
                textColor={'white'} 
                onPress={submitHandler}
                >
                VALIDER
      </Button>
      {/* {checkoutSession && <WebView ref={webViewRef} source={{ uri: checkoutSession }} onNavigationStateChange={handleNavigationChange} />} */}
      {checkoutSession && <WebView ref={webViewRef} source={{ uri: checkoutSession }} />}

     
    </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
  },
  btn: {
    backgroundColor: 'red',
    margin: 20,
    padding: 6,
  }
});

export default OrderConfirmation;
