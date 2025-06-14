import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { LanguageContext } from '../App';

export default function SolutionScreen({ route, navigation }) {
  const { t } = useContext(LanguageContext);
  const { imageUri, inspection } = route.params;

  // Use ML result if available, else fallback
  const label = inspection?.label || t('solution');
  const solution = inspection?.solution || 'यह एक उदाहरण समाधान है: अपने पौधों को नियमित रूप से जांचें और जैविक कीटनाशक का उपयोग करें।';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{label}</Text>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.solution}>{solution}</Text>
      <Button title={t('back')} onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  solution: {
    fontSize: 18,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
}); 