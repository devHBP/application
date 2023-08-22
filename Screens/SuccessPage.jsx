import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect} from 'react'
import { defaultStyle, colors, fonts} from '../styles/styles'
import { Button } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux';
import { clearCart} from '../reducers/cartSlice';
import FooterProfile from '../components/FooterProfile';
import { Rating } from 'react-native-ratings';



const SuccessPage = ({navigation}) => {

    const [modalVisible, setModalVisible] = React.useState(false);

    const openRatingModal = () => {
        setModalVisible(true);
    }

    const closeRatingModal = () => {
        setModalVisible(false);
    }

    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart.cart); 


    useEffect(() => {
      if (cart.length > 0) {
          dispatch(clearCart())
      }
  }, [cart, dispatch]);

    const submitHandler = async () => {

        navigation.navigate('home')
    }

  return (
   <>
        <View style={style.container}>

            <View style={style.centeredTextContainer}>
              <View style={style.centeredText}>
                  <Text>Merci d'avoir commandé chez nous ! </Text>
              </View>
              <View style={style.centeredText}>
                  <Text style={{textAlign:'center'}}>Vous recevrez un message quand la commande sera prête à être récupérée </Text>
              </View>
            </View>
        <View style={style.contentWrapper}>
            
            {/* <View style={style.ratingContainer}>
              <Rating
                  startingValue={5}
                  onFinishRating={(rating) => console.log("Rating selected - ", rating)}
                  style={{ paddingVertical: 10 }}
              />
          </View> */}
            <View style={style.centeredButton}>
            <TouchableOpacity onPress={openRatingModal} style={style.btnBack} >
                        <Text style={style.textBtnBack}>Donner son avis</Text>
                    </TouchableOpacity>
                <TouchableOpacity onPress={submitHandler} style={style.btnBack} >
                    <Text style={style.textBtnBack}>Retourner à l'accueil</Text>
                </TouchableOpacity>
            </View>
        </View>

        <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeRatingModal}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: '90%', height: '60%', backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center', borderColor:'lightgray', borderWidth:1, justifyContent:'center',gap:10 }}>
                            <TouchableOpacity onPress={closeRatingModal} style={{ position:'absolute', top:0, right:10 }}>
                                <Text style={{ fontSize: 36 }}>&times;</Text>
                            </TouchableOpacity>
                                <Text>Votre option nous intéresse !</Text>
                                <Text>Comment s'est déroulée votre expérience d'achat ?</Text>
                                <Rating
                                    startingValue={5}
                                    onFinishRating={(rating) => console.log("Rating selected - ", rating)}
                                    style={{ paddingVertical: 10 }}
                                />
                         
                            
                        </View>
                    </View>
                </Modal>
        
    </View>
    <FooterProfile />

    </>
  )
}
const style = StyleSheet.create({
    
    container:{
        flex:1,
        flexDirection:'column',
        // padding:20,
        justifyContent:'center',
        alignItems:'center',
        //reajustement margin pour laisser de la place au footer
        // marginBottom:70,
        backgroundColor:'white', 
        borderRadius:10,
        gap:150, paddingHorizontal:30
    },
    btnBack: {
        backgroundColor:colors.color9,
        paddingVertical:10,
        paddingHorizontal: 20,
        borderRadius:5,
        width:200
    },
    textBtnBack:{
      color:colors.color6,
      fontSize:16,
      textAlign:'center'
    },
    contentWrapper: {
      alignItems: 'center',
      gap: 20
  },
  centeredTextContainer: {  
    justifyContent: 'center',
    alignItems: 'center',
  },  
  centeredText: {
    alignSelf: 'center',
    textAlign: 'center',  
    width: '100%',       
  },
  centeredButton: {
      alignSelf: 'center', 
      width: 200,
      gap:10
  },
  ratingContainer: {
    alignItems: 'center',
    marginTop: 10,
},

})

export default SuccessPage