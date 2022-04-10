import { useLinkProps } from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';


export default function Indicator(props) {

    return(
        <>
           <ActivityIndicator animating={props.valor} size="small" color={props.color} />
        </>
                    
                     
    )
}