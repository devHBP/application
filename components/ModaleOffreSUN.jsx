import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {colors} from '../styles/styles';
import {useDispatch} from 'react-redux';
import {addToCart} from '../reducers/cartSlice';
import logoSun from '../assets/logoSUNPremium.jpg';
import {useCountdown} from '../components/CountdownContext';

const ModaleOffreSUN = ({modalVisible, setModalVisible, product}) => {
  const {resetCountdown} = useCountdown();
  const dispatch = useDispatch();

  const handleAcceptOffer = () => {
    const newProduct = {
      productId: product.productId,
      libelle: product.libelle,
      image: product.image,
      prix_unitaire: product.prix_unitaire,
      qty: 1,
      type: 'offreSUN',
      type_produit:"offreSUN"
    };
    // console.log('newproduct', newProduct);
    dispatch(addToCart(newProduct));
    resetCountdown();

   
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image source={logoSun} style={styles.logoSUN} />
          <View style={styles.textContent}>
            <Text style={styles.textColor}>Je veux bénéficier de </Text>
            <Text style={styles.textColor}>
              {' '}
              ma baguette du jour gratuite !
            </Text>
          </View>

          <View style={styles.contentBtns}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              style={{...styles.btn, backgroundColor: colors.color8}}>
              <Text style={styles.colorTextBtn}>Refuser</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleAcceptOffer();
                setModalVisible(!modalVisible);
              }}
              style={styles.btn}>
              <Text style={styles.colorTextBtn}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.color6,
    padding: 20,
    borderRadius: 10,
    width: '80%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColor: {
    textAlign: 'center',
    color: colors.color1,
    fontSize: 16,
  },
  btn: {
    backgroundColor: colors.color9,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  contentBtns: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  colorTextBtn: {
    color: colors.color6,
  },
  textContent: {
    marginVertical: 20,
  },
  logoSUN: {
    width: 40,
    height: 40,
  },
});

export default ModaleOffreSUN;
