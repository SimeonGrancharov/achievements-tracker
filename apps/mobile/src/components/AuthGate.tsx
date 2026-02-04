import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAppSelector } from '../store/hooks';
import { useAuthStateListener } from '../hooks/useAuth';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';

export function AuthGate() {
  useAuthStateListener();

  const { user, isLoading, isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized || isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <HomeScreen /> : <LoginScreen />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
