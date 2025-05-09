import { Tabs } from "expo-router";
import { Provider } from "react-redux";
import store from "@redux/store";

export default function TabsLayout() {
  return (
    <Provider store={store}>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: "Accueil" }} />
        <Tabs.Screen name="login" options={{ title: "Connexion" }} />
        <Tabs.Screen name="two" options={{ title: "Page 2" }} />
      </Tabs>
    </Provider>
  );
}
  