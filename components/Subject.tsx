import React, { useEffect, useState } from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import ThemedButton from "./ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet } from "react-native";
import { ThemedTextInput } from "./ThemedTextInput";

type SubjectStopWatchProps = {
  stopWatch: {
    id: number;
    subject: string;
    seconds: number;
    running: boolean;
  };
  deleteSubject: (id: number) => void;
  updateSubject: (
    id: number,
    updatedState: Partial<SubjectStopWatchProps["stopWatch"]>
  ) => void;
};

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
};

// Helper function to ensure two digits
const pad = (num: number): string => num.toString().padStart(2, "0");

export const SubjectStopWatch: React.FC<SubjectStopWatchProps> = ({
  stopWatch,
  deleteSubject,
  updateSubject,
}: SubjectStopWatchProps) => {
  useEffect(() => {
    let interval: any | null = null;

    if (stopWatch.running) {
      interval = setInterval(() => {
        updateSubject(stopWatch.id, { seconds: stopWatch.seconds + 1 });
      }, 1000);
    } else if (!stopWatch.running && stopWatch.seconds !== 0) {
      clearInterval(interval!);
    }
    return () => {
      clearInterval(interval);
    };
  }, [stopWatch.running, stopWatch.seconds]);

  return (
    <ThemedView style={styles.stopwatch}>
      <ThemedTextInput
        type = "subjectInput"
        text={stopWatch.subject}
        placeholder="Subject"
        handleInputChange={(input) =>
          updateSubject(stopWatch.id, { subject: input })
        }
      />
      <ThemedView style={{marginLeft:"auto", flexDirection:"row"}}>
        <ThemedText type="subtitle" style={styles.time}>
          {formatTime(stopWatch.seconds)}
        </ThemedText>
        <ThemedButton
          iconName={stopWatch.running ? "pause" : "play"}
          onPress={() =>
            updateSubject(stopWatch.id, { running: !stopWatch.running })
          }
          iconColor={useThemeColor({}, "text")}
        ></ThemedButton>
        <ThemedButton
          iconName="trash"
          onPress={() => deleteSubject(stopWatch.id)}
          iconColor={useThemeColor({}, "text")}
        ></ThemedButton>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  stopwatch: {
    margin: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  
  time: {
    justifyContent:"center", 
    marginRight:10 
  },
});
