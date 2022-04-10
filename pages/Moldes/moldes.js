import React, { useEffect, useState } from "react";
import { Text, View, TextInput,Modal, StyleSheet, Image, Alert, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import IconM from "react-native-vector-icons/MaterialIcons";
import {Picker} from '@react-native-picker/picker';
import firestore from "@react-native-firebase/firestore";

function Moldes({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [pesquisa, setPesquisa] = useState('');
  const [local, setLocal] = useState('');
  const [modelo, setModelo] = useState('Capa');
  const [detalhes, setDetalhes] = useState('');
  const [veri, setVeri] = useState(false);
  const [moldes, setMoldes] = useState([]);
  const [moldest, setMoldest] = useState([]);

  const myFunction1 = async () => {
    const subscriber = firestore()
    .collection('moldes')
    .orderBy('local', 'desc')
    .get()
    .then(querySnapshot => {
      const moldes = [];

      querySnapshot.forEach(documentSnapshot => {
        moldes.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });

      setMoldes(moldes);
      setMoldest(moldes);
    });

  return () => subscriber();
  }
  const myFunction2 = async () => {
    if(pesquisa === ''){
      setMoldes(moldest)
    }else{
      setMoldes(
        moldes.filter(item => (item.nome.toLowerCase().indexOf(pesquisa.toLowerCase()) > -1))
      )
    }
  }

  useEffect(() =>{
    myFunction1();
  }, [])

  useEffect(() =>{
      myFunction2();
  }, [pesquisa])

  
  
  function AddMolde(){
    firestore()
    .collection('moldes')
    .add({
      nome,
      local,
      modelo,
      detalhes,
    })
    .then(() => Alert.alert("Moldes", "Molde adcionado!"), setNome('', setDetalhes('')))
    .catch((error) => console.log(error))
    .finally(() => setModalVisible(!modalVisible))
  }
  function Excluir(id){
    const costurar = firestore()
      .collection('moldes')
      .doc(id)
      .delete()
      .then(() => {
        Alert.alert("Moldes!", "Molde Excluido!")
        setVeri(!veri)
      })
      return() => costurar();
  }

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: '#027381'}}>

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
       <View style={{ backgroundColor: "#027381", flex: 1,flexDirection: 'column', justifyContent: 'center', alignItems: 'center'  }}>
        
          <TextInput
            style={styles.input}
            onChangeText={setNome}
            value={nome}
            placeholder="Nome"
            keyboardType="default"
          />
          <Picker
            style={{width: '90%',marginTop: 10, backgroundColor: "white", borderRadius: 10}}
            selectedValue={modelo}
            onValueChange={(itemValue, itemIndex) =>
              setModelo(itemValue)
            }>
            <Picker.Item label="Capa" value="Capa" />
            <Picker.Item label="Tapete" value="Tapetete" />
            <Picker.Item label="Porta Malas" value="Porta-Malas" />
            <Picker.Item label="Forro Porta" value="Forro-Porta" />
          </Picker>

          <TextInput
            style={styles.input}
            onChangeText={setLocal}
            value={local}
            maxLength={3}
            placeholder="Local"
            keyboardType="default"
          />

          <TextInput
            style={styles.input}
            onChangeText={setDetalhes}
            value={detalhes}
            placeholder="Detalhes"
            keyboardType="default"
          />

          <TouchableOpacity style={{width: '90%',marginTop: 10}} onPress={() =>  AddMolde()}>
            <View style={{backgroundColor: "#FF7751", height: 40, flexDirection: 'row',borderRadius: 10, justifyContent: 'space-around', alignItems: 'center'}}>
             <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Adcionar</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{width: '90%',marginTop: 10}} onPress={() => setModalVisible(!modalVisible)}>
            <View style={{backgroundColor: "#558898", height: 40, flexDirection: 'row',borderRadius: 10, justifyContent: 'space-around', alignItems: 'center'}}>
             <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Cancelar</Text>
            </View>
          </TouchableOpacity> 
        </View>
      </Modal>
      

    

      <View style={{marginTop: 10, flexDirection: 'row', justifyContent:'space-around', alignItems: 'center'}}>
        <View style={{width: '80%',}}>
          <TextInput
            style={{ backgroundColor: "white", height: 40, padding: 5, borderRadius: 5 }}
            placeholder="Pesquisar molde"
            onChangeText={setPesquisa}
            value= {pesquisa}
            keyboardType="default"
          />
        </View>

        <Icon
          onPress={() => setModalVisible(!modalVisible)}
          name="add-circle-sharp"
          color="#FF7751"
          size={40}
        />

      </View>

      <FlatList
      showsVerticalScrollIndicator={false}
      data={moldes}
      renderItem={({ item }) => (
        <View style={{padding: 5, borderRadius: 3, backgroundColor:'white', marginTop: 5}}>
        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{width: '15%',flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
            <Text style={{fontSize: 20, color: '#565050',fontWeight: 'bold'}}>{item.local}</Text>
          </View>
          
          <View style={{marginLeft: 10, width: '70%', flexDirection: 'column', justifyContent: 'center',}}>
            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#696969'}}>{item.nome}</Text>
            <Text style={{fontSize: 10,color: '#696969'}}>Detalhes:{item.detalhes}</Text>
           </View>
           
           <View style={{marginLeft: 5, width: '15%', flexDirection: 'column', justifyContent: 'center',}}>
           <Image style={{width: 25, height: 25,}}
              source={  item.modelo == 'Capa' ? require('../src/icon/ca.png') : require('../src/icon/ta.png')}
            />
           </View>
          
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>    
          <TouchableOpacity style={{width: "90%",height: 30,marginTop: 5, alignItems: 'center', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FF7751', borderRadius: 5}} onPress={() => Excluir(item.key) }>
           <Text style={{fontWeight: 'bold', color: '#ffff'}}>Excluir Molde</Text>
          </TouchableOpacity>
          
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

export default Moldes;
