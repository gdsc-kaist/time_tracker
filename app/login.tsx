import { Text , Button, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext } from 'react';
import { AuthContext } from "./_layout";
import { ThemedView } from "@/components/ThemedView";

export default function Login({navigation}){
    const {signIn}= useContext(AuthContext);
    const handleLogin = ()=> {
        signIn(); 
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <ThemedView style = {styles.container}>
            <Button title="login" onPress={handleLogin}></Button>

            <Text>아직 회원이 아니신가요?</Text>
            <TouchableOpacity style={styles.register} onPress={handleRegister}>
                회원가입
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    register:{

    }
});