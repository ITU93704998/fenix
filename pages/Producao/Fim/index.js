import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Button, Text, FlatList, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native';
import Ct from '../Components/Fimp';

const Fim = () => {

  const [producaor, setProducaor] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const myFunction1 = async () => {
    const subscriber = firestore()
    .collection('producao')
    //.orderBy('creatate_at', 'desc')
    .where('status', '==', 4)
    .onSnapshot(querySnapshot => {
      const producaor = [];

      querySnapshot.forEach(documentSnapshot => {
        producaor.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });

      setProducaor(producaor);
      setLoading(false);
    });

  // Unsubscribe from events when no longer in use
  return () => subscriber();
  }
  useEffect(() => {
    myFunction1()
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 10}}>
<FlatList
      data={producaor}
      showsVerticalScrollIndicator={false}
     style={{height: '92%'}}
      renderItem={({ item }) => (
        <Ct nome={item.nomep} quantidade={item.quantidadep} plataforma={item.plataformap} modelo={item.modelo} status={item.status} costureiro={item.costureiro} id={item.key}/>
      )}
      />
    </View>
  );
};


export default Fim;
