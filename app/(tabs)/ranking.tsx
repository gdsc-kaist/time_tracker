import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';

import {API_get_ranking} from '@/API';
import { useRouteInfo } from 'expo-router/build/hooks';

export default function RankingScreen() {
  const [loaded, SetLoaded] = useState(false);
  const [rankMode, setRankMode] = useState(0);
  const [data, setData] = useState([[],[],[], 1,1,1]);

  // Date Calculation
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const lastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));

  const handlePress = (mode) => {
    //console.log("Pressed " + mode.toString()) // Check Entering
    setRankMode(mode);
  };

  const getDateText = () => {
    switch (rankMode) {
      case 0:
        return `${today.getMonth() + 1}월 ${today.getDate()}일`;
      case 1:
        return `${firstDay.getMonth() + 1}월 ${firstDay.getDate()}일 ~ ${lastDay.getMonth() + 1}월 ${lastDay.getDate()}일`;
      case 2:
        return `${today.getFullYear()}년 ${today.getMonth() + 1}월`;
      default:
        return null;
      }
  };

  const getMyRankText = () => {
      const myrank = data[3+rankMode];
      const total_user = (data[rankMode].length <= 1)? 2: data[rankMode].length;
      const percent = ((myrank-1) / (total_user-1) * 100).toFixed(2);
      return (
        <View>
          <Text>전체 {total_user} 명</Text>
          <Text>내 등수 {myrank.toString()}등  상위 {percent.toString()}% </Text>
        </View>
      );
  };

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
    //const response = API_get_ranking();
    setData(response);
    SetLoaded(true);
  }

  const rankingList = data[rankMode].map((item, index) => (
    <View key= {index} style={styles.rankBlock}> 
       <Text style={styles.rankNum}> {index + 1}</Text>
       <Text style={styles.rankName}> {item.name}</Text>
       <Text style={styles.rankTime}> {item.time} </Text>
    </View>
  ));
 
  useEffect(() =>{
    getRankingData();
  }, []);

  return (
    <View style = {styles.container}>
      <View style = {styles.horizontal}>
        <TouchableOpacity style={styles.button} onPress={()=>handlePress(0)}>
          <Text style={[styles.buttonText, {color: rankMode === 0? '#000':'#999'}]}> 일간 </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>handlePress(1)}>
          <Text style={[styles.buttonText, {color: rankMode === 1? '#000':'#999'}]}> 주간 </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>handlePress(2)}>
          <Text style={[styles.buttonText, {color: rankMode === 2? '#000':'#999'}]}> 월간 </Text>
        </TouchableOpacity>
      </View>
      <View style = {styles.dateinfo}>
        <View style = {styles.dateinfo_wrapper}>
          <Text>{getDateText()}</Text>
        </View>
      </View>
      <View style = {styles.userinfo}>
        {getMyRankText()}
      </View>
      <View style = {styles.vertical}>
        <ScrollView contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
          {loaded ? rankingList : null}
        </ScrollView>
      </View>
    </View>
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
    borderBottomColor : '#DDD',
    borderBottomWidth : 0.5,
  },
  button:{
    paddingHorizontal : 50,
    paddingVertical : 15,
  },
  buttonText:{
    fontSize: 12,
    fontWeight: 'bold',
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
    width : '90%',
    backgroundColor: "#DDD",
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
    borderWidth : 0.5,
    borderColor : '#DDD',
    // Shadow
    elevation: 10,
    
    //backgroundColor:'#0000FF', // Debugging
  },
  rankNum:{
    paddingLeft : '5%',
    fontWeight: 'bold'
  },
  rankName:{
    paddingLeft : '10%',
  },
  rankTime:{
    paddingLeft : '40%',
    paddingRight : '5%'
  }
});
