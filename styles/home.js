import { StyleSheet } from 'react-native';
import { colors, fonts } from '../styles/styles'


const styles = StyleSheet.create({
  bandeau: {
    flexDirection: 'row',
    width: "100%",
    justifyContent: "space-between",
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 40,
  },
  logos: {
    flexDirection: 'row',
    gap: 10,
  },
  picker: {
    color: 'red',
    fontWeight: 'bold',
    width: 70
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'center',
    marginVertical: 20,
    marginLeft: 30
  },
  btn_categorie: {
    borderRadius: 6,
    height: 40,
    marginVertical: 5,
    marginRight: 10,
    paddingVertical: 11,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  categoryTitle: {
    width: "100%",
    marginVertical: 10,
    marginLeft: 30,
    color: colors.color1,
    fontFamily:fonts.font2,
    fontSize:20,
    fontWeight:'600'
  },
  scrollHorizontal: {
    marginLeft: 30,
  },
  cardScrollview: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // width: "100%",
    // paddingBottom: 40 ,
  },
  productContainer: {
    width: 200,
    paddingRight: 5,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    width: "55%",
    paddingHorizontal: 0,
    marginHorizontal: 0
  },
  searchBarInputContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    width: "80%",
    padding: 0,
    margin: 0

  },
  scrollTop: {
    marginBottom: 100,
    textAlign: 'center'
  },
  titleFormule: {
   color:colors.color2,
   fontSize:20,
   fontWeight: 'bold',
  },
  textFormule:{
    color:colors.color1,
    fontSize:14,
    fontWeight: 500,
    width:250
  },
  cardTitle:{
    backgroundColor:'white',
    height:57,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    justifyContent:'center',
    paddingHorizontal:10
  },
  bordersPicker: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.color4,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    paddingHorizontal: 20
  },
  text1formule:{
    fontFamily:fonts.font2,
    color:colors.color1, 
    fontSize:16,
    fontWeight:'600'
  },
  text2formule:{
    color:colors.color2,
    fontFamily:fonts.font2,
    fontSize:24,
    fontWeight:'600'
  },
  container_offre_antigaspi:{
    width:"100%",
    height:100,
    flexDirection:'row',
    backgroundColor:colors.color6,
    borderBottomLeftRadius:10, 
    borderBottomRightRadius:10,
  },
  text_antigaspi:{
    flexDirection:'column',
    justifyContent:'center',
    paddingLeft:20
  },
  texte_offre:{
    color:colors.color1,
    fontFamily:fonts.font2,
    fontSize:20,
    fontWeight:'700',
  },
  texte_anti:{
    color:colors.color8,
    fontFamily:fonts.font2,
    fontSize:24,
    fontWeight:'700'
  },
  pastille:{
    height:'100%',
    flexDirection:'row',
    alignItems:'center',
    paddingLeft:40
  },
  text_offre31:{
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'flex-end',
    paddingLeft:20
  },
  texte_offre31:{
    color:colors.color1,
    fontFamily:fonts.font2,
    fontSize:18,
    fontWeight:'700',
  },
  texte_gratuit:{
    color:colors.color2,
    fontFamily:fonts.font2,
    fontSize:20,
    fontWeight:'900'
  },
  titleFormule_envie:{
    fontSize:24,
    color:colors.color2,
    textAlign:'center',
    fontFamily:fonts.font3,
    fontWeight:'700'
  },
  pastilleSolanid:{
    position:'absolute',
    width:50,
    height:50,
    top:10,
    right:10, 
    transform: [{rotate: '28deg'}]
  },
  pastilleOffre31:{
    width: 150, 
    height: 150, 
    resizeMode:'cover',
    transform: [{rotate: '28deg'}],
    position:'absolute',
    bottom:-40,
    right:5
  },
  texteOffre:{
    fontSize:15,
    color:colors.color1,
    fontFamily:fonts.font2
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 20,
    color: colors.color1,
    fontWeight: 'bold'
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

export { styles, pickerSelectStyles };
