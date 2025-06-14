import React, { useContext, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LanguageContext } from '../App';

export default function CameraScreen({ navigation }) {
  const { t } = useContext(LanguageContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleImage = async (fromCamera) => {
    let result;
    if (fromCamera) {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is required to take a photo.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
    } else {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Gallery permission is required to select a photo.');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
    }
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setLoading(true);
      setProgress(0);
      progressAnim.setValue(0);
      // Simulate upload/analysis progress
      let prog = 0;
      const interval = setInterval(async () => {
        prog += 0.05;
        setProgress(prog);
        Animated.timing(progressAnim, {
          toValue: prog,
          duration: 100,
          useNativeDriver: false,
        }).start();
        if (prog >= 1) {
          clearInterval(interval);
          // Prepare file for upload
          const localUri = result.assets[0].uri;
          const filename = localUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename ?? '');
          const type = match ? `image/${match[1]}` : `image`;
          const fileUri = localUri;
          const formData = new FormData();
          formData.append('file', {
            uri: fileUri,
            name: filename,
            type,
          });
          console.log('Uploading file:', { uri: fileUri, name: filename, type });
          try {
            const response = await fetch('http://localhost:8000/inspect', {
              method: 'POST',
              body: formData,
            });
            const inspection = await response.json();
            setLoading(false);
            navigation.navigate('Solution', { imageUri: result.assets[0].uri, inspection });
          } catch (error) {
            setLoading(false);
            navigation.navigate('Solution', { imageUri: result.assets[0].uri, inspection: { label: 'त्रुटि', solution: 'सर्वर से कनेक्ट नहीं हो सका।' } });
          }
        }
      }, 100);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 किसान सहायक</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => handleImage(true)} disabled={loading}>
          <Text style={styles.buttonText}>कैमरा से फोटो लें</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#0288d1' }]} onPress={() => handleImage(false)} disabled={loading}>
          <Text style={styles.buttonText}>गैलरी से चुनें</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Uploading...</Text>
          <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressBar, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
          </View>
        </View>
      )}
      {image && !loading && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f7fa',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 16,
  },
  button: {
    backgroundColor: '#43a047',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 8,
    elevation: 2,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    marginBottom: 8,
    color: '#00796b',
    fontSize: 16,
  },
  progressBarBg: {
    width: '100%',
    height: 16,
    backgroundColor: '#b2dfdb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: 16,
    backgroundColor: '#43a047',
    borderRadius: 8,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00796b',
  },
}); 