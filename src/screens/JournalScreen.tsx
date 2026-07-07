import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, SectionList, TouchableOpacity,
  Modal, Pressable, Alert, StatusBar, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getJournalEntries, deleteJournalEntry, JournalEntry } from '../services/supabase';
import { Typography } from '../theme';

// ── Helpers ────────────────────────────────────────────────────────────────────

const monthKey = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

function groupByMonth(entries: JournalEntry[]) {
  const map: Record<string, JournalEntry[]> = {};
  for (const e of entries) {
    const key = monthKey(e.created_at);
    if (!map[key]) map[key] = [];
    map[key].push(e);
  }
  return Object.entries(map).map(([title, data]) => ({ title, data }));
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function JournalScreen() {
  const navigation = useNavigation<any>();
  const [entries, setEntries]     = useState<JournalEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sheetEntry, setSheetEntry] = useState<JournalEntry | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const data = await getJournalEntries();
      setEntries(data);
    } catch { /* silent */ }
    finally { setRefreshing(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleDelete = (entry: JournalEntry) => {
    setSheetEntry(null);
    Alert.alert('Delete entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await deleteJournalEntry(entry.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setEntries(prev => prev.filter(e => e.id !== entry.id));
          } catch { /* silent */ }
        },
      },
    ]);
  };

  const sections = groupByMonth(entries);

  // ── Empty state ──────────────────────────────────────────────────────────────

  if (entries.length === 0 && !refreshing) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <StatusBar barStyle="dark-content" />
        <View style={s.header}>
          <Text style={s.headerTitle}>Reflections</Text>
          <TouchableOpacity
            style={s.newBtn}
            onPress={() => navigation.navigate('NewEntry', { source: 'manual' })}
            activeOpacity={0.85}
          >
            <Text style={s.newBtnText}>✦</Text>
          </TouchableOpacity>
        </View>
        <View style={s.emptyWrap}>
          <Text style={s.emptyIcon}>◇</Text>
          <Text style={s.emptyTitle}>Your reflections live here.</Text>
          <Text style={s.emptySub}>Write your first entry and begin{'\n'}exploring your inner world.</Text>
          <TouchableOpacity
            style={s.emptyBtn}
            onPress={() => navigation.navigate('NewEntry', { source: 'manual' })}
            activeOpacity={0.85}
          >
            <Text style={s.emptyBtnText}>Write something</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── List ─────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={s.header}>
        <Text style={s.headerTitle}>Reflections</Text>
        <TouchableOpacity
          style={s.newBtn}
          onPress={() => navigation.navigate('NewEntry', { source: 'manual' })}
          activeOpacity={0.85}
        >
          <Text style={s.newBtnText}>✦</Text>
        </TouchableOpacity>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#C4A0A0" />
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text style={s.sectionHeader}>{title.toUpperCase()}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.card}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('EntryDetail', { entry: item });
            }}
            onLongPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setSheetEntry(item);
            }}
            activeOpacity={0.85}
            delayLongPress={400}
          >
            <View style={s.cardMeta}>
              <Text style={s.cardDate}>{shortDate(item.created_at)}</Text>
              <Text style={s.cardWords}>{wordCount(item.content)} words</Text>
            </View>
            <Text style={s.cardPreview} numberOfLines={2}>{item.content}</Text>
            {item.source === 'chat' && (
              <View style={s.chatTag}>
                <Text style={s.chatTagText}>✦ From Aevi conversation</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      {/* Long-press action sheet */}
      <Modal
        visible={!!sheetEntry}
        transparent
        animationType="fade"
        onRequestClose={() => setSheetEntry(null)}
      >
        <Pressable style={s.sheetOverlay} onPress={() => setSheetEntry(null)}>
          <View style={s.sheet}>
            <TouchableOpacity
              style={s.sheetItem}
              onPress={() => {
                const e = sheetEntry!;
                setSheetEntry(null);
                navigation.navigate('NewEntry', { entry: e, source: e.source });
              }}
            >
              <Ionicons name="create-outline" size={18} color="#3D2B2B" />
              <Text style={s.sheetItemText}>Edit</Text>
            </TouchableOpacity>
            <View style={s.sheetDivider} />
            <TouchableOpacity
              style={s.sheetItem}
              onPress={() => {
                const e = sheetEntry!;
                setSheetEntry(null);
                navigation.navigate('ContentCreator', {
                  messages: [{ id: 'j-' + e.id, role: 'user', content: e.content, ts: Date.now() }],
                });
              }}
            >
              <Ionicons name="sparkles-outline" size={18} color="#3D2B2B" />
              <Text style={s.sheetItemText}>Turn into content</Text>
            </TouchableOpacity>
            <View style={s.sheetDivider} />
            <TouchableOpacity
              style={s.sheetItem}
              onPress={() => sheetEntry && handleDelete(sheetEntry)}
            >
              <Ionicons name="trash-outline" size={18} color="#C05050" />
              <Text style={[s.sheetItemText, { color: '#C05050' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDF6F0' },

  // ── Header ────────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontFamily: Typography.serif.italic,
    fontSize: 28,
    color: '#3D2B2B',
    lineHeight: 34,
  },
  newBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#867070',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBtnText: {
    fontSize: 14,
    color: '#FFFFFF',
  },

  // ── List ──────────────────────────────────────────────────────────────────────
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    fontFamily: Typography.sans.light,
    fontSize: 13,
    color: '#A08888',
    letterSpacing: 2,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },

  // ── Card ──────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#3D2B2B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardDate: {
    fontFamily: Typography.sans.light,
    fontSize: 12,
    color: '#D5B4B4',
  },
  cardWords: {
    fontFamily: Typography.sans.light,
    fontSize: 12,
    color: '#D5B4B4',
  },
  cardPreview: {
    fontFamily: Typography.sans.regular,
    fontSize: 15,
    color: '#3D2B2B',
    lineHeight: 22,
  },
  chatTag: {
    marginTop: 10,
  },
  chatTagText: {
    fontFamily: Typography.sans.light,
    fontSize: 12,
    color: '#C4A0A0',
  },

  // ── Empty ─────────────────────────────────────────────────────────────────────
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 40,
    color: '#D5B4B4',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: Typography.serif.italic,
    fontSize: 24,
    color: '#3D2B2B',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySub: {
    fontFamily: Typography.sans.light,
    fontSize: 15,
    color: '#A08888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  emptyBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 26,
    backgroundColor: '#3D2B2B',
  },
  emptyBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },

  // ── Sheet ─────────────────────────────────────────────────────────────────────
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(61,43,43,0.25)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FDF6F0',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  sheetItemText: {
    fontFamily: Typography.sans.regular,
    fontSize: 16,
    color: '#3D2B2B',
  },
  sheetDivider: {
    height: 1,
    backgroundColor: 'rgba(213,180,180,0.25)',
    marginHorizontal: 8,
  },
});
