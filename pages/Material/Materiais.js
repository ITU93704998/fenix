import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Button,
  Alert,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';

function Materiais({navigation}) {
  const [pesquisa, setPesquisa] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [plataforma, setPlataforma] = useState('Verniz');
  const [fabricante, setFabricante] = useState('');
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [quantidadeamais, setQuantidadeamais] = useState('');
  const [estoque, setEstoque] = useState([]);
  const [estoquet, setEstoquet] = useState([]);
  const [veri, setVeri] = useState(false);

  var data = new Date();
  var dia = String(data.getDate()).padStart(2, '0');
  var mes = String(data.getMonth() + 1).padStart(2, '0');
  var ano = data.getFullYear();
  dataAtual = dia + '/' + mes + '/' + ano;

  const myFunction = async () => {
    if (pesquisa === '') {
      setEstoque(estoquet);
    } else {
      setEstoque(
        estoque.filter(
          item => item.nome.toLowerCase().indexOf(pesquisa.toLowerCase()) > -1,
        ),
      );
    }
  };

  const myFunction2 = async () => {
    const subscriber = firestore()
      .collection('materiais')
      .orderBy('quantidade', 'asc')
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
        setEstoquet(estoque);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  };

  useEffect(() => {
    myFunction();
  }, [pesquisa]);

  useEffect(() => {
    myFunction2();
  }, [veri]);

  function AddEstoque() {
    firestore()
      .collection('materiais')
      .add({
        nome,
        modelo: plataforma,
        quantidade: parseInt(quantidade),
        fabricante,
        data_add: firestore.FieldValue.serverTimestamp(),
      })
      .then(
        () => Alert.alert('Materiais', 'Material adcionado!'),
        setVeri(!veri),
      )
      .catch(error => console.log(error))
      .finally(() => setModalVisible(!modalVisible));
  }

  function Retirar(id, quantidade, modelo, nome) {
    if (quantidade == '1') {
      const costurar = firestore()
        .collection('materiais')
        .doc(id)
        .delete()
        .then(() => {
          Alert.alert('Materiais', 'Material Retirado!'), setVeri(!veri);
        });
      return () => costurar();
    } else {
      const subscriber = firestore()
        .collection('materiais')
        .doc(id)
        .update({
          quantidade: quantidade - 1,
        })
        .then(() => {
          Alert.alert('Materiais', 'Material adcionado!'), setVeri(!veri);
        });
      return () => subscriber();
    }
  }

  function AdcionarMais(id, quantidade, quantidadeamais) {
    if (quantidadeamais == '') {
      Alert.alert('Erro!', 'Quantidade inválida');
    } else {
      const subscriber = firestore()
        .collection('materiais')
        .doc(id)
        .update({
          quantidade: quantidade + parseInt(quantidadeamais),
        })
        .then(() => {
          Alert.alert('Material!', quantidadeamais + ' material adcionado!');
          setVeri(!veri);
        });
      return () => subscriber();
    }
  }

  return (
    <View style={{flex: 1, padding: 10}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            backgroundColor: '#027381',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TextInput
            style={styles.input}
            onChangeText={setNome}
            value={nome}
            placeholder="Nome"
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            onChangeText={setFabricante}
            value={fabricante}
            placeholder="Fabricante do material"
            keyboardType="default"
          />
          <Picker
            style={{
              width: '90%',
              marginTop: 10,
              backgroundColor: 'white',
              borderRadius: 10,
            }}
            selectedValue={plataforma}
            onValueChange={(itemValue, itemIndex) => setPlataforma(itemValue)}>
            <Picker.Item label="Verniz" value="Verniz" />
            <Picker.Item label="Courvin Liso" value="Courvin Liso" />
            <Picker.Item label="Courvin Acoplado" value="Courvin Acoplado" />
            <Picker.Item
              label="Courvin Programado"
              value="Courvin Programado"
            />
            <Picker.Item label="PVC" value="Pvc" />
            <Picker.Item label="Courvin Tapete" value="Courvin Tapete" />
            <Picker.Item label="Napa" value="Napa" />
          </Picker>

          <TextInput
            style={styles.input}
            onChangeText={setQuantidade}
            value={quantidade}
            placeholder="Quantidade"
            maxLength={3}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={{width: '90%', marginTop: 10}}
            onPress={() => AddEstoque()}>
            <View
              style={{
                backgroundColor: '#FF7751',
                height: 40,
                flexDirection: 'row',
                borderRadius: 10,
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                Adcionar
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{width: '90%', marginTop: 10}}
            onPress={() => setModalVisible(!modalVisible)}>
            <View
              style={{
                backgroundColor: '#558898',
                height: 40,
                flexDirection: 'row',
                borderRadius: 10,
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                Cancelar
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <View style={{width: '80%'}}>
          <TextInput
            style={{
              backgroundColor: 'white',
              height: 40,
              padding: 5,
              borderRadius: 5,
            }}
            placeholder="Pesquisar material"
            onChangeText={setPesquisa}
            value={pesquisa}
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
        style={{height: '92%', padding: 5, marginTop: 5}}
        showsVerticalScrollIndicator={false}
        data={estoque}
        renderItem={({item}) => (
          <View
            style={{
              borderRadius: 10,
              backgroundColor: item.quantidade <= 2 ? '#A9A9A9' : '#dcdcdc',
              marginTop: 10,
              elevation: 5,
            }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '15%',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <Text
                  style={{fontSize: 30, color: '#565050', fontWeight: 'bold'}}>
                  {item.quantidade}
                </Text>
                <Text style={{fontSize: 10}}>Rolos</Text>
              </View>

              <View
                style={{
                  marginLeft: 10,
                  width: '85%',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{fontSize: 15, fontWeight: 'bold', color: '#696969'}}>
                  {item.nome} - {item.modelo}
                </Text>
                <Text style={{fontSize: 10, color: '#696969'}}>
                  {item.fabricante}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: 5,
                marginTop: 5,
              }}>
              <TouchableOpacity
                style={{
                  height: 35,
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  width: '35%',
                  backgroundColor: '#FF7751',
                  borderRadius: 5,
                }}
                onPress={() =>
                  Retirar(item.key, item.quantidade, item.modelo, item.nome)
                }>
                <Text style={{fontWeight: 'bold', color: '#ffff'}}>
                  Retirar Material
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  width: '60%',
                  backgroundColor: '#dcdcdc',
                  padding: 3,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  borderRadius: 6,
                }}>
                <TextInput
                  style={{
                    backgroundColor: '#fff',
                    height: 29,
                    padding: 5,
                    borderRadius: 5,
                    width: '45%',
                    color: '#696969',
                  }}
                  placeholder="0"
                  onChangeText={setQuantidadeamais}
                  maxLength={2}
                  value={quantidadeamais}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={{
                    height: 30,
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    width: '45%',
                    backgroundColor: '#FF7751',
                    borderRadius: 5,
                  }}
                  onPress={() =>
                    AdcionarMais(item.key, item.quantidade, quantidadeamais)
                  }>
                  <Text style={{fontWeight: 'bold', color: '#ffff'}}>
                    Adcionar
                  </Text>
                </TouchableOpacity>
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
    borderColor: '#ffff',
    backgroundColor: '#ffff',
    height: 50,
    width: '90%',
    marginTop: 10,
  },
});

export default Materiais;
