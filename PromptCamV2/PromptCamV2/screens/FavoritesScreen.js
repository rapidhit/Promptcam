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
      <StatusBar barStyle="dark-content" backgroundColor="#fdf8f3" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerEyebrow}>♥ SAVED PROMPTS</Text>
          <Text style={styles.headerTitle}>Your{'\n'}Favorites</Text>
        </View>
        {favorited.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countNum}>{favorited.length}</Text>
            <Text style={styles.countLabel}>saved</Text>
          </View>
        )}
      </View>

      {/* Decorative strip */}
      <View style={styles.strip}>
        {['🌅', '🎬', '🌸', '🖤', '📷', '🎨', '❄️', '🌆', '☁️', '✨'].map((e, i) => (
          <Text key={i} style={styles.stripEmoji}>{e}</Text>
        ))}
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
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyEmoji}>♡</Text>
            </View>
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptySub}>
              Tap the heart on any prompt{'\n'}to save your favorites here
            </Text>
            <View style={styles.emptyHint}>
              <Text style={styles.emptyHintText}>Go to Explore → tap ♡ on any card</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fdf8f3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1.5,
    borderBottomColor: '#f0e8dc',
    shadowColor: '#c8a882',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerLeft: {},
  headerEyebrow: {
    color: '#ff4060',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2.5,
    marginBottom: 4,
  },
  headerTitle: {
    color: '#2a1a0a',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  countBadge: {
    backgroundColor: '#ff4060',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: '#ff4060',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  countNum: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  countLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  strip: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff6f0',
    borderBottomWidth: 1,
    borderBottomColor: '#fde8d8',
    gap: 10,
  },
  stripEmoji: {
    fontSize: 18,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff0f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#ffd0d8',
  },
  emptyEmoji: {
    fontSize: 40,
    color: '#ffb0c0',
  },
  emptyTitle: {
    color: '#3a2a1a',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  emptySub: {
    color: '#c4a090',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyHint: {
    backgroundColor: '#fff6f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#fde0cc',
  },
  emptyHintText: {
    color: '#d4622a',
    fontSize: 12,
    fontWeight: '600',
  },
});
