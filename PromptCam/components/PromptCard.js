import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
  Animated,
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
        {/* Gradient overlay */}
        <View style={styles.imageOverlay} />

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
        <Text
          style={styles.promptText}
          numberOfLines={expanded ? undefined : 3}
        >
          {item.prompt}
        </Text>

        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.expandBtn}>
            {expanded ? 'Show less ↑' : 'Read full prompt ↓'}
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
    backgroundColor: '#13131f',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e1e32',
  },
  imageContainer: {
    height: 210,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.75) 100%)',
    // React Native doesn't support CSS gradients directly, use a bottom fade trick:
  },
  categoryBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryText: {
    color: '#c4b5fd',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  favBtn: {
    position: 'absolute',
    top: 10,
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favBtnActive: {
    backgroundColor: 'rgba(255,80,120,0.2)',
    borderColor: 'rgba(255,80,120,0.5)',
  },
  favIcon: {
    fontSize: 18,
    color: '#aaa',
  },
  favIconActive: {
    color: '#ff5080',
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
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  body: {
    padding: 16,
    paddingBottom: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: 'rgba(124,111,255,0.1)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(124,111,255,0.2)',
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: '#9a8fff',
    fontSize: 11,
    fontWeight: '600',
  },
  promptText: {
    color: '#7a7a9a',
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 6,
  },
  expandBtn: {
    color: '#6655cc',
    fontSize: 12,
    marginBottom: 14,
    fontWeight: '500',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c6fff',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    shadowColor: '#7c6fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  copyBtnSuccess: {
    backgroundColor: '#1a7a50',
    shadowColor: '#1a7a50',
  },
  copyIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  copyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
