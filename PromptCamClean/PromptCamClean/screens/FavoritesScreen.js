import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { templates } from '../data/templates';
import { useTheme } from '../App';

export default function FavoritesScreen({ navigation }) {
  const { favorites, toggleFavorite } = useFavorites();
  const { isDark } = useTheme();
  const favorited = templates.filter(t => favorites.includes(t.id));
  const bg = isDark ? '#0f0f1e' : '#f7f8fc';
  const cardBg = isDark ? '#1e1e32' : '#fff';
  const titleColor = isDark ? '#fff' : '#1a1a2e';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.profileHeader, { backgroundColor: cardBg, borderBottomColor: isDark ? '#2a2a4e' : '#f0f0f0' }]}>
        <View style={styles.avatarWrap}><Text style={styles.avatarEmoji}>🤍</Text></View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: titleColor }]}>My Collection</Text>
          <Text style={styles.profileSub}>Your saved editing prompts</Text>
        </View>
        <View style={styles.statBadge}>
          <Text style={styles.statNum}>{favorited.length}</Text>
          <Text style={styles.statLabel}>saved</Text>
        </View>
      </View>
      <View style={[styles.statsRow, { backgroundColor: cardBg }]}>
        <View style={styles.statBox}><Text style={[styles.statBoxNum, { color: titleColor }]}>{favorited.length}</Text><Text style={styles.statBoxLabel}>Favorites</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}><Text style={[styles.statBoxNum, { color: titleColor }]}>{templates.length}</Text><Text style={styles.statBoxLabel}>Total Prompts</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}><Text style={[styles.statBoxNum, { color: titleColor }]}>{[...new Set(templates.map(t => t.category))].length}</Text><Text style={styles.statBoxLabel}>Categories</Text></View>
      </View>
      <FlatList data={favorited} keyExtractor={item => String(item.id)} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}
        ListHeaderComponent={favorited.length > 0 ? <Text style={[styles.listHeader, { color: titleColor }]}>Saved Prompts</Text> : null}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}><Text style={styles.emptyEmoji}>🤍</Text></View>
            <Text style={[styles.emptyTitle, { color: titleColor }]}>No favorites yet</Text>
            <Text style={styles.emptySub}>Tap the heart on any prompt to save it here</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, { backgroundColor: cardBg }]} onPress={() => navigation.navigate('TemplateDetail', { item })} activeOpacity={0.85}>
            <Image source={{ uri: item.preview }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <Text style={[styles.cardTitle, { color: titleColor }]} numberOfLines={1}>{item.emoji} {item.title}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}><Text style={styles.unfavBtn}>♥</Text></TouchableOpacity>
              </View>
              <Text style={styles.cardCat}>{item.category}</Text>
              <View style={styles.tapBtn}><Text style={styles.tapBtnText}>View & Copy →</Text></View>
            </View>
          </TouchableOpacity>
        )} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1 },
  avatarWrap: { width: 52, height: 52, borderRadius: 18, backgroundColor: '#ff4060', alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 26 }, profileInfo: { flex: 1, paddingLeft: 14 },
  profileName: { fontSize: 18, fontWeight: '800' }, profileSub: { color: '#aaa', fontSize: 12, marginTop: 2 },
  statBadge: { backgroundColor: '#f5a623', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center' },
  statNum: { color: '#fff', fontSize: 18, fontWeight: '900' }, statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: '700' },
  statsRow: { flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 20, marginBottom: 8 },
  statBox: { flex: 1, alignItems: 'center' }, statBoxNum: { fontSize: 22, fontWeight: '900' },
  statBoxLabel: { color: '#aaa', fontSize: 11, fontWeight: '600', marginTop: 2 }, statDivider: { width: 1, backgroundColor: '#f0f0f0' },
  listHeader: { fontSize: 18, fontWeight: '800', marginBottom: 14 }, list: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 },
  card: { flexDirection: 'row', borderRadius: 18, overflow: 'hidden', marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  cardImage: { width: 90, height: 110 }, cardBody: { flex: 1, padding: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  cardTitle: { fontSize: 14, fontWeight: '800', flex: 1 }, unfavBtn: { fontSize: 20, color: '#ff4060', marginLeft: 6 },
  cardCat: { color: '#bbb', fontSize: 11, fontWeight: '600', marginBottom: 10 },
  tapBtn: { backgroundColor: '#f5a623', borderRadius: 10, paddingVertical: 9, alignItems: 'center' }, tapBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyIconWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#fff0f2', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyEmoji: { fontSize: 38 }, emptyTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  emptySub: { color: '#aaa', fontSize: 14, textAlign: 'center' },
});
