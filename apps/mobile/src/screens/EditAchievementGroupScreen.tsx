import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Achievement } from '@achievements-tracker/shared';
import {
  useGetAchievementGroupQuery,
  useUpdateAchievementGroupMutation,
} from '../store/api';
import { Swipeable } from '../components/Swipeable';
import type { RootStackParamList } from '../navigation/types';

const SIZES = ['S', 'M', 'L'] as const;
const TYPES = ['Feature', 'DevEx', 'Bug', 'Self-improvement'] as const;

type Props = NativeStackScreenProps<RootStackParamList, 'EditAchievementGroup'>;

function ItemForm({ onAdd }: { onAdd: (item: Achievement) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState<Achievement['size']>('M');
  const [type, setType] = useState<Achievement['type']>('Feature');

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Item name is required');
      return;
    }
    onAdd({ name: name.trim(), description: description.trim(), size, type });
    setName('');
    setDescription('');
    setSize('M');
    setType('Feature');
  };

  return (
    <View style={styles.itemForm}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Achievement name"
      />
      <TextInput
        style={[styles.input, { marginTop: 8 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Achievement description"
      />

      <Text style={styles.label}>Size</Text>
      <View style={styles.chips}>
        {SIZES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, size === s && styles.chipSelected]}
            onPress={() => setSize(s)}
          >
            <Text style={[styles.chipText, size === s && styles.chipTextSelected]}>
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Type</Text>
      <View style={styles.chips}>
        {TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.chip, type === t && styles.chipSelected]}
            onPress={() => setType(t)}
          >
            <Text style={[styles.chipText, type === t && styles.chipTextSelected]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addItemButton} onPress={handleAdd}>
        <Text style={styles.addItemButtonText}>Add Achievement</Text>
      </TouchableOpacity>
    </View>
  );
}

export function EditAchievementGroupScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { data: group, isLoading: isFetching } = useGetAchievementGroupQuery(id);
  const [updateGroup, { isLoading: isUpdating }] = useUpdateAchievementGroupMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<Achievement[]>([]);
  const [showItemForm, setShowItemForm] = useState(false);

  useEffect(() => {
    if (group) {
      setName(group.name);
      setDescription(group.description);
      setItems(group.achievements);
    }
  }, [group]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name is required');
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Group name"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
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

        {showItemForm && <ItemForm onAdd={handleAddItem} />}

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
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
  itemForm: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
  },
  addItemButton: {
    marginTop: 12,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  addItemButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
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
