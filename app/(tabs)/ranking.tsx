import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';

// Color 
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Firebase API
import {API_get_ranking} from '@/API';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function RankingScreen() {
  const [loaded, SetLoaded] = useState(false);
  const [rankMode, setRankMode] = useState(0);
  const [data, setData] = useState([[],[],[], 1,1,1]);

  const colorScheme = useColorScheme() ?? 'light';
  const color = Colors[colorScheme ?? 'light'];

  // Date Calculation 
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const lastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));

  // Daily / Weekly / Monthy Click Handling
  const handlePress = (mode) => {
    //console.log("Pressed " + mode.toString()) // Check Entering
    setRankMode(mode);
  };

  // Get Date Text base on current rankMode
  const getDateText = () => {
    switch (rankMode) {
      case 0: // Daily
        return `${today.getMonth() + 1}월 ${today.getDate()}일`;
      case 1: // Weekly
        return `${firstDay.getMonth() + 1}월 ${firstDay.getDate()}일 ~ ${lastDay.getMonth() + 1}월 ${lastDay.getDate()}일`;
      case 2: // Monthly
        return `${today.getFullYear()}년 ${today.getMonth() + 1}월`;
      default:
        return null;
      }
  };

  // Get current user ranking text 
  const getMyRankText = () => {
      const myrank = data[3+rankMode];
      const total_user = (data[rankMode].length <= 0)? 1: data[rankMode].length;
      const percent = ((myrank) / (total_user) * 100).toFixed(2);
      return (
        <ThemedView>
          <ThemedText>전체 {total_user} 명</ThemedText>
          <ThemedText>내 등수  
            <ThemedText lightColor='#3498db' darkColor='#2980b9' type='defaultSemiBold'> {myrank.toString()}</ThemedText>
          등  상위  
          <ThemedText lightColor='#3498db' darkColor='#2980b9' type='defaultSemiBold'> {percent.toString()}% </ThemedText> 
          </ThemedText>
        </ThemedView>
      );
  };

  // Get Ranking Data from DB
  const getRankingData = () => {
    const dailyData = [
      { name: 'User1', time: '00시간 10분' },
      { name: 'User2', time: '01시간 20분' },
      { name: 'User3', time: '01시간 20분' },
      { name: 'User4', time: '01시간 20분' },
    ];

    const weeklyData = [
      { name: 'User1', time: '00시간 10분' },
      { name: 'User2', time: '05시간 45분' },
    ];

    const monthlyData = [
      { name: 'User1', time: '12시간 30분' },
      { name: 'User2', time: '23시간 50분' },
    ];
    const response = [dailyData, weeklyData, monthlyData, 2, 1, 1]; // Example Data
    //const response = API_get_ranking(); // DB Connection Code
    setData(response);
    SetLoaded(true);
  }
 
  // When the page is rendered, load data from server
  useEffect(() =>{
    getRankingData();
  }, []);

  // Get Ranking List 
  const get_ranking_color = (index, basic_color) =>{
    switch(index){
      case 0:
        return '#FFD700';
      case 1:
        return '#C0C0C0';
      case 2:
        return '#CD7F32';
      default:
        return basic_color
    }
  }
  const rankingList = data[rankMode].map((item, index) => (
    <ThemedView key= {index} style={[styles.rankBlock, {borderColor: get_ranking_color(index, color.grey)}]}> 
       <ThemedText style={styles.rankNum} type='defaultSemiBold' lightColor={get_ranking_color(index, '#3498db')} darkColor={get_ranking_color(index,'#2980b9')}> {index + 1}</ThemedText>
       <ThemedText style={styles.rankName}> {item.name}</ThemedText>
       <ThemedText style={styles.rankTime}> {item.time} </ThemedText>
    </ThemedView>
  ));

  return (
    <ThemedView style = {styles.container}>
      <ThemedView style = {styles.horizontal}>
        <TouchableOpacity style={styles.button} onPress={()=>handlePress(0)}>
          <ThemedText style={[styles.buttonText, {color: rankMode === 0? color.tabIconSelected: color.tabIconDefault}]} type='defaultSemiBold'> 일간 </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>handlePress(1)}>
          <ThemedText style={[styles.buttonText, {color: rankMode === 1? color.tabIconSelected:color.tabIconDefault}]} type='defaultSemiBold'> 주간 </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>handlePress(2)}>
          <ThemedText style={[styles.buttonText, {color: rankMode === 2? color.tabIconSelected:color.tabIconDefault}]} type='defaultSemiBold'> 월간 </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style = {styles.dateinfo}>
        <ThemedView style = {[styles.dateinfo_wrapper, {backgroundColor: color.grey}]}>
          <ThemedText >{getDateText()}</ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView style = {styles.userinfo}>
        {getMyRankText()}
      </ThemedView>
      <ThemedView style = {styles.vertical}>
        <ScrollView contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
          {loaded ? rankingList : null}
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container:{
    flex : 1,
    backgroundColor: '#FFFFFF',
  },
  horizontal:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderBottomColor : '#F2F2F2',
    borderBottomWidth : 0.5,
  },
  button:{
    paddingHorizontal : 50,
    paddingVertical : 15,
  },
  buttonText:{
    //fontSize: 12
  },
  dateinfo:{
    paddingTop : 15,
    paddingBottom : 5,
    alignItems : 'center',
  //  backgroundColor: "#FF0000", // Debugging
  },
  dateinfo_wrapper:{
    borderRadius : 10,
    paddingVertical : 10,
    alignItems : 'center',
    width : '95%',
  },
  userinfo:{
    paddingLeft: '5%',
    paddingBottom: 10,
    marginTop: 10,
  },
  vertical:{
    flex: 1,
    //backgroundColor : '#00FF00' // Debugging
  },
  scrollContainer:{
    alignItems: 'center',  // 수평 중앙 정렬
    justifyContent: 'center',  // 수직 중앙 정렬
    //width: '100%',
    paddingVertical : '2%',
    //backgroundColor : '#FFFF00' // Debugging
  },
  rankBlock:{
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical : 25,
    marginBottom : 10,
    borderRadius : 10,
    borderWidth : 2,
    // Shadow
    elevation: 10,
    
    //backgroundColor:'#0000FF', // Debugging
  },
  rankNum:{
    paddingLeft : '5%',
  },
  rankName:{
    paddingLeft : '10%',
  },
  rankTime:{
    paddingLeft : '40%',
    paddingRight : '5%'
  }
});
