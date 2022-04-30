import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';

function Estoque({navigation}) {
  const [pesquisa, setPesquisa] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [plataforma, setPlataforma] = useState('Capa');
  const [local, setLocal] = useState('');
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [estoque, setEstoque] = useState([]);
  const [estoquet, setEstoquet] = useState([]);
  const [veri, setVeri] = useState(false);
  const [animationEnviar, setAnimationEnviar] = useState(false);
  const [animationMontar, setAnimationMontar] = useState(false);
  var data = new Date();
  var dia = String(data.getDate()).padStart(2, '0');
  var mes = String(data.getMonth() + 1).padStart(2, '0');
  var ano = data.getFullYear();
  dataAtual = dia + '/' + mes + '/' + ano;

  const myFunction1 = async () => {
    if (pesquisa === '') {
      setEstoque(estoquet);
    } else {
      setEstoque(
        estoque.filter(
          item => item.nomep.toLowerCase().indexOf(pesquisa.toLowerCase()) > -1,
        ),
      );
    }
  };
  const myFunction2 = async () => {
    const subscriber = firestore()
      .collection('producao')
      .where('status', '==', 8)
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
    myFunction1();
  }, [pesquisa]);

  useEffect(() => {
    myFunction2();
  }, []);

  function AddEstoque() {
    if (quantidade == '' || local == '') {
      Alert.alert('Atenção', 'Tem campo em branco!');
    } else {
      const adcionar = firestore()
        .collection('producao')
        .add({
          nomep: nome,
          modelo: plataforma,
          plataformap: '',
          quantidadep: quantidade,
          status: 8,
          costureiro: '',
          data_costura: '',
          data_corte: '',
          data_montagem: '',
          materiais_uso: '',
          data_envio: '',
          local,
          creatate_at: dataAtual,
        })
        .then(
          () => Alert.alert('Estoque', 'Estoque adcionado!'),
          setNome(''),
          setQuantidade(''),
        )
        .catch(error => console.log(error))
        .finally(() => setModalVisible(!modalVisible));

      return () => adcionar();
    }
  }

  function Enviar(
    id,
    quantidade,
    modelo,
    data_corte,
    data_costura,
    costureiro,
    local,
    creatate_at,
    nomep,
    plataformap,
  ) {
    setAnimationEnviar(!animationEnviar);

    if (quantidade == '1' || quantidade < '1') {
      const costurar = firestore()
        .collection('producao')
        .doc(id)
        .update({
          status: 6,
          data_envio: dataAtual,
        })
        .then(() => {
          setAnimationEnviar(false);
          Alert.alert('ok', 'Ok');
          setVeri(!veri);
        });
      return () => costurar();
    } else {
      const subscriber = firestore()
        .collection('producao')
        .doc(id)
        .update({
          status: 6,
          quantidadep: 1,
          data_envio: dataAtual,
        })
        .then(() => {
          const subscriber = firestore()
            .collection('producao')
            .add({
              nomep,
              plataformap,
              quantidadep: quantidade - 1,
              status: 8,
              modelo,
              data_corte,
              costureiro,
              data_costura,
              data_montagem: '',
              materiais_uso: '',
              data_envio: '',
              local,
              creatate_at,
            })
            .then(
              () => setAnimationEnviar(false),
              setVeri(!veri),
              Alert.alert('ok', 'Ok'),
            )
            .catch(error => console.log(error));
          return () => subscriber();
        });
      return () => subscriber();
    }
  }

  function Montar(
    id,
    quantidade,
    modelo,
    data_corte,
    data_costura,
    costureiro,
    local,
    creatate_at,
    nomep,
    plataformap,
  ) {
    if (quantidade == '1' || quantidade < '1') {
      const costurar = firestore()
        .collection('producao')
        .doc(id)
        .update({
          status: 7,
          data_montagem: dataAtual,
        })
        .then(() => {
          Alert.alert(
            'Montagem!',
            'Mercadoria retirada do estoque para montagem!',
          );
          setVeri(!veri);
        });
      return () => costurar();
    } else {
      const subscriber = firestore()
        .collection('producao')
        .doc(id)
        .update({
          status: 7,
          quantidadep: 1,
          data_montagem: dataAtual,
        })
        .then(() => {
          const subscriber = firestore()
            .collection('producao')
            .add({
              nomep,
              plataformap,
              quantidadep: quantidade - 1,
              status: 8,
              modelo,
              data_corte,
              costureiro,
              data_costura,
              data_montagem: '',
              materiais_uso: '',
              data_envio: '',
              local,
              creatate_at,
            })
            .then(
              () =>
                Alert.alert(
                  'Montagem!',
                  'Mercadoria retirada do estoque para montagem!',
                ),
              setVeri(!veri),
            )
            .catch(error => console.log(error));
          return () => subscriber();
        });
      return () => subscriber();
    }
  }

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#027381'}}>
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
            maxLength={100}
            placeholder="Nome"
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
            <Picker.Item label="Capa" value="Capa" />
            <Picker.Item label="Tapete" value="Tapete" />
            <Picker.Item label="Outros" value="Outros" />
            <Picker.Item label="Capa Cobrir" value="Capa_Cobrir" />
            <Picker.Item label="Tapete de Borracha" value="Tapete_Borracha" />
          </Picker>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '90%',
              marginTop: 10,
            }}>
            <Text style={styles.testom}>Local:</Text>
            <TextInput
              style={styles.inputm}
              onChangeText={setLocal}
              value={local}
              maxLength={3}
              keyboardType="default"
            />
            <Text style={styles.testom}>Quantidade:</Text>
            <TextInput
              style={styles.inputm}
              maxLength={3}
              onChangeText={setQuantidade}
              value={quantidade}
              keyboardType="numeric"
            />
          </View>

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
              borderRadius: 10,
            }}
            placeholder="Pesquisar no estoque"
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
        showsVerticalScrollIndicator={false}
        style={{marginTop: 10}}
        data={estoque}
        renderItem={({item}) => (
          <View
            style={{
              padding: 3,
              borderRadius: 3,
              backgroundColor: 'white',
              marginTop: 5,
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
                  width: '20%',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <Text
                  style={{fontSize: 30, color: '#565050', fontWeight: 'bold'}}>
                  {item.local}
                </Text>
              </View>

              <View
                style={{
                  marginLeft: 5,
                  width: '70%',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{fontSize: 15, fontWeight: 'bold', color: '#696969'}}>
                  <Text style={{color: '#FF7751'}}>{item.quantidadep}</Text> -{' '}
                  {item.nomep}
                </Text>
                <Text style={{fontSize: 10, color: '#696969'}}>
                  Feito por {item.costureiro} dia {item.data_costura}
                </Text>
              </View>

              <View
                style={{
                  marginLeft: 5,
                  width: '10%',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{width: 25, height: 25, marginRight: 5}}
                  source={
                    item.modelo == 'Capa'
                      ? require('../src/icon/ca.png')
                      : item.modelo == 'Tapete'
                      ? require('../src/icon/ta.png')
                      : item.modelo == 'Capa_Cobrir'
                      ? require('../src/icon/co.png')
                      : item.modelo == 'Tapete_Borracha'
                      ? require('../src/icon/tb.png')
                      : require('../src/icon/ou.png')
                  }
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 5,
              }}>
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
                  Enviar(
                    item.key,
                    item.quantidadep,
                    item.modelo,
                    item.data_corte,
                    item.data_costura,
                    item.costureiro,
                    item.local,
                    item.creatate_at,
                    item.nomep,
                    item.plataformap,
                  )
                }>
                {animationEnviar == true ? (
                  <ActivityIndicator
                    animating={animationEnviar}
                    size="small"
                    color="#fff"
                  />
                ) : (
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: '#fff',
                      fontSize: 13,
                    }}>
                    Enviar
                  </Text>
                )}
              </TouchableOpacity>

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
                  Montar(
                    item.key,
                    item.quantidadep,
                    item.modelo,
                    item.data_corte,
                    item.data_costura,
                    item.costureiro,
                    item.local,
                    item.creatate_at,
                    item.nomep,
                    item.plataformap,
                  )
                }>
                {animationMontar == true ? (
                  <ActivityIndicator
                    animating={animationMontar}
                    size="small"
                    color="#fff"
                  />
                ) : (
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: '#fff',
                      fontSize: 13,
                    }}>
                    Montar
                  </Text>
                )}
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
    borderColor: '#ffff',
    backgroundColor: '#ffff',
    height: 50,
    width: '90%',
    marginTop: 10,
  },
  inputm: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: '#ffff',
    backgroundColor: '#ffff',
    height: 40,
    width: '20%',
  },
  testom: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
});

export default Estoque;
