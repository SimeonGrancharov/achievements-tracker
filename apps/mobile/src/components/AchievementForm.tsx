import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from '@achievements-tracker/components';
import type { Achievement } from '@achievements-tracker/shared';
import { SIZES, TYPES } from '../constants/achievement';

interface AchievementFormProps {
  onSubmit: (achievement: Achievement) => void;
}

export function AchievementForm({ onSubmit }: AchievementFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState<Achievement['size']>('M');
  const [type, setType] = useState<Achievement['type']>('Feature');
  const [nameError, setNameError] = useState('');

  const handleAdd = () => {
    if (!name.trim()) {
      setNameError('Item name is required');
      return;
    }
    onSubmit({ name: name.trim(), description: description.trim(), size, type });
    setName('');
    setDescription('');
    setSize('M');
    setType('Feature');
    setNameError('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (nameError) setNameError('');
        }}
        placeholder="Achievement name"
        error={nameError}
      />
      <TextInput
        style={{ marginTop: 8 }}
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

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Add Achievement</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 16,
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
  addButton: {
    marginTop: 12,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
