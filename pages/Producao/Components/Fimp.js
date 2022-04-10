import React, {useState, useEffect} from "react";
import { Text, View, Button, TouchableOpacity, Alert, Modal, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";

function FimP(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [local, setLocal] = useState('');
  const [valorindicator, setVlorIndicator] = useState(false);
  const [costureiroUid, setCostureiroUid] = useState('');
  const [costureiroD, setCostureiroD] = useState([]);

  var data = new Date();
  var dia = String(data.getDate()).padStart(2, '0');
  var mes = String(data.getMonth() + 1).padStart(2, '0');
  var ano = data.getFullYear();
  dataAtual = dia + '/' + mes + '/' + ano;

  function TerminoCostura(id){
    setVlorIndicator(!valorindicator)
    const fim = firestore()
    .collection('producao')
    .doc(id)
    .update({
      status: 5,
      data_costura: dataAtual
    })
    .then(() => {
      Alert.alert("Fim", props.nome + " foi finalizado por " + props.costureiro + " dia " + dataAtual ),
      setVlorIndicator(!valorindicator),
      setModalVisible(!modalVisible)
    })
    return() => fim()
  }

  useEffect(() => {
    const myFunction2 = async () => {
      const subscriber = firestore()
      .collection('user')
      .get()
      .then(querySnapshot => {
        const costureiro = [];
  
        querySnapshot.forEach(documentSnapshot => {
          costureiro.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
  
        setCostureiroD(costureiro);
      });
  
    // Unsubscribe from events when no longer in use
      return () => subscriber();
    }
    myFunction2()
  },[])

  const storeData1 = async () => {
    try {
      jsonValue = await AsyncStorage.getItem('@storage_Key')
      let nomeCostura = costureiroD.filter(item => item.uid == jsonValue)
      setCostureiroUid(nomeCostura[0].nome)
    } catch (e) {
      console.log('Erro ao recuperar dados no AsyncSotarage')
    }
  }

  storeData1()


    return(
      <View>
         <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
         <View style={{ backgroundColor: "#027381", flex: 1,flexDirection: 'column', justifyContent: 'center', alignItems: 'center'  }}>
         
          <Text style={{fontSize: 30, color: '#fff'}}>Terminou de costurar?</Text>

          <TouchableOpacity style={{width: '90%',marginTop: 10}} onPress={() =>  TerminoCostura(props.id)}>
            <View style={{backgroundColor: "#FF7751", height: 40, flexDirection: 'row',borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Sim</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{marginTop: 10,width: '90%'}} onPress={() => setModalVisible(!modalVisible)}>
            <View style={{backgroundColor: "#558898", height: 40, flexDirection: 'row',borderRadius: 10, justifyContent: 'space-around', alignItems: 'center'}}>
             <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Não</Text>
            </View>
          </TouchableOpacity>
        </View>
         </Modal>

 <View style={{padding: 5, borderRadius: 10, backgroundColor:'#FF7751', marginTop: 5, elevation: 5}}>
 <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' ,}}>
        <View style={{width: '10%', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
          <Text style={{fontSize: 30, color: '#ffff',fontWeight: 'bold'}}>{props.quantidade}</Text>
        </View>
      
      <View style={{marginLeft: 5, width: '85%', flexDirection: 'column', justifyContent: 'center',}}>
        <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>{props.nome}</Text>
        <Text style={{ color: '#ffff', fontSize: 10, marginTop: 3}}><Icon name="time" size={10} color={"#ffff"} /> Em Produção por {props.costureiro}</Text>
       </View>
      
    </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around',marginTop: 5}}>
        {costureiroUid == props.costureiro ? <TouchableOpacity style={{alignItems: 'center',padding: 5, justifyContent: 'space-around', alignItems: 'center',width: '90%', backgroundColor: 'white', borderRadius: 5}} onPress={() => setModalVisible(!modalVisible)}>
         <Text style={{fontWeight: 'bold', color: '#FF7751', fontSize: 13}}>Finalizar {props.modelo}</Text>
        </TouchableOpacity> : <></> }
        
      </View>

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

export default FimP;
