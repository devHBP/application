import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack' 
import App from './Screens/App'
import Login from './Screens/Login'
import Signup from './Screens/Signup'

const Main = () => {

    const Stack = createNativeStackNavigator();

      return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='app' screenOptions={{headerShown:false}}>
                <Stack.Screen name='app' component={App}/>
                <Stack.Screen name='login' component={Login}/>
                <Stack.Screen name='signup' component={Signup}/>
            </Stack.Navigator>
        </NavigationContainer>
        
      )
    }
export default Main
