import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Text, FlatList, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native';
import Ct from '../Components/history';

const History = ({navigation}) => {

  const [producaor, setProducaor] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const myFunction1 = async () => {
    const subscriber = firestore()
    .collection('producao')
    //.orderBy('creatate_at', 'desc')
    .where('status', '==', 5)
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

  function compare(a,b) {
    return a.data_costura > b.data_costura;
  }
  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: '#fff'}}>
    
    <View style={{flexDirection: 'row', justifyContent: 'flex-end', padding: 5}}>
      <TouchableOpacity onPress={() => navigation.navigate('Estoque')} style={{padding: 5, backgroundColor: '#FF7751', borderRadius: 6,paddingHorizontal: 30}}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Estoque</Text>
      </TouchableOpacity>
    </View>

<FlatList
      data={producaor.sort(compare)}
      showsVerticalScrollIndicator={false}
     style={{height: '92%'}}
      renderItem={({ item }) => (
        <Ct nome={item.nomep} quantidade={item.quantidadep} plataforma={item.plataformap} fim={item.data_costura} status={item.status} costureiro={item.costureiro} id={item.key} modelo={item.modelo}/>
      )}
      />
    </View>
  );
};


export default History;
