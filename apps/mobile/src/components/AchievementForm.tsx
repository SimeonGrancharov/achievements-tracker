import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  InputAccessoryView,
} from "react-native";
import { TextInput } from "@achievements-tracker/components";
import type { Achievement } from "@achievements-tracker/shared";
import {
  AchievementItemTypes,
  AchievmentItemSizes,
} from "../constants/achievement";
import { useTheme } from "../theme/useTheme";

interface AchievementFormProps {
  onSubmit: (achievement: Achievement) => void;
  onCancel?: () => void;
  initialData?: Achievement;
}

export function AchievementForm({ onSubmit, onCancel, initialData }: AchievementFormProps) {
  const isEditing = !!initialData;
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [size, setSize] = useState<Achievement["size"]>(initialData?.size ?? "M");
  const [type, setType] = useState<Achievement["type"]>(initialData?.type ?? "Feature");
  const [nameError, setNameError] = useState("");
  const { colors } = useTheme();

  const accessoryID = "achievement-form-keyboard";

  const handleAdd = () => {
    if (!name.trim()) {
      setNameError("Item name is required");
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      size,
      type,
    });
    setName("");
    setDescription("");
    setSize("M");
    setType("Feature");
    setNameError("");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, borderColor: colors.primary },
      ]}
    >
      <TextInput
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (nameError) setNameError("");
        }}
        placeholder="Achievement name"
        error={nameError}
        colors={colors}
        inputAccessoryViewID={accessoryID}
      />
      <TextInput
        style={{ marginTop: 8 }}
        value={description}
        onChangeText={setDescription}
        placeholder="Achievement description"
        colors={colors}
        inputAccessoryViewID={accessoryID}
      />

      <Text style={[styles.label, { color: colors.text }]}>Size</Text>
      <View style={styles.chips}>
        {AchievmentItemSizes.map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.chip,
              { backgroundColor: colors.background, borderColor: colors.border },
              size === s && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setSize(s)}
          >
            <Text
              style={[
                styles.chipText,
                { color: colors.textSecondary },
                size === s && styles.chipTextSelected,
              ]}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: colors.text }]}>Type</Text>
      <View style={styles.chips}>
        {AchievementItemTypes.map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.chip,
              { backgroundColor: colors.background, borderColor: colors.border },
              type === t && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setType(t)}
          >
            <Text
              style={[
                styles.chipText,
                { color: colors.textSecondary },
                type === t && styles.chipTextSelected,
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formButtons}>
        {isEditing && onCancel && (
          <TouchableOpacity
            style={[styles.addButton, styles.cancelButton, { backgroundColor: colors.border }]}
            onPress={onCancel}
          >
            <Text style={[styles.addButtonText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.addButton, isEditing && styles.flexButton, { backgroundColor: colors.border }]}
          onPress={handleAdd}
        >
          <Text style={[styles.addButtonText, { color: colors.primary }]}>
            {isEditing ? "Save" : "Add Achievement"}
          </Text>
        </TouchableOpacity>
      </View>

      <InputAccessoryView nativeID={accessoryID}>
        <View
          style={[
            styles.keyboardBar,
            { backgroundColor: colors.background, borderTopColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={[styles.keyboardButton, { backgroundColor: colors.primary }]}
            onPress={handleAdd}
          >
            <Text style={styles.keyboardButtonText}>{isEditing ? "Save Achievement" : "Add Achievement"}</Text>
          </TouchableOpacity>
        </View>
      </InputAccessoryView>
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
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 16,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    color: "#fff",
  },
  formButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  addButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  cancelButton: {
    flex: 1,
  },
  flexButton: {
    flex: 1,
  },
  addButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
  keyboardBar: {
    padding: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  keyboardButton: {
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  keyboardButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
