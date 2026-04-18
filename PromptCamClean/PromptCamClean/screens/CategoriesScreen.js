import { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Image, ScrollView } from 'react-native';
import { templates, categories } from '../data/templates';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../App';

const catIcons = { All:'✦',Lighting:'🌅','Color Grade':'🎬',Aesthetic:'🌸',Moody:'🖤',Film:'📷',Creative:'🎨',Seasonal:'❄️',Urban:'🌆',Clean:'☁️',Portrait:'✨' };
const catColors = { All:'#f5a623',Lighting:'#ff7f50','Color Grade':'#6c63ff',Aesthetic:'#ff69b4',Moody:'#555',Film:'#a0740a',Creative:'#e74c3c',Seasonal:'#00bcd4',Urban:'#607d8b',Clean:'#26a69a',Portrait:'#ab47bc' };

export default function CategoriesScreen({ navigation }) {
  const [active, setActive] = useState('All');
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isDark } = useTheme();
  const filtered = useMemo(() => active === 'All' ? templates : templates.filter(t => t.category === active), [active]);
  const bg = isDark ? '#0f0f1e' : '#f7f8fc';
  const cardBg = isDark ? '#1e1e32' : '#fff';
  const sidebarBg = isDark ? '#13132a' : '#ffffff';
  const titleColor = isDark ? '#fff' : '#1a1a2e';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.layout}>
        <View style={[styles.sidebar, { backgroundColor: sidebarBg, borderRightColor: isDark ? '#2a2a3e' : '#f0f0f0' }]}>
          <Text style={[styles.sidebarHeading, { color: isDark ? '#555577' : '#bbb' }]}>STYLES</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map(cat => {
              const isActive = active === cat;
              const color = catColors[cat] || '#f5a623';
              const count = cat === 'All' ? templates.length : templates.filter(t => t.category === cat).length;
              return (
                <TouchableOpacity key={cat} style={[styles.catRow, isActive && { backgroundColor: color + '14', borderColor: color + '40', borderWidth: 1 }]} onPress={() => setActive(cat)} activeOpacity={0.75}>
                  <View style={[styles.catDot, { backgroundColor: color }]}><Text style={styles.catDotIcon}>{catIcons[cat] || '●'}</Text></View>
                  <View style={styles.catLabelWrap}>
                    <Text style={[styles.catLabel, { color: isActive ? color : (isDark ? '#aaaacc' : '#555'), fontWeight: isActive ? '800' : '400' }]} numberOfLines={1}>{cat}</Text>
                    <View style={[styles.catBar, { backgroundColor: isDark ? '#2a2a4e' : '#efefef' }]}>
                      <View style={[styles.catBarFill, { backgroundColor: isActive ? color : '#ddd', width: isActive ? '100%' : '40%' }]} />
                    </View>
                  </View>
                  <View style={[styles.catCount, { backgroundColor: isActive ? color : (isDark ? '#2a2a4e' : '#f0f0f0') }]}>
                    <Text style={[styles.catCountText, { color: isActive ? '#fff' : '#999' }]}>{count}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <View style={[styles.main, { backgroundColor: bg }]}>
          <View style={styles.mainHeader}>
            <View style={[styles.mainDot, { backgroundColor: catColors[active] || '#f5a623' }]} />
            <Text style={[styles.mainTitle, { color: titleColor }]}>{active}</Text>
            <View style={[styles.countPill, { backgroundColor: (catColors[active] || '#f5a623') + '20' }]}>
              <Text style={[styles.countText, { color: catColors[active] || '#f5a623' }]}>{filtered.length}</Text>
            </View>
          </View>
          <FlatList data={filtered} keyExtractor={item => String(item.id)} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} initialNumToRender={5}
            renderItem={({ item }) => {
              const fav = isFavorite(item.id);
              const color = catColors[item.category] || '#f5a623';
              return (
                <TouchableOpacity style={[styles.card, { backgroundColor: cardBg }]} onPress={() => navigation.navigate('TemplateDetail', { item })} activeOpacity={0.85}>
                  <Image source={{ uri: item.preview }} style={styles.cardImg} resizeMode="cover" />
                  <View style={styles.cardBody}>
                    <View style={styles.cardTop}>
                      <Text style={[styles.cardTitle, { color: titleColor }]} numberOfLines={1}>{item.emoji} {item.title}</Text>
                      <TouchableOpacity onPress={() => toggleFavorite(item.id)}><Text style={[styles.favBtn, fav && styles.favBtnActive]}>{fav ? '♥' : '♡'}</Text></TouchableOpacity>
                    </View>
                    <Text style={styles.cardCat}>{item.category}</Text>
                    <View style={[styles.tapBtn, { backgroundColor: color }]}><Text style={styles.tapBtnText}>View & Copy →</Text></View>
                  </View>
                </TouchableOpacity>
              );
            }} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 }, layout: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 150, borderRightWidth: 1, paddingTop: 18, paddingHorizontal: 10 },
  sidebarHeading: { fontSize: 9, fontWeight: '800', letterSpacing: 2, marginBottom: 12, marginLeft: 4 },
  catRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 8, marginBottom: 4, borderWidth: 1, borderColor: 'transparent' },
  catDot: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0 },
  catDotIcon: { fontSize: 15 }, catLabelWrap: { flex: 1 }, catLabel: { fontSize: 12, marginBottom: 5 },
  catBar: { height: 4, borderRadius: 2, width: '100%', overflow: 'hidden' }, catBarFill: { height: '100%', borderRadius: 2 },
  catCount: { minWidth: 24, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, marginLeft: 6 },
  catCountText: { fontSize: 10, fontWeight: '800' },
  main: { flex: 1 }, mainHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingTop: 18, paddingBottom: 12 },
  mainDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 }, mainTitle: { fontSize: 18, fontWeight: '900', flex: 1 },
  countPill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }, countText: { fontSize: 13, fontWeight: '800' },
  list: { paddingHorizontal: 12, paddingBottom: 40 },
  card: { flexDirection: 'row', borderRadius: 18, overflow: 'hidden', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  cardImg: { width: 85, height: 115 }, cardBody: { flex: 1, padding: 11 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardTitle: { fontSize: 13, fontWeight: '800', flex: 1, lineHeight: 18 },
  favBtn: { fontSize: 18, color: '#ddd', marginLeft: 4 }, favBtnActive: { color: '#ff4060' },
  cardCat: { color: '#bbb', fontSize: 11, fontWeight: '600', marginBottom: 8 },
  tapBtn: { borderRadius: 10, paddingVertical: 8, alignItems: 'center' }, tapBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});
