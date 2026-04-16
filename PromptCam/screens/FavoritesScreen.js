import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { templates } from '../data/templates';
import PromptCard from '../components/PromptCard';

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const favorited = templates.filter(t => favorites.includes(t.id));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEyebrow}>♥ SAVED PROMPTS</Text>
        <Text style={styles.headerTitle}>Your Favorites</Text>
        <Text style={styles.headerSub}>
          {favorited.length > 0
            ? `${favorited.length} prompt${favorited.length !== 1 ? 's' : ''} saved`
            : 'Tap ♡ on any prompt to save it here'}
        </Text>
      </View>

      {/* Cards */}
      <FlatList
        data={favorited}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <PromptCard item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>♡</Text>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySub}>
              Browse prompts and tap the heart to save your favorites here
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#0f0f1a',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  headerEyebrow: {
    color: '#ff5080',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 6,
  },
  headerTitle: {
    color: '#f0eee8',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSub: {
    color: '#555577',
    fontSize: 13,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 56,
    color: '#2a2a3e',
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#444466',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  emptySub: {
    color: '#333355',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
