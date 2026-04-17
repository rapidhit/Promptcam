import { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Image,
  FlatList, Dimensions,
} from 'react-native';
import { templates } from '../data/templates';
import { useTheme } from '../App';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const popular = templates.slice(0, 6);
const featured = templates.slice(2, 9);
const trending = templates.slice(5, 12);

function AutoScrollBanner({ navigation, isDark }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % popular.length;
        try {
          flatRef.current?.scrollToIndex({ index: next, animated: true });
        } catch (e) {}
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.bannerWrap}>
      <FlatList
        ref={flatRef}
        data={popular}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => String(item.id)}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
          setActiveIndex(Math.max(0, Math.min(idx, popular.length - 1)));
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bannerCard}
            activeOpacity={0.92}
            onPress={() => navigation.navigate('TemplateDetail', { item })}
          >
            <Image source={{ uri: item.preview }} style={styles.bannerImage} resizeMode="cover" />
            <View style={styles.bannerOverlay} />
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>{item.category.toUpperCase()}</Text>
            </View>
            <View style={styles.bannerBottom}>
              <Text style={styles.bannerEmoji}>{item.emoji}</Text>
              <Text style={styles.bannerTitle}>{item.title}</Text>
              <View style={styles.bannerCta}>
                <Text style={styles.bannerCtaText}>Tap to view prompt →</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={styles.dotsRow}>
        {popular.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

function MiniCard({ item, navigation, isDark }) {
  return (
    <TouchableOpacity
      style={[styles.miniCard, { backgroundColor: isDark ? '#1e1e32' : '#fff' }]}
      onPress={() => navigation.navigate('TemplateDetail', { item })}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.preview }} style={styles.miniCardImage} resizeMode="cover" />
      <View style={styles.miniCardBody}>
        <Text style={[styles.miniCardTitle, { color: isDark ? '#fff' : '#1a1a2e' }]} numberOfLines={1}>{item.emoji} {item.title}</Text>
        <Text style={styles.miniCardSub}>{item.category}</Text>
      </View>
      <View style={styles.arrowBtn}>
        <Text style={styles.arrowBtnText}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const { isDark, toggleTheme } = useTheme();
  const bg = isDark ? '#0f0f1e' : '#f7f8fc';
  const titleColor = isDark ? '#fff' : '#1a1a2e';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: isDark ? '#7a7aaa' : '#aaa' }]}>Good day! 👋</Text>
            <Text style={[styles.headerTitle, { color: titleColor }]}>Discover AI{'\n'}Photo Prompts</Text>
          </View>
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: isDark ? '#2a2a4e' : '#f0f0f0' }]}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {/* How it works */}
        <View style={[styles.howBox, { backgroundColor: isDark ? '#1e1a08' : '#fff8ec', borderColor: isDark ? '#3a3010' : '#fde8b8' }]}>
          <Text style={styles.howIcon}>⎘</Text>
          <Text style={[styles.howText, { color: isDark ? '#f5c842' : '#c47f00' }]}>
            Tap any template → Copy prompt → Paste in AI editor → Get stunning results
          </Text>
        </View>

        {/* POPULAR */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>Popular</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SeeAll', { title: 'Popular', items: popular })}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <AutoScrollBanner navigation={navigation} isDark={isDark} />

        {/* FEATURED */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>Featured</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SeeAll', { title: 'Featured', items: featured })}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.listSection}>
          {featured.slice(0, 4).map(item => (
            <MiniCard key={item.id} item={item} navigation={navigation} isDark={isDark} />
          ))}
        </View>

        {/* TRENDING */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>Trending 🔥</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SeeAll', { title: 'Trending 🔥', items: trending })}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.listSection}>
          {trending.slice(0, 4).map(item => (
            <MiniCard key={item.id} item={item} navigation={navigation} isDark={isDark} />
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', paddingHorizontal: 20,
    paddingTop: 20, paddingBottom: 16,
  },
  greeting: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
  headerTitle: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5, lineHeight: 31 },
  themeToggle: {
    width: 48, height: 48, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  themeIcon: { fontSize: 22 },
  howBox: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, marginHorizontal: 20, marginBottom: 24,
    paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, gap: 10,
  },
  howIcon: { fontSize: 18 },
  howText: { fontSize: 12, fontWeight: '600', flex: 1 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, marginBottom: 14,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  seeAll: { color: '#f5a623', fontSize: 14, fontWeight: '700' },
  bannerWrap: { marginHorizontal: 20, marginBottom: 10 },
  bannerCard: {
    width: CARD_WIDTH, height: 230, borderRadius: 22,
    overflow: 'hidden', backgroundColor: '#eee',
  },
  bannerImage: { width: '100%', height: '100%', position: 'absolute' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.32)' },
  bannerBadge: {
    position: 'absolute', top: 14, left: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  bannerBadgeText: { color: '#f5a623', fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  bannerBottom: { position: 'absolute', bottom: 18, left: 16, right: 16 },
  bannerEmoji: { fontSize: 22, marginBottom: 4 },
  bannerTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 10, letterSpacing: -0.3 },
  bannerCta: {
    backgroundColor: '#f5a623', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start',
  },
  bannerCtaText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, marginBottom: 24 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ddd', marginHorizontal: 3 },
  dotActive: { width: 20, backgroundColor: '#f5a623' },
  listSection: { paddingHorizontal: 20, marginBottom: 28 },
  miniCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 18, padding: 12, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  miniCardImage: { width: 64, height: 64, borderRadius: 14, backgroundColor: '#eee' },
  miniCardBody: { flex: 1, paddingHorizontal: 14 },
  miniCardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  miniCardSub: { color: '#aaa', fontSize: 12, fontWeight: '500' },
  arrowBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#f5a623', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#f5a623', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  arrowBtnText: { color: '#fff', fontSize: 18, fontWeight: '900' },
});
