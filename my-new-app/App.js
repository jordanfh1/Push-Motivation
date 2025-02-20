import * as Notifications from 'expo-notifications';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider, Text, Button, Card, Title } from 'react-native-paper';
import { Audio } from 'expo-av';
import 'react-native-reanimated';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';





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
"Visualise your best self and start showing up as that person.",
"Every day is a new opportunity to grow and improve.",
"Visualise the sea, the expanse of the ocean, the sound of the waves, the smell of the salt in the air.",
"Visualise a beautiful garden, the flowers, the trees, the birds, the bees.",
"Visualise a peaceful forest, the trees, the animals, the sounds of nature.",
"Visualise a tall mountain, the rocks, the trees, the animals, the sound of the wind.",
"See the beauty in everything.",
"Sunrise, then sunset.",
"Today is a step closer to achieving you goals, make it count.",
"Make today count.",
"This is your first time on Earth, find the little delights in building a positive day",
];

const getTodaysTopic = async () => {
  const today = new Date().toDateString();
  const storedDate = await AsyncStorage.getItem('lastTopicDate');
  

  if (storedDate === today) {
    return AsyncStorage.getItem('dailyTopic');
  }

  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  await AsyncStorage.setItem('dailyTopic', randomTopic);
  await AsyncStorage.setItem('lastTopicDate', today);
  
  return randomTopic;
};

const scheduleDailyReminder = async () => {
  const trigger = new Date();
  trigger.setHours(9, 0, 0);
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Meditation Time",
      body: "Take a moment to meditate. Today's topic: " + (await getTodaysTopic()),
    },
    trigger,
  });
};




export default function App() {
  const [dailyTopic, setDailyTopic] = useState("");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sound, setSound] = useState();

  const animation = useSharedValue(0);

useEffect(() => {
  if (isRunning) {
    animation.value = withTiming(1, { duration: 500 });
  } else {
    animation.value = withTiming(0, { duration: 500 });
  }
}, [isRunning]);

const animatedStyles = useAnimatedStyle(() => {
  return {
    opacity: animation.value,
    transform: [
      { scale: animation.value }
    ],
  };
});


  useEffect(() => {
    getTodaysTopic().then(setDailyTopic);
    scheduleDailyReminder();
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

  // Function to play sound
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/relaxing-music.wav')
    );
    setSound(sound);

    await sound.setIsLoopingAsync(true);
    await sound.playAsync();
  }

  // Function to stop sound
  async function stopSound() {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); 
        }
      : undefined;
  }, [sound]);


  return (
    <PaperProvider>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Today's Meditation Topic</Title>
            <Text style={styles.topic}>{dailyTopic}</Text>
          </Card.Content>
        </Card>
        
        <Animated.Text style={[styles.timer, animatedStyles]}>Timer: {timer}s</Animated.Text>
        
        

        <Button 
  mode="contained" 
  onPress={() => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      playSound();   // Play audio when timer starts
    } else {
      stopSound();   // Stop audio when timer stops
    }
  }}
  style={styles.button}
>
  {isRunning ? "Stop" : "Start"}
</Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    padding: 20,
  },
  card: {
    width: '90%',
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796B',
    textAlign: 'center',
    marginBottom: 10,
  },
  topic: {
    fontSize: 18,
    color: '#004D40',
    textAlign: 'center',
  },
  timer: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004D40',
    marginVertical: 20,
  },
  button: {
    width: '50%',
    borderRadius: 20,
    backgroundColor: '#00796B',
  }
});