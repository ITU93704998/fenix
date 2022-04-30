import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

function DadosSomar(props) {
  const [filterpro, setFilterPro] = useState([]);
  const [producaor, setProducaor] = useState([]);
  const [comissao, setComissao] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pesquisadi, setPesquisadi] = useState('01');
  const [pesquisadf, setPesquisadf] = useState('31');

  var data = new Date();
  var dia = String(data.getDate()).padStart(2, '0');
  var mes = String(data.getMonth() + 1).padStart(2, '0');
  var ano = data.getFullYear();
  dataAtual = dia + '/' + mes + '/' + ano;

  var valorcapa = comissao.map(item => item.capas);
  var valortapete = comissao.map(item => item.tapetes);
  var valorforro = comissao.map(item => item.forros);

  let producaoFilterUser = filterpro.filter(
    item => item.costureiro == props.nome,
  );

  let objetosFiltradosAnoMes = producaoFilterUser.filter(
    item => item.data_costura.substr(3) == props.mess + '/' + ano,
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

  let totalcapas = objetosFiltrados.filter(item => item.modelo == 'Capa');
  let totaltapetes = objetosFiltrados.filter(item => item.modelo == 'Tapete');
  let totalforros = objetosFiltrados.filter(
    item => item.modelo == 'ForroPorta',
  );

  var totalcapasInt = totalcapas.reduce((somatoria, quantidade) => {
    return somatoria + parseInt(quantidade.quantidadep);
  }, 0);
  var totaltapetesInt = totaltapetes.reduce((somatoria, quantidade) => {
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
    myFunction1();
  }, []);

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

  return <Text>{totalcomissao + props.somar}</Text>;
}

export default DadosSomar;
