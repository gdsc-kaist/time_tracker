import { Text , Button, View } from "react-native";
import React, { useContext } from 'react';


export default function Register({navigation}){
    return (
        <View>
            <Text> Register Page </Text>
            <Button title="뒤로가기" onPress={()=>navigation.goBack()}></Button>
        </View>
    );
}