import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, processColor} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { BarChart } from "react-native-chart-kit";
import { auth } from '@/firebaseConfig';
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

  //Stat, Chart 
  const [time, setTime] = useState({
    hour: 0,
    min: 0,
    sec: 0
  });

  const [averageTime, setAverageTime] = useState({
    hour: 0,
    min: 0,
    sec: 0
  });

  const [chartParentWidth, setChartParentWidth] = useState(0);

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
    const totalSeconds = received.data[6];
    setTime({
      hour: Math.floor(totalSeconds / 3600),
      min: Math.floor((totalSeconds % 3600) / 60),
      sec: totalSeconds % 60
    });

    let sum = 0;
    for(let i=0; i<7; ++i){
      sum += received.data[i]
    }
    sum = Math.floor(sum/7);
    setAverageTime({
      hour: Math.floor(sum / 3600),
      min: Math.floor((sum % 3600) / 60),
      sec: sum % 60
    });


    setData(received);
    setChartdata(formattedData);
    console.log("RECEIVED ", received);
  };

  useEffect(()=>{
    getStatData(today.getFullYear(), today.getMonth()+1, today.getDate());
  }, []);

  const chartConfig ={
    backgroundGradientFrom: color.background,
    backgroundGradientTo: color.background,
    decimalPlaces: 0, // 소수점 자리수
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // 색상 설정
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      padding : 10,
      borderRadius: 10,
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
        <ThemedText type ='defaultSemiBold'> {auth.currentUser?.displayName}님 </ThemedText>
        <ThemedText type ='defaultSemiBold'> {month}월 {day}일 집계 </ThemedText>
       
        <ThemedView style={styles.horizontal}>
          <ThemedView style={styles.board}>
            <ThemedView style ={styles.content}>
              {(load || !data)?
              (
                <ActivityIndicator/>          
              ):
              (
                <ThemedView style={styles.vertical}>
                  <ThemedText type='defaultSemiBold' style={{color:color.text}}> 하루 총 </ThemedText>
                  <ThemedText type='defaultSemiBold' style={{color:color.tint}}> {time.hour}시간 {time.min}분 {time.sec}초</ThemedText>
                  <ThemedText> </ThemedText>
                  <ThemedText type='defaultSemiBold' style={{color:color.text}}> 최근 7일 평균 </ThemedText>
                  <ThemedText type='defaultSemiBold' style={{color:color.tint}}> {averageTime.hour}시간 {averageTime.min}분 {averageTime.sec}초</ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.board}>
            <ThemedView style ={styles.content}>
              <ThemedView style={styles.vertical}>
                <ThemedText type='defaultSemiBold' style={{color:color.text}}> 일일 랭킹 </ThemedText>
                <ThemedText  type='defaultSemiBold' style={{color:color.tint}}> 100명 중 2등 </ThemedText>
                <ThemedText> </ThemedText>
                <ThemedText type='defaultSemiBold' style={{color:color.text}}> 주간 랭킹 </ThemedText>
                <ThemedText  type='defaultSemiBold' style={{color:color.tint}}> 1000명 중 54등 </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView 
      onLayout={({ nativeEvent }) => setChartParentWidth(nativeEvent.layout.width)}
      style =  {[styles.graph_wrapper, {borderWidth : 0.5, borderColor : color.grey}]}>
        {(load || !chartdata)?
            (
              <ActivityIndicator/>          
            ):
            (
              <ThemedView style = {styles.vertical}>
                <ThemedText type='defaultSemiBold'>최근 7일 공부 시간</ThemedText>
                <BarChart
                  data={chartdata}
                  width={chartParentWidth * 0.9} // from react-native
                  height={220}
                  withHorizontalLabels={true}
                  yAxisLabel={''}
                  yAxisSuffix={'초'}
                  verticalLabelRotation={0}
                  chartConfig={chartConfig}
                  />
              </ThemedView>
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
    margin : 10,
    borderRadius : 10,
  },
  aggregate_wrapper:{
    width: '90%',
    padding : 10,
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
    width:'100%',
    alignItems:'center',
    flexDirection:'row',
  },
  vertical:{
    padding : 10,
    alignItems:'center',
    flexDirection:'column',
  },
  board:{
    flex:1,
    padding:10,
    alignItems:'center',
  },
  content:{
    flex:1,
  },
  chart:{

  }
});
