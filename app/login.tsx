import { TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import React, { useContext, useState } from 'react';
import { AuthContext } from "./_layout";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { API_firebase_login } from "@/API";
import { ThemedText } from "@/components/ThemedText";

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Login({navigation}){
    const colorScheme = useColorScheme() ?? 'light';
    const color = Colors[colorScheme ?? 'light'];

    const {signIn}= useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [wait, setWait] = useState(false);

    const handleLogin = async ()=>{
        setWait(true);
        const result = await API_firebase_login(email, password);
        setWait(false);
        if(result.success){
            signIn(); 
        } 
        else{
            Alert.alert("로그인 실패");
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <KeyboardAwareScrollView style={{backgroundColor:color.background}}>
        <ThemedView style = {styles.container}>
            <ThemedText type='title' style = {styles.title}> Login </ThemedText>
            <ThemedView style = {styles.wrapper}>
                <ThemedView style = {styles.input_wrapper}>
                    <ThemedTextInput
                    style = {styles.input}
                    handleInputChange={(text) => setEmail(text)}
                    text={email}
                    placeholder="Email"
                    ></ThemedTextInput>
                    <ThemedTextInput
                    style = {styles.input}
                    handleInputChange={(text) => setPassword(text)}
                    text={password}
                    placeholder="Password"
                    ></ThemedTextInput>
                </ThemedView>
                    {wait? (
                        <ActivityIndicator style={styles.indicator}/>
                    ):(
                        <TouchableOpacity onPress={handleLogin} style={[styles.button, {backgroundColor: color.tint }]}> 
                            <ThemedText type='defaultSemiBold' style={{color: color.background}}> 로그인 </ThemedText>
                        </TouchableOpacity>
                    )}
                <ThemedView style = {styles.register_wrapper}>
                    <ThemedText>아직 회원이 아니신가요?</ThemedText>
                    <TouchableOpacity style={styles.register} onPress={handleRegister}>
                        <ThemedText style={{ textDecorationLine: 'underline'}}> 회원가입 </ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </ThemedView>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
    },
    title :{
        marginTop : '25%',
    },
    wrapper :{
        alignItems: 'center',
        width : '100%',
        marginTop : '40%',
       // backgroundColor : '#FF0000',
    },
    input_wrapper :{
        width : '85%',
        //backgroundColor : '#FF0000',
    },
    input:{
    },
    indicator:{
        paddingVertical : 7,
    },
    button:{
        alignItems: 'center',
        paddingVertical : 5,
        paddingHorizontal : '5%',
        width : '80%',
        borderRadius : 0
    },
    register_wrapper:{
        flexDirection:'row',
        alignItems: 'center',
        marginTop: '5%'
    },
    register:{
        marginLeft : 10
    }
});