import { StyleSheet } from 'react-native';
import { colors, fonts } from '../styles/styles'

export const stylesInvite = StyleSheet.create({
    btn:{
        backgroundColor:colors.color9, 
        paddingVertical:8, 
        paddingHorizontal:10,
        borderRadius:5,
        flexDirection:'row',
        gap:5,
        alignItems:'center',
        justifyContent:'center'
      },
      textBtn:{
        color:colors.color6,
        fontFamily:fonts.font2,
        fontWeight:"700",
        fontSize:14
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
      },
      modalContent: {
        backgroundColor: colors.color1,
        padding: 20,
        borderRadius: 20,
        width: '80%',
        height: "60%",
        justifyContent: 'center',
        alignItems: 'center',
      },
  });  