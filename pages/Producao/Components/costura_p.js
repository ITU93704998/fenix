import React, {useState, useEffect} from "react";
import { Text, View, Button, Pressable, Modal, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import Indicator from './indicator';
import firestore from '@react-native-firebase/firestore';
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Costura_p(props) {
  const [costureiroD, setCostureiroD] = useState([]);
  const [costureiro, setCostureiro] = useState('');
  const [costureiroUid, setCostureiroUid] = useState('');
  const [valorindicator, setVlorIndicator] = useState(false);
  const [uid, setUID] = useState('');

  const storeData1 = async () => {
    try {
      jsonValue = await AsyncStorage.getItem('@storage_Key')
      let nomeCostura = costureiroD.filter(item => item.uid == jsonValue)
      setCostureiroUid(nomeCostura[0].nome)
      setUID(nomeCostura[0].uid)
    } catch (e) {
      console.log('Erro ao recuperar dados no AsyncSotarage')
    }
  }

  storeData1()

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

  function VeriLogo(){
    if(props.plataforma == '#D4AE00'){
      return(
        <View style={{width: '10%', flexDirection: 'column', justifyContent: 'center',}}>
           <Image
            style={{width: 30, height: 20}}
            source={require('../../src/img/ml.png')}
          />
        </View>
      )
    }

    if(props.plataforma == '#00A3D8'){
      return(
        <View style={{width: '10%',  flexDirection: 'column', justifyContent: 'center',}}>
          <Image
            style={{width: 30, height: 20}}
            source={require('../../src/img/co.png')}
          />
        </View>
      )
    }
    if(props.plataforma == '#FFFF'){
      return(
        <View style={{width: '10%', flexDirection: 'column', justifyContent: 'center',}}>
          <Image
            style={{width: 30, height: 30}}
            source={require('../../src/img/et.png')}
          />
        </View>
      )
    }
    if(props.plataforma == '#7B7B7B'){
      return(
        <View style={{width: '10%', flexDirection: 'column', justifyContent: 'center',}}>
          <Image
            style={{width: 30, height: 30}}
            source={require('../../src/img/mo.png')}
          />
        </View>
      )
    }
 }



  function Costurar(id){
    if(costureiroUid == ''){
      Alert.alert("Erro", "Tente novamente :(")
    }else{
    setVlorIndicator(!valorindicator)
    const costurar = firestore()
      .collection('producao')
      .doc(id)
      .update({
        status: 4,
        costureiro: costureiroUid,
      })
      .then(() => {
        Alert.alert("Sucesso", 'Costura começou com: ' + costureiroUid)
        setVlorIndicator(!valorindicator)
      })
    return() => costurar();
    }
  
}

    return(
      <View style={{padding: 5, borderRadius: 10, backgroundColor:"#CCCCCC", marginTop: 7, elevation: 5}}>
       

         <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' ,}}>
        <View style={{width: '15%',flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
          <Text style={{fontSize: 30, color: '#565050',fontWeight: 'bold'}}>{props.quantidade}</Text>
        </View>
      
      <View style={{width: '75%', flexDirection: 'column', justifyContent: 'center',}}>
        <Text style={{fontSize: 15, fontWeight: 'bold', color: '#565050'}}>{props.nome}</Text>
       </View>

       <VeriLogo />
       
      
    </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 5}}>
        {uid != 'v7RPkSgKE7PwUo6fnyDbR3JSFU23' ?
        <TouchableOpacity style={{alignItems: 'center',elevation: 5, padding: 5, justifyContent: 'space-around', alignItems: 'center', width: '90%', backgroundColor: '#fff', borderRadius: 5}} onPress={() => Costurar(props.id)}>
        <Text style={{fontWeight: 'bold', color: '#696969', fontSize: 13}}>{costureiroUid}, Costurar {props.modelo}</Text>
       </TouchableOpacity> :
       <Text>Modelo: {props.modelo}</Text>} 
        
        
      </View>

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
    width: '90%'
  },
});

export default Costura_p;
