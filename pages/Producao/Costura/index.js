import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Button, Text, FlatList } from "react-native";
import firestore from '@react-native-firebase/firestore';
import Ct from '../Components/costura_p';
import auth from '@react-native-firebase/auth';


const Costura = () => {

  const [producaor, setProducaor] = useState([]);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [costureiro, setCostureiro] = useState(null);

  

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const myFunction1 = async () => {
    const subscriber = firestore()
      .collection('producao')
      //.orderBy('creatate_at', 'desc')
      .where('status', '==', 3)
      .onSnapshot(querySnapshot => {
        const producaor = [];
  
        querySnapshot.forEach(documentSnapshot => {
          producaor.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
  
        setProducaor(producaor);
      });
  
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }
  useEffect(() => {
    myFunction1()
  }, []);
  
  function compare(a,b) {
    return a.data_corte < b.data_corte;
  }

  
  return (
    <View style={{ flex: 1,}}>
    
      <View style={{flex: 1,padding:10, backgroundColor: '#fff'}}>
      <FlatList
      showsVerticalScrollIndicator={false}
      data={producaor.sort(compare)}
      renderItem={({ item }) => (
        <Ct nome={item.nomep} quantidade={item.quantidadep} plataforma={item.plataformap}status={item.status} id={item.key} modelo={item.modelo}/>
      )}
      />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Costura;
