import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState} from 'react'
import { defaultStyle} from '../styles/styles'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector} from 'react-redux'
import { Button } from 'react-native-paper'
import axios from 'axios'
import FooterProfile from '../components/FooterProfile';

const Orders = ({navigation}) => {

    const user = useSelector((state) => state.auth.user);
    const userId = user.userId
    const [orders, setOrders] = useState([]);
    const [expandedOrderIds, setExpandedOrderIds] = useState([]);
    const [cancelledOrder, setCancelledOrder] = useState(null);

    const handleBack = () => {
        navigation.navigate('home');
      };
    
    const handleCancel = async (orderId) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8080/cancelOrder`, { orderId });
            setCancelledOrder(orderId); 
        } catch (error) {
            console.error('An error occurred while updating the order status:', error);
        }
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
          const response = await axios.get(`http://127.0.0.1:8080/ordersOfUser/${userId}`);
          const orders = response.data;
          //console.log('orders', orders)
          const ordersWithDetails = await Promise.all(orders.map(async order => {
            const productResponse = await axios.get(`http://127.0.0.1:8080/getOrderProducts/${order.orderId}`);
            const products = productResponse.data;
            return { ...order, products };
          }));
      
          
          //setOrders(ordersWithDetails);
          setOrders(ordersWithDetails.sort((a, b) => new Date(b.orderId) - new Date(a.orderId)));

          
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
        return `${day}-${month}-${year} `;
    };

      //consctruction du tableau recapitulatif
      const renderItem = ({ item }) => (
        
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <TouchableOpacity
                style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems:'center', gap:10 }}
                onPress={() => {
                    if (expandedOrderIds.includes(item.orderId)) {
                        setExpandedOrderIds(prevIds => prevIds.filter(id => id !== item.orderId));
                    } else {
                        setExpandedOrderIds(prevIds => [...prevIds, item.orderId]);
                    }
                }}
            >
                <Text>{formatDate(item.createdAt)}</Text>
                <Text>{item.prix_total}€</Text>
                <Text>{item.status}</Text>
                <Icon name={expandedOrderIds.includes(item.orderId) ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color="#900" />
            </TouchableOpacity>
            {/* infos supplémentaires */}
            {expandedOrderIds.includes(item.orderId) && (
                <View style={{ flex:1, paddingLeft: 10 , marginVertical:10, alignItems:'center'}}>
                    <Text>Numéro de commande: {item.numero_commande}</Text>
                    {item.products && item.products.map(product => {
                   return (
                    <View key={product.productId} style={{marginVertical:10}}>
                        <Text>{product.quantity}x {product.libelle}</Text>
                        {/* Render other product details here */}
                    </View>
                );
                })}
                    <Button 
                        buttonColor='lightgray'
                        style={ style.btn} 
                        onPress={() => handleCancel(item.orderId)}
                        disabled={item.status === 'annulee'} 
                    >
                            Annuler
                    </Button>
                </View>
            )}
        </View>
        
    );
    
  return (
    <>
    <View style={{ ...defaultStyle, alignItems: 'center', backgroundColor: 'white', margin: 30, paddingHorizontal: 5 }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Icon name="arrow-back" size={30} color="#900" onPress={handleBack} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>Mes commandes</Text>
        </View>

        <View>
            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={item => item.orderId.toString()}
            />
        </View>

    </View>
    <FooterProfile />
        </>
    
    
  )
}

const style = StyleSheet.create({
    btn:{
        marginVertical:10,
        width:"50%",
    }
})

export default Orders

