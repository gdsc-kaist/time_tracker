import { StyleSheet, ScrollView, View, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState, useEffect, useRef } from "react";

import ThemedButton from "@/components/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";

import { SubjectStopWatch } from "@/components/Subject";
import { auth } from "@/firebaseConfig";
import {
  getDatabase,
  ref,
  update,
  Database,
  get,
  onValue,
  set,
} from "firebase/database";

type StopwatchState = {
  id: number;
  subject: string;
  seconds: number;
  running: boolean;
};

export default function HomeScreen() {
  const [seconds, setSeconds] = useState<number>(0);
  const [subject, setSubject] = useState<StopwatchState[]>([]);
  const [nextId, setNextId] = useState<number>(0);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  const db = getDatabase();
  const uid = auth.currentUser?.uid;
  const today = new Date();
  const date = `${today.getFullYear()}/${
    today.getMonth() + 1
  }/${today.getDate()}`;

  useEffect(() => {
    if (isDataLoaded) return;
    getInitialData();
    setIsDataLoaded(true);
  }, []); // Ensures this effect runs only once.

  const getInitialData = async () => {
    const userRef = ref(db, `users/${uid}/data/${date}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(data);
      setSubject(data.subjects);
      setNextId(data.subjects.length);
      setSeconds(data.seconds);
    }
    setIsDataLoaded(true);
  };

  const addSubject = () => {
    const newStopWatch: StopwatchState = {
      id: nextId,
      subject: "",
      seconds: 0,
      running: false,
    };
    setSubject([...subject, newStopWatch]);
    setNextId(nextId + 1);
  };

  const deleteSubject = (id: number) => {
    Alert.alert(
      "Delete Subject",
      "Are you sure you want to delete this subject?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            
            const newSubject = subject.filter(
              (stopWatch) => stopWatch.id !== id
            );
            // shift the id of the remaining stopwatches
            newSubject.forEach((stopWatch, index) => {
              stopWatch.id = index;
            });
            setNextId(nextId - 1);
            

            setSubject(newSubject);
          },
        },
      ]
    );
  };

  const updateSubject = (id: number, updatedState: Partial<StopwatchState>) => {
    setSubject(
      subject.map((stopWatch) =>
        stopWatch.id === id ? { ...stopWatch, ...updatedState } : stopWatch
      )
    );
  };
  function saveUserData(
    seconds: number,
    db: Database,
    subject: StopwatchState[]
  ) {
    console.log("saveUserData");
    const uid = auth.currentUser?.uid;

    update(ref(db, `users/${uid}/data/${date}`), {
      seconds,
      subjects: subject,
    });
  }

  useEffect(() => {
    // add all the time from running stopwatches
    const totalSeconds = subject.reduce((acc, stopWatch) => {
      return acc + stopWatch.seconds;
    }, 0);
    setSeconds(totalSeconds);
  }, [subject]);

  const INTERVAL = 10;
  useEffect(() => {
    if (isDataLoaded && seconds % INTERVAL === 0) {
      saveUserData(seconds, db, subject);
    }
  }, [seconds]);
  useEffect(() => {
    if (isDataLoaded) {
      saveUserData(seconds, db, subject);
    }
  }, [nextId]);

  const reset = (): void => {
    // confirm reset
    Alert.alert("Reset Timer", "Are you sure you want to reset the timer?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          setSeconds(0);
          setSubject([]);
          setNextId(0);
        },
      },
    ]);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  // Helper function to ensure two digits
  const pad = (num: number): string => num.toString().padStart(2, "0");

  const openSettings = () => {
    // navigate to setting.tsx
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        lightColor="#3498db"
        darkColor="#2980b9"
        style={styles.timerContainer}
      >
        <ThemedText style={styles.time}>{formatTime(seconds)}</ThemedText>
        <ThemedView
          lightColor="#3498db"
          darkColor="#2980b9"
          style={styles.buttonContainer}
        ></ThemedView>
        <View style={{ position: "absolute", top: 0, right: 0, margin: 10 }}>
          <ThemedButton
            iconName="refresh-circle-outline"
            iconColor={useThemeColor(
              { light: undefined, dark: undefined },
              "text"
            )}
            iconSize={30}
            onPress={reset}
            style={styles.largeButton}
          />
        </View>
        {/* setting button */}
        <View style={{ position: "absolute", top: 0, left: 0, margin: 10 }}>
          <ThemedButton
            iconName="settings-outline"
            iconColor={useThemeColor(
              { light: undefined, dark: undefined },
              "text"
            )}
            iconSize={25}
            onPress={openSettings}
            style={styles.largeButton}
          />
        </View>
      </ThemedView>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">과목 타이머</ThemedText>
          <ThemedButton
            iconName="add-circle"
            style={{ alignItems: "center", marginLeft: 10 }}
            onPress={addSubject}
            iconSize={30}
            iconColor={useThemeColor({}, "text")}
          />
        </ThemedView>
        {subject.map((stopWatch: StopwatchState) => (
          <SubjectStopWatch
            key={stopWatch.id}
            stopWatch={stopWatch}
            deleteSubject={deleteSubject}
            updateSubject={updateSubject}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    margin: 20,
  },
  stepContainer: {
    gap: 8,
    padding: 8,
    alignItems: "center",
    flex: 1,
  },
  timerContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },
  time: {
    fontSize: 48,
    fontWeight: "bold",
    lineHeight: 48,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },
  largeButton: {
    backgroundColor: "transparent",
  },
});
