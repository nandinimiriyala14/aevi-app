import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { getSession, getMemories, signOut } from '../services/supabase';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme';

const PROMPTS = [
  { q: "What's weighing on your mind?", featured: true, icon: '◉' },
  { q: "Any decisions to think through?", featured: false, icon: '◎' },
  { q: "A feeling to explore?", featured: false, icon: '◇' },
];

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [memories, setMemories] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Stagger animations
  const anims = useRef(Array.from({ length: 6 }, () => new Animated.Value(0))).current;

  const hour = new Date().getHours();
  const greet = hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const todayIdx = (new Date().getDay() + 6) % 7;

  useEffect(() => {
    loadData();
    Animated.stagger(80, anims.map(a =>
      Animated.spring(a, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true })
    )).start();
  }, []);

  const loadData = async () => {
    const session = await getSession();
    if (session?.user) {
      const n = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Friend';
      setName(n);
    }
    const mems = await getMemories();
    setMemories(mems);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const animStyle = (i: number) => ({
    opacity: anims[i],
    transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <Animated.View style={[styles.header, animStyle(0)]}>
        <View>
          <Text style={styles.greet}>{greet}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); navigation.navigate('Upgrade'); }}
          style={styles.freeBadge}
        >
          <Text style={styles.freeBadgeText}>✦  Free plan</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.rose} />}
      >
        {/* Memory card */}
        {memories.length > 0 && (
          <Animated.View style={[styles.memoryCard, animStyle(1)]}>
            <View style={styles.memoryAccent} />
            <Text style={styles.memoryLabel}>✦  AEVI REMEMBERS</Text>
            <Text style={styles.memoryQuote}>"{memories[memories.length - 1].value}"</Text>
            <View style={styles.memoryTag}>
              <Text style={styles.memoryTagText}>from your last session</Text>
            </View>
          </Animated.View>
        )}

        {/* Start here */}
        <Animated.View style={animStyle(2)}>
          <Text style={styles.sectionLbl}>START HERE</Text>

          {PROMPTS.map((prompt, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); navigation.navigate('Chat'); }}
              style={[styles.promptCard, prompt.featured && styles.promptCardFeatured]}
              activeOpacity={0.85}
            >
              <View style={styles.promptIcon}>
                <Text style={styles.promptIconText}>{prompt.icon}</Text>
              </View>
              <Text style={[styles.promptText, prompt.featured && styles.promptTextFeatured]}>{prompt.q}</Text>
              <Text style={styles.promptExplore}>Explore →</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Stats */}
        <Animated.View style={animStyle(3)}>
          <Text style={styles.sectionLbl}>YOUR PROGRESS</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{memories.length}</Text>
              <Text style={styles.statLabel}>Memories</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>1</Text>
              <Text style={styles.statLabel}>Days active</Text>
            </View>
          </View>
        </Animated.View>

        {/* Streak */}
        <Animated.View style={[styles.streakCard, animStyle(4)]}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakTitle}>Reflection streak</Text>
            <View style={styles.streakBadge}>
              <Text style={styles.streakBadgeText}>Keep going</Text>
            </View>
          </View>
          <View style={styles.daysRow}>
            {DAYS.map((d, i) => (
              <View key={i} style={styles.dayCol}>
                <View style={[styles.dayBox, i === todayIdx && styles.dayBoxActive]}>
                  {i === todayIdx && <Text style={styles.dayBoxText}>{d}</Text>}
                </View>
                {i !== todayIdx && <Text style={styles.dayLabel}>{d}</Text>}
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.screenH,
    paddingTop: 16,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  greet: { fontFamily: Typography.sans.light, fontSize: 13, color: Colors.roseMid, marginBottom: 3 },
  name: { fontFamily: Typography.serif.semiBoldItalic, fontSize: 36, color: Colors.textDark },
  freeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    backgroundColor: Colors.rosePale,
    borderWidth: 1,
    borderColor: Colors.roseBlush,
  },
  freeBadgeText: { fontFamily: Typography.sans.semiBold, fontSize: 11, color: Colors.roseMid },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.screenH, paddingBottom: 110 },
  memoryCard: {
    backgroundColor: Colors.roseDeep,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    ...Shadows.dark,
  },
  memoryAccent: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: 'rgba(213,180,180,0.5)',
  },
  memoryLabel: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 10,
    color: 'rgba(213,180,180,0.7)',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  memoryQuote: {
    fontFamily: Typography.serif.italic,
    fontSize: 18,
    color: Colors.textOnDark,
    lineHeight: 28,
    marginBottom: 12,
  },
  memoryTag: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(213,180,180,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(213,180,180,0.15)',
  },
  memoryTagText: {
    fontFamily: Typography.sans.regular,
    fontSize: 10,
    color: 'rgba(213,180,180,0.7)',
  },
  sectionLbl: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 11,
    color: Colors.roseLight,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  promptCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: 10,
    ...Shadows.card,
  },
  promptCardFeatured: { padding: Spacing.xl },
  promptIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.rosePale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  promptIconText: { fontSize: 14, color: Colors.roseDark },
  promptText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 20,
    marginBottom: 6,
  },
  promptTextFeatured: { fontSize: 15 },
  promptExplore: {
    fontFamily: Typography.sans.medium,
    fontSize: 12,
    color: Colors.roseMid,
  },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.xl },
  statCard: {
    flex: 1,
    backgroundColor: Colors.rosePale,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.roseBlush,
  },
  statNum: {
    fontFamily: Typography.serif.semiBold,
    fontSize: 48,
    color: Colors.textDark,
    lineHeight: 52,
  },
  statLabel: {
    fontFamily: Typography.sans.regular,
    fontSize: 12,
    color: Colors.roseMid,
    marginTop: 4,
  },
  streakCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  streakTitle: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 14,
    color: Colors.textDark,
  },
  streakBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Colors.rosePale,
  },
  streakBadgeText: {
    fontFamily: Typography.sans.medium,
    fontSize: 10,
    color: Colors.roseDark,
  },
  daysRow: { flexDirection: 'row', gap: 6 },
  dayCol: { flex: 1, alignItems: 'center', gap: 5 },
  dayBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(213,180,180,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBoxActive: { backgroundColor: Colors.roseDeep },
  dayBoxText: { fontFamily: Typography.sans.bold, fontSize: 10, color: Colors.textOnDark },
  dayLabel: { fontFamily: Typography.sans.regular, fontSize: 10, color: Colors.roseLight },
});