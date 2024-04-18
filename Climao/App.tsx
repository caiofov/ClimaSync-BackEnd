import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Switch } from "react-native";

import { getToken } from "./clients/tuya";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    (async () => {
      const token = await getToken();
      console.log("token: ", token);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <Text>Oi</Text>

      <Switch value={false}>Botão</Switch>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
