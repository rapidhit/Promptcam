import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Image,
} from 'react-native';
import { useTheme } from '../App';

export default function SeeAllScreen({ route, navigation }) {
  const { title, items } = route.params;
  const { isDark } = useTheme();
  const bg = isDark ? '#0f0f1e' : '#f7f8fc';
  const cardBg = isDark ? '#1e1e32' : '#fff';
  const titleColor = isDark ? '#fff' : '#1a1a2e';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.topBar, { backgroundColor: cardBg, borderBottomColor: isDark ? '#2a2a4e' : '#f0f0f0' }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? '#2a2a4e' : '#f4f4f4' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backBtnText, { color: titleColor }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: titleColor }]}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: cardBg }]}
            onPress={() => navigation.navigate('TemplateDetail', { item })}
            activeOpacity={0.85}
          >
            <Image source={{ uri: item.preview }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, { color: titleColor }]} numberOfLines={1}>{item.emoji} {item.title}</Text>
              <Text style={styles.cardCat}>{item.category}</Text>
              <View style={styles.tagRow}>
                {item.tags.slice(0, 2).map(t => (
                  <View key={t} style={styles.tag}>
                    <Text style={styles.tagText}>#{t}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.tapBtn}>
                <Text style={styles.tapBtnText}>View & Copy →</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  backBtnText: { fontSize: 20, fontWeight: '700' },
  topBarTitle: { flex: 1, fontSize: 18, fontWeight: '800' },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    flexDirection: 'row', borderRadius: 18, overflow: 'hidden', marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  cardImage: { width: 100, height: 120 },
  cardBody: { flex: 1, padding: 12 },
  cardTitle: { fontSize: 15, fontWeight: '800', marginBottom: 3 },
  cardCat: { color: '#bbb', fontSize: 11, fontWeight: '600', marginBottom: 8 },
  tagRow: { flexDirection: 'row', marginBottom: 10 },
  tag: {
    backgroundColor: '#fff8ec', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: '#fde8b8', marginRight: 6,
  },
  tagText: { color: '#f5a623', fontSize: 10, fontWeight: '600' },
  tapBtn: { backgroundColor: '#f5a623', borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  tapBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
});
