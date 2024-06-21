import { Text , Button, View, TouchableOpacity } from "react-native";
import React, { useContext } from 'react';
import { AuthContext } from "./_layout";


export default function Login(){
    const {signIn}= useContext(AuthContext);
    const handle = ()=>{
        signIn();
    }
    return (
        <View>
            <Button title="login" onPress={handle}></Button>

            <Text>아직 회원이 아니신가요?</Text>
            <TouchableOpacity>회원가입</TouchableOpacity>
        </View>
    );
}