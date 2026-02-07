import { View, Text, TouchableOpacity, StyleSheet, type ReactNode } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '../theme/useTheme';

type HeaderProps = {
  title: string;
  onBack?: () => void;
  variant?: 'back' | 'close';
  right?: ReactNode;
  modal?: boolean;
};

export function Header({ title, onBack, variant = 'back', right, modal }: HeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: modal ? 16 : insets.top, backgroundColor: colors.background }]}>
      <View style={styles.row}>
        <View style={styles.side}>
          {onBack && (
            <TouchableOpacity onPress={onBack} hitSlop={8}>
              <Feather
                name={variant === 'close' ? 'x' : 'chevron-left'}
                size={variant === 'close' ? 22 : 28}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.side}>
          {right}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 12,
  },
  side: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});
