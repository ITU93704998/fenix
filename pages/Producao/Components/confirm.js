import { useLinkProps } from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import Icon from "react-native-vector-icons/EvilIcons";

export default function Confirm(props) {

    return(
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
           <Icon name="md-checkmark-done-sharp" size={50} color="#4FAC7F" />
        </View>            
    )
}