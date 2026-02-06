import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AchievementGroup } from "@achievements-tracker/shared";
import {
  useGetAchievementGroupsQuery,
  useDeleteAchievementGroupMutation,
} from "../store/api";
import { Swipeable } from "../components/Swipeable";
import { Screen } from "../components/Screen";
import { useTheme } from "../theme/useTheme";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { data: groups, isLoading, error } = useGetAchievementGroupsQuery();
  const [deleteGroup] = useDeleteAchievementGroupMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { colors } = useTheme();

  const handleDelete = (item: AchievementGroup) => {
    Alert.alert("Delete", `Delete "${item.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setDeletingId(item.id);
          try {
            await deleteGroup(item.id).unwrap();
          } catch {
            Alert.alert("Error", "Failed to delete achievement group");
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Howdy, boi</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate("Settings")}
          >
            <Feather name="settings" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {isLoading && (
          <Text style={[styles.message, { color: colors.textSecondary }]}>Loading achievements...</Text>
        )}
        {error && <Text style={styles.error}>Failed to load achievements</Text>}

        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Swipeable
              view="card"
              role="delete"
              onPress={() =>
                navigation.navigate("ViewAchievementGroup", { id: item.id })
              }
              onDelete={() => handleDelete(item)}
              isDeleting={deletingId === item.id}
            >
              <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>{item.description}</Text>
              <Text style={[styles.cardCount, { color: colors.textSecondary }]}>
                {item.achievements.length} achievement(s)
              </Text>
            </Swipeable>
          )}
          ListEmptyComponent={
            !isLoading ? (
              <Text style={[styles.message, { color: colors.textSecondary }]}>No achievements yet</Text>
            ) : null
          }
        />

        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("CreateAchievementGroup")}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginTop: 12,
  },
  settingsButton: {
    padding: 8,
  },
  list: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  cardCount: {
    fontSize: 12,
  },
  message: {
    textAlign: "center",
    marginTop: 32,
  },
  error: {
    textAlign: "center",
    color: "#ff3b30",
    marginTop: 32,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  fabText: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "300",
  },
});
