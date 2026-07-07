import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getJournalEntries, JournalEntry, sendMessage } from '../services/supabase';
import { Colors, Typography, Radius, Shadows, Spacing } from '../theme';

// ── Helpers ───────────────────────────────────────────────────────────────────

const dateStr = (iso: string) => iso.slice(0, 10);

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function buildWeeklyChart(entries: JournalEntry[]) {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().slice(0, 10);
    const count = entries.filter(e => dateStr(e.created_at) === ds).length;
    return { day: DAY_LETTERS[d.getDay()], count };
  });
}

function buildStats(entries: JournalEntry[]) {
  const total = entries.length;
  const dateSet = new Set(entries.map(e => dateStr(e.created_at)));
  const daysActive = dateSet.size;
  let streak = 0;
  const today = new Date();
  for (let i = 0; ; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (dateSet.has(d.toISOString().slice(0, 10))) streak++;
    else break;
  }
  return { total, daysActive, streak };
}

const formatEntryDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const wordCount = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ pulse }: { pulse: Animated.Value }) {
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  return (
    <ScrollView
      contentContainerStyle={s.content}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    >
      {[140, 100, 80].map((h, i) => (
        <Animated.View
          key={i}
          style={[s.skeletonBlock, { height: h, opacity, marginBottom: i < 2 ? 16 : 0 }]}
        />
      ))}
    </ScrollView>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function InsightsScreen() {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [entries, setEntries]         = useState<JournalEntry[]>([]);
  const [loading, setLoading]         = useState(true);
  const [insight, setInsight]         = useState('');
  const [insightLoading, setInsightLoading] = useState(false);

  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const loadEntries = useCallback(async () => {
    try {
      const data = await getJournalEntries();
      setEntries(data);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadEntries();
    }, [loadEntries])
  );

  const fetchInsight = useCallback(async (currentEntries: JournalEntry[]) => {
    if (currentEntries.length === 0) return;
    setInsightLoading(true);
    try {
      const recent = currentEntries.slice(0, 5).map(e => e.content).join('\n\n');
      const { content } = await sendMessage([{
        role: 'user',
        content: `Based on these recent journal entries, give one short warm observation about this person's emotional patterns or growth. Be specific and poetic. 2-3 sentences max.\n\n${recent}`,
      }]);
      setInsight(content);
    } catch {
      setInsight('');
    } finally {
      setInsightLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && entries.length > 0 && !insight) {
      fetchInsight(entries);
    }
  }, [loading]);

  // ── Shared header ─────────────────────────────────────────────────────────

  const Header = (
    <View style={s.header}>
      <Text style={s.title}>Insights</Text>
      <Text style={s.subtitle}>Your patterns, reflected.</Text>
    </View>
  );

  // ── Empty state ───────────────────────────────────────────────────────────

  if (!loading && entries.length === 0) {
    return (
      <View style={[s.safe, { paddingTop: top }]}>
        {Header}
        <View style={s.emptyWrap}>
          <Text style={s.emptySymbol}>◇</Text>
          <Text style={s.emptyTitle}>Nothing here yet</Text>
          <Text style={s.emptySub}>
            Start journaling to see your patterns emerge over time.
          </Text>
          <TouchableOpacity
            style={s.emptyBtn}
            onPress={() => navigation.navigate('NewEntry')}
            activeOpacity={0.85}
          >
            <Text style={s.emptyBtnText}>Start reflecting</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={[s.safe, { paddingTop: top }]}>
        {Header}
        <Skeleton pulse={pulse} />
      </View>
    );
  }

  // ── Computed data ─────────────────────────────────────────────────────────

  const chart    = buildWeeklyChart(entries);
  const maxCount = Math.max(...chart.map(d => d.count), 1);
  const stats    = buildStats(entries);
  const recent   = entries.slice(0, 3);

  return (
    <View style={[s.safe, { paddingTop: top }]}>
      {Header}

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── Weekly activity chart ─────────────────────────────────────────── */}
        <Text style={s.sectionLabel}>ACTIVITY</Text>
        <View style={[s.card, Shadows.card, { marginBottom: 12 }]}>
          <Text style={s.cardTitle}>This week</Text>
          <View style={s.chart}>
            {chart.map((d, i) => {
              const barH = d.count > 0
                ? Math.max(14, Math.round((d.count / maxCount) * 80))
                : 4;
              const barColor = d.count > 0 ? '#867070' : '#E8DADA';
              return (
                <View key={i} style={s.chartCol}>
                  <View style={s.chartBarWrap}>
                    <View style={[s.chartBar, { height: barH, backgroundColor: barColor }]} />
                  </View>
                  <Text style={s.chartLabel}>{d.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Stats row ─────────────────────────────────────────────────────── */}
        <View style={[s.statsRow, { marginBottom: 20 }]}>
          {[
            { value: stats.total,      label: 'Total reflections' },
            { value: stats.daysActive, label: 'Days active' },
            { value: stats.streak,     label: 'Current streak' },
          ].map((stat, i) => (
            <View key={i} style={[s.statCard, Shadows.card]}>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Aevi insight card ─────────────────────────────────────────────── */}
        <Text style={s.sectionLabel}>AEVI'S TAKE</Text>
        <View style={[s.insightCard, Shadows.dark, { marginBottom: 20 }]}>
          <View style={s.insightHeader}>
            <Text style={s.insightLabel}>✦ Aevi noticed</Text>
            <TouchableOpacity
              onPress={() => fetchInsight(entries)}
              disabled={insightLoading}
              activeOpacity={0.7}
            >
              <Text style={s.insightRefresh}>{insightLoading ? '…' : '↻'}</Text>
            </TouchableOpacity>
          </View>
          <View style={s.insightBody}>
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
              {insightLoading ? (
                <Text style={s.insightPlaceholder}>Reflecting…</Text>
              ) : insight ? (
                <Text style={s.insightText}>{insight}</Text>
              ) : (
                <Text style={s.insightPlaceholder}>Tap ↻ to generate an insight.</Text>
              )}
            </ScrollView>
            <LinearGradient
              colors={['rgba(61,43,43,0)', 'rgba(61,43,43,0.9)']}
              style={s.insightFade}
              pointerEvents="none"
            />
          </View>
        </View>

        {/* ── Recent reflections ────────────────────────────────────────────── */}
        <View style={s.recentHeader}>
          <Text style={[s.sectionLabel, { marginBottom: 0 }]}>RECENT REFLECTIONS</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Journal')} activeOpacity={0.7}>
            <Text style={s.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        {recent.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            style={[s.entryCard, Shadows.card]}
            onPress={() => navigation.navigate('EntryDetail', { entry })}
            activeOpacity={0.85}
          >
            <View style={s.entryMeta}>
              <Text style={s.entryDate}>{formatEntryDate(entry.created_at)}</Text>
              <Text style={s.entryWordCount}>{wordCount(entry.content)} words</Text>
            </View>
            <Text style={s.entryPreview} numberOfLines={2}>{entry.content}</Text>
            {entry.source === 'chat' && (
              <Text style={s.entrySource}>✦ From Aevi conversation</Text>
            )}
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDF6F0' },

  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(180,130,130,0.12)',
    backgroundColor: '#FDF6F0',
  },
  title: {
    fontFamily: Typography.serif.italic,
    fontSize: 28,
    color: '#3D2B2B',
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: Typography.sans.light,
    fontSize: 14,
    color: '#A08888',
  },

  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: 20,
    paddingBottom: 110,
  },

  sectionLabel: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 10,
    color: Colors.textLight,
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  // ── Skeleton ────────────────────────────────────────────────────────────────
  skeletonBlock: {
    backgroundColor: '#F5EBEB',
    borderRadius: 12,
    width: '100%',
  },

  // ── Empty state ─────────────────────────────────────────────────────────────
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 10,
  },
  emptySymbol: {
    fontSize: 40,
    color: '#D5B4B4',
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: Typography.serif.italic,
    fontSize: 22,
    color: '#3D2B2B',
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: Typography.sans.light,
    fontSize: 15,
    color: '#A08888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  emptyBtn: {
    marginTop: 4,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: Radius.xl,
    backgroundColor: '#3D2B2B',
  },
  emptyBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },

  // ── Weekly chart ────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
  },
  cardTitle: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 13,
    color: '#4D3030',
    marginBottom: 14,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  chartBarWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '65%',
  },
  chartBar: {
    borderRadius: 4,
    width: '100%',
  },
  chartLabel: {
    fontFamily: Typography.sans.regular,
    fontSize: 11,
    color: Colors.textLight,
  },

  // ── Stats row ───────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Typography.serif.regular,
    fontSize: 28,
    color: '#3D2B2B',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: Typography.sans.light,
    fontSize: 11,
    color: '#A08888',
    textAlign: 'center',
  },

  // ── Insight card ────────────────────────────────────────────────────────────
  insightCard: {
    backgroundColor: '#3D2B2B',
    borderRadius: Radius.xl,
    padding: 20,
    paddingBottom: 24,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  insightBody: {
    maxHeight: 140,
  },
  insightFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 28,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  insightLabel: {
    fontFamily: Typography.sans.light,
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.5,
  },
  insightRefresh: {
    fontFamily: Typography.sans.regular,
    fontSize: 18,
    color: 'rgba(255,255,255,0.5)',
  },
  insightText: {
    fontFamily: Typography.serif.italic,
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 28,
  },
  insightPlaceholder: {
    fontFamily: Typography.sans.light,
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    fontStyle: 'italic',
  },

  // ── Recent reflections ──────────────────────────────────────────────────────
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  seeAll: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: '#867070',
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  entryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  entryDate: {
    fontFamily: Typography.sans.medium,
    fontSize: 13,
    color: '#867070',
  },
  entryWordCount: {
    fontFamily: Typography.sans.light,
    fontSize: 12,
    color: '#A08888',
  },
  entryPreview: {
    fontFamily: Typography.serif.regular,
    fontSize: 15,
    color: '#3D2B2B',
    lineHeight: 22,
  },
  entrySource: {
    fontFamily: Typography.sans.light,
    fontSize: 12,
    color: '#C4A0A0',
    marginTop: 8,
  },
});
