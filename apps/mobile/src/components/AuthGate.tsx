import { ActivityIndicator, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "../store/hooks";
import { useAuthStateListener } from "../hooks/useAuth";
import { LoginScreen } from "../screens/LoginScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { CreateAchievementGroupScreen } from "../screens/CreateAchievementScreen";
import { ViewAchievementGroupScreen } from "../screens/ViewAchievementGroupScreen";
import { EditAchievementGroupScreen } from "../screens/EditAchievementGroupScreen";
import type { RootStackParamList } from "../navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AuthGate() {
  useAuthStateListener();

  const { user, isLoading, isInitialized } = useAppSelector(
    (state) => state.auth,
  );

  if (!isInitialized || isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateAchievementGroup"
          component={CreateAchievementGroupScreen}
          options={{
            title: "New Achievement Group",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="ViewAchievementGroup"
          component={ViewAchievementGroupScreen}
          options={{ title: "Achievement Group" }}
        />
        <Stack.Screen
          name="EditAchievementGroup"
          component={EditAchievementGroupScreen}
          options={{
            title: "Edit Achievement Group",
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
