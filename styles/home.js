import { StyleSheet } from 'react-native';
import { colors } from '../styles/styles'


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
    fontWeight: 'bold',
    color: colors.color1
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
    width: "60%",
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
    position: 'absolute',
    color: 'white',
    top: 20,
    left: 20,
    fontSize: 30,
    width: 200,
    fontWeight: 'bold'
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
