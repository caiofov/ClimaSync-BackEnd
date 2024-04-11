import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { plugOnOrOff } from './stores/plug';

export default function App() {
  const onPress = () => plugOnOrOff(true)

  return (
    <View style={styles.container}>
      <Text>Plug on</Text>
      <Button title='botao' onPress={onPress}></Button>
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
