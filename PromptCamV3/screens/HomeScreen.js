import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Image,
  Clipboard,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { templates } from '../data/templates';

const popular = templates.slice(0, 6);
const featured = templates.slice(2, 8);
const trending = templates.slice(4, 10);

function MiniCard({ item, onCopy, copied }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(item.id);
  return (
    <View style={styles.miniCard}>
      <Image source={{ uri: item.preview }} style={styles.miniCardImage} resizeMode="cover" />
      <View style={styles.miniCardBody}>
        <Text style={styles.miniCardTitle} numberOfLines={1}>{item.emoji} {item.title}</Text>
        <Text style={styles.miniCardSub} numberOfLines={1}>{item.category}</Text>
      </View>
      <TouchableOpacity
        style={[styles.arrowBtn, copied === item.id && styles.arrowBtnSuccess]}
        onPress={() => onCopy(item.id, item.prompt)}
        activeOpacity={0.85}
      >
        <Text style={styles.arrowBtnText}>{copied === item.id ? '✓' : '→'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function PopularCard({ item, onCopy, copied }) {
  return (
    <TouchableOpacity
      style={styles.popCard}
      onPress={() => onCopy(item.id, item.prompt)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.preview }} style={styles.popCardImage} resizeMode="cover" />
      <View style={styles.popCardOverlay} />
      <View style={styles.popCardBadge}>
        <Text style={styles.popCardBadgeText}>{item.category}</Text>
      </View>
      {copied === item.id && (
        <View style={styles.popCardCopied}>
          <Text style={styles.popCardCopiedText}>✓ Copied!</Text>
        </View>
      )}
      <View style={styles.popCardBottom}>
        <Text style={styles.popCardEmoji}>{item.emoji}</Text>
        <Text style={styles.popCardTitle} numberOfLines={2}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [copied, setCopied] = useState(null);

  const handleCopy = (id, prompt) => {
    Clipboard.setString(prompt);
    setCopied(id);
    setTimeout(() => setCopied(null), 2200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f8fc" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good day! 👋</Text>
            <Text style={styles.headerTitle}>Discover AI{'\n'}Photo Prompts</Text>
          </View>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarEmoji}>✦</Text>
          </View>
        </View>

        {/* How it works pill */}
        <View style={styles.howItWorks}>
          <Text style={styles.howIcon}>⎘</Text>
          <Text style={styles.howText}>Copy prompt → Paste in AI editor → Get stunning results</Text>
        </View>

        {/* ── POPULAR ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {popular.map(item => (
            <PopularCard key={item.id} item={item} onCopy={handleCopy} copied={copied} />
          ))}
        </ScrollView>

        {/* ── FEATURED ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <View style={styles.listSection}>
          {featured.map(item => (
            <MiniCard key={item.id} item={item} onCopy={handleCopy} copied={copied} />
          ))}
        </View>

        {/* ── TRENDING ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending 🔥</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <View style={styles.listSection}>
          {trending.map(item => (
            <MiniCard key={item.id} item={item} onCopy={handleCopy} copied={copied} />
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f8fc' },
  scroll: { paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: { color: '#aaa', fontSize: 13, fontWeight: '500', marginBottom: 4 },
  headerTitle: {
    color: '#1a1a2e',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 31,
  },
  avatarWrap: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: '#f5a623',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#f5a623',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  avatarEmoji: { color: '#fff', fontSize: 22, fontWeight: '900' },

  // How it works
  howItWorks: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8ec',
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#fde8b8',
    gap: 10,
  },
  howIcon: { fontSize: 18 },
  howText: { color: '#c47f00', fontSize: 12, fontWeight: '600', flex: 1 },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: { color: '#1a1a2e', fontSize: 20, fontWeight: '800' },
  seeAll: { color: '#f5a623', fontSize: 14, fontWeight: '700' },

  // Horizontal scroll
  hScroll: { paddingLeft: 20, paddingRight: 10, paddingBottom: 8, marginBottom: 24 },

  // Popular card (large horizontal)
  popCard: {
    width: 180,
    height: 220,
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: 14,
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  popCardImage: { width: '100%', height: '100%', position: 'absolute' },
  popCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  popCardBadge: {
    position: 'absolute', top: 12, left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  popCardBadgeText: { color: '#f5a623', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  popCardCopied: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: '#2a9a60',
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4,
  },
  popCardCopiedText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  popCardBottom: { position: 'absolute', bottom: 14, left: 14, right: 14 },
  popCardEmoji: { fontSize: 20, marginBottom: 4 },
  popCardTitle: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: -0.2 },

  // List section
  listSection: { paddingHorizontal: 20, marginBottom: 28, gap: 12 },

  // Mini card (list row)
  miniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 12,
  },
  miniCardImage: {
    width: 64, height: 64, borderRadius: 14,
    backgroundColor: '#eee',
  },
  miniCardBody: { flex: 1, paddingHorizontal: 14 },
  miniCardTitle: { color: '#1a1a2e', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  miniCardSub: { color: '#aaa', fontSize: 12, fontWeight: '500' },
  arrowBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#f5a623',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#f5a623',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  arrowBtnSuccess: { backgroundColor: '#2a9a60' },
  arrowBtnText: { color: '#fff', fontSize: 18, fontWeight: '900' },
});
