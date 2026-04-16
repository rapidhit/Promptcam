import { useState, useMemo } from 'react';
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
} from 'react-native';
import { templates, categories } from '../data/templates';
import PromptCard from '../components/PromptCard';

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
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEyebrow}>✦ AI PHOTO STUDIO</Text>
        <Text style={styles.headerTitle}>Edit Like a Pro</Text>
        <Text style={styles.headerSub}>
          Copy any prompt → paste into your AI photo editor
        </Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search styles, moods, tags..."
            placeholderTextColor="#444466"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.catWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, activeCategory === cat && styles.catPillActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.75}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {filtered.length} prompt{filtered.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Cards */}
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

      {/* Bottom hint bar */}
      <View style={styles.hintBar}>
        <Text style={styles.hintText}>
          <Text style={styles.hintStep}>1</Text> Copy prompt {'  '}
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
    backgroundColor: '#0a0a0f',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#0f0f1a',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  headerEyebrow: {
    color: '#7c6fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 6,
  },
  headerTitle: {
    color: '#f0eee8',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSub: {
    color: '#555577',
    fontSize: 13,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#f0eee8',
    fontSize: 14,
  },
  clearBtn: {
    color: '#555',
    fontSize: 16,
    paddingLeft: 8,
  },
  catWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#111',
    paddingVertical: 12,
  },
  catScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  catPillActive: {
    borderColor: '#7c6fff',
    backgroundColor: 'rgba(124,111,255,0.15)',
  },
  catText: {
    color: '#555577',
    fontSize: 12,
    fontWeight: '600',
  },
  catTextActive: {
    color: '#c4b5fd',
  },
  countRow: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  countText: {
    color: '#444466',
    fontSize: 12,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 80,
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
    color: '#555',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySub: {
    color: '#333',
    fontSize: 13,
  },
  hintBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10,10,15,0.97)',
    borderTopWidth: 1,
    borderTopColor: '#1e1e2e',
    paddingVertical: 10,
    alignItems: 'center',
  },
  hintText: {
    color: '#333355',
    fontSize: 12,
  },
  hintStep: {
    color: '#7c6fff',
    fontWeight: '700',
  },
});
