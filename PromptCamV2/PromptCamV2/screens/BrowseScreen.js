import { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { templates, categories } from '../data/templates';
import PromptCard from '../components/PromptCard';

const SIDEBAR_WIDTH = 80;
const { width } = Dimensions.get('window');

const categoryIcons = {
  All: '✦',
  Lighting: '🌅',
  'Color Grade': '🎬',
  Aesthetic: '🌸',
  Moody: '🖤',
  Film: '📷',
  Creative: '🎨',
  Seasonal: '❄️',
  Urban: '🌆',
  Clean: '☁️',
  Portrait: '✨',
};

export default function BrowseScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    return templates.filter(t => {
      const matchCat = activeCategory === 'All' || t.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fdf8f3" />

      <View style={styles.layout}>
        {/* ── SIDEBAR ── */}
        <View style={styles.sidebar}>
          {/* Logo mark */}
          <View style={styles.sidebarLogo}>
            <Text style={styles.sidebarLogoIcon}>✦</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarScroll}>
            {categories.map(cat => {
              const active = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.sidebarItem, active && styles.sidebarItemActive]}
                  onPress={() => setActiveCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sidebarIcon}>{categoryIcons[cat] || '●'}</Text>
                  <Text
                    style={[styles.sidebarLabel, active && styles.sidebarLabelActive]}
                    numberOfLines={2}
                  >
                    {cat}
                  </Text>
                  {active && <View style={styles.sidebarActiveDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── MAIN CONTENT ── */}
        <View style={styles.main}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerEyebrow}>AI PHOTO STUDIO</Text>
              <Text style={styles.headerTitle}>Edit Like{'\n'}a Pro ✦</Text>
            </View>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeNum}>{filtered.length}</Text>
              <Text style={styles.headerBadgeLabel}>prompts</Text>
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search styles, moods..."
              placeholderTextColor="#c4b09a"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Text style={styles.clearBtn}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Active category pill */}
          <View style={styles.activeCatRow}>
            <View style={styles.activeCatPill}>
              <Text style={styles.activeCatIcon}>{categoryIcons[activeCategory]}</Text>
              <Text style={styles.activeCatText}>{activeCategory}</Text>
            </View>
            <Text style={styles.activeCatCount}>{filtered.length} results</Text>
          </View>

          {/* Cards list */}
          <FlatList
            data={filtered}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <PromptCard item={item} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptySub}>Try a different search or category</Text>
              </View>
            )}
          />
        </View>
      </View>

      {/* Bottom hint */}
      <View style={styles.hintBar}>
        <Text style={styles.hintText}>
          <Text style={styles.hintStep}>1</Text> Copy {'  '}
          <Text style={styles.hintStep}>2</Text> Open AI editor {'  '}
          <Text style={styles.hintStep}>3</Text> Paste & generate ✦
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fdf8f3',
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
  },

  // ── SIDEBAR ──
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#ffffff',
    borderRightWidth: 1.5,
    borderRightColor: '#f0e8dc',
    paddingTop: 16,
    paddingBottom: 20,
    shadowColor: '#c8a882',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sidebarLogo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#d4622a',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#d4622a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sidebarLogoIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  sidebarScroll: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  sidebarItem: {
    width: 64,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 4,
    position: 'relative',
  },
  sidebarItemActive: {
    backgroundColor: '#fff6f0',
  },
  sidebarIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  sidebarLabel: {
    color: '#c4b09a',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  sidebarLabelActive: {
    color: '#d4622a',
    fontWeight: '800',
  },
  sidebarActiveDot: {
    position: 'absolute',
    right: 4,
    top: '50%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d4622a',
  },

  // ── MAIN ──
  main: {
    flex: 1,
    backgroundColor: '#fdf8f3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerEyebrow: {
    color: '#d4622a',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2.5,
    marginBottom: 4,
  },
  headerTitle: {
    color: '#2a1a0a',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 30,
  },
  headerBadge: {
    backgroundColor: '#d4622a',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: '#d4622a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerBadgeNum: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  headerBadgeLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#f0e0d0',
    paddingHorizontal: 14,
    height: 48,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#c8a882',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#2a1a0a',
    fontSize: 14,
    fontWeight: '500',
  },
  clearBtn: {
    color: '#c4a090',
    fontSize: 16,
    paddingLeft: 8,
  },
  activeCatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  activeCatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff6f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#fde0cc',
    gap: 6,
  },
  activeCatIcon: {
    fontSize: 14,
  },
  activeCatText: {
    color: '#d4622a',
    fontSize: 12,
    fontWeight: '700',
  },
  activeCatCount: {
    color: '#c4b09a',
    fontSize: 11,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#8a7a6a',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySub: {
    color: '#c4b09a',
    fontSize: 13,
  },
  hintBar: {
    position: 'absolute',
    bottom: 0,
    left: SIDEBAR_WIDTH,
    right: 0,
    backgroundColor: 'rgba(253,248,243,0.97)',
    borderTopWidth: 1,
    borderTopColor: '#f0e8dc',
    paddingVertical: 10,
    alignItems: 'center',
  },
  hintText: {
    color: '#c4b09a',
    fontSize: 11,
    fontWeight: '500',
  },
  hintStep: {
    color: '#d4622a',
    fontWeight: '800',
  },
});
