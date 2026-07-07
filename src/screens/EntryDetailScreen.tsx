import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, Pressable, Alert, StatusBar, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { deleteJournalEntry, JournalEntry } from '../services/supabase';
import { Typography } from '../theme';
import TextActionSheet from '../components/TextActionSheet';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

export default function EntryDetailScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();
  const entry: JournalEntry = route.params.entry;

  const [menuVisible,     setMenuVisible]     = useState(false);
  const [selectedText,    setSelectedText]    = useState('');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [toast,           setToast]           = useState('');
  const toastAnim = useRef(new Animated.Value(0)).current;

  const showToast = (msg: string) => {
    setToast(msg);
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setToast(''));
  };

  const handleSheetAction = async (action: string, text: string) => {
    if (action === 'content') {
      navigation.navigate('ContentCreator', {
        messages: [{ id: 'ed-sel-' + Date.now(), role: 'user', content: text, ts: Date.now() }],
      });
    } else if (action === 'copy') {
      await Clipboard.setStringAsync(text);
      showToast('Copied ✦');
    }
  };

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert('Delete entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await deleteJournalEntry(entry.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.goBack();
          } catch { /* silent */ }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#3D2B2B" />
        </TouchableOpacity>

        <Text style={s.headerDate} numberOfLines={1}>{formatDate(entry.created_at)}</Text>

        <TouchableOpacity
          style={s.headerBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setMenuVisible(true);
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#3D2B2B" />
        </TouchableOpacity>
      </View>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {entry.source === 'chat' && (
          <View style={s.sourceTag}>
            <Text style={s.sourceTagText}>✦ From Aevi conversation</Text>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={1}
          delayLongPress={400}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setSelectedText(entry.content);
            setShowActionSheet(true);
          }}
        >
          <Text selectable style={s.body}>{entry.content}</Text>
        </TouchableOpacity>

        {entry.aevi_reflection ? (
          <View style={s.reflectionCard}>
            <Text style={s.reflectionLabel}>✦ Aevi's reflection</Text>
            <Text style={s.reflectionText}>{entry.aevi_reflection}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* ── Three-dot menu modal ───────────────────────────────────────────── */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={s.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={s.menu}>
            <TouchableOpacity
              style={s.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('NewEntry', { entry, source: entry.source });
              }}
            >
              <Ionicons name="create-outline" size={18} color="#3D2B2B" />
              <Text style={s.menuItemText}>Edit</Text>
            </TouchableOpacity>
            <View style={s.menuDivider} />
            <TouchableOpacity
              style={s.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('ContentCreator', {
                  messages: [{ id: 'ed-' + entry.id, role: 'user', content: entry.content, ts: Date.now() }],
                });
              }}
            >
              <Ionicons name="sparkles-outline" size={18} color="#3D2B2B" />
              <Text style={s.menuItemText}>Turn into content</Text>
            </TouchableOpacity>
            <View style={s.menuDivider} />
            <TouchableOpacity style={s.menuItem} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={18} color="#C05050" />
              <Text style={[s.menuItemText, { color: '#C05050' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <TextActionSheet
        selectedText={selectedText}
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        onAction={handleSheetAction}
        showChatActions={false}
      />

      {toast ? (
        <Animated.View style={[s.toast, { opacity: toastAnim }]} pointerEvents="none">
          <Text style={s.toastText}>{toast}</Text>
        </Animated.View>
      ) : null}
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
    paddingVertical: 10,
  },
  headerBtn: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDate: {
    fontFamily: Typography.serif.italic,
    fontSize: 16,
    color: '#3D2B2B',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 4,
  },

  // ── Content ───────────────────────────────────────────────────────────────────
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 48,
  },
  sourceTag: {
    marginBottom: 16,
  },
  sourceTagText: {
    fontFamily: Typography.sans.light,
    fontSize: 13,
    color: '#C4A0A0',
  },
  body: {
    fontFamily: Typography.serif.regular,
    fontSize: 18,
    color: '#3D2B2B',
    lineHeight: 32,
  },

  // ── Reflection card ───────────────────────────────────────────────────────────
  reflectionCard: {
    backgroundColor: '#F5EBEB',
    borderRadius: 16,
    padding: 16,
    marginTop: 28,
  },
  reflectionLabel: {
    fontFamily: Typography.sans.light,
    fontSize: 12,
    color: '#A08888',
    marginBottom: 8,
  },
  reflectionText: {
    fontFamily: Typography.sans.light,
    fontSize: 15,
    color: '#5C4040',
    lineHeight: 24,
    fontStyle: 'italic',
  },

  // ── Menu ──────────────────────────────────────────────────────────────────────
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(61,43,43,0.2)',
  },
  menu: {
    position: 'absolute',
    top: 56,
    right: 16,
    backgroundColor: '#FDF6F0',
    borderRadius: 16,
    paddingVertical: 4,
    shadowColor: '#3D2B2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 180,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontFamily: Typography.sans.regular,
    fontSize: 15,
    color: '#3D2B2B',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(213,180,180,0.25)',
    marginHorizontal: 12,
  },

  // ── Toast ──────────────────────────────────────────────────────────────────────
  toast: {
    position: 'absolute',
    bottom: 40,
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
