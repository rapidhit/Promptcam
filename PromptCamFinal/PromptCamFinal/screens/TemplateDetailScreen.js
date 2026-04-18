import { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, Clipboard, Dimensions,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../App';

const { width } = Dimensions.get('window');

export default function TemplateDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fav = isFavorite(item.id);

  const bg = isDark ? '#0f0f1e' : '#f7f8fc';
  const cardBg = isDark ? '#1e1e32' : '#fff';
  const titleColor = isDark ? '#fff' : '#1a1a2e';
  const subColor = isDark ? '#8888aa' : '#aaa';

  const handleCopy = () => {
    Clipboard.setString(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top bar */}
      <View style={[styles.topBar, { backgroundColor: cardBg, borderBottomColor: isDark ? '#2a2a4e' : '#f0f0f0' }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: isDark ? '#2a2a4e' : '#f4f4f4' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backBtnText, { color: titleColor }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: titleColor }]} numberOfLines={1}>{item.title}</Text>
        <TouchableOpacity
          style={[styles.favBtn, { backgroundColor: fav ? '#fff0f2' : (isDark ? '#2a2a4e' : '#f4f4f4') }]}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={[styles.favBtnText, fav && styles.favBtnTextActive]}>{fav ? '♥' : '♡'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Big preview image */}
        <View style={{ width, height: width * 1.05, backgroundColor: '#eee' }}>
          <Image source={{ uri: item.preview }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          <View style={StyleSheet.absoluteFill}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.15)' }} />
          </View>
          <View style={styles.previewBadge}>
            <Text style={styles.previewBadgeEmoji}>{item.emoji}</Text>
            <Text style={styles.previewBadgeCat}>{item.category.toUpperCase()}</Text>
          </View>
          <View style={styles.previewLabel}>
            <Text style={styles.previewLabelText}>✦ Preview</Text>
          </View>
        </View>

        {/* COPY BUTTON right below image */}
        <View style={[styles.copySection, { backgroundColor: cardBg }]}>
          <TouchableOpacity
            style={[styles.copyBtn, copied && styles.copyBtnSuccess]}
            onPress={handleCopy}
            activeOpacity={0.88}
          >
            <Text style={styles.copyBtnIcon}>{copied ? '✓' : '⎘'}</Text>
            <View>
              <Text style={styles.copyBtnTitle}>{copied ? 'Prompt Copied!' : 'Copy Prompt'}</Text>
              <Text style={styles.copyBtnSub}>{copied ? 'Now paste in your AI editor' : 'Tap to copy editing prompt'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Title & tags */}
        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.infoTitle, { color: titleColor }]}>{item.title}</Text>
          <View style={styles.tagRow}>
            {item.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How to use */}
        <View style={[styles.section, { backgroundColor: cardBg, marginTop: 10 }]}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>How to use this prompt</Text>
          {[
            { num: '1', label: 'Copy the prompt', sub: 'Tap the copy button above' },
            { num: '2', label: 'Open your AI editor', sub: 'Remini, Luminar, Adobe Firefly etc.' },
            { num: '3', label: 'Paste & generate', sub: 'Paste prompt and apply to your photo' },
            { num: '4', label: 'Get stunning results', sub: 'Your photo is professionally edited' },
          ].map(step => (
            <View key={step.num} style={styles.howStep}>
              <View style={styles.howNum}>
                <Text style={styles.howNumText}>{step.num}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.howLabel, { color: titleColor }]}>{step.label}</Text>
                <Text style={[styles.howSub, { color: subColor }]}>{step.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Full prompt */}
        <View style={[styles.section, { backgroundColor: cardBg, marginTop: 10 }]}>
          <View style={styles.promptHeader}>
            <Text style={[styles.sectionTitle, { color: titleColor }]}>Full Prompt</Text>
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
              <Text style={styles.expandBtn}>{expanded ? 'Collapse ↑' : 'Expand ↓'}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.promptBox, { backgroundColor: isDark ? '#1a1a2e' : '#faf7f2', borderColor: isDark ? '#2a2a4e' : '#f0e8d8' }]}>
            <Text style={[styles.promptText, { color: isDark ? '#ccc' : '#5a4a3a' }]} numberOfLines={expanded ? undefined : 4}>
              {item.prompt}
            </Text>
          </View>
        </View>

        {/* Bottom copy */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <TouchableOpacity
            style={[styles.bottomBtn, copied && styles.bottomBtnSuccess]}
            onPress={handleCopy}
            activeOpacity={0.88}
          >
            <Text style={styles.bottomBtnText}>
              {copied ? '✓  Copied! Paste in your AI editor' : '⎘  Copy This Prompt'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  backBtnText: { fontSize: 20, fontWeight: '700' },
  topBarTitle: { flex: 1, fontSize: 16, fontWeight: '800' },
  favBtn: {
    width: 40, height: 40, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
  favBtnText: { fontSize: 20, color: '#ccc' },
  favBtnTextActive: { color: '#ff4060' },
  scroll: { paddingBottom: 20 },
  previewBadge: {
    position: 'absolute', bottom: 20, left: 20,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
  },
  previewBadgeEmoji: { fontSize: 18, marginRight: 6 },
  previewBadgeCat: { color: '#f5a623', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  previewLabel: {
    position: 'absolute', top: 16, right: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5,
  },
  previewLabelText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  copySection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  copyBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f5a623', borderRadius: 18,
    paddingVertical: 16, paddingHorizontal: 24,
    shadowColor: '#f5a623', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 14, elevation: 8,
  },
  copyBtnSuccess: { backgroundColor: '#2a9a60', shadowColor: '#2a9a60' },
  copyBtnIcon: { color: '#fff', fontSize: 26, fontWeight: '900', marginRight: 14 },
  copyBtnTitle: { color: '#fff', fontSize: 16, fontWeight: '900' },
  copyBtnSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 1 },
  section: { paddingHorizontal: 20, paddingVertical: 18, borderTopWidth: 1, borderTopColor: '#f5f5f5' },
  infoTitle: { fontSize: 22, fontWeight: '900', marginBottom: 12, letterSpacing: -0.3 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: {
    backgroundColor: '#fff8ec', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: '#fde8b8', marginRight: 8, marginBottom: 6,
  },
  tagText: { color: '#f5a623', fontSize: 12, fontWeight: '700' },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 14 },
  howStep: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  howNum: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: '#f5a623',
    alignItems: 'center', justifyContent: 'center', marginRight: 14, flexShrink: 0,
  },
  howNumText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  howLabel: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  howSub: { fontSize: 12 },
  promptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  expandBtn: { color: '#f5a623', fontSize: 13, fontWeight: '700' },
  promptBox: {
    borderRadius: 16, padding: 16,
    borderWidth: 1.5, borderLeftWidth: 4, borderLeftColor: '#f5a623',
  },
  promptText: { fontSize: 13, lineHeight: 22 },
  bottomBtn: {
    backgroundColor: '#1a1a2e', borderRadius: 18,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: '#1a1a2e', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 14, elevation: 8,
  },
  bottomBtnSuccess: { backgroundColor: '#2a9a60' },
  bottomBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.3 },
});
