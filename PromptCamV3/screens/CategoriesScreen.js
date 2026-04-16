import { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
  Image, ScrollView, Clipboard,
} from 'react-native';
import { templates, categories } from '../data/templates';
import { useFavorites } from '../context/FavoritesContext';

const categoryIcons = {
  All: '✦', Lighting: '🌅', 'Color Grade': '🎬',
  Aesthetic: '🌸', Moody: '🖤', Film: '📷',
  Creative: '🎨', Seasonal: '❄️', Urban: '🌆',
  Clean: '☁️', Portrait: '✨',
};

const categoryColors = {
  All: '#f5a623', Lighting: '#ff7f50', 'Color Grade': '#6c63ff',
  Aesthetic: '#ff69b4', Moody: '#4a4a6a', Film: '#8b6914',
  Creative: '#e74c3c', Seasonal: '#00bcd4', Urban: '#607d8b',
  Clean: '#26a69a', Portrait: '#ab47bc',
};

export default function CategoriesScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [copied, setCopied] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const filtered = useMemo(() =>
    activeCategory === 'All' ? templates : templates.filter(t => t.category === activeCategory),
    [activeCategory]
  );

  const handleCopy = (id, prompt) => {
    Clipboard.setString(prompt);
    setCopied(id);
    setTimeout(() => setCopied(null), 2200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f8fc" />
      <View style={styles.layout}>

        {/* ── SIDEBAR ── */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Filters</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map(cat => {
              const active = activeCategory === cat;
              const color = categoryColors[cat] || '#f5a623';
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.sidebarItem, active && { backgroundColor: color + '18' }]}
                  onPress={() => setActiveCategory(cat)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.sidebarIconWrap, active && { backgroundColor: color }]}>
                    <Text style={styles.sidebarIcon}>{categoryIcons[cat] || '●'}</Text>
                  </View>
                  <Text style={[styles.sidebarLabel, active && { color, fontWeight: '800' }]}
                    numberOfLines={2}>
                    {cat}
                  </Text>
                  {active && <View style={[styles.activeLine, { backgroundColor: color }]} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── MAIN ── */}
        <View style={styles.main}>
          <View style={styles.mainHeader}>
            <Text style={styles.mainTitle}>{categoryIcons[activeCategory]} {activeCategory}</Text>
            <View style={[styles.countPill, { backgroundColor: (categoryColors[activeCategory] || '#f5a623') + '20' }]}>
              <Text style={[styles.countText, { color: categoryColors[activeCategory] || '#f5a623' }]}>
                {filtered.length}
              </Text>
            </View>
          </View>

          <FlatList
            data={filtered}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const fav = isFavorite(item.id);
              const color = categoryColors[item.category] || '#f5a623';
              return (
                <View style={styles.card}>
                  <Image source={{ uri: item.preview }} style={styles.cardImage} resizeMode="cover" />
                  <View style={styles.cardBody}>
                    <View style={styles.cardTop}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{item.emoji} {item.title}</Text>
                      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                        <Text style={[styles.favBtn, fav && styles.favBtnActive]}>
                          {fav ? '♥' : '♡'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.tagRow}>
                      {item.tags.slice(0, 2).map(t => (
                        <View key={t} style={[styles.tag, { backgroundColor: color + '15', borderColor: color + '30' }]}>
                          <Text style={[styles.tagText, { color }]}>#{t}</Text>
                        </View>
                      ))}
                    </View>
                    <TouchableOpacity
                      style={[styles.copyBtn, { backgroundColor: color }, copied === item.id && styles.copyBtnSuccess]}
                      onPress={() => handleCopy(item.id, item.prompt)}
                    >
                      <Text style={styles.copyBtnText}>
                        {copied === item.id ? '✓ Copied!' : '⎘ Copy Prompt'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f8fc' },
  layout: { flex: 1, flexDirection: 'row' },

  // Sidebar
  sidebar: {
    width: 82,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#efefef',
    paddingTop: 20,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  sidebarTitle: {
    color: '#ccc', fontSize: 9, fontWeight: '800',
    letterSpacing: 2, textAlign: 'center',
    marginBottom: 14, textTransform: 'uppercase',
  },
  sidebarItem: {
    borderRadius: 14, padding: 8,
    alignItems: 'center', marginBottom: 4,
    position: 'relative',
  },
  sidebarIconWrap: {
    width: 40, height: 40, borderRadius: 13,
    backgroundColor: '#f4f4f4',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 5,
  },
  sidebarIcon: { fontSize: 18 },
  sidebarLabel: {
    color: '#bbb', fontSize: 9, fontWeight: '600',
    textAlign: 'center', lineHeight: 12,
  },
  activeLine: {
    position: 'absolute', right: 0, top: '20%',
    width: 3, height: '60%', borderRadius: 2,
  },

  // Main
  main: { flex: 1 },
  mainHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12,
  },
  mainTitle: { color: '#1a1a2e', fontSize: 20, fontWeight: '900' },
  countPill: {
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  countText: { fontSize: 14, fontWeight: '800' },

  list: { paddingHorizontal: 14, paddingBottom: 40 },

  card: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderRadius: 18, overflow: 'hidden', marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  cardImage: { width: 90, height: 120 },
  cardBody: { flex: 1, padding: 12 },
  cardTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4,
  },
  cardTitle: { color: '#1a1a2e', fontSize: 14, fontWeight: '800', flex: 1 },
  favBtn: { fontSize: 20, color: '#ddd', marginLeft: 6 },
  favBtnActive: { color: '#ff4060' },
  tagRow: { flexDirection: 'row', gap: 5, marginBottom: 10, flexWrap: 'wrap' },
  tag: {
    borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3,
    borderWidth: 1, marginRight: 5,
  },
  tagText: { fontSize: 10, fontWeight: '600' },
  copyBtn: {
    borderRadius: 10, paddingVertical: 9,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 6, elevation: 3,
  },
  copyBtnSuccess: { backgroundColor: '#2a9a60 !important' },
  copyBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
});
