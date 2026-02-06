import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetAchievementGroupQuery } from '../store/api';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { useTheme } from '../theme/useTheme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ViewAchievementGroup'>;

export function ViewAchievementGroupScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { data: group, isLoading, error } = useGetAchievementGroupQuery(id);
  const { colors } = useTheme();

  const editButton = (
    <TouchableOpacity onPress={() => navigation.navigate('EditAchievementGroup', { id })}>
      <Text style={[styles.editButton, { color: colors.primary }]}>Edit</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <Screen>
        <Header title="Achievement Group" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    );
  }

  if (error || !group) {
    return (
      <Screen>
        <Header title="Achievement Group" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.error}>Failed to load achievement group</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        title="Achievement Group"
        onBack={() => navigation.goBack()}
        right={editButton}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[styles.name, { color: colors.text }]}>{group.name}</Text>
      {group.description ? (
        <Text style={[styles.description, { color: colors.textSecondary }]}>{group.description}</Text>
      ) : null}
      <Text style={[styles.date, { color: colors.textSecondary }]}>
        Created {new Date(group.createdAt).toLocaleDateString()}
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Achievements ({group.achievements.length})
      </Text>

      {group.achievements.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No achievements yet</Text>
      ) : (
        group.achievements.map((item, index) => (
          <View key={index} style={[styles.itemCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
            {item.description ? (
              <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>{item.description}</Text>
            ) : null}
            <View style={styles.itemTags}>
              <Text style={[styles.tag, { backgroundColor: colors.border, color: colors.textSecondary }]}>{item.size}</Text>
              <Text style={[styles.tag, { backgroundColor: colors.border, color: colors.textSecondary }]}>{item.type}</Text>
            </View>
          </View>
        ))
      )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
  },
  date: {
    fontSize: 13,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
  },
  error: {
    color: '#ff3b30',
    fontSize: 16,
  },
  itemCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 13,
    marginTop: 4,
  },
  itemTags: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 12,
    overflow: 'hidden',
  },
});
