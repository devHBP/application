import { StyleSheet } from 'react-native';
import { colors, fonts } from '../styles/styles'

const style = StyleSheet.create({
    title:{
        fontFamily:fonts.font1,
        fontSize:20,
        paddingBottom:10,
        color:colors.color1
    },
    choixTitle:{
        textAlign:'center',
        fontSize:20,
        padding:10,
        backgroundColor:colors.color3,
    },
    scrollProduct:{
        height:280,
        paddingHorizontal:20
    },
    sandwichImage: {
        width: 150,
        height: 100,
        borderRadius: 10,
    },
    menu:{
        height:110,
        backgroundColor: '#fff',
        padding: 10,
        elevation: 2, 
        shadowColor: '#000', 
        shadowOpacity: 0.6, 
        shadowOffset: { width: 0, height: 1 }, 
        shadowRadius: 2, 
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginBottom:65,
        width:"100%"
    },
    disabledCheckBox: {
      opacity: 0.2, 
    },
    btn:{
      backgroundColor:colors.color2,
      height:40,
      width:160,
      borderRadius:5,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      // paddingHorizontal:10,
      // textAlign:'center'
    },
    disabledBtn:{
      backgroundColor:colors.color3,
    },
    bandeauFormule:{
      flexDirection:'row', 
      width:180, 
      justifyContent:'space-between',
    },
   
    checkButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'gray',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 5,
    },
    checkInnerCircle: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.color1,
    },

    //page produit
    texte_page_produit:{
      color:colors.color1,
      fontSize:15,
      fontFamily:fonts.font2,
      fontWeight: "400"
    },
    titleProduct:{ 
      color: "white",
      fontFamily:fonts.font1,
      fontSize:24,
      width:"80%"
    },
    btnPaiement:{
      backgroundColor:colors.color9,
      paddingHorizontal:10,
      paddingVertical:5,
      borderRadius:5,
      width:130,
      height:35
    }
  }
)

export { style };