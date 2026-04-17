import { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Image, ScrollView,
} from 'react-native';
import { templates, categories } from '../data/templates';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../App';

const catIcons = { All:'✦',Lighting:'🌅','Color Grade':'🎬',Aesthetic:'🌸',Moody:'🖤',Film:'📷',Creative:'🎨',Seasonal:'❄️',Urban:'🌆',Clean:'☁️',Portrait:'✨' };
const catColors = { All:'#f5a623',Lighting:'#ff7f50','Color Grade':'#6c63ff',Aesthetic:'#ff69b4',Moody:'#555',Film:'#8b6914',Creative:'#e74c3c',Seasonal:'#00bcd4',Urban:'#607d8b',Clean:'#26a69a',Portrait:'#ab47bc' };

export default function CategoriesScreen({ navigation }) {
  const [active, setActive] = useState('All');
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isDark } = useTheme();
  const filtered = useMemo(() => active === 'All' ? templates : templates.filter(t => t.category === active), [active]);
  const bg = isDark ? '#0f0f1e' : '#f7f8fc';
  const cardBg = isDark ? '#1e1e32' : '#fff';
  const sidebarBg = isDark ? '#1a1a2e' : '#fff';
  const titleColor = isDark ? '#fff' : '#1a1a2e';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.layout}>
        {/* Sidebar */}
        <View style={[styles.sidebar, { backgroundColor: sidebarBg, borderRightColor: isDark ? '#2a2a4e' : '#efefef' }]}>
          <Text style={styles.sidebarLabel}>Filter</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map(cat => {
              const isActive = active === cat;
              const color = catColors[cat] || '#f5a623';
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.sidebarItem, isActive && { backgroundColor: color + '18' }]}
                  onPress={() => setActive(cat)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.iconWrap, { backgroundColor: isActive ? color : (isDark ? '#2a2a4e' : '#f4f4f4') }]}>
                    <Text style={styles.icon}>{catIcons[cat] || '●'}</Text>
                  </View>
                  <Text style={[styles.catLabel, { color: isActive ? color : (isDark ? '#666' : '#bbb'), fontWeight: isActive ? '800' : '600' }]} numberOfLines={2}>{cat}</Text>
                  {isActive && <View style={[styles.activeLine, { backgroundColor: color }]} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {/* Main */}
        <View style={styles.main}>
          <View style={styles.mainHeader}>
            <Text style={[styles.mainTitle, { color: titleColor }]}>{catIcons[active]} {active}</Text>
            <View style={[styles.countPill, { backgroundColor: (catColors[active] || '#f5a623') + '20' }]}>
              <Text style={[styles.countText, { color: catColors[active] || '#f5a623' }]}>{filtered.length}</Text>
            </View>
          </View>
          <FlatList
            data={filtered}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const fav = isFavorite(item.id);
              const color = catColors[item.category] || '#f5a623';
              return (
                <TouchableOpacity
                  style={[styles.card, { backgroundColor: cardBg }]}
                  onPress={() => navigation.navigate('TemplateDetail', { item })}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: item.preview }} style={styles.cardImg} resizeMode="cover" />
                  <View style={styles.cardBody}>
                    <View style={styles.cardTop}>
                      <Text style={[styles.cardTitle, { color: titleColor }]} numberOfLines={1}>{item.emoji} {item.title}</Text>
                      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                        <Text style={[styles.favBtn, fav && styles.favBtnActive]}>{fav ? '♥' : '♡'}</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.cardCat}>{item.category}</Text>
                    <View style={[styles.tapBtn, { backgroundColor: color }]}>
                      <Text style={styles.tapBtnText}>View & Copy →</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  layout: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 82, borderRightWidth: 1, paddingTop: 20, paddingHorizontal: 6 },
  sidebarLabel: { color: '#ccc', fontSize: 9, fontWeight: '800', letterSpacing: 2, textAlign: 'center', marginBottom: 14, textTransform: 'uppercase' },
  sidebarItem: { borderRadius: 14, padding: 8, alignItems: 'center', marginBottom: 4, position: 'relative' },
  iconWrap: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  icon: { fontSize: 18 },
  catLabel: { fontSize: 9, textAlign: 'center', lineHeight: 12 },
  activeLine: { position: 'absolute', right: 0, top: '20%', width: 3, height: '60%', borderRadius: 2 },
  main: { flex: 1 },
  mainHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  mainTitle: { fontSize: 20, fontWeight: '900' },
  countPill: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  countText: { fontSize: 14, fontWeight: '800' },
  list: { paddingHorizontal: 14, paddingBottom: 40 },
  card: { flexDirection: 'row', borderRadius: 18, overflow: 'hidden', marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  cardImg: { width: 90, height: 120 },
  cardBody: { flex: 1, padding: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 14, fontWeight: '800', flex: 1 },
  favBtn: { fontSize: 20, color: '#ddd', marginLeft: 6 },
  favBtnActive: { color: '#ff4060' },
  cardCat: { color: '#bbb', fontSize: 11, fontWeight: '600', marginBottom: 10 },
  tapBtn: { borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  tapBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
});
