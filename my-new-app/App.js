import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const topics = [
  "Every single detail of life is delightful",
  "I choose to see the good in every situation",
  "Every day is a new opportunity to grow and improve.",
  "Every day is a new opportunity to grow and improve.",
  "A peaceful place.",
  "Practice self-love.",
  "Let go of negative thoughts.",
  "Each day, I find new reasons to be thankful.",
  "I am enough.",
  "I am loved.",
  "I am worthy of love.",
  "I am worthy of happiness.",
  "Gratitude fills my heart and mind, bringing peace and joy.",
  "I am at peace with myself and the world around me.",
"I trust the process of life and embrace each moment.",


];

const getTodaysTopic = async () => {
  const today = new Date().toDateString();  // Get today's date as a string
  const storedDate = await AsyncStorage.getItem('lastTopicDate');
  
  // If topic was already set for today, return it
  if (storedDate === today) {
    return AsyncStorage.getItem('dailyTopic');
  }

  // Otherwise, pick a new topic
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  await AsyncStorage.setItem('dailyTopic', randomTopic);
  await AsyncStorage.setItem('lastTopicDate', today);
  
  return randomTopic;
};

export default function App() {
  const [dailyTopic, setDailyTopic] = useState("");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    getTodaysTopic().then(setDailyTopic);
  }, []);

  useEffect(() => {
    let interval = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, timer]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Today's Meditation Topic:</Text>
      <Text>{dailyTopic}</Text>
      <Text>Timer: {timer}s</Text>
      <Button title={isRunning ? "Stop" : "Start"} onPress={() => setIsRunning(!isRunning)} />
    </View>
  );
}