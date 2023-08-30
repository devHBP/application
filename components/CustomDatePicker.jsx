import { View, Text , TouchableOpacity} from 'react-native'
import React, {useState, useEffect} from 'react'
import { styles } from '../styles/home'; 
import { fonts, colors} from '../styles/styles'
import DatePicker from 'react-native-date-picker'
import { useSelector, useDispatch } from 'react-redux'
import {  updateUser} from '../reducers/authSlice';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { addDate, addTime} from '../reducers/cartSlice';
import axios from 'axios'
import {  API_BASE_URL, API_BASE_URL_ANDROID, API_BASE_URL_IOS } from '@env';



const CustomDatePicker = () => {

 //pour les test
 if (__DEV__) {
  if (Platform.OS === 'android') {
      API_BASE_URL = API_BASE_URL_ANDROID;
  } else if (Platform.OS === 'ios') {
      API_BASE_URL = API_BASE_URL_IOS;  
  }
}
  

    const dateRedux = useSelector((state) => state.cart.date)
    
    const [date, setDate] = useState( dateRedux ||  null)
    //console.log('Date redux',dateRedux)
    //console.log("Date initialisée:", date);
    const [openDate, setOpenDate] = useState(false)
    const [role, setRole] = useState('');
    const [time, setTime] = useState()
    const [openTime, setOpenTime] = useState(false)

   
    const timeRedux = useSelector((state) => state.cart.time)
    const user = useSelector((state) => state.auth.user);


    const dispatch = useDispatch();

    const isTomorrowOrLater = (selectedDate) => {
      const currentDate = new Date();
      currentDate.setHours(23, 59, 0, 0); // Set current date to today at 23:59
      return selectedDate >= currentDate;
    };
      useEffect(() => {
        // Effectuez une requête GET pour récupérer le rôle de l'utilisateur
        axios.get(`${API_BASE_URL}/getOne/${user.userId}`)
        //axios.get(`http://10.0.2.2:8080/getOne/${user.userId}`)
          .then(response => {
            //console.log(response.data.role)
            const role  = response.data.role;
             setRole(role); 
             dispatch(updateUser(response.data))
          })
          .catch(error => {
            console.error('Erreur lors de la récupération du rôle de l\'utilisateur:', error);
          });
      }, [])

     

    const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    //const hours = date.getHours().toString().padStart(2, '0');
    //const minutes = date.getMinutes().toString().padStart(2, '0');
    //const seconds = date.getSeconds().toString().padStart(2, '0');
    //return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    //return `${year}-${month}-${day}`;
    //test pour affichage dans le picker
   return `${day}/${month}/${year}`;

    //attention ici au format de la date - a bien verifier dans le order_ctrl (moment.js)
  };

  // heure non formaté pour l'instant - inutile pour les collaborateurs
  const formatTime = (dateString) => {
    const time = new Date(dateString);
    //const day = date.getDate().toString().padStart(2, '0');
    //const month = (date.getMonth() + 1).toString().padStart(2, '0');
    //const year = date.getFullYear().toString();
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    //return `${day}-${month}-${year} ${hours}h${minutes}`;
    return `${hours}h${minutes}`;
  };


  return (
    <View>
    <View>
      {/* // Selection Jour  */}
      <TouchableOpacity onPress={() => setOpenDate(true)}  style={styles.bordersPicker}>
         {/* <Text>{dateRedux ? <Text style={style.picker}>{dateRedux}</Text> : "Choisissez votre jour"}</Text>  */}
            <Text style={styles.textPickerDate}>Pour quel jour</Text>
            <Text>
            {date ? 
          
            <Text style={styles.picker}>{dateRedux}</Text>
            :
            (
           
                  <Text style={styles.pickerNoDate}>jj/mm/aaaa</Text>
            )}
            </Text>
            {/* <Text style={{fontSize:10, color:colors.color2}}>Status</Text> */}
        </TouchableOpacity> 
        </View>
               <DatePicker
                cancelText= "Annuler"
                confirmText="Confirmer"
                locale="fr"
                modal
                open={openDate}
                date={date ? new Date() : new Date()}
                mode="date"
                onConfirm={(date) => {
                  
                  setOpenDate(false)
                  
                  if (!isTomorrowOrLater(date)) {
                    Toast.show({
                      type: 'error',
                      text1: 'Erreur, Vous arrivez trop tard pour cette date',
                    text2: 'Veuillez selectionner une nouvelle date',
                    });
                    return;
                  }
                //test date
                  const formattedDate = formatDate(date.toISOString());
                  setDate(formattedDate);
                  dispatch(addDate(formattedDate));
                  return Toast.show({
                    type: 'success',
                    text1: 'Succès',
                    text2: `Commande choisie pour le ${formattedDate}`
                  });
                
                }}
                onCancel={() => {
                  setOpenDate(false)
                }}
                minimumDate={new Date()}
                
              /> 
                 {role == 'client' && (
                <TouchableOpacity onPress={() => setOpenTime(true)} >
                  <Text>{timeRedux ? <Text style={styles.picker}>{timeRedux}</Text> : "Choisissez votre heure"}</Text>
                  </TouchableOpacity>
                  )}
                  {role === 'client' && (
                        <DatePicker
                          modal
                          open={openTime}
                          date={time ? new Date(time) : new Date()}
                          mode="time"
                          onConfirm={(time) => {
                            setOpenTime(false)
                            setTime(time)
                            dispatch(addTime(formatTime(time.toISOString()))); 
                            //converti en chaine de caractères
                            console.log('heure commande',formatTime(time))
                            //console.log('selection date store redux:', selectedDateString)
                            //console.log('selection date chaine de caractère:', selectedDateString)
                          }}
                          onCancel={() => {
                            setOpenTime(false)
                          }}
                        /> 
                  )} 
              </View>
    
  )
}

export default CustomDatePicker