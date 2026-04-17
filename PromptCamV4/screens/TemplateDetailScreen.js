import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Clipboard, Dimensions } from 'react-native';
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
      <View style={[styles.topBar, { backgroundColor: cardBg, borderBottomColor: isDark ? '#2a2a4e' : '#f0f0f0' }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDark ? '#2a2a4e' : '#f4f4f4' }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtnText, { color: titleColor }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: titleColor }]} numberOfLines={1}>{item.title}</Text>
        <TouchableOpacity style={[styles.favBtn, fav && styles.favBtnActive]} onPress={() => toggleFavorite(item.id)}>
          <Text style={[styles.favBtnText, fav && styles.favBtnTextActive]}>{fav ? '♥' : '♡'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Big preview image */}
        <View style={styles.previewWrap}>
          <Image source={{ uri: item.preview }} style={styles.previewImage} resizeMode="cover" />
          <View style={styles.previewOverlay} />
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
          <TouchableOpacity style={[styles.copyBtn, copied && styles.copyBtnSuccess]} onPress={handleCopy} activeOpacity={0.88}>
            <Text style={styles.copyBtnIcon}>{copied ? '✓' : '⎘'}</Text>
            <View>
              <Text style={styles.copyBtnTitle}>{copied ? 'Prompt Copied!' : 'Copy Prompt'}</Text>
              <Text style={styles.copyBtnSub}>{copied ? 'Now paste in your AI editor' : 'Tap to copy editing prompt'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Title & tags */}
        <View style={[styles.infoSection, { backgroundColor: cardBg }]}>
          <Text style={[styles.infoTitle, { color: titleColor }]}>{item.title}</Text>
          <View style={styles.tagRow}>
            {item.tags.map(tag => (
              <View key={tag} style={styles.tag}><Text style={styles.tagText}>#{tag}</Text></View>
            ))}
          </View>
        </View>

        {/* How to use */}
        <View style={[styles.howSection, { backgroundColor: cardBg }]}>
          <Text style={[styles.howTitle, { color: titleColor }]}>How to use this prompt</Text>
          {[
            { num: '1', icon: '⎘', label: 'Copy the prompt', sub: 'Tap the copy button above' },
            { num: '2', icon: '📱', label: 'Open your AI editor', sub: 'Remini, Luminar, Adobe Firefly etc.' },
            { num: '3', icon: '📋', label: 'Paste & generate', sub: 'Paste prompt and apply to your photo' },
            { num: '4', icon: '✨', label: 'Get stunning results', sub: 'Your photo is now professionally edited' },
          ].map(step => (
            <View key={step.num} style={styles.howStep}>
              <View style={styles.howStepNum}><Text style={styles.howStepNumText}>{step.num}</Text></View>
              <View style={styles.howStepBody}>
                <Text style={[styles.howStepLabel, { color: titleColor }]}>{step.icon}  {step.label}</Text>
                <Text style={[styles.howStepSub, { color: subColor }]}>{step.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Full prompt */}
        <View style={[styles.promptSection, { backgroundColor: cardBg }]}>
          <View style={styles.promptSectionHeader}>
            <Text style={[styles.promptSectionTitle, { color: titleColor }]}>Full Prompt</Text>
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
              <Text style={styles.expandBtn}>{expanded ? 'Collapse ↑' : 'Expand ↓'}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.promptBox, isDark && styles.promptBoxDark]}>
            <Text style={[styles.promptText, isDark && { color: '#ccc' }]} numberOfLines={expanded ? undefined : 4}>{item.prompt}</Text>
          </View>
        </View>

        {/* Bottom copy */}
        <View style={styles.bottomCopyWrap}>
          <TouchableOpacity style={[styles.bottomCopyBtn, copied && styles.bottomCopyBtnSuccess]} onPress={handleCopy} activeOpacity={0.88}>
            <Text style={styles.bottomCopyText}>{copied ? '✓  Copied! Paste in your AI editor' : '⎘  Copy This Prompt'}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  backBtnText: { fontSize: 20, fontWeight: '700' },
  topBarTitle: { flex: 1, fontSize: 16, fontWeight: '800' },
  favBtn: { width: 40, height: 40, borderRadius: 13, backgroundColor: '#f4f4f4', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  favBtnActive: { backgroundColor: '#fff0f2' },
  favBtnText: { fontSize: 20, color: '#ccc' },
  favBtnTextActive: { color: '#ff4060' },
  scroll: { paddingBottom: 20 },
  previewWrap: { width: width, height: width * 1.05, position: 'relative', backgroundColor: '#eee' },
  previewImage: { width: '100%', height: '100%' },
  previewOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  previewBadge: { position: 'absolute', bottom: 20, left: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, gap: 6 },
  previewBadgeEmoji: { fontSize: 18 },
  previewBadgeCat: { color: '#f5a623', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  previewLabel: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  previewLabelText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  copySection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5a623', borderRadius: 18, paddingVertical: 16, paddingHorizontal: 24, gap: 14, shadowColor: '#f5a623', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 8 },
  copyBtnSuccess: { backgroundColor: '#2a9a60', shadowColor: '#2a9a60' },
  copyBtnIcon: { color: '#fff', fontSize: 26, fontWeight: '900' },
  copyBtnTitle: { color: '#fff', fontSize: 16, fontWeight: '900' },
  copyBtnSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1 },
  infoSection: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#f5f5f5' },
  infoTitle: { fontSize: 22, fontWeight: '900', marginBottom: 12, letterSpacing: -0.3 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#fff8ec', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: '#fde8b8', marginRight: 6, marginBottom: 4 },
  tagText: { color: '#f5a623', fontSize: 12, fontWeight: '700' },
  howSection: { marginTop: 10, paddingHorizontal: 20, paddingVertical: 20 },
  howTitle: { fontSize: 17, fontWeight: '800', marginBottom: 16 },
  howStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 12 },
  howStepNum: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#f5a623', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  howStepNumText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  howStepBody: { flex: 1, paddingTop: 2 },
  howStepLabel: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  howStepSub: { fontSize: 12 },
  promptSection: { marginTop: 10, paddingHorizontal: 20, paddingVertical: 20 },
  promptSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  promptSectionTitle: { fontSize: 17, fontWeight: '800' },
  expandBtn: { color: '#f5a623', fontSize: 13, fontWeight: '700' },
  promptBox: { backgroundColor: '#faf7f2', borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: '#f0e8d8', borderLeftWidth: 4, borderLeftColor: '#f5a623' },
  promptBoxDark: { backgroundColor: '#1a1a2e', borderColor: '#2a2a4e', borderLeftColor: '#f5a623' },
  promptText: { color: '#5a4a3a', fontSize: 13, lineHeight: 22 },
  bottomCopyWrap: { paddingHorizontal: 20, paddingTop: 20 },
  bottomCopyBtn: { backgroundColor: '#1a1a2e', borderRadius: 18, paddingVertical: 18, alignItems: 'center', shadowColor: '#1a1a2e', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 8 },
  bottomCopyBtnSuccess: { backgroundColor: '#2a9a60' },
  bottomCopyText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.3 },
});
