import React, { useEffect, useState } from "react";
import { Text, View, TextInput , TouchableOpacity, Modal, StyleSheet, Alert, FlatList} from "react-native";
import firestore from '@react-native-firebase/firestore';
import Icon from "react-native-vector-icons/Ionicons";
import {Picker} from '@react-native-picker/picker';

function Finalizados({ navigation }) {
  const [emuso, setEmUso] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [ver, setVer] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [veri, setVeri] = useState(false);

  useEffect(() => {
    const myFunction2 = async () => {
      const subscriber = firestore()
      .collection('materiais_uso')
      .where('status', '==', 2)
      .get()
      .then(querySnapshot => {
        const estoque = [];
  
        querySnapshot.forEach(documentSnapshot => {
          estoque.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
  
        setEstoque(estoque);
      });
  
    // Unsubscribe from events when no longer in use
      return () => subscriber();
    }
    myFunction2()
  },[veri])

  useEffect(() => {
    const myFunction2 = async () => {
      const subscriber = firestore()
      .collection('producao')
      .get()
      .then(querySnapshot => {
        const estoque = [];
  
        querySnapshot.forEach(documentSnapshot => {
          estoque.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
  
        setEmUso(estoque);
      });
  
    // Unsubscribe from events when no longer in use
      return () => subscriber();
    }
    myFunction2()
  },[])

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: '#027381' }}>

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ backgroundColor: "#027381", flex: 1, padding: 20,flexDirection: 'column', justifyContent: 'space-around',}}>
          <View style={{flexDirection: 'column', justifyContent: 'flex-start',flex: 1 }}>
            <FlatList
            style={{}}
              showsVerticalScrollIndicator={false}
              data={emuso.filter(itemd => (itemd.materiais_uso.toLowerCase().indexOf(ver.toString().toLowerCase()) > -1))}
              renderItem={({ item }) => (
                    <Text style={{color: 'white', fontWeight: 'bold'}}>{item.quantidadep} {item.nomep}</Text>
                  )}
                  />
            </View>
        <TouchableOpacity style={{width: '100%',marginTop: 10,}} onPress={() => setModalVisible(!modalVisible)}>
            <View style={{backgroundColor: "#558898", height: 40, flexDirection: 'row',borderRadius: 10, justifyContent: 'space-around', alignItems: 'center'}}>
             <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Voltar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
      showsVerticalScrollIndicator={false}
      data={estoque}
      renderItem={({ item }) => (

        <View style={{ borderRadius: 3, backgroundColor:'white', marginTop: 5, padding:3}}>
        <View style={{width: '100%',  flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' ,}}>
          <View style={{width: '15%', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
            <Text style={{fontSize: 30, color: '#565050',fontWeight: 'bold'}}>{
            emuso.filter(itemd => (itemd.materiais_uso.toLowerCase().indexOf(item.key.toString().toLowerCase()) > -1)).reduce((somatoria, quantidade) => {return somatoria + parseInt(quantidade.quantidadep)}, 0)
            }</Text>
            <Text style={{fontSize: 10}}>Feitos</Text>
          </View>
          
          <View style={{ width: '85%', flexDirection: 'column', justifyContent:'flex-start',}}>
           <Text style={{fontSize: 15, fontWeight: 'bold', color: '#696969'}}>{item.nome} - {item.modelo}</Text>
           <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 3}}>   
            <Text>Inicio: {item.data_inicio}</Text>
            <Text>Fim: {item.data_fim}</Text>
            </View>
          </View>
           
          
        </View>
      </View>
        )}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "#ffff",
    backgroundColor: '#ffff',
    height: 50,
    width: '90%',
    marginTop: 10
  },
});

export default Finalizados;
