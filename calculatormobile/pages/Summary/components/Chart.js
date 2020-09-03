import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  VictoryChart,
  VictoryPolarAxis,
  VictoryBar,
  VictoryTheme,
} from 'victory-native';
import { gql, useQuery } from '@apollo/client';
import dailyRecommendation from './dailyRecommendation';
import calculateIntake from './calculateIntake';

const DAILY = gql`
  {
    foodusersDate(
      user_id: "5f4a4b1a5668613a24e4e744"
      date: "2020-09-03"
      dwm: "daily"
    ) {
      date
      amount
      food_id
      foods {
        calories
        fat
        carbohydrate
        sugar
        protein
        sodium
        cholesterol
        iron
        calcium
        vitamin_a
        vitamin_d
        zinc
      }
    }
  }
`;
const lables = [
  'calories',
  'fat',
  'carbohydrate',
  'sugar',
  'protein',
  'sodium',
  'cholesterol',
  'iron',
  'calcium',
  'vitamin_a',
  'vitamin_d',
];

const defaultDailyData = [
  { x: 'calories', y: 0 },
  { x: 'fat', y: 0 },
  { x: 'carbohydrate', y: 0 },
  { x: 'sugar', y: 0 },
  { x: 'protein', y: 0 },
  { x: 'sodium', y: 0 },
  { x: 'cholesterol', y: 0 },
  { x: 'iron', y: 0 },
  { x: 'calcium', y: 0 },
  { x: 'vitamin_a', y: 0 },
  { x: 'vitamin_d', y: 0 },
];

export default function Chart({ dwm }) {
  const recommendedDaily = dailyRecommendation(26, 'Male');
  const { data, loading, error } = useQuery(DAILY, {
    onCompleted: (data) =>
      setDailyData(calculateIntake(recommendedDaily, data.foodusersDate)),
  });
  const [dailyData, setDailyData] = useState(defaultDailyData);
  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View style={styles.container}>
      {/* if loading..... */}
      <VictoryChart
        polar
        theme={VictoryTheme.material}
        animate={{ duration: 1000, easing: 'bounce' }}>
        {lables.map((d, i) => {
          return (
            <VictoryPolarAxis
              dependentAxis
              key={i}
              label={d}
              labelPlacement="perpendicular"
              style={{ tickLabels: { fill: 'none' } }}
              axisValue={d}
            />
          );
        })}
        <VictoryBar
          style={{
            data: {
              fill: ({ datum }) => {
                return datum.x === 'calories' ? '#000000' : 'tomato';
              },
              stroke: ({ index }) => (+index % 2 === 0 ? '#000' : '#fff'),
              width: 20,
              strokeWidth: 3,
              fillOpacity: 0.7,
            },
          }}
          data={dailyData}
        />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  chart: {
    height: '95%',
    width: '95%',
    backgroundColor: 'yellow',
  },
});
