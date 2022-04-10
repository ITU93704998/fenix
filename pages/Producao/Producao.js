import React, { useEffect, useState } from 'react';
import { Text, View } from "react-native";
import auth from '@react-native-firebase/auth';
import Ionicons from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Corte from "./Corte/index";
import Mesa from "./Mesa/index"
import Costura from "./Costura/index"
import Fim from './Fim/index'
import History from "./History";
import List from './List/index';

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }


  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (user.uid != 'v7RPkSgKE7PwUo6fnyDbR3JSFU23') {
      return (
        <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Mesa") {
            iconName = focused
              ? "ios-file-tray-stacked"
              : "ios-file-tray-stacked-outline";
          }

          if (route.name === "Fim") {
            iconName = focused
              ? "md-checkmark-done-sharp"
              : "md-checkmark-done-outline";
          }
          
          if (route.name === "Histórico") {
            iconName = focused
              ? "timer"
              : "timer-outline";
          }

          if (route.name === "Caderneta") {
            iconName = focused
              ? "list"
              : "md-list-outline";
          }
          

          if (route.name === "Corte") {
            iconName = focused ? "ios-cut" : "ios-cut";
          } else if (route.name === "Costura") {
            iconName = focused ? "md-barcode" : "md-barcode";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Costura" component={Costura} options={{ headerShown: false }} />
      <Tab.Screen name="Fim" component={Fim} options={{ headerShown: false }} />
      <Tab.Screen name="Caderneta" component={List} options={{ headerShown: false }} />

    </Tab.Navigator>
      )
  }else{

    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Mesa") {
              iconName = focused
                ? "ios-file-tray-stacked"
                : "ios-file-tray-stacked-outline";
            }

            if (route.name === "Fim") {
              iconName = focused
                ? "md-checkmark-done-sharp"
                : "md-checkmark-done-outline";
            }
            
            if (route.name === "Histórico") {
              iconName = focused
                ? "timer"
                : "timer-outline";
            }
            if (route.name === "Caderneta") {
              iconName = focused
                ? "list"
                : "md-list-outline";
            }

            if (route.name === "Corte") {
              iconName = focused ? "ios-cut" : "ios-cut";
            } else if (route.name === "Costura") {
              iconName = focused ? "md-barcode" : "md-barcode";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Corte" component={Corte} options={{ headerShown: false }} />
        <Tab.Screen name="Mesa" component={Mesa} options={{ headerShown: false }} />
        <Tab.Screen name="Costura" component={Costura} options={{ headerShown: false }} />
        <Tab.Screen name="Fim" component={Fim} options={{ headerShown: false }} />
        <Tab.Screen name="Histórico" component={History} options={{ headerShown: false }} />
        <Tab.Screen name="Caderneta" component={List} options={{ headerShown: false }} />

      </Tab.Navigator>
   
    )
      } 
}
