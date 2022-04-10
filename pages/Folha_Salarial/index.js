import React,{useState, useEffect}  from 'react';
import {View, Text, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Picker } from "@react-native-picker/picker";
import { FlatList } from 'react-native-gesture-handler';
import Dados from './dados';

function Folha_Salarial(){
    const [dados, setDados] = useState([]);
    const [gastos, setGastos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [valor, setValor] = useState()
    const [modelo, setModelo] = useState('Vale')
    const [recebedor, setRecebedor] = useState()
    const [veri, setVeri] = useState()
    

    var data = new Date();
    var dia = String(data.getDate()).padStart(2, '0');
    var mes = String(data.getMonth() + 1).padStart(2, '0');
    var ano = data.getFullYear();
    var dia1 = dia - 1;
    dataAtual = dia + '/' + mes + '/' + ano;

    const [mesPesquisa, setMesPesquisa] = useState(mes)

    useEffect(() => {
        const veri = async () => {
            firestore()
            .collection('user')
            .onSnapshot(querySnapshot => {
            const usuarios = [];

            querySnapshot.forEach(documentSnapshot => {
                usuarios.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
                });
            });

            setDados(usuarios);
            });
        }
        veri()
    }, [])

    useEffect(() => {
        const VeriGastos = async () => {
          const subscriber = firestore()
          .collection('contas_empresa')
          .get()
          .then(querySnapshot => {
            const gastosEm = [];
      
            querySnapshot.forEach(documentSnapshot => {
              gastosEm.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            });
      
            setGastos(gastosEm);
          });
          return () => subscriber();
        }
        VeriGastos()
    },[veri])

    useEffect(() => {
        const VeriGastos = async () => {
          const subscriber = firestore()
          .collection('contas_empresa')
          .where('recebedor', '==', uid)
          .get()
          .then(querySnapshot => {
            const gastosEm = [];
      
            querySnapshot.forEach(documentSnapshot => {
              gastosEm.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            });
      
            setGastos(gastosEm);
          });
          return () => subscriber();
        }
        VeriGastos()
      },[])


    function AddGasto(){
        if(valor == null){
            Alert.alert("Erro", "Coloque um valor antes.")
        }else{
            if(recebedor == null){
                Alert.alert("Erro", "Coloque um funcionario antes.")
            }else{
                const cortado = firestore()
                firestore()
                .collection('contas_empresa')
                .add({
                    nome:  modelo,
                    data: dataAtual,
                    recebedor,
                    tipo: 2,
                    valor: parseInt(valor)
                })
                .then(() => {
                  setModalVisible(!modalVisible);
                  setValor(''),
                  setRecebedor(''),
                  Alert.alert("Sucesso!","Débito adcionado com sucesso!");
                  setVeri(!veri)
                });
                return () => cortado();
            }
        }
    }

    let objetosFiltradosAnoMes = gastos.filter( item => item.data.substr(3) == mesPesquisa+'/'+ano)

    return(
        <View style={{flex: 1,  padding: 15}}>
        

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}>
          <View style={{ backgroundColor: "#027381", flex: 1,flexDirection: 'column', justifyContent: 'center', alignItems: 'center' , width: '100%' }}>
           
            <View style={{width: '90%',marginTop: 20}}>
                <TextInput
                  style={{ backgroundColor: "white", height: 50, padding: 5, borderRadius: 3 }}
                  placeholder="Valor do débito"
                  onChangeText={setValor}
                  value={valor}
                  keyboardType="numeric"
                />
            </View>

            <View style={{width: '90%',marginTop: 20}}>
                <TextInput
                  style={{ backgroundColor: "white", height: 50, padding: 5, borderRadius: 3 }}
                  placeholder="Vale"
                  onChangeText={setModelo}
                  value={modelo}
                  keyboardType="default"
                />
            </View>

            <View style={{width: '90%',marginTop: 20}}>
            <Picker
                style={{width: '100%', backgroundColor: "white", borderRadius: 10}}
                selectedValue={recebedor}
                onValueChange={(itemValue, itemIndex) =>
                setRecebedor(itemValue)
                } 
            >
                <Picker.Item label='Selecione funcionário:' value='0' />
                { 
                dados.length > 0 ? 
                dados.map(item =>  <Picker.Item label={item.nome} value={item.uid} /> ):
                ''
                }
            </Picker>
            </View>
  
            <TouchableOpacity style={{marginTop: 50,width: "90%",}} onPress={() =>  AddGasto()}>
              <View style={{backgroundColor: "#FF7751",  height: 40, flexDirection: 'row',borderRadius: 3, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Adcionar Débito</Text>
              </View>
            </TouchableOpacity>
  
            <TouchableOpacity style={{marginTop: 10,width: "90%",}} onPress={() => setModalVisible(!modalVisible)}>
              <View style={{backgroundColor: "#558898", height: 40, flexDirection: 'row',borderRadius: 3, justifyContent: 'space-around', alignItems: 'center'}}>
               <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Voltar</Text>
              </View>
            </TouchableOpacity>
                
          </View>
        </Modal>
        
            <View style={{flexDirection: 'row',justifyContent: 'space-around', marginTop: 5}}>
                    <View style={{width: '40%'}}>
                        <TextInput
                        style={{ backgroundColor: "white", padding: 5, borderRadius: 3 }}
                        placeholder="Mês consulta"
                        onChangeText={setMesPesquisa}
                        value={mesPesquisa}
                        maxLength={2}
                        keyboardType="numeric"
                        />
                    </View> 
                    <TouchableOpacity style={{backgroundColor: '#027381', width: '45%', flexDirection: 'row', justifyContent:'center', alignItems: 'center', padding: 5, borderRadius: 6,}}onPress={() =>  setModalVisible(!modalVisible)}>
                        <Text style={{color: '#ffff',fontWeight: 'bold', fontSize:15}}>Adcionar Débito</Text>
                    </TouchableOpacity>
            </View>

            

            <FlatList
            style={{height: '90%', padding: 5,}}
            showsVerticalScrollIndicator={false}
            data={dados}
            renderItem={({ item }) => (
                <View style={{width: '100%',backgroundColor: '#ffff', padding: 10, borderRadius:5, elevation: 5, marginTop: 10}}>
                <Text style={{fontSize: 17, fontWeight: 'bold'}}>{item.nome_completo}</Text>
                <View style={{borderBottomColor: '#dcdcdc',borderBottomWidth: 1,}}/>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <View style={{flexDirection:  'column', justifyContent:'space-evenly', width: '90%', marginTop: 5}}>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>Salário</Text>
                            <Text style={{color: 'green', fontWeight: 'bold'}}>+ R${item.salario}</Text>
                        </View>
                        <FlatList
                        data={objetosFiltradosAnoMes.filter(items => items.recebedor == item.uid)}
                        showsVerticalScrollIndicator={false}
                        style={{}}
                        renderItem={({ item }) => (
                            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text>{item.nome} dia {item.data}</Text>
                                <Text style={{color: item.tipo == 2 ? 'red' : 'green', fontWeight: '500'}}> {item.tipo == 2 ? '-' : '+'} R${item.valor}</Text>
                            </View>
                        )}
                        />
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>Comissão do mês</Text>
                            
                            <Text style={{color: 'green', fontWeight: 'bold'}}>+ R$< Dados nome={item.nome} mess={mesPesquisa} /></Text>
                        </View>
                        
                    </View>
                </View>
                
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, backgroundColor: '#dcdcdc', padding: 5}}>
                            <Text style={{fontWeight: 'bold', fontSize:15}}>Total</Text>
                            <Text style={{color: '#696969',fontWeight: 'bold', fontSize:15}}>R${item.salario - objetosFiltradosAnoMes.filter(items => items.recebedor == item.uid).reduce((somatoria, quantidade) => { return somatoria + parseInt(quantidade.valor)}, 0) } + < Dados nome={item.nome} mess={mesPesquisa} /></Text>
                </View>
            </View>
            )}
            />
            
        </View>
    )
}

export default Folha_Salarial;