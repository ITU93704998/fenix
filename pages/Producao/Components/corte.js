import React, {useState, useEffect} from "react";
import { Text, View, FlatList, Image, TouchableOpacity, Alert, Modal } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
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

  function DeletePro(id){
    setVlorIndicator(!valorindicator)
    const fimdelete = firestore()
    .collection('producao')
    .doc(id)
    .delete()
    .then(() => {
      Alert.alert("Confirmação!","Produto excluido com sucesso!");
    });
    return () => fimdelete();
  }

  function CortadoPro(id){
    setVlorIndicator(!valorindicator)
    const cortado = firestore()
    .collection('producao')
    .doc(id)
    .update({
      status: 2,
      data_corte: dataAtual,
      materiais_uso: materialSele1 + " " + materialSele2 + " " + materialSele3
    })
    .then(() => {
      setVlorIndicator(!valorindicator),
      setModalVisibleFim(!modalVisibleFim),
      setMarterialSele1(''),
      setMarterialSele2(''),
      setMarterialSele3('')
      Alert.alert("Confirmação!","Produto cortado com sucesso!");
    });
    return () => cortado();
  }

  function VeriLogo(){
      if(props.plataforma == '#D4AE00'){
        return(
          <View style={{width: '10%', flexDirection: 'column', justifyContent: 'center',}}>
             <Image
              style={{width: 30, height: 20}}
              source={require('../../src/img/ml.png')}
            />
          </View>
        )
      }

      if(props.plataforma == '#00A3D8'){
        return(
          <View style={{width: '10%',  flexDirection: 'column', justifyContent: 'center',}}>
            <Image
              style={{width: 30, height: 20}}
              source={require('../../src/img/co.png')}
            />
          </View>
        )
      }
      if(props.plataforma == '#FFFF'){
        return(
          <View style={{width: '10%',  flexDirection: 'column', justifyContent: 'center',}}>
            <Image
              style={{width: 30, height: 30}}
              source={require('../../src/img/et.png')}
            />
          </View>
        )
      }
      if(props.plataforma == '#7B7B7B'){
        return(
          <View style={{width: '10%', flexDirection: 'column', justifyContent: 'center',}}>
            <Image
              style={{width: 30, height: 30}}
              source={require('../../src/img/mo.png')}
            />
          </View>
        )
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
    }
    myFunction2()
  },[])

  useEffect(() => {
    const myFunction = async () => {
      if(valorbutton === ''){
        setMateriasFilter(materiais)
      }else{
        setMateriasFilter(
          materiais.filter(item => (item.modelo == valorbutton))
        )
      }
    };
    myFunction();
  }, [valorbutton])


  
  return (
    <View style={{padding: 3, borderRadius: 5, backgroundColor:'white', marginTop: 3,elevation: 10  }}>

      
     <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleFim}
        onRequestClose={() => {
          setModalVisibleFim(!modalVisibleFim);
        }}
      >
        <View style={{ backgroundColor: "#027381", flex: 1,flexDirection: 'column', justifyContent: 'center', alignItems: 'center'  }}>
        
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: '90%'}}>
          <Text style={{color:'#dcdcdc', fontWeight: 'bold'}}>Materias usado?</Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '95%'}}>
          <TouchableOpacity style={{backgroundColor: '#ffff', paddingHorizontal: 10,paddingVertical:3, borderRadius: 3}} onPress={() => setValorbutton('Verniz')}>
            <Text style={{color:"#027381"}}>VER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: '#ffff', paddingHorizontal: 10,paddingVertical:3, borderRadius: 3}} onPress={() => setValorbutton('Courvin Liso')}>
            <Text style={{color:"#027381"}}>C LI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: '#ffff', paddingHorizontal: 10,paddingVertical:3, borderRadius: 3}} onPress={() => setValorbutton('Courvin Acoplado')}>
            <Text style={{color:"#027381"}}>C AC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: '#ffff', paddingHorizontal: 10,paddingVertical:3, borderRadius: 3}} onPress={() => setValorbutton('Pvc')}>
            <Text style={{color:"#027381"}}>PVC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: '#ffff', paddingHorizontal: 10,paddingVertical:3, borderRadius: 3}} onPress={() => setValorbutton('Courvin Tapete')}>
            <Text style={{color:"#027381"}}>C TA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: '#ffff', paddingHorizontal: 10,paddingVertical:3, borderRadius: 3}} onPress={() => setValorbutton('Courvin Programado')}>
            <Text style={{color:"#027381"}}>C Pro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: '#ffff', paddingHorizontal: 10,paddingVertical:3, borderRadius: 3}} onPress={() => setValorbutton('Napa')}>
            <Text style={{color:"#027381"}}>Napa</Text>
          </TouchableOpacity>
        </View>
        
          <Picker
            style={{width: '90%',marginTop: 10, backgroundColor: "white", borderRadius: 10}}
            selectedValue={materialSele1}
            onValueChange={(itemValue, itemIndex) =>
              setMarterialSele1(itemValue)
            } 
          >
            <Picker.Item label={materialSele1} value='0' />
            { 
              materiais.length > 0 ? 
              materiaisFilter.map(item =>  <Picker.Item label={item.nome + "- " + item.modelo} value={item.key} /> ):
              ''
            }
          </Picker>

          <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: '90%'}}>
        </View>
          <Picker
            style={{width: '90%',marginTop: 10, backgroundColor: "white", borderRadius: 10}}
            selectedValue={materialSele2}
            onValueChange={(itemValue, itemIndex) =>
              setMarterialSele2(itemValue)
            } 
          >
            <Picker.Item label={materialSele2} value='0' />
            { 
              materiais.length > 0 ? 
              materiaisFilter.map(item =>  <Picker.Item label={item.nome + "- " + item.modelo} value={item.key} /> ):
              ''
            }
          </Picker>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: '90%'}}>
        </View>
          <Picker
            style={{width: '90%',marginTop: 10, backgroundColor: "white", borderRadius: 10}}
            selectedValue={materialSele3}
            onValueChange={(itemValue, itemIndex) =>
              setMarterialSele3(itemValue)
            } 
          >
            <Picker.Item label={materialSele3} value='0' />
            { 
              materiais.length > 0 ? 
              materiaisFilter.map(item =>  <Picker.Item label={item.nome + "- " + item.modelo} value={item.key} /> ):
              ''
            }
          </Picker>

          <TouchableOpacity style={{width: '90%',marginTop: 10}}  onPress={() => CortadoPro(props.id)}>
            <View style={{backgroundColor: "#FF7751", height: 40, flexDirection: 'row',borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
           
            <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Ok</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{width: '90%',marginTop: 10}}  onPress={() => setModalVisibleFim(!modalVisibleFim)}>
            <View style={{backgroundColor: "#558898", height: 40, flexDirection: 'row',borderRadius: 10, justifyContent: 'space-around', alignItems: 'center'}}>
             <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Cancelar</Text>
            </View>
          </TouchableOpacity>
          </View>
      </Modal>


      <View style={{width: '100%',  flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' ,}}>
        <View style={{width: '15%',flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
          <Text style={{fontSize: 30, color: '#565050',fontWeight: 'bold'}}>{props.quantidade}</Text>
        </View>
        
        <View style={{marginLeft: 5, width: '75%', flexDirection: 'column', justifyContent: 'center',}}>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: '#696969'}}>{props.nome}</Text>
          <Text style={{fontSize: 10, fontWeight: 'bold',}}>{props.modelo}</Text>
         </View>
         <VeriLogo />
         
        
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around',marginTop: 3}}>
        <TouchableOpacity style={{alignItems: 'center',padding: 5,flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '45%', backgroundColor: '#FF7751', borderRadius: 5}} onPress={() => DeletePro(props.id)}>
        <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 13}}>Excluir</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{alignItems: 'center',padding: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '45%', backgroundColor: '#FF7751', borderRadius: 5}} onPress={() => (setModalVisibleFim(!modalVisibleFim), props.id) }>
         <Text style={{fontWeight: 'bold', color: '#ffff', fontSize: 13}}>Cortado</Text>
        </TouchableOpacity>
        
      </View>

    </View>
  );
}

export default Cortar;
