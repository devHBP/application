import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useEffect, useState} from 'react'
import { fonts, colors} from '../styles/styles'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector} from 'react-redux'
import { Button } from 'react-native-paper'
import axios from 'axios'
import FooterProfile from '../components/FooterProfile';

//call Api
import { getStoreById } from '../CallApi/api';

const Orders = ({navigation}) => {

    let API_BASE_URL = 'http://127.0.0.1:8080';

//     if (Platform.OS === 'android') {
//       if (__DEV__) {
//           API_BASE_URL = 'http://10.0.2.2:8080'; // Adresse pour l'émulateur Android en mode développement
//       } 
//   }

    const user = useSelector((state) => state.auth.user);
    const userId = user.userId
    const [store, setStore] = useState(null); 
    // const [orders, setOrders] = useState([]);
    const [expandedOrderIds, setExpandedOrderIds] = useState([]);
    const [cancelledOrder, setCancelledOrder] = useState(null);
    const [lastOrder, setLastOrder] = useState(null);
    const [previousOrders, setPreviousOrders] = useState([]);
    const [ hasOrder, setHasOrder] = useState(false)

    const handleBack = () => {
        navigation.navigate('home');
    };
    
    const handleCancel = async (orderId) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/cancelOrder`, { orderId });
            setCancelledOrder(orderId); 
        } catch (error) {
            console.error('An error occurred while updating the order status:', error);
        }
    }
    const handleReorder = () => {
        console.log('reorder')
    }
    //mise à jour des commandes si commande annulée
    useEffect(() => {
        if (cancelledOrder !== null) {
          allMyOrders();
        }
      }, [cancelledOrder]);
    
      //recupérer toutes les commandes du user
      const allMyOrders = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/ordersOfUser/${userId}`);
          const orders = response.data;
          console.log('orders', orders)
          if(orders.length > 0){
            console.log('commande presente')
            setHasOrder(true)
          } else {
            console.log('pas de commande')
          }
          const ordersWithDetails = await Promise.all(orders.map(async order => {
            const productResponse = await axios.get(`${API_BASE_URL}/getOrderProducts/${order.orderId}`);
            const products = productResponse.data;
            const store = await getStoreById(order.storeId);
            console.log(store)
            //console.log(products)
            return { ...order, products, store };
          }));
      
          
          //setOrders(ordersWithDetails);
          //setOrders(ordersWithDetails.sort((a, b) => new Date(b.orderId) - new Date(a.orderId)));
          const sortedOrders = ordersWithDetails.sort((a, b) => new Date(b.orderId) - new Date(a.orderId));
          setLastOrder(sortedOrders[0]);
          setPreviousOrders(sortedOrders.slice(1));
          
        } catch (error) {
          console.error("Une erreur s'est produite :", error);
        }
      };
    
      useEffect(() => {
        allMyOrders();
      }, []);

      const formatDate = (dateString) => {
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
        return (
            <View style={lastOrder ? style.lastOrderContainer : { borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor:colors.color6, marginVertical:5}}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems:'center', gap:10 }}
                    onPress={() => {
                        if (expandedOrderIds.includes(item.orderId)) {
                            setExpandedOrderIds(prevIds => prevIds.filter(id => id !== item.orderId));
                        } else {
                            setExpandedOrderIds(prevIds => [...prevIds, item.orderId]);
                        }
                    }}
                    activeOpacity={1}
                >
                    <View style={{flexDirection:'row',justifyContent:'center', width:"100%", alignItems: 'center', gap:20}}>
                        <View style={{flexDirection:'column', justifyContent:'flex-start'}}>
                            <Text style={{color:colors.color1, fontWeight:"bold"}}>{item.status.charAt(0).toUpperCase() + item.status.substring(1)}</Text>
                            <Text style={{color:colors.color5, fontSize:10}}>OrderID: {item.orderId}</Text>
                        </View>
                        <View style={{flexDirection:'column', justifyContent:'flex-start', borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderColor: colors.color4,
                                paddingHorizontal:10}}>
                            <Text style={{color:colors.color1, fontWeight:"bold"}}>{item.store && item.store.nom_magasin}</Text>
                            <Text style={{color:colors.color5, fontSize:10}}>{formatDate(item.createdAt)}</Text>
                        </View>
                        <View style={{flexDirection:'column', justifyContent:'flex-start'}}>
                            <Text style={{color:colors.color2, fontWeight:"bold"}}>{item.prix_total}€</Text>
                            <Text style={{color:colors.color5, fontSize:10}}>{item.productIds.split(",").length}x Articles</Text>
                        </View>
                        <View style={{backgroundColor:'lightgrey', borderRadius:25, justifyContent:'center'}}> 
                            <Icon name={expandedOrderIds.includes(item.orderId) ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={28} color={colors.color4}  />
                        </View>
                    </View>
                </TouchableOpacity>
                {expandedOrderIds.includes(item.orderId) && (
                    <View style={{ flex:1, paddingLeft: 10 , marginVertical:10, marginHorizontal:30}}>
                        <Text>Détails de la commande</Text>
                        {/* <Text>Numéro de commande: {item.numero_commande}</Text> */}
                        {item.products && item.products.map(product => {
                            return (
                                <View key={product.productId} style={{marginVertical:5, flexDirection:'row', justifyContent:'space-between'}}>
                                    <Text>{product.quantity}x {product.libelle}</Text>
                                    <Text>{product.prix_unitaire || product.prix_formule}€</Text>
                                </View>
                            );
                        })}
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <Text style={{fontSize:14, fontWeight: "600"}}>Votre total:</Text>
                            <Text style={{color:colors.color2, fontWeight:"bold"}}>{item.prix_total}€</Text>
                        </View>
                       <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                            <TouchableOpacity onPress={handleReorder} style={{...style.btnReorder,flexDirection:'row', gap:10, alignItems:'center',justifyContent:'center',  width:'35%', marginVertical:10 }}>
                                <Image
                                source={require('../assets/reorder.png')} 
                                style={{width:12, height:12}}
                                />
                                <Text style={{color:'white', fontSize:12}}>Renouveler</Text>
                            </TouchableOpacity>
                       </View>
                    </View>
                )}
            </View>
        )
    }
    //derniere commande
    const renderLastOrder = (item, index) => {
        return (
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                <Text style={{paddingLeft:30,  marginVertical:20, fontFamily:fonts.font3, fontWeight: "600", color:colors.color1, fontSize:16}}>Votre derniere commande</Text>
                <View style={{backgroundColor:colors.color4, height:'auto', paddingHorizontal:30}}>
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems:'center', gap:10 }}
                    >
                        <View>
                            <Text style={{color:colors.color5, fontSize:10}}>OrderID: {item.orderId}</Text>
                            <Text style={{color:colors.color5, fontSize:10}}>{formatDate(item.createdAt)}</Text>
                        </View>
                        <View>
                            <Text style={{color:colors.color1, fontSize:14, fontWeight: "600"}}>{item.store && item.store.nom_magasin}</Text>
                        </View>
                        
                    </View>

                    <View style={{ flex:1, marginVertical:10,}}>
                    {item.products && item.products.map(product => {
                        return (
                            <View key={product.productId} style={{marginVertical:10}}>
                                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                    <Text>{product.quantity}x {product.libelle}</Text>
                                    <Text>{product.prix_unitaire || product.prix_formule}€</Text>
                                </View>   
                            </View>
                        );
                    })}
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={{fontSize:14, fontWeight: "600"}}>Votre total:</Text>
                        <Text style={{color:colors.color2, fontWeight:"bold"}}>{item.prix_total}€</Text>
                    </View>
                   
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:"100%", marginVertical:20}}>
                        
                        <Text>{item.status.charAt(0).toUpperCase() + item.status.substring(1)}</Text>
                        
                        <View style={style.btnReorder}>
                            <TouchableOpacity onPress={handleReorder} style={{flexDirection:'row', gap:10, alignItems:'center'}}>
                                <Image
                                source={require('../assets/reorder.png')} 
                                style={{width:12, height:12}}
                                />
                                <Text style={{color:'white', fontSize:12}}>Renouveler</Text>
                            </TouchableOpacity>
                            
                        </View>
                    </View>
                    
                </View>
                </View>
            </View>
        )
    }

    const ListHeader = ({ lastOrder }) => (
        <View>
          {lastOrder && renderLastOrder(lastOrder)}
          <Text style={{ paddingHorizontal: 30, marginVertical: 10, fontFamily: fonts.font3, fontWeight: "600", color: colors.color1, fontSize: 16 }}>Vos commandes antérieures</Text>
        </View>
      )
    
  return (

    
    <>
    
    
        
            {
                hasOrder ? (
                    <View style={{ flex:1,  alignItems: 'center', backgroundColor:colors.color3}}>
                    <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap:70, marginTop:30 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", fontFamily:fonts.font1}}>Vos commandes</Text>
                        <TouchableOpacity onPress={handleBack} style={style.back}>
                            <Icon name="keyboard-arrow-left" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                            <View style={{flex:1, width:"100%"}}>
                                        <FlatList
                                            data={previousOrders}
                                            renderItem={({ item, index }) => renderOrder(item, index)}
                                            keyExtractor={item => item.orderId.toString()}
                                            ListHeaderComponent={lastOrder ? <ListHeader lastOrder={lastOrder} /> : null}
                                        />     
                            </View>
                </View>
             
                </View>
                )
                :
                (
                    <View style={{ flex:1,  alignItems: 'center', backgroundColor:colors.color3}}>
                        <View >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap:70, marginVertical:30 }}>
                                    <Text style={{ fontSize: 20, fontWeight: "bold", fontFamily:fonts.font1}}>Vos commandes</Text>
                                    <TouchableOpacity onPress={handleBack} style={style.back}>
                                        <Icon name="keyboard-arrow-left" size={30} color="#fff" />
                                    </TouchableOpacity>
                                </View>

                        <View style={{backgroundColor:'white', flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:100, borderRadius:20}}>
                            <Text>Pas de commandes encore</Text>
                        </View>
                    </View>
                    </View>
                )
            }
        
    
    <FooterProfile />
    </>
    
    
  )
}

const style = StyleSheet.create({
    btn:{
        backgroundColor:colors.color2,
        borderRadius:5,
        paddingHorizontal:5,
        paddingVertical:5,
    },
    back:{
        backgroundColor: colors.color1,
        width:40,
        height:40,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:25
      },
      btnReorder:{
        backgroundColor:colors.color2,
        borderRadius:5,
        paddingHorizontal:5,
        paddingVertical:5,
      }
})

export default Orders