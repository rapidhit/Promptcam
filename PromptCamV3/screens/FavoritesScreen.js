import {
  View, Text, FlatList, StyleSheet,
  SafeAreaView, StatusBar, TouchableOpacity,
  Image, Clipboard,
} from 'react-native';
import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { templates } from '../data/templates';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(null);
  const favorited = templates.filter(t => favorites.includes(t.id));

  const handleCopy = (id, prompt) => {
    Clipboard.setString(prompt);
    setCopied(id);
    setTimeout(() => setCopied(null), 2200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f8fc" />

      {/* Profile header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarEmoji}>✦</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>My Collection</Text>
          <Text style={styles.profileSub}>Your saved editing prompts</Text>
        </View>
        <View style={styles.statBadge}>
          <Text style={styles.statNum}>{favorited.length}</Text>
          <Text style={styles.statLabel}>saved</Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statBoxNum}>{favorited.length}</Text>
          <Text style={styles.statBoxLabel}>Favorites</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statBoxNum}>{templates.length}</Text>
          <Text style={styles.statBoxLabel}>Total Prompts</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statBoxNum}>{[...new Set(templates.map(t => t.category))].length}</Text>
          <Text style={styles.statBoxLabel}>Categories</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={favorited}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          favorited.length > 0
            ? <Text style={styles.listHeader}>Saved Prompts</Text>
            : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyEmoji}>♡</Text>
            </View>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySub}>
              Tap ♡ on any prompt{'\n'}to save it here
            </Text>
            <View style={styles.emptyArrow}>
              <Text style={styles.emptyArrowText}>Go to Explore or Categories → tap ♡</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.preview }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.emoji} {item.title}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <Text style={styles.unfavBtn}>♥</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardCat}>{item.category}</Text>
              <TouchableOpacity
                style={[styles.copyBtn, copied === item.id && styles.copyBtnSuccess]}
                onPress={() => handleCopy(item.id, item.prompt)}
              >
                <Text style={styles.copyBtnText}>
                  {copied === item.id ? '✓  Copied!' : '⎘  Copy Prompt'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f8fc' },

  profileHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  avatarWrap: {
    width: 52, height: 52, borderRadius: 18,
    backgroundColor: '#f5a623',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#f5a623', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 5,
  },
  avatarEmoji: { color: '#fff', fontSize: 24, fontWeight: '900' },
  profileInfo: { flex: 1, paddingLeft: 14 },
  profileName: { color: '#1a1a2e', fontSize: 18, fontWeight: '800' },
  profileSub: { color: '#aaa', fontSize: 12, marginTop: 2 },
  statBadge: {
    backgroundColor: '#f5a623', borderRadius: 14,
    paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center',
    shadowColor: '#f5a623', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  statNum: { color: '#fff', fontSize: 18, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: '700' },

  statsRow: {
    flexDirection: 'row', backgroundColor: '#fff',
    paddingVertical: 16, paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statBoxNum: { color: '#1a1a2e', fontSize: 22, fontWeight: '900' },
  statBoxLabel: { color: '#aaa', fontSize: 11, fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#f0f0f0', marginVertical: 4 },

  listHeader: {
    color: '#1a1a2e', fontSize: 18, fontWeight: '800',
    marginBottom: 14,
  },
  list: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 4 },

  card: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderRadius: 18, overflow: 'hidden', marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  cardImage: { width: 90, height: 110 },
  cardBody: { flex: 1, padding: 12 },
  cardTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 2,
  },
  cardTitle: { color: '#1a1a2e', fontSize: 14, fontWeight: '800', flex: 1 },
  unfavBtn: { fontSize: 20, color: '#ff4060', marginLeft: 6 },
  cardCat: { color: '#bbb', fontSize: 11, fontWeight: '600', marginBottom: 10 },
  copyBtn: {
    backgroundColor: '#f5a623', borderRadius: 10,
    paddingVertical: 9, alignItems: 'center',
    shadowColor: '#f5a623', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },
  copyBtnSuccess: { backgroundColor: '#2a9a60' },
  copyBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyIconWrap: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#fff0f2', alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, borderWidth: 2, borderColor: '#ffd0d8',
  },
  emptyEmoji: { fontSize: 38, color: '#ffb0c0' },
  emptyTitle: { color: '#1a1a2e', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  emptySub: { color: '#aaa', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  emptyArrow: {
    backgroundColor: '#fff8ec', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: '#fde8b8',
  },
  emptyArrowText: { color: '#f5a623', fontSize: 12, fontWeight: '700' },
});
