import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { TextInput } from '@achievements-tracker/components';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Achievement } from '@achievements-tracker/shared';
import {
  useGetAchievementGroupQuery,
  useUpdateAchievementGroupMutation,
} from '../store/api';
import { Swipeable } from '../components/Swipeable';
import { AchievementForm } from '../components/AchievementForm';
import { Screen } from '../components/Screen';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditAchievementGroup'>;

export function EditAchievementGroupScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { data: group, isLoading: isFetching } = useGetAchievementGroupQuery(id);
  const [updateGroup, { isLoading: isUpdating }] = useUpdateAchievementGroupMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<Achievement[]>([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (group) {
      setName(group.name);
      setDescription(group.description);
      setItems(group.achievements);
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
    setItems((prev) => [...prev, item]);
    setShowItemForm(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  if (isFetching) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (nameError) setNameError('');
          }}
          placeholder="Group name"
          error={nameError}
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
        />

        <View style={styles.itemsHeader}>
          <Text style={styles.sectionTitle}>Achievements ({items.length})</Text>
          {!showItemForm && (
            <TouchableOpacity onPress={() => setShowItemForm(true)}>
              <Text style={styles.addLink}>+ Add</Text>
            </TouchableOpacity>
          )}
        </View>

        {items.map((item, index) => (
          <Swipeable
            key={index}
            view="tile"
            role="delete"
            onDelete={() => handleRemoveItem(index)}
          >
            <Text style={styles.itemName}>{item.name}</Text>
            {item.description ? (
              <Text style={styles.itemDescription}>{item.description}</Text>
            ) : null}
            <View style={styles.itemTags}>
              <Text style={styles.tag}>{item.size}</Text>
              <Text style={styles.tag}>{item.type}</Text>
            </View>
          </Swipeable>
        ))}

        {showItemForm && <AchievementForm onSubmit={handleAddItem} />}

        <TouchableOpacity
          style={[styles.button, isUpdating && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={isUpdating}
        >
          <Text style={styles.buttonText}>
            {isUpdating ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#333',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  addLink: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  itemTags: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 12,
    color: '#555',
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#007AFF',
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
