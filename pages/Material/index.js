import React, { useEffect, useState } from 'react';
import { Text, View } from "react-native";
import auth from '@react-native-firebase/auth';
import Ionicons from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Materiais from "./Materiais";
import MateriaisUso from "./Material_uso";
import Finalizados from './Finalizados';

const Tab = createBottomTabNavigator();

export default function App() {

      return (
        <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Finalizados") {
            iconName = focused ? "shield-checkmark-sharp" : "shield-checkmark-outline";
          }
          if (route.name === "Matéria") {
            iconName = focused ? "pricetags" : "pricetag-sharp";
          } else if (route.name === "Em Uso") {
            iconName = focused ? "reader" : "reader-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Matéria" component={Materiais} options={{ headerShown: false }} />
      <Tab.Screen name="Em Uso" component={MateriaisUso} options={{ headerShown: false }} />
      <Tab.Screen name="Finalizados" component={Finalizados} options={{ headerShown: false}} />

    </Tab.Navigator>
      )
 
}
