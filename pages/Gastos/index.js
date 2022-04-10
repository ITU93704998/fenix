import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Modal,TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { Picker } from "@react-native-picker/picker";

export default function Gastos(){
    const [valorcomissao, setValorComissao] = useState([]);
    const [dados, setDados] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState();
    const [etapa, setEtapa] = useState(1);

    var data = new Date();
    var dia = String(data.getDate()).padStart(2, '0');
    var mes = String(data.getMonth() + 1).padStart(2, '0');
    var ano = data.getFullYear();
    dataAtual = dia + '/' + mes + '/' + ano;


    useEffect(() => {
        const veri = async () => {
            firestore()
            .collection('gastos')
            .where('status', '==' , 1)
            .onSnapshot(querySnapshot => {
            const producaor = [];

            querySnapshot.forEach(documentSnapshot => {
                producaor.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
                });
            });

            setDados(producaor);
            });
        }
        veri()
    }, [])

    useEffect(() => {
        const veri = async () => {
            firestore()
            .collection('valor_comissao')
            .onSnapshot(querySnapshot => {
            const producaor = [];

            querySnapshot.forEach(documentSnapshot => {
                producaor.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
                });
            });

            setValorComissao(producaor);
            });
        }
        veri()
    }, [])

    function arredondar(n) {
        return (Math.round(n * 100) / 100).toFixed(2);
    }

    let filtrodadosetapa2 = dados.filter(item => item.etapa == 2)
    var valoretape2 = filtrodadosetapa2.reduce((somatoria, quantidade) => { return somatoria + quantidade.valor}, 0);

    let filtrodadosetapa1 = dados.filter(item => item.etapa == 1)
    var valoretape1 = filtrodadosetapa1.reduce((somatoria, quantidade) => { return somatoria + (quantidade.valor/100)*5}, 0);

    var ValorTotal = valoretape1 - valoretape2;

    function AddComisao(){
        const add = async () => {
            firestore()
            .collection('gastos')
            .add({
              nome,
              valor: parseInt(valor),
              etapa,
              status: 1,
              data: dataAtual
            })
            .then(
              setNome(''),
              setValor(),
              setModalVisible(!modalVisible)
            )
        }

        add();
    }

    function compare(a,b) {
        return a.data < b.data;
      }

      
    function DarBaixa(){
        const att = async () => {
          dados.forEach(item => {
             console.log(item.key, item.nome);
             firestore()
            .collection('gastos')
            .doc(item.key)
            .update({
            status: 2
            })
            .then(() => {console.log('ok') })
          });
        }

        att();
          Alert.alert("Baixa", "Dados foi finalizado! Esse foi o valor total: " + ValorTotal.toFixed(2))
    }

    return(
        <>
       < Modal
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
            maxLength={100}
            placeholder="Nome"
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            onChangeText={setValor}
            value={valor}
            placeholder="Valor"
            keyboardType="numeric"
          />
          <Picker
            style={{width: '90%',marginTop: 10, backgroundColor: "white", borderRadius: 10}}
            selectedValue={etapa}
            onValueChange={(itemValue, itemIndex) =>
              setEtapa(itemValue)
            }>
            <Picker.Item label="Comissão" value={1} />
            <Picker.Item label="Saída" value={2} />
          </Picker>

          <TouchableOpacity style={{width: '90%',marginTop: 10}}  onPress={() => AddComisao()}>
            <View style={{backgroundColor: "#FF7751", height: 40, flexDirection: 'row',borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
            
            <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Adcionar</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{width: '90%',marginTop: 10}}  onPress={() => setModalVisible(!modalVisible)}>
            <View style={{backgroundColor: "#558898", height: 40, flexDirection: 'row',borderRadius: 10, justifyContent: 'space-around', alignItems: 'center'}}>
             <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Cancelar</Text>
            </View>
          </TouchableOpacity>
          </View>
      </Modal>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
            <View style={{ width: '100%', height: 20,backgroundColor: '#027381'}}></View>
            <View style={{ width: '100%',backgroundColor: '#027381', flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableOpacity onPress={() => DarBaixa()} style={{width: '40%', height: 30, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FF7751',borderRadius: 5}}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Dar Baixa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={{width: '40%', height: 30, alignItems: 'center',flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FF7751',borderRadius: 5}}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Adcionar</Text>
                </TouchableOpacity>
            </View>
        
            <View style={{ width: '100%', height: 70,backgroundColor: '#027381'}}></View>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '90%', height: 100, backgroundColor: '#FF7751', borderRadius: 10, elevation: 5, marginTop: -50}}>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 12, color: '#fff', fontWeight: 'bold'}}>R$ <Text style={{fontSize: 20}}>{ValorTotal.toFixed(2)}</Text></Text>
                    <Text style={{fontSize: 12, color: '#fff', fontWeight: 'bold'}}>Total</Text>
                </View>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 12, color: '#fff', fontWeight: 'bold'}}>R$ <Text style={{fontSize: 20}}>{valoretape1.toFixed(2)}</Text></Text>
                    <Text style={{fontSize: 12, color: '#fff', fontWeight: 'bold'}}>Comissão</Text>
                </View>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 12, color: '#fff', fontWeight: 'bold'}}>R$ <Text style={{fontSize: 20}}>{valoretape2.toFixed(2)}</Text></Text>
                    <Text style={{fontSize: 12, color: '#fff', fontWeight: 'bold'}}>Saídas</Text>
                </View>
            </View>

            <View style={{marginTop: 10, width: '95%'}}>
            <FlatList
                style={{height: '90%', padding: 5, marginTop: 5}}
                showsVerticalScrollIndicator={false}
                data={dados.sort(compare)}
                renderItem={({ item }) => (
                    <>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
                        <View style={{width: '80%', flexDirection: 'column', justifyContent: 'center',}}>
                          <Text style={{fontSize: 14, color: item.etapa == 2 ? "#ff5b41" : "#3a925e", fontWeight: 'bold' }}>{item.nome} - <Text style={{fontSize: 12, fontWeight: '400'}}>{item.data}</Text></Text>
                        </View>
                        <View style={{width: '20%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontSize: 15, color: item.etapa == 2 ? "#ff5b41" : "#3a925e", fontWeight: 'bold' }}>{  item.etapa == 2 ? "-" : "+" } R${item.etapa == 2 ? item.valor : arredondar((item.valor/100)*5)}</Text>
                        </View>
                        
                    </View>
                    <View style={{borderBottomColor: '#dcdcdc',borderBottomWidth: 1,marginTop: 5}}/>
                    </>
                )}
            />
            </View>
        </View>
    </>
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
      width: '90%',
      marginTop: 10
    },
  });