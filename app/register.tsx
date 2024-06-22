import { Button, TouchableOpacity,StyleSheet, Alert, ActivityIndicator} from "react-native";
import React, { useState } from 'react';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { API_firebase_register } from "@/API";

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Register({navigation}){
    const colorScheme = useColorScheme() ?? 'light';
    const color = Colors[colorScheme ?? 'light'];
    
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [wait, setWait] = useState(false);

    const handleRegister = async () => {
        setWait(true);
        const result = await API_firebase_register(nickname, email, password);
        setWait(false);
        if(result.success){ // Register Done
            Alert.alert("회원가입 성공");
            navigation.goBack();
        }
        else{ // Register Failed
            Alert.alert("회원가입 실패");
        }
    };

    return (
        <KeyboardAwareScrollView style={{backgroundColor:color.background}}>
        <ThemedView style={styles.container}>
            <ThemedText type='title' style = {styles.title}> Register </ThemedText>
            <ThemedView style = {styles.wrapper}>
            <ThemedView style = {styles.main_wrapper}>
                <ThemedView style = {styles.tag_wrapper}>
                    <ThemedText type='defaultSemiBold' style={styles.tag}>닉네임</ThemedText>
                    <ThemedView style = {styles.input_wrapper}>
                        <ThemedTextInput
                        style = {styles.input}
                        handleInputChange={(text) => setNickname(text)}
                        text={nickname}
                        placeholder="Nickname"
                        ></ThemedTextInput>
                    </ThemedView>
                </ThemedView>
                <ThemedView style = {styles.tag_wrapper}>
                    <ThemedText type='defaultSemiBold' style={styles.tag}>이메일</ThemedText>
                    <ThemedView style = {styles.input_wrapper}>
                        <ThemedTextInput
                        style = {styles.input}
                        handleInputChange={(text) => setEmail(text)}
                        text={email}
                        placeholder="Email"
                        ></ThemedTextInput>
                    </ThemedView>
                </ThemedView>
                <ThemedView style = {styles.tag_wrapper}>
                    <ThemedText type='defaultSemiBold' style={styles.tag}>비밀번호</ThemedText>
                    <ThemedView style = {styles.input_wrapper}>
                        <ThemedTextInput
                        style = {styles.input}
                        handleInputChange={(text) => setPassword(text)}
                        text={password}
                        placeholder="Password"
                        ></ThemedTextInput>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
                {wait?(
                    <ActivityIndicator/>
                ):(
                    <TouchableOpacity onPress={handleRegister} style={[styles.button, {backgroundColor: color.tint }]}> 
                        <ThemedText type='defaultSemiBold' style={{color: color.background}}> 가입 </ThemedText>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.back}  onPress={()=>navigation.goBack()}>
                        <ThemedText style={{ textDecorationLine: 'underline'}}> 뒤로가기 </ThemedText>
                </TouchableOpacity>
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
        marginTop : '35%',
       // backgroundColor : '#FF0000',
    },
    main_wrapper :{
        width : '85%',
        //backgroundColor : '#FF0000',
    },
    tag_wrapper :{
        width : '100%',
        flexDirection : 'column',
    },
    tag:{
        paddingLeft : '5%',
    },
    input_wrapper:{
        width: '100%',
    },
    input:{
    },
    button:{
        alignItems: 'center',
        paddingVertical : 5,
        paddingHorizontal : '5%',
        width : '80%',
        borderRadius : 0
    },
    back:{
        marginTop: '5%'
    },
});