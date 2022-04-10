import React, {useState} from "react";
import { Text, View, Button, TouchableOpacity, Alert, Modal, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import firestore from '@react-native-firebase/firestore';


function Lista(props) {

    return(
      <View>

    <View style={{padding: 3, borderRadius: 5, backgroundColor: props.modelo == 'Outros' ? '#FF7751' : '#2CA79F', marginTop: 5, elevation: 5}}>
    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
      <View style={{width: '15%',  flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 20, color: 'white',fontWeight: 'bold'}}>{props.quantidade}</Text>
      </View>
      
      <View style={{width: '85%', flexDirection: 'column', justifyContent: 'center',}}>
        <Text style={{fontSize: 17, fontWeight: 'bold', color: 'white'}}>{props.nome}</Text>
        <Text style={{ color: '#fff', fontSize: 10, marginTop: 5}}>• {props.modelo} feito por {props.costureiro} dia <Text style={{fontWeight: 'bold', fontSize: 12}}>{props.fim}</Text></Text>
       </View>
      
    </View>
    </View>
      </View>
    )
    
 
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Lista;
