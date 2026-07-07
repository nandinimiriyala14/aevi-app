import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Typography, Radius, Shadows } from '../theme';

const GOALS = [
  {
    id: 'reflect',
    label: 'Self-reflection',
    sub: 'Process thoughts and understand myself',
    icon: '◎',
  },
  {
    id: 'decide',
    label: 'Better decisions',
    sub: 'Think through choices with clarity',
    icon: '⊙',
  },
  {
    id: 'create',
    label: 'Creative writing',
    sub: 'Turn raw ideas into polished content',
    icon: '✦',
  },
  {
    id: 'journal',
    label: 'Daily journaling',
    sub: 'Build a consistent reflection habit',
    icon: '◇',
  },
];

export default function OnboardingGoalScreen() {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState('reflect');

  const handleSelect = (id: string) => {
    Haptics.selectionAsync();
    setSelected(id);
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
            <Text style={styles.title}>What brings{'\n'}you here?</Text>
            <Text style={styles.subtitle}>I'll shape how I think around your goal.</Text>
          </View>

          {/* Goal options */}
          <View style={styles.goals}>
            {GOALS.map((g) => {
              const isSelected = selected === g.id;
              return (
                <TouchableOpacity
                  key={g.id}
                  onPress={() => handleSelect(g.id)}
                  style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                  activeOpacity={0.85}
                >
                  <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                    <Text style={[styles.icon, isSelected && styles.iconSelected]}>{g.icon}</Text>
                  </View>
                  <View style={styles.goalText}>
                    <Text style={styles.goalLabel}>{g.label}</Text>
                    <Text style={styles.goalSub}>{g.sub}</Text>
                  </View>
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            {/* Progress dots */}
            <View style={styles.dots}>
              <View style={styles.dotActive} />
              <View style={styles.dot} />
            </View>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.navigate('OnboardingVoice', { goal: selected });
              }}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#8a6060', '#6a4040']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextBtn}
              >
                <Text style={styles.nextBtnText}>Next  →</Text>
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
  goals: { gap: 12 },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.card,
  },
  goalCardSelected: {
    borderColor: '#7a5555',
    ...Shadows.cardMd,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#f5eeec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    backgroundColor: '#7a5555',
  },
  icon: { fontSize: 20, color: '#9a7878' },
  iconSelected: { color: '#ffffff' },
  goalText: { flex: 1 },
  goalLabel: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 15,
    color: '#2d1818',
    marginBottom: 2,
  },
  goalSub: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: '#9a7878',
    lineHeight: 18,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#d4b0b0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  radioSelected: { borderColor: '#7a5555' },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7a5555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
  },
  dots: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dotActive: {
    width: 28,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7a5555',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(180,130,130,0.4)',
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
