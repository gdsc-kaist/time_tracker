import { Image, StyleSheet, Platform, Button } from "react-native";
import React, { useContext, useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { API_register, API_firebase_logout } from '@/API';

import { AuthContext } from "../_layout";

export default function Experimental() {
    const initialState = {
        id: '',
        userName: '',
    };
  const [userInputs, setUserInputs] = useState(initialState);

  const {signOut} = useContext(AuthContext);

  const handleInputChange = (text: string, input:string) => {
    setUserInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleSubmit = () => {
    API_register(userInputs.id, userInputs.userName);
    //alert(`You entered: ${userInputs.id} and ${userInputs.userName}`);
  };

  const handleLogout = async () => {
    const result = await API_firebase_logout();
    if(result){
      signOut();
    } 
    else{

    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image

          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Experimental</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">1. User Info to DB Test</ThemedText>
        <ThemedText>
          User below function to submit user info to DB
        </ThemedText>
      </ThemedView>
      <ThemedView>
        <ThemedTextInput
          handleInputChange={text => handleInputChange(text, 'id')}
          text={userInputs.id}
          placeholder="ID"
        ></ThemedTextInput>
        <ThemedTextInput
          handleInputChange={text => handleInputChange(text, 'userName')}
          text={userInputs.userName}
          placeholder="UserName"
        ></ThemedTextInput>
        <Button title="Submit" onPress={handleSubmit}></Button>
      </ThemedView>
      <Button title="로그아웃" onPress={handleLogout}></Button>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
