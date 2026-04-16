import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
  Alert,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext';

export default function PromptCard({ item }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fav = isFavorite(item.id);

  const handleCopy = () => {
    Clipboard.setString(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <View style={styles.card}>
      {/* Image Preview */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.preview }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Dark gradient at bottom */}
        <View style={styles.imageFade} />

        {/* Category badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
        </View>

        {/* Fav button */}
        <TouchableOpacity
          style={[styles.favBtn, fav && styles.favBtnActive]}
          onPress={() => toggleFavorite(item.id)}
          activeOpacity={0.8}
        >
          <Text style={[styles.favIcon, fav && styles.favIconActive]}>
            {fav ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>

        {/* Title over image */}
        <View style={styles.titleOverlay}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Tags */}
        <View style={styles.tagsRow}>
          {item.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        {/* Prompt text */}
        <View style={styles.promptBox}>
          <Text style={styles.promptLabel}>PROMPT</Text>
          <Text
            style={styles.promptText}
            numberOfLines={expanded ? undefined : 3}
          >
            {item.prompt}
          </Text>
        </View>

        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.expandBtn}>
            {expanded ? '↑ Show less' : '↓ Read full prompt'}
          </Text>
        </TouchableOpacity>

        {/* Copy Button */}
        <TouchableOpacity
          style={[styles.copyBtn, copied && styles.copyBtnSuccess]}
          onPress={handleCopy}
          activeOpacity={0.85}
        >
          <Text style={styles.copyIcon}>{copied ? '✓' : '⎘'}</Text>
          <Text style={styles.copyText}>
            {copied ? 'Copied! Paste in your AI editor' : 'Copy Prompt'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#c8a882',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f5efe6',
  },
  imageContainer: {
    height: 220,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    color: '#d4622a',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  favBtn: {
    position: 'absolute',
    top: 10,
    right: 14,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favBtnActive: {
    backgroundColor: '#fff0f0',
  },
  favIcon: {
    fontSize: 20,
    color: '#ccc',
  },
  favIconActive: {
    color: '#ff4060',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 14,
    left: 16,
  },
  emoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  body: {
    padding: 18,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  tag: {
    backgroundColor: '#fff6f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#fde8d8',
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: '#d4622a',
    fontSize: 11,
    fontWeight: '600',
  },
  promptBox: {
    backgroundColor: '#faf7f4',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0e8dc',
    borderLeftWidth: 3,
    borderLeftColor: '#d4622a',
  },
  promptLabel: {
    color: '#d4622a',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 6,
  },
  promptText: {
    color: '#5a4a3a',
    fontSize: 13,
    lineHeight: 21,
  },
  expandBtn: {
    color: '#d4622a',
    fontSize: 12,
    marginBottom: 16,
    fontWeight: '600',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d4622a',
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
    shadowColor: '#d4622a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  copyBtnSuccess: {
    backgroundColor: '#2a9a60',
    shadowColor: '#2a9a60',
  },
  copyIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  copyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
