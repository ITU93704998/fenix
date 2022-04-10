import React ,{useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';

function Login({navigation}){
    const [user, setUser] = useState(null);
    const [senha, setSenha] =useState(null);
    const [initializing, setInitializing] = useState(true);

    function Logar(){
        auth()
        .signInWithEmailAndPassword(user.trim(), senha)
        .then(() => {
          Alert.alert("Sucesso", "Logado com sucesso!");
        })
        .catch(console.log('Algo deu errado'))
      }

    return(
        <View style={{flex: 1,}}>
            <View style={{ backgroundColor: "#027381", flex: 1,flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%'  }}>
          <View style={{width: '90%'}}>
              <TextInput
                style={{ backgroundColor: "white", height: 50, padding: 5, borderRadius: 5 }}
                placeholder="email"
                onChangeText={setUser}
                value= {user}
                keyboardType="default"
              />
            </View>
            <View style={{width: '90%',marginTop: 20}}>
              <TextInput
                style={{ backgroundColor: "white", height: 50, padding: 5, borderRadius: 5 }}
                placeholder="senha"
                onChangeText={setSenha}
                value= {senha}
                keyboardType="numeric"
              />
            </View>


          <TouchableOpacity style={{marginTop: 10,width: '90%',}} onPress={() =>  Logar(user, senha)}>
            <View style={{backgroundColor: "#FF7751",  height: 40, flexDirection: 'row',borderRadius: 10, justifyContent: 'space-around', alignItems: 'center'}}>
            <Text style={{fontSize:15, fontWeight: 'bold', color: '#fff'}}>Logar</Text>
            </View>
          </TouchableOpacity>
              
        </View>
        </View>
    )
}

export default Login;