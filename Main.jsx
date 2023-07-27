import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack' 
import  Toast  from 'react-native-toast-message'
import App from './Screens/App'
import Login from './Screens/Login'
import Signup from './Screens/Signup'
import Home from './Screens/Home'
import Panier from './Screens/Panier'
import SuccessPage from './Screens/SuccessPage'
import ChoixPaiement from './Screens/ChoixPaiement'
import OrderConfirmation from './Screens/OrderConfirmation'
import Stores from './Screens/Stores'
import Profile from './Screens/Profile'
import ProductDetails from './Screens/ProductDetails'
import Orders from './Screens/Orders'
import Cookies from './Screens/Cookies'
import Donnees from './Screens/Donnees'
import Mentions from './Screens/Mentions'
import FormuleSandwich from './Screens/Formules/FormuleSandwich'
import FormulePoke from './Screens/Formules/FormulePoke'
import FormuleSalade from './Screens/Formules/FormuleSalades'
import FormulePizzas from './Screens/Formules/FormulePizzas'
import FormuleWraps from './Screens/Formules/FormuleWraps'
import FormulePainBagnat from './Screens/Formules/FormulePainBagnat'
import FormuleBurger from './Screens/Formules/FormuleBurger'
import FormuleCroques from './Screens/Formules/FormuleCroque'
import FormulePanini from './Screens/Formules/FormulePanini'
import FormuleQuiche from './Screens/Formules/FormuleQuiche'
import PageSandwich from './Screens/PagesSalées/PageSandwich'
import FormuleArtisan from './Screens/Formules/FormuleArtisan'
import FormulePetitDejeuner from './Screens/Formules/FormulePetitDejeuner'
import FormulePetitDejeunerGourmand from './Screens/Formules/FormulePetitDejeunerGourmand'


const Main = () => {

    const Stack = createNativeStackNavigator();

    const linking = {
      prefixes: ['clickandcollect://'],
      config: {
        screens: {
          success: 'success',
          // echec: 'echec',
        },
      },
    };

      return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator initialRouteName='app' screenOptions={{headerShown:false}}>
                <Stack.Screen name='app' component={App}/>
                <Stack.Screen name='login' component={Login}/>
                <Stack.Screen name='signup' component={Signup}/>
                <Stack.Screen name="stores" component={Stores}/>
                <Stack.Screen name='home' component={Home}/>
                    {/*  Formules  */}
                    <Stack.Screen name='formulesandwich' component={FormuleSandwich}/>
                    <Stack.Screen name='formulepoke' component={FormulePoke}/>
                    <Stack.Screen name='formulesalade' component={FormuleSalade}/>
                    <Stack.Screen name='formulepizza' component={FormulePizzas}/>
                    <Stack.Screen name='formulewrap' component={FormuleWraps}/>
                    <Stack.Screen name='formulepainbagnat' component={FormulePainBagnat}/>
                    <Stack.Screen name='formuleburger' component={FormuleBurger}/>
                    <Stack.Screen name='formulecroque' component={FormuleCroques}/>
                    <Stack.Screen name='formulepanini' component={FormulePanini}/>
                    <Stack.Screen name='formulequiche' component={FormuleQuiche}/>
                    {/* Pages salées */}
                    <Stack.Screen name='sandwich' component={PageSandwich}/>
                    {/* Formules petit dejeuner */}
                    <Stack.Screen name='artisan' component={FormuleArtisan}/>
                    <Stack.Screen name='petitdej' component={FormulePetitDejeuner}/>
                    <Stack.Screen name='petitdejgourmand' component={FormulePetitDejeunerGourmand}/>
                <Stack.Screen name='details' component={ProductDetails}/>
                <Stack.Screen name='profile' component={Profile}/>
                <Stack.Screen name='orders' component={Orders}/>
                <Stack.Screen name='panier' component={Panier}/>
                <Stack.Screen name='choixpaiement' component={ChoixPaiement}/>
                <Stack.Screen name='orderconfirm' component={OrderConfirmation}/>
                <Stack.Screen name='success' component={SuccessPage}/>
                <Stack.Screen name='cookies' component={Cookies}/>
                <Stack.Screen name='donnees' component={Donnees}/>
                <Stack.Screen name='mentions' component={Mentions}/>
            </Stack.Navigator>
           

            <Toast  position="bottom"/>
        </NavigationContainer>        
      )
    }
export default Main
