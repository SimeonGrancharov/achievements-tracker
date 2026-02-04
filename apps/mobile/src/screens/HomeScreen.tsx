import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useAppSelector } from '../store/hooks';
import { useGetAchievementsQuery } from '../store/api';
import { signOut } from '../hooks/useAuth';

export function HomeScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: achievements, isLoading, error } = useGetAchievementsQuery();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.email}</Text>
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {isLoading && <Text style={styles.message}>Loading achievements...</Text>}
      {error && <Text style={styles.error}>Failed to load achievements</Text>}

      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardCount}>
              {item.achievements.length} achievement(s)
            </Text>
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.message}>No achievements yet</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#007AFF',
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardCount: {
    fontSize: 12,
    color: '#999',
  },
  message: {
    textAlign: 'center',
    color: '#666',
    marginTop: 32,
  },
  error: {
    textAlign: 'center',
    color: '#ff3b30',
    marginTop: 32,
  },
});
