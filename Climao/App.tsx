import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Switch } from "react-native";

import { getDeviceInfo, getToken } from "./clients/tuya";
import { useEffect, useState } from "react";
import CONFIG from "./config";

export default function App() {
  const [token, setToken] = useState<string | undefined>();
  const [info, setInfo] = useState();
  useEffect(() => {
    (async () => {
      const t = await getToken().then((r) => {
        setToken(r.result.access_token);
        return r.result.access_token;
      });

      const info = await getDeviceInfo(CONFIG.tuyaDeviceID, t).then((r) => {
        setInfo(r);
        return r;
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>{token}</Text>
      <Text>{JSON.stringify(info)}</Text>
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
