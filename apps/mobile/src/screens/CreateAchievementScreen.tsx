import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { TextInput } from '@achievements-tracker/components';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Achievement } from '@achievements-tracker/shared';
import { useCreateAchievementGroupMutation } from '../store/api';
import { Swipeable } from '../components/Swipeable';
import { AchievementForm } from '../components/AchievementForm';
import { Screen } from '../components/Screen';
import type { RootStackParamList } from '../navigation/types';


type Props = NativeStackScreenProps<RootStackParamList, 'CreateAchievementGroup'>;

export function CreateAchievementGroupScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<Achievement[]>([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [nameError, setNameError] = useState('');
  const [createGroup, { isLoading }] = useCreateAchievementGroupMutation();

  const handleCreate = async () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }

    try {
      await createGroup({
        name: name.trim(),
        description: description.trim(),
        achievements: items,
      }).unwrap();
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to create achievement group');
    }
  };

  const handleAddItem = (item: Achievement) => {
    setItems((prev) => [...prev, item]);
    setShowItemForm(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

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
          autoFocus
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

        {showItemForm && (
          <AchievementForm onSubmit={handleAddItem} />
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating...' : 'Create'}
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
