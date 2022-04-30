import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Text,
  FlatList,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ct from '../Components/Corte_mesa';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator} from 'react-native';

const CorteMesa = () => {
  const [producaor, setProducaor] = useState([]);
  const [producaorP, setProducaorP] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState('');

  const myFunction1 = async () => {
    const subscriber = firestore()
      .collection('producao')
      .where('status', '==', 2)
      .onSnapshot(querySnapshot => {
        const producaor = [];

        querySnapshot.forEach(documentSnapshot => {
          producaor.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setProducaor(producaor);
        setProducaorP(producaor);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  };

  useEffect(() => {
    myFunction1();
  }, []);

  const Pesquisar = async () => {
    if (pesquisa === '') {
      setProducaor(producaorP);
    } else {
      setProducaor(
        producaor.filter(
          item => item.nomep.toLowerCase().indexOf(pesquisa.toLowerCase()) > -1,
        ),
      );
    }
  };

  useEffect(() => {
    Pesquisar();
  }, [pesquisa]);

  function compare(a, b) {
    return a.data_corte > b.data_corte;
  }

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          width: '100%',
          height: 70,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: '#027381',
        }}>
        <View style={{width: '90%'}}>
          <TextInput
            style={{
              backgroundColor: 'white',
              height: 40,
              padding: 5,
              borderRadius: 5,
            }}
            placeholder="Pesquisar na mesa"
            onChangeText={setPesquisa}
            value={pesquisa}
            keyboardType="default"
          />
        </View>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{height: '92%', padding: 10}}
        data={producaor.sort(compare)}
        renderItem={({item}) => (
          <Ct
            nome={item.nomep}
            quantidade={item.quantidadep}
            plataforma={item.plataformap}
            id={item.key}
            modelo={item.modelo}
            data_corte={item.data_corte}
            materiais_uso={item.materiais_uso}
          />
        )}
      />
    </View>
  );
};

export default CorteMesa;
