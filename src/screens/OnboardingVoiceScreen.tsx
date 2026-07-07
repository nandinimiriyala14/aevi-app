import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Typography, Radius, Shadows } from '../theme';

const TONES = [
  { id: 'warm', label: 'Warm & gentle' },
  { id: 'direct', label: 'Direct & honest' },
  { id: 'curious', label: 'Curious & deep' },
  { id: 'calm', label: 'Calm & grounding' },
];

const TOPICS = [
  'Work & career', 'Relationships', 'Creativity', 'Health',
  'Purpose', 'Decisions', 'Emotions', 'Ideas', 'Growth', 'Writing',
];

export default function OnboardingVoiceScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [tone, setTone] = useState('warm');
  const [topics, setTopics] = useState<string[]>(['Work & career', 'Creativity', 'Purpose']);

  const toggleTopic = (t: string) => {
    Haptics.selectionAsync();
    setTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const handleDone = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const user = { goal: route.params?.goal || 'reflect', tone, topics };
    await AsyncStorage.setItem('aevi_user_prefs', JSON.stringify(user));
    navigation.navigate('MeetAevi', { ...user });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Header card */}
          <View style={[styles.headerCard, Shadows.card]}>
            <Text style={styles.title}>Shape{'\n'}my voice</Text>
            <Text style={styles.subtitle}>How should I sound when I talk to you?</Text>
          </View>

          {/* Tone grid */}
          <View style={styles.toneGrid}>
            {TONES.map((t) => {
              const sel = tone === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => { Haptics.selectionAsync(); setTone(t.id); }}
                  activeOpacity={0.85}
                >
                  {sel ? (
                    <LinearGradient
                      colors={['#8a6060', '#6a4040']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.toneCard}
                    >
                      <Text style={[styles.toneText, styles.toneTextSelected]}>{t.label}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.toneCard, styles.toneCardIdle]}>
                      <Text style={styles.toneText}>{t.label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Topics */}
          <Text style={styles.topicsLabel}>Topics you'd like to explore</Text>
          <View style={styles.topicsWrap}>
            {TOPICS.map((t) => {
              const sel = topics.includes(t);
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => toggleTopic(t)}
                  activeOpacity={0.85}
                >
                  {sel ? (
                    <LinearGradient
                      colors={['#8a6060', '#6a4040']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.topicPill}
                    >
                      <Text style={[styles.topicText, styles.topicTextSelected]}>{t}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.topicPill, styles.topicPillIdle]}>
                      <Text style={styles.topicText}>{t}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.dots}>
              <View style={styles.dot} />
              <View style={styles.dotActive} />
            </View>

            <TouchableOpacity onPress={handleDone} activeOpacity={0.85}>
              <LinearGradient
                colors={['#8a6060', '#6a4040']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextBtn}
              >
                <Text style={styles.nextBtnText}>Meet Aevi  →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0dbd9' },
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  backArrow: { fontSize: 17, color: '#5a3535' },
  headerCard: {
    borderRadius: Radius['2xl'],
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  title: {
    fontFamily: Typography.serif.bold,
    fontSize: 34,
    color: '#2d1818',
    lineHeight: 41,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: Typography.sans.regular,
    fontSize: 14,
    color: '#9a7878',
  },
  toneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  toneCard: {
    width: 155,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: Radius.xl,
    alignItems: 'center',
  },
  toneCardIdle: {
    backgroundColor: '#ffffff',
    ...Shadows.card,
  },
  toneText: {
    fontFamily: Typography.sans.medium,
    fontSize: 14,
    color: '#2d1818',
    textAlign: 'center',
  },
  toneTextSelected: { color: '#ffffff' },
  topicsLabel: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 15,
    color: '#2d1818',
    marginBottom: 14,
  },
  topicsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  topicPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  topicPillIdle: {
    backgroundColor: '#ffffff',
    ...Shadows.card,
  },
  topicText: {
    fontFamily: Typography.sans.medium,
    fontSize: 13,
    color: '#4d3030',
  },
  topicTextSelected: { color: '#ffffff' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dots: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(180,130,130,0.4)',
  },
  dotActive: {
    width: 28,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7a5555',
  },
  nextBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: Radius.xl,
    ...Shadows.btn,
  },
  nextBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 15,
    color: '#ffffff',
  },
});
