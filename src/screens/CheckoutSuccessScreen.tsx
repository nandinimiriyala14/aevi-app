import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Radius, Shadows, Spacing } from '../theme';

const UNLOCKED = [
  { icon: '◉', label: 'Unlimited conversations with Aevi' },
  { icon: '✦', label: 'Deep emotional insights & pattern mapping' },
  { icon: '◈', label: 'Persistent memory across every session' },
];

export default function CheckoutSuccessScreen() {
  const navigation = useNavigation<any>();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 500, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <LinearGradient
      colors={['#2d1818', '#3d2020', '#4a2828']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.4, y: 1 }}
      style={styles.gradient}
    >
      <StatusBar barStyle="light-content" />

      {/* Ambient rings */}
      <View style={[styles.ring, styles.ring1]} />
      <View style={[styles.ring, styles.ring2]} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>

          {/* Success orb */}
          <Animated.View style={[styles.orbWrap, { opacity: fade, transform: [{ scale }] }]}>
            <View style={styles.orbOuter}>
              <View style={styles.orb}>
                <Text style={styles.orbCheck}>✓</Text>
              </View>
            </View>
          </Animated.View>

          {/* Text */}
          <Animated.View style={[styles.textBlock, { opacity: fade, transform: [{ translateY: slideUp }] }]}>
            <Text style={styles.eyebrow}>PREMIUM UNLOCKED</Text>
            <Text style={styles.title}>You're all set.</Text>
            <Text style={styles.subtitle}>
              Your journey with Aevi deepens from here. Everything you needed, waiting quietly for you.
            </Text>
          </Animated.View>

          {/* Unlocked features */}
          <Animated.View style={[styles.featureList, { opacity: fade, transform: [{ translateY: slideUp }] }]}>
            {UNLOCKED.map((item) => (
              <View key={item.icon} style={styles.featureRow}>
                <View style={styles.featureIconWrap}>
                  <Text style={styles.featureIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.featureLabel}>{item.label}</Text>
              </View>
            ))}
          </Animated.View>

          {/* Actions */}
          <Animated.View style={[styles.actions, { opacity: fade }]}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleContinue}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#8a6060', '#6a4040']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryBtnGrad}
              >
                <Text style={styles.primaryBtnText}>Begin your journey  →</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ghostBtn}
              onPress={() => navigation.navigate('SubscriptionManagement')}
              activeOpacity={0.7}
            >
              <Text style={styles.ghostBtnText}>Manage subscription</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },

  // ── Ambient rings ──────────────────────────────────────────────────────────
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(200,160,140,0.08)',
  },
  ring1: { width: 360, height: 360, top: -60, right: -80 },
  ring2: { width: 240, height: 240, bottom: 40, left: -60 },

  // ── Orb ───────────────────────────────────────────────────────────────────
  orbWrap: { marginBottom: 32 },
  orbOuter: {
    width: 110,
    height: 110,
    borderRadius: 35,
    backgroundColor: 'rgba(200,160,100,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(200,160,100,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.orb,
  },
  orb: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: 'rgba(200,160,100,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbCheck: {
    fontSize: 36,
    color: '#d4aa70',
  },

  // ── Text ──────────────────────────────────────────────────────────────────
  textBlock: { alignItems: 'center', marginBottom: 28 },
  eyebrow: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 10,
    color: 'rgba(212,170,112,0.8)',
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    fontFamily: Typography.serif.boldItalic,
    fontSize: 36,
    color: 'white',
    marginBottom: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Typography.sans.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Unlocked features ─────────────────────────────────────────────────────
  featureList: {
    alignSelf: 'stretch',
    gap: 10,
    marginBottom: 36,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  featureIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: 'rgba(212,170,112,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: { fontSize: 14, color: '#d4aa70' },
  featureLabel: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    flex: 1,
    lineHeight: 19,
  },

  // ── Actions ───────────────────────────────────────────────────────────────
  actions: { alignSelf: 'stretch', gap: 12 },
  primaryBtn: { borderRadius: Radius['2xl'], overflow: 'hidden', ...Shadows.btn },
  primaryBtnGrad: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 16,
    color: 'white',
    letterSpacing: 0.3,
  },
  ghostBtn: {
    height: 52,
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtnText: {
    fontFamily: Typography.sans.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
});
