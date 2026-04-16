import { useState, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList,
  StyleSheet, SafeAreaView, StatusBar,
  TouchableOpacity, Image, Clipboard,
} from 'react-native';
import { templates } from '../data/templates';
import { useFavorites } from '../context/FavoritesContext';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return templates.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }, [query]);

  const handleCopy = (id, prompt) => {
    Clipboard.setString(prompt);
    setCopied(id);
    setTimeout(() => setCopied(null), 2200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f8fc" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <Text style={styles.headerSub}>Find your perfect editing style</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Golden hour, cinematic, moody..."
            placeholderTextColor="#c0c0c0"
            value={query}
            onChangeText={setQuery}
            autoFocus={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <View style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>✕</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Suggestions when empty */}
      {query.length === 0 && (
        <View style={styles.suggestions}>
          <Text style={styles.suggestLabel}>Popular searches</Text>
          <View style={styles.suggestRow}>
            {['cinematic', 'warm', 'moody', 'vintage', 'pastel', 'neon', 'portrait', 'dark'].map(s => (
              <TouchableOpacity key={s} style={styles.suggestPill} onPress={() => setQuery(s)}>
                <Text style={styles.suggestPillText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Results */}
      {query.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.resultCount}>
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySub}>Try "cinematic", "warm" or "moody"</Text>
            </View>
          }
          renderItem={({ item }) => {
            const fav = isFavorite(item.id);
            return (
              <View style={styles.resultCard}>
                <Image source={{ uri: item.preview }} style={styles.resultImage} resizeMode="cover" />
                <View style={styles.resultBody}>
                  <View style={styles.resultTop}>
                    <Text style={styles.resultTitle} numberOfLines={1}>{item.emoji} {item.title}</Text>
                    <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                      <Text style={[styles.resultFav, fav && styles.resultFavActive]}>
                        {fav ? '♥' : '♡'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.resultCat}>{item.category}</Text>
                  <View style={styles.resultTagRow}>
                    {item.tags.slice(0, 2).map(t => (
                      <View key={t} style={styles.resultTag}>
                        <Text style={styles.resultTagText}>#{t}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={[styles.copyBtn, copied === item.id && styles.copyBtnSuccess]}
                    onPress={() => handleCopy(item.id, item.prompt)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.copyBtnText}>
                      {copied === item.id ? '✓  Copied!' : '⎘  Copy Prompt'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f8fc' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  headerTitle: { color: '#1a1a2e', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  headerSub: { color: '#aaa', fontSize: 13, marginTop: 2 },
  searchWrap: { paddingHorizontal: 20, marginBottom: 16, marginTop: 12 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16, paddingHorizontal: 16, height: 52,
    borderWidth: 1.5, borderColor: '#ebebeb',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, color: '#1a1a2e', fontSize: 15, fontWeight: '500' },
  clearBtn: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center',
  },
  clearBtnText: { color: '#888', fontSize: 11, fontWeight: '700' },

  suggestions: { paddingHorizontal: 20 },
  suggestLabel: { color: '#aaa', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestPill: {
    backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1.5, borderColor: '#ebebeb',
    marginBottom: 8, marginRight: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  suggestPillText: { color: '#555', fontSize: 13, fontWeight: '600' },

  list: { paddingHorizontal: 20, paddingBottom: 40 },
  resultCount: { color: '#aaa', fontSize: 12, fontWeight: '600', marginBottom: 14 },

  resultCard: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderRadius: 18, overflow: 'hidden', marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  resultImage: { width: 90, height: 110 },
  resultBody: { flex: 1, padding: 12 },
  resultTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  resultTitle: { color: '#1a1a2e', fontSize: 14, fontWeight: '800', flex: 1 },
  resultFav: { fontSize: 20, color: '#ddd', marginLeft: 8 },
  resultFavActive: { color: '#ff4060' },
  resultCat: { color: '#bbb', fontSize: 11, fontWeight: '600', marginBottom: 6 },
  resultTagRow: { flexDirection: 'row', gap: 4, marginBottom: 8 },
  resultTag: {
    backgroundColor: '#fff8ec', borderRadius: 6,
    paddingHorizontal: 7, paddingVertical: 2,
    borderWidth: 1, borderColor: '#fde8b8',
  },
  resultTagText: { color: '#f5a623', fontSize: 10, fontWeight: '600' },
  copyBtn: {
    backgroundColor: '#f5a623', borderRadius: 10,
    paddingVertical: 8, alignItems: 'center',
    shadowColor: '#f5a623', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },
  copyBtnSuccess: { backgroundColor: '#2a9a60' },
  copyBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 44, marginBottom: 16 },
  emptyTitle: { color: '#555', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySub: { color: '#aaa', fontSize: 13 },
});
