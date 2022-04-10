import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View , Pressable, StatusBar, TouchableOpacity, Alert, TextInput, FlatList, Modal, ActivityIndicator, Button} from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconC from "react-native-vector-icons/MaterialCommunityIcons";
import { Grid, LineChart} from 'react-native-svg-charts'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Login from './Login/index'

export default function App({navigation}) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [senha, setSenha] =useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [producao, setProducao] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [verificacao, setVerificacao] = useState([]);
  const [valorindicator, setVlorIndicator] = useState(false);
  const [veri, setVeri] = useState(false);


  const [totalMoldes, setTotalMoldes] = useState([]);
  const [totalEstoque, setTotalEstoque] = useState([]);
  const [totalMateriais, setTotalMateriais] = useState([]);

  var data = new Date();
  var dia = String(data.getDate()).padStart(2, '0');
  var mes = String(data.getMonth() + 1).padStart(2, '0');
  var ano = data.getFullYear();
  var dia1 = dia - 1;
  var dateontem =  ("00" + dia1).slice(-2);
  dataAtual = dia + '/' + mes + '/' + ano;
  var ontem = dateontem + '/' + mes + '/' + ano;

  var totalavisoestoque = verificacao.map(item => item.quanti);

  let dadoshojecorte = producao.filter(item => item.data_corte == dataAtual)
  let dadoshojecostura = producao.filter(item => item.data_costura == dataAtual)
  let dadoshojeenvio = producao.filter(item => item.data_envio == dataAtual)
  let dadoshojemontados = producao.filter(item => item.data_montagem == dataAtual)

  var TTCH = dadoshojecorte.reduce((somatoria, quantidade) => { return somatoria + parseInt(quantidade.quantidadep)}, 0);
  var TTCOH = dadoshojecostura.reduce((somatoria, quantidade) => { return somatoria + parseInt(quantidade.quantidadep)}, 0);
  var TTEH = dadoshojeenvio.reduce((somatoria, quantidade) => { return somatoria + parseInt(quantidade.quantidadep)}, 0);
  var TTMH = dadoshojemontados.reduce((somatoria, quantidade) => { return somatoria + parseInt(quantidade.quantidadep)}, 0);


  let dadosontemcorte = producao.filter(item => item.data_corte == ontem)
  let dadosontemcostura = producao.filter(item => item.data_costura == ontem)
  let dadosontemenvio = producao.filter(item => item.data_envio == ontem)
  let dadosontemmontados = producao.filter(item => item.data_montagem == ontem)

  var TTCO = dadosontemcorte.reduce((somatoria, quantidade) => { return somatoria + parseInt(quantidade.quantidadep)}, 0);
  var TTCOO = dadosontemcostura.reduce((somatoria, quantidade) => { return somatoria + parseInt(quantidade.quantidadep)}, 0);
  var TTEO = dadosontemenvio.reduce((somatoria, quantidade) => { return somatoria + parseInt(quantidade.quantidadep)}, 0);
  var TTMO = dadosontemmontados.reduce((somatoria, quantidade) => { return somatoria + parseInt(quantidade.quantidadep)}, 0);

  const data1 = [ TTCH, TTCOH, TTEH, TTMH ]
  const data2 = [ TTCO, TTCOO,TTEO, TTMO ]

  var totalFinalEstoque = totalEstoque.reduce((somatoria, quantidade) => { return somatoria + parseInt(quantidade.quantidadep)}, 0);
  var totalFinalMateriais = totalMateriais.reduce((somatoria, quantidade) => { return somatoria + parseInt(quantidade.quantidade)}, 0);


  const datas = [
    {
        data: data1,
        svg: { stroke: '#FF7751' },
    },
    {
        data: data2,
        svg: { stroke: 'blue' },
    },
]


 useEffect(() => {
  const myFunction2 = async () => {
    const subscriber = firestore()
    .collection('materiais')
    .where('quantidade', '<=' , parseInt(totalavisoestoque.toString()) )
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
    });

  // Unsubscribe from events when no longer in use
    return () => subscriber();
  }
  myFunction2();
 }, [verificacao])

 

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const myFunction2 = async () => {
    const subscriber = firestore()
    .collection('producao')
    .get()
    .then(querySnapshot => {
      const producao = [];

      querySnapshot.forEach(documentSnapshot => {
        producao.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });

      setProducao(producao);
    });

   // Unsubscribe from events when no longer in use
   return () => subscriber();
    }

  useEffect(() => {
    myFunction2()
  }, [])

  useEffect(() => {
    const VeriEstoque = async () => {
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

        setTotalEstoque(estoque);
      });
      return () => subscriber();
    }
    VeriEstoque();
  }, []);

  useEffect(() => {
    const VeriMateriais= async () => {
    const subscriber = firestore()
    .collection('materiais')
    .get()
    .then(querySnapshot => {
      const estoque = [];

      querySnapshot.forEach(documentSnapshot => {
        estoque.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });

      setTotalMateriais(estoque);
    });
    return () => subscriber();
  }
   VeriMateriais();

  }, []);
  useEffect(() => {
    const VeriMoldes = async () => {
    const subscriber = firestore()
    .collection('moldes')
    .get()
    .then(querySnapshot => {
      const estoque = [];

      querySnapshot.forEach(documentSnapshot => {
        estoque.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });

      setTotalMoldes(estoque);
    });
    return () => subscriber();
  }
    VeriMoldes();
  }, []);

  function Logar(){
    setVlorIndicator(true)
    auth()
    .signInWithEmailAndPassword(user.trim(), senha)
    .then(() => {
      setVlorIndicator(false)
      setModalVisible(!modalVisible)
    })
    .catch(console.log('Algo deu errado'))
  }

  function Logout(){
    auth()
    .signOut()
    .then(() => Alert.alert("Usuario", 'Usuarios deslogado'));
  }
  
  
useEffect(() => {
  const comissao = async () => {
    const subscriber = firestore()
    .collection('aviso_materiais')
    .onSnapshot(querySnapshot => {
        const verifica = [];
  
        querySnapshot.forEach(documentSnapshot => {
          verifica.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
  
        setVerificacao(verifica);
      });
  
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }

  comissao();

}, [])

  if (initializing) return null;

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@storage_Key', user.uid)
    } catch (e) {
      console.log('Erro ao gravar dados no AsyncSotarage')
    }
  }
  storeData()

  if(!user){
    return(
     <Login />
    )
  }else{
    if(user.uid != 'v7RPkSgKE7PwUo6fnyDbR3JSFU23'){
      return(
        <View style={styles.container}>
        <StatusBar 
          barStyle='default'
          backgroundColor="#027381"
        />
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}>
          <View style={{ backgroundColor: "#027381", flex: 1,flexDirection: 'column', justifyContent: 'center', alignItems: 'center' , width: '100%' }}>
            <View style={{width: '90%'}}>
                <TextInput
                  style={{ backgroundColor: "white", height: 50, padding: 5, borderRadius: 3 }}
                  placeholder="email"
                  onChangeText={setUser}
                  value= {user}
                  keyboardType="default"
                />
              </View>
              <View style={{width: '90%',marginTop: 20}}>
                <TextInput
                  style={{ backgroundColor: "white", height: 50, padding: 5, borderRadius: 3 }}
                  placeholder="senha"
                  onChangeText={setSenha}
                  value={senha}
                  keyboardType="numeric"
                />
              </View>
  
  
            <TouchableOpacity style={{marginTop: 10,width: "90%",}} onPress={() =>  Logar(user, senha)}>
              <View style={{backgroundColor: "#FF7751",  height: 40, flexDirection: 'row',borderRadius: 3, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator style={{marginRight: 10}} animating={valorindicator} size="small" color="#fff" />
              <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Logar</Text>
              </View>
            </TouchableOpacity>
  
            <TouchableOpacity style={{marginTop: 10,width: "90%",}} onPress={() => setModalVisible(!modalVisible)}>
              <View style={{backgroundColor: "#558898", height: 40, flexDirection: 'row',borderRadius: 3, justifyContent: 'space-around', alignItems: 'center'}}>
               <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Cancelar</Text>
              </View>
            </TouchableOpacity>
                
          </View>
        </Modal>
  
        <View style={{ width: '90%', height: '10%', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
          <TouchableOpacity onPress={() => Logout()}>
             <IconC name="logout" size={30} color="#FF7751" />
          </TouchableOpacity>
        </View>
  
        <View style={{flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', flex: 1}}>
          <View style={{flexDirection: 'column', justifyContent: 'space-around'}}>
            <Pressable style={{flexDirection:'column', justifyContent:'space-around'}}>
                <Icon name="assignment" color='#FF7751' size={70} onPress={() => navigation.navigate('Produção')}/>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Produção</Text>
                </View>
              </Pressable>
  
              
          </View>
  
          <View style={{flexDirection: 'column', justifyContent: 'space-around'}}>
            <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                <IconC name="floor-plan" color='#FF7751' size={70} onPress={() => navigation.navigate('Moldes')}/>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Moldes</Text>
                </View>
              </View>
          </View>
        </View>
  
       
        
  
      </View>
      )
    }else{
    return(
      <View style={styles.container}>
      <StatusBar 
        barStyle='default'
        backgroundColor="#027381"
      />

      <View style={{ width: '100%', flexDirection: 'row', justifyContent:'flex-end', padding: 10}}>
    
      <TouchableOpacity onPress={() => Logout()}>
           <IconC name="logout" size={30} color="#FF7751" />
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%', height: '35%'}}>
        <View style={{flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Produção')} style={{flexDirection:'column', justifyContent:'center'}}>
             <Icon name="assignment" color='#FF7751' size={50} />
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{color: 'white', fontWeight: '400', fontSize: 12}}>Produção</Text>
              </View>
          </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Estoque')} style={{flexDirection: 'column', justifyContent: 'center',  alignItems: 'center'}}>
              <IconC name="package" color='#FF7751' size={50} />
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{color: 'white', fontWeight: '400', fontSize: 12}}>Etoque ({totalFinalEstoque})</Text>
              </View>
            </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'column', justifyContent: 'space-around'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Moldes')} style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <IconC name="floor-plan" color='#FF7751' size={50} />
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{color: 'white', fontWeight: '400', fontSize: 12}}>Moldes ({totalMoldes.length})</Text>
              </View>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => navigation.navigate('Materiais')} style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="style" color='#FF7751' size={50} />
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{color: 'white', fontWeight: '400', fontSize: 12}}>Materiais ({totalFinalMateriais})</Text>
              </View>
            </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'column', justifyContent: 'space-around'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Gastos')} style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="money-off" color='#FF7751' size={50} />
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{color: 'white', fontWeight: '400', fontSize: 12}}>Comissão</Text>
              </View>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => navigation.navigate('FolhaSalarial')} style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="attach-money" color='#FF7751' size={50} />
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{color: 'white', fontWeight: '400', fontSize: 12}}>Salários</Text>
              </View>
            </TouchableOpacity>
        </View>
      </View>

      <View style={{borderTopLeftRadius: 20, borderTopRightRadius: 20 , padding: 10, width: '100%', height: '20%', backgroundColor: 'white', elevation: 30}}>
     
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Text style={{color: '#929292', fontWeight: 'bold'}}>Materiais com menor quantidade em estoque: {totalavisoestoque.toString()}</Text>
      </View>
      

      <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{marginTop: 10}}
      data={estoque}
      renderItem={({ item }) => (
          <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 80, marginLeft: 8, backgroundColor: '#FF7751', borderRadius: 10, elevation: 5}}>
            <Text style={{fontSize:30, color: '#fff', fontWeight: 'bold'}}>{item.quantidade}</Text>
            <Text style={{fontSize: 12, color: '#fff', fontWeight: 'bold'}}>{item.nome.substr(0, 10)}</Text>
            <Text style={{fontSize: 12, color: '#fff'}}>{item.modelo.substr(0, 10)}</Text>
          </View>

      )}
      />

        
      </View>
      
      <View style={{backgroundColor: "white", padding: 20, width: '100%', height: '40%', flexDirection: 'column', justifyContent: 'flex-start'}}>
      
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Text style={{color: '#929292', fontWeight: 'bold'}}>Gráfico de produção</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%',}}>

        <View style={{width: '100%', marginTop: 10}}>
        
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
            <Text style={{fontSize: 10,fontWeight: 'bold'}}>Corte</Text>
            <Text style={{fontSize: 10,fontWeight: 'bold'}}>Costura</Text>
            <Text style={{fontSize: 10,fontWeight: 'bold'}}>Envio</Text>
            <Text style={{fontSize: 10,fontWeight: 'bold'}}>Montados</Text>
          </View>
        <View style={{ width: '100%' }}>
        
        <LineChart
              style={{ height: 150 }}
              data={ datas }
              contentInset={{ top: 20, bottom: 20 }}
            >
                <Grid />
            </LineChart>
            
        <View
            style={{
              borderBottomColor: '#dcdcdc',
              borderBottomWidth: 1,
              marginTop: 5,
            }}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 5}}>
            <Text style={{fontSize: 10}}>CTH - <Text style={{color:'#FF7751'}}>{TTCH}</Text></Text>
            <Text style={{fontSize: 10}}>CTO - <Text style={{color:'#FF7751'}}>{TTCO}</Text></Text>
            <Text style={{fontSize: 10}}>CRH - <Text style={{color:'#FF7751'}}>{TTCOH}</Text></Text>
            <Text style={{fontSize: 10}}>CRO - <Text style={{color:'#FF7751'}}>{TTCOO}</Text></Text>
            <Text style={{fontSize: 10}}>EVH - <Text style={{color:'#FF7751'}}>{TTEH}</Text></Text>
            <Text style={{fontSize: 10}}>EVO - <Text style={{color:'#FF7751'}}>{TTEO}</Text></Text>
            <Text style={{fontSize: 10}}>MOH - <Text style={{color:'#FF7751'}}>{TTMH}</Text></Text>
            <Text style={{fontSize: 10}}>MOO - <Text style={{color:'#FF7751'}}>{TTMO}</Text></Text>
          </View>
          <View
            style={{
              borderBottomColor: '#dcdcdc',
              borderBottomWidth: 1,
              marginTop: 5,
            }}
          />
          
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <Text style={{fontSize: 10, color: '#FF7751',fontWeight: 'bold'}}>Hoje</Text>
            <Text style={{fontSize: 10, color: 'blue', fontWeight: 'bold'}}>Ontem</Text>
        </View>

        </View>
        
        </View>

        
       
        
      </View>
      
      </View>

    </View>
    )
    }
  }

  

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#027381',
    
  },
});
