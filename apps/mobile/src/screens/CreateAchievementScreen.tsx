import { useState } from 'react';
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
import { useCreateAchievementGroupMutation } from '../store/api';
import { Swipeable } from '../components/Swipeable';
import { AchievementForm } from '../components/AchievementForm';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { useTheme } from '../theme/useTheme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAchievementGroup'>;

export function CreateAchievementGroupScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<Achievement[]>([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [nameError, setNameError] = useState('');
  const [createGroup, { isLoading }] = useCreateAchievementGroupMutation();
  const { colors } = useTheme();

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
      <Header
        title="New Achievement Group"
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
          autoFocus
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
          <Swipeable
            key={index}
            view="tile"
            role="delete"
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
        ))}

        {showItemForm && (
          <AchievementForm onSubmit={handleAddItem} />
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }, isLoading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating...' : 'Create'}
          </Text>
          </TouchableOpacity>
        </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
