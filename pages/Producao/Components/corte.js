import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import Indicator from './indicator';

function Cortar(props) {
  const [modalVisibleFim, setModalVisibleFim] = useState(false);
  const [materiais, setMaterias] = useState([]);
  const [materiaisFilter, setMateriasFilter] = useState([]);
  const [materialSele1, setMarterialSele1] = useState('');
  const [materialSele2, setMarterialSele2] = useState('');
  const [materialSele3, setMarterialSele3] = useState('');
  const [valorindicator, setVlorIndicator] = useState(false);
  const [valorbutton, setValorbutton] = useState('Verniz');

  var data = new Date();
  var dia = String(data.getDate()).padStart(2, '0');
  var mes = String(data.getMonth() + 1).padStart(2, '0');
  var ano = data.getFullYear();
  dataAtual = dia + '/' + mes + '/' + ano;

  function DeletePro(id) {
    setVlorIndicator(!valorindicator);
    const fimdelete = firestore()
      .collection('producao')
      .doc(id)
      .delete()
      .then(() => {
        Alert.alert('Confirmação!', 'Produto excluido com sucesso!');
      });
    return () => fimdelete();
  }

  function CortadoPro(id) {
    setVlorIndicator(!valorindicator);
    const cortado = firestore()
      .collection('producao')
      .doc(id)
      .update({
        status: 2,
        data_corte: dataAtual,
      })
      .then(() => {
        setVlorIndicator(!valorindicator),
          setModalVisibleFim(!modalVisibleFim),
          setMarterialSele1(''),
          setMarterialSele2(''),
          setMarterialSele3('');
        Alert.alert('Confirmação!', 'Produto cortado com sucesso!');
      });
    return () => cortado();
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

  useEffect(() => {
    const myFunction2 = async () => {
      const subscriber = firestore()
        .collection('materiais_uso')
        .where('status', '==', 1)
        .get()
        .then(querySnapshot => {
          const estoque = [];

          querySnapshot.forEach(documentSnapshot => {
            estoque.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });

          setMaterias(estoque);
        });

      // Unsubscribe from events when no longer in use
      return () => subscriber();
    };
    myFunction2();
  }, []);

  useEffect(() => {
    const myFunction = async () => {
      if (valorbutton === '') {
        setMateriasFilter(materiais);
      } else {
        setMateriasFilter(materiais.filter(item => item.modelo == valorbutton));
      }
    };
    myFunction();
  }, [valorbutton]);

  return (
    <View
      style={{
        padding: 3,
        borderRadius: 10,
        backgroundColor: '#dcdcdc',
        marginTop: 10,
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
          <Text style={{fontSize: 30, color: '#696969', fontWeight: 'bold'}}>
            {props.quantidade}
          </Text>
        </View>

        <View
          style={{
            marginLeft: 5,
            width: '75%',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 17, fontWeight: 'bold', color: '#696969'}}>
            {props.nome}
          </Text>
        </View>
        <VeriLogo />
      </View>
      <View
        style={{
          borderBottomColor: '#f0f0f0',
          borderBottomWidth: 1,
          marginTop: 5,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 3,
        }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '45%',
            borderRadius: 5,
          }}
          onPress={() => DeletePro(props.id)}>
          <Text style={{fontWeight: 'bold', color: '#FF7751', fontSize: 14}}>
            Excluir{' '}
            {props.modelo == 'ForroPorta' ? `Forro de Porta` : props.modelo}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            alignItems: 'center',
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '45%',
            borderRadius: 5,
          }}
          onPress={() => CortadoPro(props.id)}>
          <Text style={{fontWeight: 'bold', color: '#FF7751', fontSize: 14}}>
            Cortar{' '}
            {props.modelo == 'ForroPorta' ? `Forro de Porta` : props.modelo}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Cortar;
