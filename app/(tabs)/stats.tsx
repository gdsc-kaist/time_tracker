import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { PieChart } from "react-native-chart-kit";

// APIap
import { API_get_stats } from '@/API';

// Color 
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function StatScreen() {

  const colorScheme = useColorScheme() ?? 'light';
  const color = Colors[colorScheme ?? 'light'];
  
  // Calendar
  const today = new Date();
  const [selected, setSelected] = useState(null);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()+1);
  const [day, setDay] = useState(today.getDate());

  // Data
  const [data, setData] = useState(null);

  // Chart

  const DateChanged = (day)=>{
    /* day = {year: 2024, month: 1, day: 10, timestamp: 1704844800000, dateString: '2024-01-10'} */
    setSelected(day.dateString);
    setYear(day.year);
    setMonth(day.month);
    setDay(day.day);
    getStatData(day.year, day.month, day.day);
  };

  const getStatData = async (year, month, day)=>{
    // Get Statistic Data from DB --> Call API function..
    //console.log("GET DATA", selected, year, month, day);
    const received = await API_get_stats(year, month, day);
    setData(received);
  };

  useEffect(()=>{
    getStatData(today.getFullYear(), today.getMonth()+1, today.getDate());
  }, []);

  return (
    <ThemedView style = {[styles.container, {backgroundColor : color.background}]}>
    <ScrollView contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}>
      <ThemedView style = {[styles.calender_wrapper, {borderWidth : 0.5, borderColor : color.grey}]}>
        <Calendar
          style = {styles.calendar}
          onDayPress={day => {
           DateChanged(day);
          }}
          markedDates={{
            [selected]: {selected: true, disableTouchEvent: true}
          }}
        />
      </ThemedView>

      <ThemedView style =  {[styles.aggregate_wrapper, {borderWidth : 0.5, borderColor : color.grey }]}>
        <ThemedText> {month}월 {day}일에는 ... </ThemedText>
        <ThemedView style={styles.horizontal}>
          <ThemedView style={styles.board}>
          </ThemedView>
          <ThemedView style={styles.board}>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style =  {[styles.graph_wrapper, {borderWidth : 0.5, borderColor : color.grey}]}>
      <ThemedText>Example </ThemedText>
      </ThemedView>

    </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  scrollContainer:{
    alignItems: 'center',  // 수평 중앙 정렬
    //backgroundColor : '#FFFF00', // Debugging
  },
  calender_wrapper:{
    width: '90%',
    alignItems: 'center',
    //backgroundColor: '#00FFFF',
    borderRadius : 10,
    marginTop: '5%',
    marginBottom : '2%',
    paddingBottom : '3%',
  },
  calendar:{
    width : 300,
    height : '100%',
    margin : 10,
    borderRadius : 10,
  },
  aggregate_wrapper:{
    width: '90%',
    alignItems: 'center',
    //backgroundColor: '#0000FF',
    borderRadius : 10,
    marginVertical: '2%',
  },
  graph_wrapper:{
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius : 10,
    marginTop: '2%',
    marginBottom : '5%',
  },
  horizontal:{

  },
  board:{
  }
});
