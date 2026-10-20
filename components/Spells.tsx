import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Spells() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>Spells</Text>
      <StatusBar style="auto" />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});