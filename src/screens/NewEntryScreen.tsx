import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { createJournalEntry, updateJournalEntry, sendMessage, JournalEntry } from '../services/supabase';
import { Typography } from '../theme';

const todayLabel = () =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

export default function NewEntryScreen() {
  const navigation = useNavigation<any>();
  const route      = useRoute<any>();

  const existingEntry: JournalEntry | undefined = route.params?.entry;
  const initialContent: string                  = route.params?.initialContent ?? existingEntry?.content ?? '';
  const source: 'manual' | 'chat'               = route.params?.source ?? existingEntry?.source ?? 'manual';

  const [content, setContent]         = useState(initialContent);
  const [reflection, setReflection]   = useState(existingEntry?.aevi_reflection ?? '');
  const [askingAevi, setAskingAevi]   = useState(false);
  const [saving, setSaving]           = useState(false);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSave = async () => {
    if (!content.trim() || saving) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(true);
    try {
      if (existingEntry) {
        await updateJournalEntry(existingEntry.id, {
          content: content.trim(),
          source,
          aevi_reflection: reflection || null,
        });
      } else {
        await createJournalEntry({
          content: content.trim(),
          source,
          ...(reflection ? { aevi_reflection: reflection } : {}),
        });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch {
      setSaving(false);
    }
  };

  const handleAskAevi = async () => {
    if (!content.trim() || askingAevi) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAskingAevi(true);
    try {
      const res = await sendMessage([
        {
          role: 'user',
          content: `I'm writing a journal entry. Here's what I wrote:\n\n"${content.trim()}"\n\nPlease offer a gentle, empathetic reflection on this — 2–3 sentences.`,
        },
      ]);
      setReflection(res.reply ?? res.content ?? '');
    } catch {
      /* silent */
    } finally {
      setAskingAevi(false);
    }
  };

  const canSave = content.trim().length > 0 && !saving;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={s.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
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

          <Text style={s.headerDate}>{todayLabel()}</Text>

          <TouchableOpacity
            style={[s.saveBtn, !canSave && s.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!canSave}
            activeOpacity={0.85}
          >
            {saving
              ? <ActivityIndicator size="small" color="#867070" />
              : <Text style={s.saveBtnText}>Save</Text>
            }
          </TouchableOpacity>
        </View>

        {/* ── Body ───────────────────────────────────────────────────────────── */}
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TextInput
            ref={inputRef}
            style={s.input}
            value={content}
            onChangeText={setContent}
            placeholder="Begin writing..."
            placeholderTextColor="#D5B4B4"
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
          />

          {/* Aevi reflection card */}
          {(reflection || askingAevi) && (
            <View style={s.reflectionCard}>
              <Text style={s.reflectionLabel}>✦ Aevi's reflection</Text>
              {askingAevi
                ? <ActivityIndicator size="small" color="#C4A0A0" style={{ marginTop: 8 }} />
                : <Text style={s.reflectionText}>{reflection}</Text>
              }
            </View>
          )}
        </ScrollView>

        {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
        <View style={s.bottomBar}>
          <TouchableOpacity style={s.bottomIconBtn} disabled activeOpacity={0.4}>
            <Ionicons name="camera-outline" size={22} color="#D5B4B4" />
          </TouchableOpacity>

          <TouchableOpacity
            style={s.aeviBtn}
            onPress={handleAskAevi}
            disabled={askingAevi || !content.trim()}
            activeOpacity={0.85}
          >
            {askingAevi
              ? <ActivityIndicator size="small" color="#867070" />
              : <Text style={s.aeviBtnText}>✦  Ask Aevi</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={s.contentBtn}
            onPress={() => {
              if (!content.trim()) return;
              navigation.navigate('ContentCreator', {
                messages: [{ id: 'ne-' + Date.now(), role: 'user', content: content.trim(), ts: Date.now() }],
              });
            }}
            activeOpacity={0.85}
          >
            <Text style={s.contentBtnText}>Turn into content</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDF6F0' },
  kav:  { flex: 1 },

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
    fontFamily: Typography.sans.light,
    fontSize: 14,
    color: '#A08888',
    flex: 1,
    textAlign: 'center',
  },
  saveBtn: {
    width: 56,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 15,
    color: '#867070',
  },

  // ── Writing area ──────────────────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  input: {
    fontFamily: Typography.serif.italic,
    fontSize: 20,
    color: '#3D2B2B',
    lineHeight: 32,
    minHeight: 300,
    padding: 0,
  },

  // ── Aevi reflection card ──────────────────────────────────────────────────────
  reflectionCard: {
    backgroundColor: '#F5EBEB',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
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

  // ── Bottom bar ────────────────────────────────────────────────────────────────
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(213,180,180,0.2)',
    backgroundColor: '#FDF6F0',
  },
  bottomIconBtn: {
    padding: 6,
  },
  aeviBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5EBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aeviBtnText: {
    fontFamily: Typography.sans.medium,
    fontSize: 14,
    color: '#867070',
  },
  contentBtn: {
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    backgroundColor: '#3D2B2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentBtnText: {
    fontFamily: Typography.sans.medium,
    fontSize: 14,
    color: '#FFFFFF',
  },
});
