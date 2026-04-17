import { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { templates } from '../data/templates';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../App';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isDark } = useTheme();
  const bg = isDark ? '#0f0f1e' : '#f7f8fc';
  const cardBg = isDark ? '#1e1e32' : '#fff';
  const titleColor = isDark ? '#fff' : '#1a1a2e';

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return templates.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: titleColor }]}>Search</Text>
        <Text style={styles.headerSub}>Find your perfect editing style</Text>
      </View>
      <View style={styles.searchWrap}>
        <View style={[styles.searchBar, { backgroundColor: cardBg, borderColor: isDark ? '#2a2a4e' : '#ebebeb' }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput style={[styles.searchInput, { color: titleColor }]} placeholder="Golden hour, cinematic, moody..." placeholderTextColor="#999" value={query} onChangeText={setQuery} />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <View style={styles.clearBtn}><Text style={styles.clearBtnText}>✕</Text></View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {query.length === 0 && (
        <View style={styles.suggestions}>
          <Text style={styles.suggestLabel}>Popular searches</Text>
          <View style={styles.suggestRow}>
            {['cinematic', 'warm', 'moody', 'vintage', 'pastel', 'neon', 'portrait', 'dark'].map(s => (
              <TouchableOpacity key={s} style={[styles.suggestPill, { backgroundColor: cardBg, borderColor: isDark ? '#2a2a4e' : '#ebebeb' }]} onPress={() => setQuery(s)}>
                <Text style={[styles.suggestPillText, { color: isDark ? '#ccc' : '#555' }]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {query.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<Text style={styles.resultCount}>{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</Text>}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={[styles.emptyTitle, { color: titleColor }]}>No results found</Text>
              <Text style={styles.emptySub}>Try "cinematic", "warm" or "moody"</Text>
            </View>
          }
          renderItem={({ item }) => {
            const fav = isFavorite(item.id);
            return (
              <TouchableOpacity style={[styles.resultCard, { backgroundColor: cardBg }]} onPress={() => navigation.navigate('TemplateDetail', { item })} activeOpacity={0.85}>
                <Image source={{ uri: item.preview }} style={styles.resultImage} resizeMode="cover" />
                <View style={styles.resultBody}>
                  <View style={styles.resultTop}>
                    <Text style={[styles.resultTitle, { color: titleColor }]} numberOfLines={1}>{item.emoji} {item.title}</Text>
                    <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                      <Text style={[styles.resultFav, fav && styles.resultFavActive]}>{fav ? '♥' : '♡'}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.resultCat}>{item.category}</Text>
                  <View style={styles.resultTagRow}>
                    {item.tags.slice(0, 2).map(t => (
                      <View key={t} style={styles.resultTag}><Text style={styles.resultTagText}>#{t}</Text></View>
                    ))}
                  </View>
                  <View style={styles.tapRow}><Text style={styles.tapText}>Tap to view full prompt →</Text></View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  headerSub: { color: '#aaa', fontSize: 13, marginTop: 2 },
  searchWrap: { paddingHorizontal: 20, marginBottom: 16, marginTop: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 16, height: 52, borderWidth: 1.5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500' },
  clearBtn: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  clearBtnText: { color: '#888', fontSize: 11, fontWeight: '700' },
  suggestions: { paddingHorizontal: 20 },
  suggestLabel: { color: '#aaa', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap' },
  suggestPill: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5, marginBottom: 8, marginRight: 8 },
  suggestPillText: { fontSize: 13, fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  resultCount: { color: '#aaa', fontSize: 12, fontWeight: '600', marginBottom: 14 },
  resultCard: { flexDirection: 'row', borderRadius: 18, overflow: 'hidden', marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  resultImage: { width: 90, height: 120 },
  resultBody: { flex: 1, padding: 12 },
  resultTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  resultTitle: { fontSize: 14, fontWeight: '800', flex: 1 },
  resultFav: { fontSize: 20, color: '#ddd', marginLeft: 8 },
  resultFavActive: { color: '#ff4060' },
  resultCat: { color: '#bbb', fontSize: 11, fontWeight: '600', marginBottom: 6 },
  resultTagRow: { flexDirection: 'row', marginBottom: 8 },
  resultTag: { backgroundColor: '#fff8ec', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 1, borderColor: '#fde8b8', marginRight: 5 },
  resultTagText: { color: '#f5a623', fontSize: 10, fontWeight: '600' },
  tapRow: { backgroundColor: '#f5a623', borderRadius: 8, paddingVertical: 7, alignItems: 'center' },
  tapText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 44, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySub: { color: '#aaa', fontSize: 13 },
});
