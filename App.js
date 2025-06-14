import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from './components/CameraScreen';
import SolutionScreen from './components/SolutionScreen';
import { I18nManager } from 'react-native';

// Hindi translations (can be expanded)
const translations = {
  hi: {
    takePhoto: 'फोटो लें',
    solution: 'समाधान',
    analyzing: 'विश्लेषण कर रहा है...',
    detected: 'पता चला:',
    back: 'वापस जाएं',
  },
};

export const LanguageContext = React.createContext({
  lang: 'hi',
  t: (key) => translations['hi'][key] || key,
});

const Stack = createStackNavigator();

export default function App() {
  const [lang] = useState('hi');
  const t = (key) => translations[lang][key] || key;

  // Optional: Force RTL for Hindi
  I18nManager.forceRTL(false);

  return (
    <LanguageContext.Provider value={{ lang, t }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Camera">
          <Stack.Screen name="Camera" component={CameraScreen} options={{ title: t('takePhoto') }} />
          <Stack.Screen name="Solution" component={SolutionScreen} options={{ title: t('solution') }} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageContext.Provider>
  );
} 