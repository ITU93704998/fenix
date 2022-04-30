import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import Ct from '../Components/lista';
import AsyncStorage from '@react-native-async-storage/async-storage';

const List = () => {
  const [producaor, setProducaor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [valorSalario, setValorSalario] = useState(false);
  const [gastos, setGastos] = useState([]);
  const [uid, setUID] = useState('');
  const [vsalerio, setVSalario] = useState(null);
  const [pesquisadi, setPesquisadi] = useState('01');
  const [pesquisadf, setPesquisadf] = useState('31');
  const [filterpro, setFilterPro] = useState([]);
  const [comissao, setComissao] = useState([]);
  const [costureiroD, setCostureiroD] = useState([]);
  const [costureiroUid, setCostureiroUid] = useState('');
  const [pesquisaGerencia, setPesquisaGerencia] = useState();

  var data = new Date();
  var dia = String(data.getDate()).padStart(2, '0');
  var mes = String(data.getMonth() + 1).padStart(2, '0');
  var ano = String(data.getFullYear());
  dataAtual = dia + '/' + mes + '/' + ano;

  const [pesquisames, setPesquisames] = useState(mes);
  const [pesquisaano, setPesquisaano] = useState(ano);

  var valorcapa = comissao.map(item => item.capas);
  var valortapete = comissao.map(item => item.tapetes);
  var valorforro = comissao.map(item => item.forros);

  let objGastosFilter = gastos.filter(
    item => item.data.substr(3) == pesquisames + '/' + ano,
  );

  let producaoFilterUser = filterpro.filter(
    item =>
      item.costureiro ==
      (uid == 'v7RPkSgKE7PwUo6fnyDbR3JSFU23'
        ? pesquisaGerencia
        : costureiroUid),
  );
  var TotalGastosFalarial = objGastosFilter.reduce((somatoria, quantidade) => {
    return somatoria + parseInt(quantidade.valor);
  }, 0);

  let objetosFiltradosAnoMes = producaoFilterUser.filter(
    item => item.data_costura.substr(3) == pesquisames + '/' + pesquisaano,
  );

  let objetosFiltrados = objetosFiltradosAnoMes.filter(result => {
    if ((pesquisadi == '') & (pesquisadf == '')) {
      return result.data_costura == dataAtual;
    } else {
      return (
        result.data_costura.substr(0, 2) >= pesquisadi &&
        result.data_costura.substr(0, 2) <= pesquisadf
      );
    }
  });

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
    };
    myFunction2();
  }, []);

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
    };
    VeriGastos();
  }, [valorSalario]);

  const storeData1 = async () => {
    try {
      jsonValue = await AsyncStorage.getItem('@storage_Key');
      let nomeCostura = costureiroD.filter(item => item.uid == jsonValue);
      setCostureiroUid(nomeCostura[0].nome);
      setUID(nomeCostura[0].uid);
      setVSalario(nomeCostura[0].salario);
    } catch (e) {
      console.log(e);
    }
  };

  storeData1();

  let totalcapas = objetosFiltrados.filter(item => item.modelo == 'Capa');
  let totaltapetes = objetosFiltrados.filter(item => item.modelo == 'Tapete');
  let totaloutros = objetosFiltrados.filter(item => item.modelo == 'Outros');
  let totalforros = objetosFiltrados.filter(
    item => item.modelo == 'ForroPorta',
  );

  var totalcapasInt = totalcapas.reduce((somatoria, quantidade) => {
    return somatoria + parseInt(quantidade.quantidadep);
  }, 0);
  var totaltapetesInt = totaltapetes.reduce((somatoria, quantidade) => {
    return somatoria + parseInt(quantidade.quantidadep);
  }, 0);
  var totaloutrosInt = totaloutros.reduce((somatoria, quantidade) => {
    return somatoria + parseInt(quantidade.quantidadep);
  }, 0);
  var TotalforrosInt = totalforros.reduce((somatoria, quantidade) => {
    return somatoria + parseInt(quantidade.quantidadep);
  }, 0);

  var totalcomissao =
    totalcapasInt * valorcapa +
    totaltapetesInt * valortapete +
    TotalforrosInt * valorforro;

  useEffect(() => {
    const comissao = async () => {
      const subscriber = firestore()
        .collection('valor_comissao')
        .onSnapshot(querySnapshot => {
          const comic = [];

          querySnapshot.forEach(documentSnapshot => {
            comic.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });

          setComissao(comic);
        });

      // Unsubscribe from events when no longer in use
      return () => subscriber();
    };

    comissao();
  }, []);

  const myFunction1 = async () => {
    const subscriber = firestore()
      .collection('producao')
      .onSnapshot(querySnapshot => {
        const producaor = [];

        querySnapshot.forEach(documentSnapshot => {
          producaor.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setProducaor(producaor);
        setFilterPro(producaor);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  };

  useEffect(() => {
    myFunction1();
  }, []);

  function compare(a, b) {
    return a.data_costura < b.data_costura;
  }

  return (
    <View style={{flex: 1, width: '100%'}}>
      <View style={{}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: '#027381',
            padding: 20,
            height: 130,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: -30,
            }}>
            {uid === 'v7RPkSgKE7PwUo6fnyDbR3JSFU23' ? (
              <View
                style={{
                  width: '26%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    height: 33,
                    padding: 5,
                    borderRadius: 5,
                    width: '95%',
                    color: '#4B4B4B',
                  }}
                  placeholder="Costureiro"
                  onChangeText={setPesquisaGerencia}
                  value={pesquisaGerencia}
                  keyboardType="default"
                />
              </View>
            ) : (
              <View></View>
            )}

            <View
              style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                width: uid == 'v7RPkSgKE7PwUo6fnyDbR3JSFU23' ? '70%' : '100%',
              }}>
              <View
                style={{
                  width: '15%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    height: 30,
                    padding: 5,
                    borderRadius: 5,
                    width: '95%',
                    color: '#4B4B4B',
                  }}
                  placeholder="00"
                  onChangeText={setPesquisadi}
                  value={pesquisadi}
                  maxLength={2}
                  keyboardType="numeric"
                />
              </View>
              <View>
                <Icon name="keyboard-arrow-right" size={20} color="#696969" />
              </View>
              <View
                style={{
                  width: '15%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    height: 30,
                    padding: 5,
                    borderRadius: 5,
                    width: '95%',
                    color: '#4B4B4B',
                  }}
                  placeholder="00"
                  maxLength={2}
                  onChangeText={setPesquisadf}
                  value={pesquisadf}
                  keyboardType="numeric"
                />
              </View>
              <View style={{}}>
                <Text style={{color: '#696969', fontSize: 25}}>/</Text>
              </View>
              <View
                style={{
                  width: '15%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    height: 30,
                    padding: 5,
                    borderRadius: 5,
                    color: '#4B4B4B',
                  }}
                  placeholder="00"
                  onChangeText={setPesquisames}
                  value={pesquisames}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              <View style={{}}>
                <Text style={{color: '#696969', fontSize: 25}}>/</Text>
              </View>
              <View
                style={{
                  width: '20%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    height: 30,
                    padding: 5,
                    borderRadius: 5,
                    color: '#4B4B4B',
                  }}
                  placeholder="0000"
                  onChangeText={setPesquisaano}
                  value={pesquisaano}
                  maxLength={4}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '90%',
              height: 80,
              backgroundColor: '#FF7751',
              marginTop: -40,
              borderRadius: 10,
              elevation: 5,
            }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 25, color: '#fff', fontWeight: 'bold'}}>
                <Text style={{fontSize: 12, fontWeight: 'bold'}}>R$ </Text>
                {totalcomissao}
              </Text>
              <Text style={{color: '#fff', fontSize: 10}}>Comissão</Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 25, color: '#ffff', fontWeight: 'bold'}}>
                {totalcapasInt}
              </Text>
              <Text style={{color: '#fff', fontSize: 10}}>Capas</Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 25, color: '#ffff', fontWeight: 'bold'}}>
                {totaltapetesInt}
              </Text>
              <Text style={{color: '#fff', fontSize: 10}}>Tapetes</Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 25, color: '#fff', fontWeight: 'bold'}}>
                {TotalforrosInt}
              </Text>
              <Text style={{color: '#fff', fontSize: 10}}>Forros</Text>
            </View>

            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 25, color: '#ffff', fontWeight: 'bold'}}>
                {totaloutrosInt}
              </Text>
              <Text style={{color: '#fff', fontSize: 10}}>Outros</Text>
            </View>
          </View>
        </View>
      </View>
      {uid != 'v7RPkSgKE7PwUo6fnyDbR3JSFU23' ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            padding: 10,
          }}>
          <TouchableOpacity
            style={{
              marginRight: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setValorSalario(!valorSalario),
                setPesquisadi('01'),
                setPesquisadf('31');
            }}>
            <Text style={{fontWeight: '500', color: 'green'}}>
              <Icon
                name={
                  valorSalario == true
                    ? 'keyboard-arrow-up'
                    : 'keyboard-arrow-down'
                }
                size={12}
                color="green"
              />{' '}
              Ver Folha salarial{' '}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View></View>
      )}

      {valorSalario == true ? (
        uid != 'v7RPkSgKE7PwUo6fnyDbR3JSFU23' ? (
          <View style={{padding: 20, marginTop: -20}}>
            <View
              style={{
                width: '100%',
                backgroundColor: '#ffff',
                padding: 10,
                borderRadius: 5,
                elevation: 5,
              }}>
              <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                {costureiroUid}
              </Text>
              <View
                style={{borderBottomColor: '#dcdcdc', borderBottomWidth: 1}}
              />
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    width: '90%',
                    marginTop: 5,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text>Salário</Text>
                    <Text style={{color: 'green', fontWeight: '500'}}>
                      + R${vsalerio}
                    </Text>
                  </View>
                  <FlatList
                    data={objGastosFilter}
                    showsVerticalScrollIndicator={false}
                    style={{}}
                    renderItem={({item}) => (
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text>
                          {item.nome} dia {item.data}
                        </Text>
                        <Text
                          style={{
                            color: item.tipo == 2 ? 'red' : 'green',
                            fontWeight: '500',
                          }}>
                          {' '}
                          {item.tipo == 2 ? '-' : '+'} R${item.valor}
                        </Text>
                      </View>
                    )}
                  />
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text>Comissão</Text>
                    <Text style={{color: 'green', fontWeight: '500'}}>
                      + R${totalcomissao}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 5,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>Total</Text>
                <Text
                  style={{color: '#696969', fontWeight: '500', fontSize: 15}}>
                  R$ {vsalerio + totalcomissao - TotalGastosFalarial}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View></View>
        )
      ) : (
        <View></View>
      )}

      <View
        style={{
          padding: 10,
          marginTop: uid === 'v7RPkSgKE7PwUo6fnyDbR3JSFU23' ? 1 : -10,
        }}>
        <FlatList
          data={objetosFiltrados.sort(compare)}
          showsVerticalScrollIndicator={false}
          style={{
            height: uid === 'v7RPkSgKE7PwUo6fnyDbR3JSFU23' ? '77%' : '72%',
          }}
          renderItem={({item}) => (
            <Ct
              nome={item.nomep}
              quantidade={item.quantidadep}
              plataforma={item.plataformap}
              fim={item.data_costura}
              status={item.status}
              costureiro={item.costureiro}
              id={item.key}
              modelo={item.modelo}
            />
          )}
        />
      </View>
    </View>
  );
};

export default List;
