import { useState, useMemo, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Image, ScrollView, Animated,
} from 'react-native';
import { templates, categories } from '../data/templates';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../App';

const catIcons = {
  All: '✦', Lighting: '🌅', 'Color Grade': '🎬',
  Aesthetic: '🌸', Moody: '🖤', Film: '📷',
  Creative: '🎨', Seasonal: '❄️', Urban: '🌆',
  Clean: '☁️', Portrait: '✨',
};
const catColors = {
  All: '#f5a623', Lighting: '#ff7f50', 'Color Grade': '#6c63ff',
  Aesthetic: '#ff69b4', Moody: '#4a4a6a', Film: '#a0740a',
  Creative: '#e74c3c', Seasonal: '#00bcd4', Urban: '#607d8b',
  Clean: '#26a69a', Portrait: '#ab47bc',
};

function CategoryRow({ cat, isActive, onPress, isDark, count }) {
  const color = catColors[cat] || '#f5a623';
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    onPress(cat);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={[
          styles.catRow,
          { backgroundColor: isActive ? color + '14' : 'transparent' },
          isActive && { borderColor: color + '40', borderWidth: 1 },
        ]}
      >
        {/* Left colored circle dot */}
        <View style={[styles.catDot, { backgroundColor: color }]}>
          <Text style={styles.catDotIcon}>{catIcons[cat] || '●'}</Text>
        </View>

        {/* Label + count bar */}
        <View style={styles.catLabelWrap}>
          <Text
            style={[
              styles.catLabel,
              { color: isActive ? color : (isDark ? '#aaaacc' : '#555') },
              isActive && { fontWeight: '800' },
            ]}
            numberOfLines={1}
          >
            {cat}
          </Text>
          {/* Progress bar */}
          <View style={[styles.catBar, { backgroundColor: isDark ? '#2a2a4e' : '#efefef' }]}>
            <View
              style={[
                styles.catBarFill,
                {
                  backgroundColor: isActive ? color : (isDark ? '#3a3a5e' : '#ddd'),
                  width: isActive ? '100%' : `${Math.min(100, (count / templates.length) * 300)}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Count badge */}
        <View style={[styles.catCount, { backgroundColor: isActive ? color : (isDark ? '#2a2a4e' : '#f0f0f0') }]}>
          <Text style={[styles.catCountText, { color: isActive ? '#fff' : (isDark ? '#888' : '#999') }]}>
            {count}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function CardItem({ item, navigation, isDark, index }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(item.id);
  const color = catColors[item.category] || '#f5a623';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 350,
        delay: index * 60, useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 350,
        delay: index * 60, useNativeDriver: true,
      }),
    ]).start();
  });

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: isDark ? '#1e1e32' : '#fff' }]}
        onPress={() => navigation.navigate('TemplateDetail', { item })}
        activeOpacity={0.85}
      >
        <Image source={{ uri: item.preview }} style={styles.cardImg} resizeMode="cover" />
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <Text style={[styles.cardTitle, { color: isDark ? '#fff' : '#1a1a2e' }]} numberOfLines={1}>
              {item.emoji} {item.title}
            </Text>
            <TouchableOpacity
              style={[styles.favBtn, fav && { backgroundColor: '#fff0f2' }]}
              onPress={() => toggleFavorite(item.id)}
            >
              <Text style={[styles.favIcon, fav && styles.favIconActive]}>{fav ? '♥' : '♡'}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.catChip, { backgroundColor: color + '18', borderColor: color + '30' }]}>
            <View style={[styles.chipDot, { backgroundColor: color }]} />
            <Text style={[styles.chipText, { color }]}>{item.category}</Text>
          </View>
          <View style={[styles.tapBtn, { backgroundColor: color }]}>
            <Text style={styles.tapBtnText}>View & Copy →</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function CategoriesScreen({ navigation }) {
  const [active, setActive] = useState('All');
  const { isDark } = useTheme();
  const listRef = useRef(null);

  const filtered = useMemo(
    () => active === 'All' ? templates : templates.filter(t => t.category === active),
    [active]
  );

  const getCatCount = (cat) =>
    cat === 'All' ? templates.length : templates.filter(t => t.category === cat).length;

  const handleCatSelect = (cat) => {
    setActive(cat);
    setTimeout(() => {
      try { listRef.current?.scrollToOffset({ offset: 0, animated: true }); } catch (e) {}
    }, 50);
  };

  const bg = isDark ? '#0f0f1e' : '#f7f8fc';
  const sidebarBg = isDark ? '#13132a' : '#ffffff';
  const titleColor = isDark ? '#fff' : '#1a1a2e';
  const color = catColors[active] || '#f5a623';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.layout}>

        {/* ── SIDEBAR ── */}
        <View style={[styles.sidebar, {
          backgroundColor: sidebarBg,
          borderRightColor: isDark ? '#2a2a3e' : '#f0f0f0',
        }]}>
          <Text style={[styles.sidebarHeading, { color: isDark ? '#555577' : '#bbb' }]}>
            STYLES
          </Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {categories.map(cat => (
              <CategoryRow
                key={cat}
                cat={cat}
                isActive={active === cat}
                onPress={handleCatSelect}
                isDark={isDark}
                count={getCatCount(cat)}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── MAIN ── */}
        <View style={[styles.main, { backgroundColor: bg }]}>
          {/* Header */}
          <View style={styles.mainHeader}>
            <View style={[styles.mainDot, { backgroundColor: color }]} />
            <Text style={[styles.mainTitle, { color: titleColor }]}>{active}</Text>
            <View style={[styles.countPill, { backgroundColor: color + '20' }]}>
              <Text style={[styles.countText, { color }]}>{filtered.length}</Text>
            </View>
          </View>

          <FlatList
            ref={listRef}
            data={filtered}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={8}
            removeClippedSubviews={true}
            renderItem={({ item, index }) => (
              <CardItem
                item={item}
                navigation={navigation}
                isDark={isDark}
                index={index}
              />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  layout: { flex: 1, flexDirection: 'row' },

  // Sidebar
  sidebar: {
    width: 150,
    borderRightWidth: 1,
    paddingTop: 18,
    paddingHorizontal: 10,
  },
  sidebarHeading: {
    fontSize: 9, fontWeight: '800', letterSpacing: 2,
    marginBottom: 12, marginLeft: 4,
  },

  // Category row — dot + bar style
  catRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, paddingVertical: 10,
    paddingHorizontal: 8, marginBottom: 4,
    borderWidth: 1, borderColor: 'transparent',
  },
  catDot: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10, flexShrink: 0,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 2,
  },
  catDotIcon: { fontSize: 15 },
  catLabelWrap: { flex: 1 },
  catLabel: { fontSize: 12, marginBottom: 5 },
  catBar: { height: 4, borderRadius: 2, width: '100%', overflow: 'hidden' },
  catBarFill: { height: '100%', borderRadius: 2 },
  catCount: {
    minWidth: 24, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 6, marginLeft: 6,
  },
  catCountText: { fontSize: 10, fontWeight: '800' },

  // Main area
  main: { flex: 1 },
  mainHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingTop: 18, paddingBottom: 12,
  },
  mainDot: {
    width: 10, height: 10, borderRadius: 5,
    marginRight: 8,
  },
  mainTitle: { fontSize: 18, fontWeight: '900', flex: 1 },
  countPill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  countText: { fontSize: 13, fontWeight: '800' },
  list: { paddingHorizontal: 12, paddingBottom: 40 },

  // Card
  card: {
    flexDirection: 'row', borderRadius: 18, overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  cardImg: { width: 85, height: 115 },
  cardBody: { flex: 1, padding: 11 },
  cardTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 6,
  },
  cardTitle: { fontSize: 13, fontWeight: '800', flex: 1, lineHeight: 18 },
  favBtn: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: '#f4f4f4',
    alignItems: 'center', justifyContent: 'center', marginLeft: 4,
  },
  favIcon: { fontSize: 15, color: '#ccc' },
  favIconActive: { color: '#ff4060' },
  catChip: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, alignSelf: 'flex-start', marginBottom: 8,
  },
  chipDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  chipText: { fontSize: 10, fontWeight: '700' },
  tapBtn: { borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  tapBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});
