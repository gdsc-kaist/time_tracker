import { Image, StyleSheet, Platform, Button, ScrollView, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState, useEffect } from "react";
import { SafeThemedView } from "@/components/SafeThemedView";
import Separator from "@/components/Separator";
import ThemedButton from "@/components/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";

import { StyleProps } from "react-native-reanimated";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { SubjectStopWatch } from "@/components/Subject";

type StopwatchState = {
  id: number;
  subject: string;
  seconds: number;
  running: boolean;
};

export default function HomeScreen() {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [subject, setSubject] = useState<StopwatchState[]>([]);
  const [nextId, setNextId] = useState<number>(0);

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
    setSubject(subject.filter((stopWatch) => stopWatch.id !== id));
  };
  const updateSubject = (id: number, updatedState: Partial<StopwatchState>) => {
    setSubject(
      subject.map((stopWatch) =>
        stopWatch.id === id ? { ...stopWatch, ...updatedState } : stopWatch
      )
    );
  };

  useEffect(() => {
    // add all the time from running stopwatches
    const totalSeconds = subject.reduce((acc, stopWatch) => {
      if (stopWatch.running) {
        return acc + stopWatch.seconds + 1;
      }
      return acc + stopWatch.seconds;
    }, 0);
    setSeconds(totalSeconds);
  }, [subject]);



  const reset = (): void => {
    setSeconds(0);
    setSubject([]);
    setNextId(0);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  // Helper function to ensure two digits
  const pad = (num: number): string => num.toString().padStart(2, "0");

  return (
    <SafeThemedView style={styles.container}>
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
        >

        </ThemedView>
        <View style={{ position: "absolute", top: 0, right: 0,margin:10 }}>
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
    </SafeThemedView>
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
    paddingVertical: 50,
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
