import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from '@achievements-tracker/components';
import type { Achievement } from '@achievements-tracker/shared';
import { SIZES, TYPES } from '../constants/achievement';
import { useTheme } from '../theme/useTheme';

interface AchievementFormProps {
  onSubmit: (achievement: Achievement) => void;
}

export function AchievementForm({ onSubmit }: AchievementFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState<Achievement['size']>('M');
  const [type, setType] = useState<Achievement['type']>('Feature');
  const [nameError, setNameError] = useState('');
  const { colors } = useTheme();

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
    <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.primary }]}>
      <TextInput
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (nameError) setNameError('');
        }}
        placeholder="Achievement name"
        error={nameError}
        colors={colors}
      />
      <TextInput
        style={{ marginTop: 8 }}
        value={description}
        onChangeText={setDescription}
        placeholder="Achievement description"
        colors={colors}
      />

      <Text style={[styles.label, { color: colors.text }]}>Size</Text>
      <View style={styles.chips}>
        {SIZES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.chip,
              { backgroundColor: colors.border, borderColor: colors.border },
              size === s && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setSize(s)}
          >
            <Text style={[styles.chipText, { color: colors.text }, size === s && styles.chipTextSelected]}>
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: colors.text }]}>Type</Text>
      <View style={styles.chips}>
        {TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.chip,
              { backgroundColor: colors.border, borderColor: colors.border },
              type === t && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setType(t)}
          >
            <Text style={[styles.chipText, { color: colors.text }, type === t && styles.chipTextSelected]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.border }]} onPress={handleAdd}>
        <Text style={[styles.addButtonText, { color: colors.primary }]}>Add Achievement</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
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
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },
  addButton: {
    marginTop: 12,
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
