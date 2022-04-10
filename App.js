import React from 'react';
import { Text, View, StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './pages/Home'
import Producao from './pages/Producao/Producao'
import Estoque from './pages/Estoque/Etoque'
import Moldes  from './pages/Moldes/moldes';
import Materiais from './pages/Material/index';
import Gastos from './pages/Gastos/index';
import Login from './pages/Login';
import FolhaSalarial from './pages/Folha_Salarial/index'

const Stack = createNativeStackNavigator();

function App({navigation}) {
  return (
    <NavigationContainer>
      <StatusBar barStyle='light-content'/>
      <StatusBar 
        barStyle='default'
        backgroundColor="#027381"
      />
      <Stack.Navigator screenOptions={{ }}>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Produção" component={Producao} options={{ headerShown: false }}/>
      <Stack.Screen name="Estoque" component={Estoque} options={{ headerShown: false }}/>
      <Stack.Screen name="Moldes" component={Moldes} options={{ headerShown: false }}/>
      <Stack.Screen name="Materiais" component={Materiais} options={{ headerShown: false }}/>
      <Stack.Screen name="Gastos" component={Gastos} options={{headerShown: false}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
      <Stack.Screen name="FolhaSalarial" component={FolhaSalarial} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
