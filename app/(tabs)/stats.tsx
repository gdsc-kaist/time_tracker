import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, processColor} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { BarChart } from "react-native-chart-kit";

// APIap
import { API_get_lastweek_stats} from '@/API';

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
  const [chartdata, setChartdata] = useState(null);
  
  // Loading
  const [load, setLoad] = useState(false);

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
    setLoad(true);
    const received = await API_get_lastweek_stats(year, month, day);
    setLoad(false);
    const formattedData = {
      labels: received.labels,
      datasets: [
        {
          data: received.data,
        },
      ],
  };
    
    setData(received);
    setChartdata(formattedData);
    console.log("RECEIVED ", received);
  };

  useEffect(()=>{
    getStatData(today.getFullYear(), today.getMonth()+1, today.getDate());
  }, []);

  const chartConfig ={
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0, // 소수점 자리수
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // 색상 설정
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

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
          {(load || !data)?
          (
            <ActivityIndicator/>          
          ):
          (
            <ThemedText> {data.data[6]}초 만큼 공부했어요!</ThemedText>
          )}
          <ThemedView style={styles.board}>
          </ThemedView>
          <ThemedView style={styles.board}>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style =  {[styles.graph_wrapper, {borderWidth : 0.5, borderColor : color.grey}]}>
        {(load || !chartdata)?
            (
              <ActivityIndicator/>          
            ):
            (
              <BarChart
                data={chartdata}
                width={300} // from react-native
                height={250}
                yAxisLabel={''}
                yAxisSuffix={'초'}
                chartConfig={chartConfig}
                />
            )}
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
  },
  chart:{

  }
});
