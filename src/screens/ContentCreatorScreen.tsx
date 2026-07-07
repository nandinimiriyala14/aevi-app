import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, Animated, Dimensions, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Typography } from '../theme';

// ── Constants ──────────────────────────────────────────────────────────────────

const { width: W } = Dimensions.get('window');
const CARD_SIZE = W - 32;

const SWATCHES = [
  '#C4A0A0', // Dusty Rose (default)
  '#5C4A4A', // Deep Rose
  '#2C2C2E', // Charcoal
  '#7A9E7E', // Sage
  '#9B8BB4', // Lavender
  '#1C2340', // Midnight
] as const;

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function ContentCreatorScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const cardRef    = useRef<ViewShot>(null);
  const toastAnim  = useRef(new Animated.Value(0)).current;

  const [text,    setText]    = useState('');
  const [font,    setFont]    = useState<'serif' | 'clean'>('serif');
  const [bgColor, setBgColor] = useState<string>('#C4A0A0');
  const [toast,   setToast]   = useState<string | null>(null);

  useEffect(() => {
    const msgs = route.params?.messages;
    if (msgs?.length) {
      const lastUser = [...msgs].reverse().find((m: any) => m.role === 'user');
      if (lastUser) setText(lastUser.content);
    }
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const showToast = (msg: string) => {
    setToast(msg);
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setToast(null));
  };

  const capture = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    return (cardRef.current as any).capture();
  };

  // ── Actions ──────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to save images to your gallery.');
        return;
      }
      const uri = await capture();
      if (!uri) return;
      await MediaLibrary.saveToLibraryAsync(uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast('Saved ✦');
    } catch {
      showToast('Could not save image');
    }
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const uri = await capture();
      if (!uri) return;
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share your Aevi reflection' });
    } catch {
      // user cancelled
    }
  };

  // ── Derived ──────────────────────────────────────────────────────────────────

  const displayText = text.trim() || 'Your words here...';
  const quoteFont   = font === 'serif' ? Typography.serif.italic : Typography.sans.regular;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#3D2B2B" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Create</Text>
        <View style={s.headerBtn} />
      </View>

      {/* ── Card preview ─────────────────────────────────────────────────────── */}
      <View style={s.cardSection}>
        <View style={s.cardShadow}>
          <ViewShot ref={cardRef} options={{ format: 'png', quality: 1.0 }}>
            <View style={[s.card, { backgroundColor: bgColor }]}>
              <View style={s.glassPanel}>
                <Text style={s.sparkle}>✦</Text>
                <Text style={[s.quoteText, { fontFamily: quoteFont }]}>
                  {displayText}
                </Text>
                <Text style={s.attribution}>— Aevi</Text>
              </View>
            </View>
          </ViewShot>
        </View>
      </View>

      {/* ── Scrollable controls ───────────────────────────────────────────────── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Text */}
        <Text style={s.sectionLabel}>TEXT</Text>
        <TextInput
          style={s.textInput}
          value={text}
          onChangeText={setText}
          multiline
          placeholder="Paste your text here..."
          placeholderTextColor="#C4A8A8"
          textAlignVertical="top"
        />

        {/* Font */}
        <Text style={s.sectionLabel}>FONT</Text>
        <View style={s.fontRow}>
          {(['serif', 'clean'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[s.fontBtn, font === f && s.fontBtnActive]}
              onPress={() => { Haptics.selectionAsync(); setFont(f); }}
              activeOpacity={0.8}
            >
              <Text style={[s.fontBtnText, font === f && s.fontBtnTextActive]}>
                {f === 'serif' ? 'Serif' : 'Clean'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Background */}
        <Text style={s.sectionLabel}>BACKGROUND</Text>
        <View style={s.swatchRow}>
          {SWATCHES.map((color) => (
            <TouchableOpacity
              key={color}
              style={[s.swatch, { backgroundColor: color }, bgColor === color && s.swatchActive]}
              onPress={() => { Haptics.selectionAsync(); setBgColor(color); }}
              activeOpacity={0.8}
            />
          ))}
        </View>
      </ScrollView>

      {/* Toast */}
      {toast && (
        <Animated.View style={[s.toast, { opacity: toastAnim }]} pointerEvents="none">
          <Text style={s.toastText}>{toast}</Text>
        </Animated.View>
      )}

      {/* ── Bottom bar ───────────────────────────────────────────────────────── */}
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={s.saveBtnText}>Save to gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.shareBtn} onPress={handleShare} activeOpacity={0.85}>
          <Text style={s.shareBtnText}>Share</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FDF6F0',
  },

  // ── Header ────────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerBtn: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Typography.serif.italic,
    fontSize: 28,
    color: '#3D2B2B',
    lineHeight: 34,
  },

  // ── Card ──────────────────────────────────────────────────────────────────────
  cardSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  cardShadow: {
    borderRadius: 20,
    shadowColor: '#3D2B2B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  glassPanel: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
  },
  sparkle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 12,
  },
  attribution: {
    fontFamily: Typography.sans.light,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-end',
  },

  // ── Scroll ────────────────────────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionLabel: {
    fontFamily: Typography.sans.light,
    fontSize: 13,
    color: '#A08888',
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  // ── Text input ────────────────────────────────────────────────────────────────
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5B4B4',
    padding: 14,
    fontFamily: Typography.sans.regular,
    fontSize: 15,
    color: '#3D2B2B',
    minHeight: 80,
    maxHeight: 140,
    marginBottom: 20,
  },

  // ── Font toggle ───────────────────────────────────────────────────────────────
  fontRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  fontBtn: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#F5EBEB',
  },
  fontBtnActive: {
    backgroundColor: '#3D2B2B',
  },
  fontBtnText: {
    fontFamily: Typography.sans.medium,
    fontSize: 14,
    color: '#867070',
  },
  fontBtnTextActive: {
    color: '#FFFFFF',
  },

  // ── Swatches ──────────────────────────────────────────────────────────────────
  swatchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  swatchActive: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // ── Bottom bar ────────────────────────────────────────────────────────────────
  bottomBar: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(213,180,180,0.2)',
    backgroundColor: '#FDF6F0',
  },
  saveBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F5EBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 15,
    color: '#867070',
  },
  shareBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#3D2B2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },

  // ── Toast ─────────────────────────────────────────────────────────────────────
  toast: {
    position: 'absolute',
    bottom: 130,
    alignSelf: 'center',
    backgroundColor: 'rgba(61,43,43,0.88)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  toastText: {
    fontFamily: Typography.sans.medium,
    fontSize: 13,
    color: '#FFFFFF',
  },
});
