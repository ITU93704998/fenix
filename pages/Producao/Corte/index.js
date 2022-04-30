import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Text,
  Modal,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ct from '../Components/corte';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';

const UselessTextInput = ({navigation}) => {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [plataforma, setPlataforma] = useState('#D4AE00');
  const [modalVisible, setModalVisible] = useState(false);
  const [valorindicator, setVlorIndicator] = useState(false);
  const [producaor, setProducaor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modelo, setModelo] = useState('Capa');
  const [codigo, setCodigo] = useState('0001');
  var data = new Date();
  var dia = String(data.getDate()).padStart(2, '0');
  var mes = String(data.getMonth() + 1).padStart(2, '0');
  var ano = data.getFullYear();
  dataAtual = dia + '/' + mes + '/' + ano;

  const myFunction1 = async () => {
    const subscriber = firestore()
      .collection('producao')
      .where('status', '==', 1)
      .onSnapshot(querySnapshot => {
        const producaor = [];

        querySnapshot.forEach(documentSnapshot => {
          producaor.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setProducaor(producaor);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  };

  useEffect(() => {
    myFunction1();
  }, []);

  function addProducao() {
    setVlorIndicator(true);
    try {
      if (quantidade == '') {
        Alert.alert('Atenção', 'Coloque uma quantidade válida!');
      } else {
        firestore()
          .collection('producao')
          .add({
            nomep: nome,
            plataformap: plataforma,
            quantidadep: quantidade,
            status: 1,
            modelo,
            data_corte: '',
            costureiro: '',
            data_costura: '',
            data_montagem: '',
            data_envio: '',
            local: '',
            materiais_uso: codigo,
            creatate_at: dataAtual,
          })
          .then(
            setNome(''),
            setQuantidade(''),
            setPlataforma('#D4AE00'),
            setVlorIndicator(false),
            setModalVisible(!modalVisible),
          )
          .catch(() => Alert.alert('Erro', 'Erro ao adcionar Produção!'));
      }
    } catch (e) {
      console.log(e);
      setVlorIndicator(false);
    }
  }

  if (loading) {
    return <ActivityIndicator />;
  }

  function compare(a, b) {
    return a.creatate_at > b.creatate_at;
  }

  return (
    <View style={{flex: 1, backgroundColor: '#ffff'}}>
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
            selectedValue={modelo}
            onValueChange={(itemValue, itemIndex) => setModelo(itemValue)}>
            <Picker.Item label="Capa" value="Capa" />
            <Picker.Item label="Tapete" value="Tapete" />
            <Picker.Item label="Forro Porta" value="ForroPorta" />
          </Picker>

          <Picker
            style={{
              width: '90%',
              marginTop: 10,
              backgroundColor: 'white',
              borderRadius: 10,
            }}
            selectedValue={plataforma}
            onValueChange={(itemValue, itemIndex) => setPlataforma(itemValue)}>
            <Picker.Item label="Mercado Livre" value="#D4AE00" />
            <Picker.Item label="Correios" value="#00A3D8" />
            <Picker.Item label="Montagem" value="#7B7B7B" />
            <Picker.Item label="Estoque" value="#FFFF" />
          </Picker>

          <TextInput
            style={styles.input}
            onChangeText={setQuantidade}
            value={quantidade}
            maxLength={3}
            placeholder="Quantidade"
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={{width: '90%', marginTop: 10}}
            onPress={() => addProducao()}>
            <View
              style={{
                backgroundColor: '#FF7751',
                height: 40,
                flexDirection: 'row',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {valorindicator == true ? (
                <ActivityIndicator
                  style={{marginRight: 5}}
                  animating={valorindicator}
                  size="small"
                  color="#fff"
                />
              ) : (
                <Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                  Adcionar
                </Text>
              )}
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
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#027381',
          padding: 10,
        }}>
        <View
          style={{
            marginLeft: 15,
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Moldes')}
            style={{
              padding: 7,
              backgroundColor: '#FF7751',
              borderRadius: 6,
              paddingHorizontal: 30,
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Moldes</Text>
          </TouchableOpacity>
        </View>

        <View style={{marginRight: 15}}>
          <Icon
            onPress={() => setModalVisible(!modalVisible)}
            name="add-circle"
            color="#fff"
            size={40}
          />
        </View>
      </View>

      <View style={{padding: 10}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{height: '92%', padding: 5}}
          data={producaor.sort(compare)}
          renderItem={({item}) => (
            <Ct
              nome={item.nomep}
              quantidade={item.quantidadep}
              plataforma={item.plataformap}
              id={item.key}
              modelo={item.modelo}
              codigo={item.materiais_uso}
            />
          )}
        />
      </View>
    </View>
  );
};

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

export default UselessTextInput;
