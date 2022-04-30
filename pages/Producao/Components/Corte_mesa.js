import React, {useState} from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Button,
} from 'react-native';
import Indicator from './indicator';
import firestore from '@react-native-firebase/firestore';

function Cortar_Mesa(props) {
  const [quantidade, setQuantidade] = useState(props.quantidade);
  const [costureiro, setCostureiro] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [valorindicator, setVlorIndicator] = useState(false);

  var data = new Date();
  var dia = String(data.getDate()).padStart(2, '0');
  var mes = String(data.getMonth() + 1).padStart(2, '0');
  var ano = data.getFullYear();
  dataAtual = dia + '/' + mes + '/' + ano;

  function MandarPC(id, quant) {
    if (quantidade == '') {
      Alert.alert('Atenção', 'A quantidade não pode ser nula!');
    } else {
      setVlorIndicator(!valorindicator);
      if (quant == quantidade) {
        const subscriber = firestore()
          .collection('producao')
          .doc(id)
          .update({
            status: 3,
          })
          .then(() => {
            Alert.alert('Costura', 'Foi enviado para costura!');
            setQuantidade(props.quantidade);
          })
          .finally(() => setModalVisible(!modalVisible));
        return () => subscriber();
      } else {
        if (quantidade > quant) {
          Alert.alert('Atenção', 'Os numeros da quantidade não batem!');
        } else {
          const subscriber = firestore()
            .collection('producao')
            .doc(id)
            .update({
              status: 3,
              quantidadep: quantidade,
            })
            .then(() => {
              const subscriber = firestore()
                .collection('producao')
                .add({
                  nomep: props.nome,
                  plataformap: props.plataforma,
                  quantidadep: props.quantidade - quantidade,
                  status: 2,
                  modelo: props.modelo,
                  data_corte: props.data_corte,
                  costureiro: '',
                  data_costura: '',
                  materiais_uso: props.materiais_uso,
                  data_montagem: '',
                  data_envio: '',
                  local: '',
                  creatate_at: dataAtual,
                })
                .then(
                  () => Alert.alert('Produção', 'Produção adcionada!'),
                  setQuantidade(props.quantidade),
                )
                .catch(error => console.log(error))
                .finally(() => setModalVisible(!modalVisible));
              return () => subscriber();
            });
          return () => subscriber();
        }
      }
      setVlorIndicator(!valorindicator);
    }
  }

  function VeriLogo() {
    if (props.plataforma == '#D4AE00') {
      return (
        <View
          style={{
            width: '10%',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <Image
            style={{width: 30, height: 20}}
            source={require('../../src/img/ml.png')}
          />
        </View>
      );
    }

    if (props.plataforma == '#00A3D8') {
      return (
        <View
          style={{
            width: '10%',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <Image
            style={{width: 30, height: 20}}
            source={require('../../src/img/co.png')}
          />
        </View>
      );
    }
    if (props.plataforma == '#FFFF') {
      return (
        <View
          style={{
            width: '10%',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <Image
            style={{width: 30, height: 30}}
            source={require('../../src/img/et.png')}
          />
        </View>
      );
    }
    if (props.plataforma == '#7B7B7B') {
      return (
        <View
          style={{
            width: '10%',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <Image
            style={{width: 30, height: 30}}
            source={require('../../src/img/mo.png')}
          />
        </View>
      );
    }
  }
  return (
    <>
      <View
        style={{
          padding: 3,
          borderRadius: 6,
          backgroundColor: '#dcdcdc',
          marginTop: 10,
        }}>
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
              onChangeText={setQuantidade}
              value={quantidade}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={{width: '90%', marginTop: 10}}
              onPress={() => MandarPC(props.id, props.quantidade)}>
              <View
                style={{
                  backgroundColor: '#FF7751',
                  height: 40,
                  flexDirection: 'row',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                  Mandar Para Costura
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{marginTop: 10, width: '90%'}}
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
            <Text style={{fontSize: 30, color: '#565050', fontWeight: 'bold'}}>
              {props.quantidade}
            </Text>
          </View>

          <View
            style={{
              width: '75%',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#696969'}}>
              {props.nome}
            </Text>
          </View>

          <VeriLogo />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 5,
          }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 5,
              width: '90%',
            }}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={{fontWeight: 'bold', color: '#FF7751', fontSize: 16}}>
              Mandar {props.modelo} para Costura
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
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
  },
});

export default Cortar_Mesa;
