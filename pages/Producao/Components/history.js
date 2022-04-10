import React, {useState} from "react";
import { Text, View, Button, TouchableOpacity, Alert, Modal, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
function HistoryP(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [local, setLocal] = useState('');
  var data = new Date();
  var dia = String(data.getDate()).padStart(2, '0');
  var mes = String(data.getMonth() + 1).padStart(2, '0');
  var ano = data.getFullYear();
  dataAtual = dia + '/' + mes + '/' + ano;

  function Enviar(id){
    const enviar = firestore()
    .collection('producao')
    .doc(id)
    .update({
      status: 6,
      data_envio: dataAtual
    })
    .then(() => {
      Alert.alert("Enviar", "Mercadoria separada para envio")
    })
    return() => enviar();
  }

  function Montar(id){
    const montar = firestore()
    .collection('producao')
    .doc(id)
    .update({
      status: 7,
      data_montagem: dataAtual
    })
    .then(() => {
      Alert.alert("Montar", "Mercadoria separada para montagem")
    })
    return() => montar();
  }

  function Estoque(id){
    if(local == ''){
      Alert.alert("Erro", 'Coloque um local para o estoque')
    }else{
    const estoque = firestore()
    .collection('producao')
    .doc(id)
    .update({
      status: 8,
      local,
    })
    .then(() => {
      Alert.alert("Estoque", "Mercadoria guardada em estoque"),
      setModalVisible(!modalVisible)
    })
    return() => estoque();
  }
  }


    return(
      <View style={{padding: 3, borderRadius: 6, backgroundColor:'#2CA79F', marginTop: 3}}>
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
            onChangeText={setLocal}
            placeholder="Local no estoque"
            maxLength={3}
            value={local}
            keyboardType="default"
          />


          <TouchableOpacity style={{width: '90%',marginTop: 10}}  onPress={() =>  Estoque(props.id)}>
            <View style={{backgroundColor: "#FF7751", height: 40, flexDirection: 'row',borderRadius: 10, justifyContent: 'space-around', alignItems: 'center'}}>
             <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Mandar</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{width: '90%',marginTop: 10}} onPress={() => setModalVisible(!modalVisible)}>
            <View style={{backgroundColor: "#558898", height: 40, flexDirection: 'row',borderRadius: 10, justifyContent: 'space-around', alignItems: 'center'}}>
             <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Cancelar</Text>
            </View>
          </TouchableOpacity>
        </View>
         </Modal>

         <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' ,}}>
        <View style={{width: '15%', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
          <Text style={{fontSize: 30, color: '#ffff',fontWeight: 'bold'}}>{props.quantidade}</Text>
        </View>
      
      <View style={{width: '85%', flexDirection: 'column', justifyContent: 'center', padding: 3}}>
        <Text style={{fontSize: 15, fontWeight: 'bold', color: '#FFFFFF'}}>{props.nome}</Text>
        <Text style={{fontSize: 10, fontWeight: 'bold', color: '#fff'}}>{props.modelo}</Text>
        <Text style={{fontSize: 11, color: '#FFFFFF'}}>- Finalizado: {props.fim} por {props.costureiro}</Text>
       </View>
      
    </View>


    <View style={{flexDirection: 'row', justifyContent: 'space-around',marginTop: 5, padding: 5, }}>
        <TouchableOpacity style={{width: '30%',height: 30, backgroundColor: 'white', borderRadius: 6,flexDirection: 'column', justifyContent: 'center', alignItems: 'center', elevation: 5}} onPress={() => Enviar(props.id)}>
         <Text style={{fontWeight: 'bold', color: '#FF7751', fontSize: 13}}>Enviar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{width: '30%',height: 30, backgroundColor: 'white', borderRadius: 6,flexDirection: 'column', justifyContent: 'center', alignItems: 'center', elevation: 5}} onPress={() => setModalVisible(!modalVisible)}>
         <Text style={{fontWeight: 'bold', color: '#FF7751', fontSize: 13}}>Estoque</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{width: '30%',height: 30, backgroundColor: 'white', borderRadius: 6,flexDirection: 'column', justifyContent: 'center', alignItems: 'center', elevation: 5}} onPress={() => Montar(props.id)}>
         <Text style={{fontWeight: 'bold', color: '#FF7751', fontSize: 13}}>Montar</Text>
        </TouchableOpacity>
    </View>

  </View>
    )
   

}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "#ffff",
    backgroundColor: '#ffff',
    height: 50,
    width: '90%'
  },
});

export default HistoryP;
