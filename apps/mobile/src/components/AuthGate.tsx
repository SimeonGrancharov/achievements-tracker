import { useMemo } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  NavigationContainer,
  DefaultTheme,
  type Theme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "../store/hooks";
import { useAuthStateListener } from "../hooks/useAuth";
import { useTheme } from "../theme/useTheme";
import { LoginScreen } from "../screens/LoginScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { CreateAchievementGroupScreen } from "../screens/CreateAchievementScreen";
import { ViewAchievementGroupScreen } from "../screens/ViewAchievementGroupScreen";
import { EditAchievementGroupScreen } from "../screens/EditAchievementGroupScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import type { RootStackParamList } from "../navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AuthGate() {
  useAuthStateListener();

  const { user, isLoading, isInitialized } = useAppSelector(
    (state) => state.auth,
  );
  const { colors, isDark } = useTheme();

  const navTheme: Theme = useMemo(
    () => ({
      ...DefaultTheme,
      dark: isDark,
      colors: {
        ...DefaultTheme.colors,
        background: colors.background,
        card: colors.background,
        text: colors.text,
        primary: colors.primary,
        border: colors.border,
      },
    }),
    [colors, isDark],
  );

  if (!isInitialized || isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="CreateAchievementGroup"
          component={CreateAchievementGroupScreen}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="ViewAchievementGroup"
          component={ViewAchievementGroupScreen}
        />
        <Stack.Screen
          name="EditAchievementGroup"
          component={EditAchievementGroupScreen}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
