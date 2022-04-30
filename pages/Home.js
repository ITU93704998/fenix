import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  StatusBar,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
  Modal,
  ActivityIndicator,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconC from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Login from './Login/index';

export default function App({navigation}) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [senha, setSenha] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [verificacao, setVerificacao] = useState([]);
  const [valorindicator, setVlorIndicator] = useState(false);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  function Logar() {
    setVlorIndicator(true);
    auth()
      .signInWithEmailAndPassword(user.trim(), senha)
      .then(() => {
        setVlorIndicator(false);
        setModalVisible(!modalVisible);
      })
      .catch(console.log('Algo deu errado'));
  }

  function Logout() {
    auth()
      .signOut()
      .then(() => Alert.alert('Usuario', 'Usuarios deslogado'));
  }

  if (initializing) return null;

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@storage_Key', user.uid);
    } catch (e) {
      console.log('Erro ao gravar dados no AsyncSotarage');
    }
  };
  storeData();

  if (!user) {
    return <Login />;
  } else {
    if (user.uid != 'v7RPkSgKE7PwUo6fnyDbR3JSFU23') {
      return (
        <View style={styles.container}>
          <StatusBar barStyle="default" backgroundColor="#027381" />
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View
              style={{
                backgroundColor: '#027381',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
              <View style={{width: '90%'}}>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    height: 50,
                    padding: 5,
                    borderRadius: 3,
                  }}
                  placeholder="email"
                  onChangeText={setUser}
                  value={user}
                  keyboardType="default"
                />
              </View>
              <View style={{width: '90%', marginTop: 20}}>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    height: 50,
                    padding: 5,
                    borderRadius: 3,
                  }}
                  placeholder="senha"
                  onChangeText={setSenha}
                  value={senha}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                style={{marginTop: 10, width: '90%'}}
                onPress={() => Logar(user, senha)}>
                <View
                  style={{
                    backgroundColor: '#FF7751',
                    height: 40,
                    flexDirection: 'row',
                    borderRadius: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator
                    style={{marginRight: 10}}
                    animating={valorindicator}
                    size="small"
                    color="#fff"
                  />
                  <Text
                    style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                    Logar
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
                    borderRadius: 3,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                    Cancelar
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>

          <View
            style={{
              width: '90%',
              height: '10%',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 20,
            }}>
            <TouchableOpacity onPress={() => Logout()}>
              <IconC name="logout" size={30} color="#FF7751" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              flex: 1,
            }}>
            <View
              style={{flexDirection: 'column', justifyContent: 'space-around'}}>
              <Pressable
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                }}>
                <Icon
                  name="assignment"
                  color="#FF7751"
                  size={70}
                  onPress={() => navigation.navigate('Produção')}
                />
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={{color: 'white', fontWeight: '300'}}>
                    Produção
                  </Text>
                </View>
              </Pressable>
            </View>

            <View
              style={{flexDirection: 'column', justifyContent: 'space-around'}}>
              <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                <IconC
                  name="floor-plan"
                  color="#FF7751"
                  size={70}
                  onPress={() => navigation.navigate('Moldes')}
                />
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={{color: 'white', fontWeight: '300'}}>
                    Moldes
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar barStyle="default" backgroundColor="#027381" />

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: 10,
            }}>
            <TouchableOpacity onPress={() => Logout()}>
              <IconC name="logout" size={30} color="#FF7751" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              height: '100%',
            }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Produção')}
                style={{flexDirection: 'column', justifyContent: 'center'}}>
                <Icon name="assignment" color="#FF7751" size={70} />
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text
                    style={{color: 'white', fontWeight: '400', fontSize: 12}}>
                    Produção
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Estoque')}
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <IconC name="package" color="#FF7751" size={70} />
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text
                    style={{color: 'white', fontWeight: '400', fontSize: 12}}>
                    Etoque
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{flexDirection: 'column', justifyContent: 'space-around'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Moldes')}
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <IconC name="floor-plan" color="#FF7751" size={70} />
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text
                    style={{color: 'white', fontWeight: '400', fontSize: 12}}>
                    Moldes
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Materiais')}
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="style" color="#FF7751" size={70} />
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text
                    style={{color: 'white', fontWeight: '400', fontSize: 12}}>
                    Materiais
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{flexDirection: 'column', justifyContent: 'space-around'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Gastos')}
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="money-off" color="#FF7751" size={70} />
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text
                    style={{color: 'white', fontWeight: '400', fontSize: 12}}>
                    Comissão
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('FolhaSalarial')}
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="attach-money" color="#FF7751" size={70} />
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text
                    style={{color: 'white', fontWeight: '400', fontSize: 12}}>
                    Salários
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#027381',
  },
});
