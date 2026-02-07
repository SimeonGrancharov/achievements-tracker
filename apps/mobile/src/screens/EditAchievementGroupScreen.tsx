import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { TextInput } from '@achievements-tracker/components';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Achievement } from '@achievements-tracker/shared';
import {
  useGetAchievementGroupQuery,
  useUpdateAchievementGroupMutation,
} from '../store/api';
import { Swipeable } from '../components/Swipeable';
import { Skeleton } from '../components/Skeleton';
import { AchievementForm } from '../components/AchievementForm';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { useTheme } from '../theme/useTheme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditAchievementGroup'>;

export function EditAchievementGroupScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { data: group, isLoading: isFetching } = useGetAchievementGroupQuery(id);
  const [updateGroup, { isLoading: isUpdating }] = useUpdateAchievementGroupMutation();
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<Achievement[]>([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [nameError, setNameError] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (group) {
      setName(group.name);
      setDescription(group.description);
      setItems(group.achievements);
      setIsReady(true);
    }
  }, [group]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }

    try {
      await updateGroup({
        id,
        data: {
          name: name.trim(),
          description: description.trim(),
          achievements: items,
        },
      }).unwrap();
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to update achievement group');
    }
  };

  const handleAddItem = (item: Achievement) => {
    if (editingIndex !== null) {
      setItems((prev) => prev.map((it, i) => (i === editingIndex ? item : it)));
      setEditingIndex(null);
    } else {
      setItems((prev) => [...prev, item]);
    }
    setShowItemForm(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  if (isFetching || !isReady) {
    return (
      <Screen>
        <Header
          title="Edit Achievement Group"
          onBack={() => navigation.goBack()}
          variant="close"
          modal
        />
        <View style={styles.skeletonForm}>
          <Skeleton width={40} height={14} />
          <Skeleton width="100%" height={44} borderRadius={8} style={{ marginTop: 6 }} />
          <Skeleton width={80} height={14} style={{ marginTop: 16 }} />
          <Skeleton width="100%" height={100} borderRadius={8} style={{ marginTop: 6 }} />
          <Skeleton width={120} height={16} style={{ marginTop: 24 }} />
          {[0, 1].map((i) => (
            <View key={i} style={styles.skeletonTile}>
              <Skeleton width="50%" height={15} />
              <Skeleton width="70%" height={13} style={{ marginTop: 6 }} />
              <View style={styles.skeletonTags}>
                <Skeleton width={32} height={20} borderRadius={4} />
                <Skeleton width={56} height={20} borderRadius={4} />
              </View>
            </View>
          ))}
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        title="Edit Achievement Group"
        onBack={() => navigation.goBack()}
        variant="close"
        modal
      />
        <ScrollView contentContainerStyle={styles.form} automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="handled">
        <TextInput
          label="Name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (nameError) setNameError('');
          }}
          placeholder="Group name"
          error={nameError}
          colors={colors}
        />

        <TextInput
          label="Description"
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          colors={colors}
        />

        <View style={styles.itemsHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements ({items.length})</Text>
          {!showItemForm && (
            <TouchableOpacity onPress={() => setShowItemForm(true)} hitSlop={8}>
              <Text style={[styles.addLink, { color: colors.primary }]}>+ Add</Text>
            </TouchableOpacity>
          )}
        </View>

        {items.map((item, index) => (
          editingIndex === index ? (
            <AchievementForm
              key={index}
              initialData={item}
              onSubmit={handleAddItem}
              onCancel={() => {
                setEditingIndex(null);
                setShowItemForm(false);
              }}
            />
          ) : (
            <Swipeable
              key={index}
              view="tile"
              role="delete"
              onPress={() => {
                setEditingIndex(index);
                setShowItemForm(false);
              }}
              onDelete={() => handleRemoveItem(index)}
            >
              <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
              {item.description ? (
                <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>{item.description}</Text>
              ) : null}
              <View style={styles.itemTags}>
                <Text style={[styles.tag, { backgroundColor: colors.border, color: colors.textSecondary }]}>{item.size}</Text>
                <Text style={[styles.tag, { backgroundColor: colors.border, color: colors.textSecondary }]}>{item.type}</Text>
              </View>
            </Swipeable>
          )
        ))}

        {showItemForm && editingIndex === null && <AchievementForm onSubmit={handleAddItem} />}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }, isUpdating && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={isUpdating}
        >
          <Text style={styles.buttonText}>
            {isUpdating ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
        </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  skeletonForm: {
    padding: 16,
  },
  skeletonTile: {
    paddingVertical: 12,
  },
  skeletonTags: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  form: {
    padding: 16,
    paddingBottom: 40,
  },
  textArea: {
    minHeight: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  addLink: {
    fontSize: 16,
    fontWeight: '500',
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
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
