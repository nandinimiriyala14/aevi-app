import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { getSubscription, getSession, SubscriptionData } from '../services/supabase';
import { Colors, Typography, Radius, Shadows, Spacing } from '../theme';

// ── Plan catalogue ────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '€0',
    period: '',
    features: ['10 messages / day', 'Basic journaling', 'Limited insights'],
    dark: false,
  },
  {
    id: 'plus',
    name: 'Aevi Plus',
    price: '€9',
    period: '/ mo',
    badge: 'POPULAR',
    features: ['Unlimited messages', 'Persistent memory', 'Full insights & pattern mapping', 'Complete journal access'],
    dark: true,
  },
  {
    id: 'pro',
    name: 'Aevi Pro',
    price: '€19',
    period: '/ mo',
    badge: 'BEST VALUE',
    features: ['Everything in Plus', 'Priority responses', 'Advanced insights', 'Early access to new features'],
    dark: true,
  },
];

function formatDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <View style={styles.skeletonWrap}>
      <View style={[styles.skeletonCard, { height: 120, marginBottom: 24 }]} />
      <View style={[styles.skeletonCard, { height: 14, width: '35%', marginBottom: 12 }]} />
      <View style={[styles.skeletonCard, { height: 180, marginBottom: 12 }]} />
      <View style={[styles.skeletonCard, { height: 180 }]} />
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function SubscriptionManagementScreen() {
  const navigation = useNavigation<any>();
  const [sub, setSub] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadSub = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const session = await getSession();
      const data = session?.user?.id ? await getSubscription(session.user.id) : null;
      setSub(data ?? { plan: 'free' });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadSub(); }, [loadSub]));

  const currentPlan = PLANS.find((p) => p.id === (sub?.plan ?? 'free'))!;
  const isPaid = sub?.plan && sub.plan !== 'free';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={Colors.roseDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading && <Skeleton />}

      {!loading && error && (
        <View style={styles.stateWrap}>
          <View style={styles.errorOrb}>
            <Text style={styles.errorOrbText}>◉</Text>
          </View>
          <Text style={styles.stateTitle}>Couldn't load subscription</Text>
          <Text style={styles.stateSub}>Check your connection and try again.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadSub} activeOpacity={0.8}>
            <Text style={styles.retryBtnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && sub && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Current plan card */}
          {isPaid ? (
            <LinearGradient
              colors={['#5a3535', '#3d2020']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.currentPlanCard, Shadows.dark]}
            >
              <View style={styles.currentPlanTop}>
                <View>
                  <Text style={styles.currentPlanEyebrow}>CURRENT PLAN</Text>
                  <Text style={styles.currentPlanName}>{currentPlan.name}</Text>
                </View>
                <View style={styles.activeBadge}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeBadgeText}>Active</Text>
                </View>
              </View>

              {sub.trialEndsAt && (
                <View style={styles.trialBanner}>
                  <Ionicons name="time-outline" size={13} color="#d4aa70" />
                  <Text style={styles.trialText}>
                    Free trial ends {formatDate(sub.trialEndsAt)}
                  </Text>
                </View>
              )}

              <View style={styles.billingRow}>
                {sub.cancelAt ? (
                  <>
                    <Ionicons name="close-circle-outline" size={14} color="rgba(255,255,255,0.5)" />
                    <Text style={styles.billingText}>
                      Cancels {formatDate(sub.cancelAt)}
                    </Text>
                  </>
                ) : sub.renewsAt ? (
                  <>
                    <Ionicons name="refresh-outline" size={14} color="rgba(255,255,255,0.5)" />
                    <Text style={styles.billingText}>
                      Renews {formatDate(sub.renewsAt)}
                    </Text>
                  </>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.manageBillingBtn}
                onPress={() => Linking.openURL('https://billing.stripe.com/p/login')}
                activeOpacity={0.8}
              >
                <Text style={styles.manageBillingText}>Manage billing  ↗</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <View style={[styles.freePlanCard, Shadows.card]}>
              <View style={styles.currentPlanTop}>
                <View>
                  <Text style={styles.currentPlanEyebrowDark}>CURRENT PLAN</Text>
                  <Text style={styles.currentPlanNameDark}>Free</Text>
                </View>
                <View style={styles.freeBadge}>
                  <Text style={styles.freeBadgeText}>Limited</Text>
                </View>
              </View>
              <Text style={styles.freeDesc}>
                Upgrade to unlock unlimited conversations, deep insights, and persistent memory.
              </Text>
            </View>
          )}

          {/* Available plans */}
          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>
            {isPaid ? 'CHANGE PLAN' : 'UPGRADE YOUR PRACTICE'}
          </Text>

          {PLANS.filter((p) => p.id !== sub.plan).map((plan) => (
            <View key={plan.id} style={[styles.planCard, Shadows.card]}>
              <View style={styles.planTop}>
                <View style={styles.planNameRow}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {plan.badge && (
                    <View style={styles.planBadge}>
                      <Text style={styles.planBadgeText}>{plan.badge}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.planPriceRow}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  {plan.period && <Text style={styles.planPeriod}>{plan.period}</Text>}
                </View>
              </View>

              <View style={styles.planFeatures}>
                {plan.features.map((f) => (
                  <View key={f} style={styles.planFeatureRow}>
                    <Text style={styles.planFeatureCheck}>✓</Text>
                    <Text style={styles.planFeatureText}>{f}</Text>
                  </View>
                ))}
              </View>

              {plan.id !== 'free' && (
                <TouchableOpacity
                  style={styles.planBtn}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    navigation.navigate('Upgrade');
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.planBtnText}>
                    {isPaid ? `Switch to ${plan.name}` : `Upgrade to ${plan.name}`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* Secondary actions */}
          <View style={[styles.actionsCard, Shadows.card]}>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => navigation.navigate('RestorePurchases')}
              activeOpacity={0.75}
            >
              <View style={styles.actionLeft}>
                <View style={styles.actionIconWrap}>
                  <Ionicons name="refresh-outline" size={16} color={Colors.roseMid} />
                </View>
                <View>
                  <Text style={styles.actionLabel}>Restore Purchases</Text>
                  <Text style={styles.actionSub}>Recover a previous subscription</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={15} color={Colors.textLight} />
            </TouchableOpacity>

            <View style={styles.actionDivider} />

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => Linking.openURL('https://aevi-app.vercel.app')}
              activeOpacity={0.75}
            >
              <View style={styles.actionLeft}>
                <View style={styles.actionIconWrap}>
                  <Ionicons name="help-circle-outline" size={16} color={Colors.roseMid} />
                </View>
                <View>
                  <Text style={styles.actionLabel}>Billing Support</Text>
                  <Text style={styles.actionSub}>Questions about charges or refunds</Text>
                </View>
              </View>
              <Ionicons name="open-outline" size={14} color={Colors.textLight} />
            </TouchableOpacity>
          </View>

          <Text style={styles.footerNote}>
            Subscriptions auto-renew unless cancelled at least 24 hours before the renewal date.
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgWarm },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    backgroundColor: 'rgba(245,237,233,0.97)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: 4, minWidth: 44 },
  headerTitle: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 15,
    color: Colors.textDark,
  },

  content: { paddingHorizontal: Spacing.base, paddingTop: 20, paddingBottom: 60 },

  // ── Skeleton ─────────────────────────────────────────────────────────────
  skeletonWrap: { padding: Spacing.base, paddingTop: 20 },
  skeletonCard: {
    backgroundColor: 'rgba(200,160,160,0.15)',
    borderRadius: Radius.xl,
    width: '100%',
  },

  // ── Error / empty states ──────────────────────────────────────────────────
  stateWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  errorOrb: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.rosePale,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...Shadows.cardMd,
  },
  errorOrbText: { fontSize: 30, color: Colors.roseDark },
  stateTitle: {
    fontFamily: Typography.serif.semiBold,
    fontSize: 20,
    color: Colors.textDark,
    textAlign: 'center',
  },
  stateSub: {
    fontFamily: Typography.sans.regular,
    fontSize: 14,
    color: Colors.textMid,
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: Radius.xl,
    backgroundColor: Colors.roseDeep,
    ...Shadows.btn,
  },
  retryBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 14,
    color: 'white',
  },

  // ── Current plan (paid) ───────────────────────────────────────────────────
  currentPlanCard: {
    borderRadius: Radius.xl,
    padding: 20,
  },
  currentPlanTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  currentPlanEyebrow: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  currentPlanName: {
    fontFamily: Typography.serif.bold,
    fontSize: 24,
    color: 'white',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7ad49a',
  },
  activeBadgeText: {
    fontFamily: Typography.sans.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212,170,112,0.15)',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  trialText: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: '#d4aa70',
  },
  billingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  billingText: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  manageBillingBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  manageBillingText: {
    fontFamily: Typography.sans.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },

  // ── Current plan (free) ───────────────────────────────────────────────────
  freePlanCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 20,
  },
  currentPlanEyebrowDark: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 10,
    color: Colors.textLight,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  currentPlanNameDark: {
    fontFamily: Typography.serif.bold,
    fontSize: 24,
    color: Colors.textDark,
  },
  freeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Colors.rosePale,
  },
  freeBadgeText: {
    fontFamily: Typography.sans.medium,
    fontSize: 11,
    color: Colors.roseMid,
  },
  freeDesc: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: Colors.textMid,
    lineHeight: 20,
  },

  // ── Plan cards ────────────────────────────────────────────────────────────
  sectionLabel: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 10,
    color: Colors.textLight,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  planCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 18,
    marginBottom: 12,
  },
  planTop: { marginBottom: 14 },
  planNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  planName: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 16,
    color: Colors.textDark,
  },
  planBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    backgroundColor: '#fde8e8',
  },
  planBadgeText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 9,
    color: '#9a5555',
    letterSpacing: 0.8,
  },
  planPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  planPrice: {
    fontFamily: Typography.serif.bold,
    fontSize: 28,
    color: Colors.textDark,
  },
  planPeriod: {
    fontFamily: Typography.sans.regular,
    fontSize: 14,
    color: Colors.textMid,
  },
  planFeatures: { gap: 7, marginBottom: 16 },
  planFeatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },
  planFeatureCheck: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 13,
    color: Colors.roseDark,
    lineHeight: 20,
  },
  planFeatureText: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: Colors.textDark,
    flex: 1,
    lineHeight: 20,
  },
  planBtn: {
    backgroundColor: Colors.roseDeep,
    borderRadius: Radius.lg,
    paddingVertical: 13,
    alignItems: 'center',
    ...Shadows.btn,
  },
  planBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 14,
    color: 'white',
  },

  // ── Actions card ──────────────────────────────────────────────────────────
  actionsCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 64,
  },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  actionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.rosePale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: Typography.sans.medium,
    fontSize: 14,
    color: Colors.textDark,
  },
  actionSub: {
    fontFamily: Typography.sans.regular,
    fontSize: 11,
    color: Colors.textMid,
    marginTop: 1,
  },

  footerNote: {
    fontFamily: Typography.sans.regular,
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 8,
  },
});
