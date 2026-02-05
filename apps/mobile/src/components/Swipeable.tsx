import { useRef, type ReactNode } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Swipeable as RNSwipeable } from 'react-native-gesture-handler';

type Props = {
  children: ReactNode;
  view: 'card' | 'tile';
  role: 'delete';
  onPress?: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
};

export function Swipeable({ children, view, onPress, onDelete, isDeleting = false }: Props) {
  const swipeableRef = useRef<RNSwipeable>(null);

  const renderRightActions = () => (
    <TouchableOpacity
      style={[styles.deleteAction, view === 'card' ? styles.deleteCard : styles.deleteTile]}
      onPress={onDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.deleteText}>Delete</Text>
      )}
    </TouchableOpacity>
  );

  const content = onPress ? (
    <TouchableOpacity
      style={view === 'card' ? styles.card : styles.tile}
      onPress={onPress}
      activeOpacity={0.7}
      delayPressIn={100}
    >
      {children}
    </TouchableOpacity>
  ) : (
    <View style={view === 'card' ? styles.card : styles.tile}>
      {children}
    </View>
  );

  return (
    <RNSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      enabled={!isDeleting}
    >
      {content}
    </RNSwipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tile: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  deleteAction: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteCard: {
    marginBottom: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteTile: {
    marginBottom: 8,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
