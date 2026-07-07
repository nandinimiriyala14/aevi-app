import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Alert, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { supabase } from '../services/supabase';
import { Typography, Radius, Shadows } from '../theme';

const PRICE_IDS = {
  plus: 'price_1TOKMS48Tfwr0HiZgXAB9Ken',
  pro:  'price_1TOKO848Tfwr0HiZi4fiS0tO',
} as const;

const FEATURES = [
  {
    icon: '◉',
    title: 'Infinite Reflection',
    desc: 'Unlimited entries for every moment of clarity or pause.',
  },
  {
    icon: '✦',
    title: 'Mindful Insights',
    desc: 'Gentle AI themes that surface recurring emotions in your writing.',
  },
  {
    icon: '🔒',
    title: 'Private Sanctum',
    desc: 'Biometric locks to keep your inner world completely your own.',
  },
];

export default function UpgradeScreen() {
  const navigation = useNavigation<any>();
  const [loadingPlan, setLoadingPlan] = useState<'plus' | 'pro' | null>(null);

  const handleCheckout = async (plan: 'plus' | 'pro') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoadingPlan(plan);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email;
      const userId    = session?.user?.id;

      const response = await fetch('https://aevi-backend.vercel.app/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: PRICE_IDS[plan], userId, userEmail }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const { url } = await response.json();
      if (url) await Linking.openURL(url);
    } catch {
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const busy = loadingPlan !== null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>✦</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Rose image placeholder */}
          <View style={styles.imageCircleWrap}>
            <LinearGradient
              colors={['#ddb8b8', '#b08888']}
              style={styles.imageCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.imageCircleIcon}>🌸</Text>
            </LinearGradient>
          </View>

          {/* Headline */}
          <View style={styles.headline}>
            <Text style={styles.headlineTitle}>Grow with yourself,{'\n'}deeply</Text>
            <Text style={styles.headlineSub}>
              A sanctuary for your thoughts, designed to help you rediscover the quiet spaces within.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.features}>
            {FEATURES.map(feat => (
              <View key={feat.title} style={[styles.featureCard, Shadows.card]}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>{feat.icon}</Text>
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feat.title}</Text>
                  <Text style={styles.featureDesc}>{feat.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Pricing */}
          <View style={styles.pricing}>
            <View style={styles.pricingBadgeWrap}>
              <View style={styles.pricingBadge}>
                <Text style={styles.pricingBadgeText}>PLUS PLAN</Text>
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>€9</Text>
              <Text style={styles.pricePeriod}> / month</Text>
            </View>
            <Text style={styles.priceBilled}>Unlimited messages, memory &amp; insights</Text>
          </View>

          {/* Start Plus CTA */}
          <TouchableOpacity
            onPress={() => handleCheckout('plus')}
            activeOpacity={0.85}
            disabled={busy}
            style={styles.ctaBtn}
          >
            <LinearGradient
              colors={['#5a3535', '#3d2020']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaBtnGrad}
            >
              {loadingPlan === 'plus' ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.ctaBtnText}>Start Plus — €9/month</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Get Pro secondary */}
          <TouchableOpacity
            style={[styles.secondaryBtn, busy && styles.btnDisabled]}
            onPress={() => handleCheckout('pro')}
            activeOpacity={0.85}
            disabled={busy}
          >
            {loadingPlan === 'pro' ? (
              <ActivityIndicator color="#5a3535" size="small" />
            ) : (
              <Text style={styles.secondaryBtnText}>Get Pro — €19/month</Text>
            )}
          </TouchableOpacity>

          {/* Quote */}
          <Text style={styles.quote}>
            "Investing in your own growth is the most meaningful journey you'll ever take."
          </Text>

          {/* Footer links */}
          <View style={styles.footerLinks}>
            {[
              { label: 'Privacy Policy', url: 'https://www.myaevi.app/privacy.html' },
              { label: 'Terms of Use', url: 'https://www.myaevi.app/terms.html' },
            ].map(({ label, url }) => (
              <TouchableOpacity key={label} onPress={() => Linking.openURL(url)}>
                <Text style={styles.footerLink}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.footerNote}>
            Cancel anytime in your App Store settings. Subscription auto-renews unless turned off at least 24 hours before the period ends.
          </Text>

          {/* Restore purchases */}
          <TouchableOpacity
            style={styles.restoreBtn}
            onPress={() => navigation.navigate('RestorePurchases')}
            activeOpacity={0.7}
          >
            <Text style={styles.restoreBtnText}>Restore purchases</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5ede9' },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(245,237,233,0.97)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(180,130,130,0.12)',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center', justifyContent: 'center',
  },
  backBtnText: { fontSize: 17, color: '#5a3535' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#9a6868',
    alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 13, color: 'white' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  imageCircleWrap: { alignItems: 'center', paddingTop: 32, paddingBottom: 24 },
  imageCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.cardMd,
  },
  imageCircleIcon: { fontSize: 36 },
  headline: { paddingHorizontal: 12, alignItems: 'center', marginBottom: 32 },
  headlineTitle: {
    fontFamily: Typography.serif.bold,
    fontSize: 28,
    color: '#2d1818',
    lineHeight: 35,
    marginBottom: 12,
    textAlign: 'center',
  },
  headlineSub: {
    fontFamily: Typography.sans.regular,
    fontSize: 14,
    color: '#8a6a6a',
    lineHeight: 22.4,
    textAlign: 'center',
  },
  features: { gap: 12, marginBottom: 32 },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: Radius.xl,
    padding: 16,
  },
  featureIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#f0e5e3',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  featureIconText: { fontSize: 18, color: '#9a7878' },
  featureText: { flex: 1 },
  featureTitle: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 15,
    color: '#2d1818',
    marginBottom: 3,
  },
  featureDesc: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: '#8a6a6a',
    lineHeight: 19.5,
  },
  pricing: { alignItems: 'center', marginBottom: 20 },
  pricingBadgeWrap: { marginBottom: 16 },
  pricingBadge: {
    paddingHorizontal: 16, paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: '#e8d5d2',
  },
  pricingBadgeText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 11,
    color: '#7a5050',
    letterSpacing: 1,
  },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
  price: {
    fontFamily: Typography.serif.bold,
    fontSize: 42,
    color: '#2d1818',
  },
  pricePeriod: {
    fontFamily: Typography.sans.regular,
    fontSize: 16,
    color: '#9a7878',
  },
  priceBilled: {
    fontFamily: Typography.sans.regular,
    fontSize: 12,
    color: '#b09090',
  },
  ctaBtn: { marginBottom: 12 },
  ctaBtnGrad: {
    height: 56,
    borderRadius: Radius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.btn,
  },
  ctaBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 16,
    color: 'white',
  },
  secondaryBtn: {
    height: 56,
    borderRadius: Radius['2xl'],
    borderWidth: 1.5,
    borderColor: 'rgba(160,110,110,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: 20,
  },
  btnDisabled: { opacity: 0.5 },
  secondaryBtnText: {
    fontFamily: Typography.sans.medium,
    fontSize: 15,
    color: '#5a3535',
  },
  quote: {
    fontFamily: Typography.sans.regular,
    fontSize: 12,
    color: '#9a7878',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 19.2,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 10,
  },
  footerLink: {
    fontFamily: Typography.sans.regular,
    fontSize: 11,
    color: '#b09090',
    textDecorationLine: 'underline',
  },
  footerNote: {
    fontFamily: Typography.sans.regular,
    fontSize: 10,
    color: '#c0a0a0',
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 16,
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  restoreBtnText: {
    fontFamily: Typography.sans.light,
    fontSize: 14,
    color: '#A08888',
  },
});
