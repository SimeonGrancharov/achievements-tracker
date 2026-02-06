import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Screen } from '../components/Screen';
import { useTheme } from '../theme/useTheme';
import { signOut } from '../hooks/useAuth';
import type { ThemeMode } from '../theme/ThemeContext';

const themeOptions: { value: ThemeMode; icon: 'sun' | 'moon' | 'monitor' }[] = [
  { value: 'light', icon: 'sun' },
  { value: 'dark', icon: 'moon' },
  { value: 'system', icon: 'monitor' },
];

export function SettingsScreen() {
  const { colors, theme, setTheme } = useTheme();

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Feather name="log-out" size={22} color="#ff3b30" />
          </TouchableOpacity>
        </View>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Theme</Text>
          <View style={[styles.segmented, { borderColor: colors.border }]}>
            {themeOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.segmentedButton,
                  { borderLeftColor: colors.border },
                  theme === opt.value && { backgroundColor: colors.border },
                ]}
                onPress={() => setTheme(opt.value)}
              >
                <Feather
                  name={opt.icon}
                  size={18}
                  color={theme === opt.value ? colors.primary : colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  logoutButton: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    fontSize: 16,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  segmentedButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
});
