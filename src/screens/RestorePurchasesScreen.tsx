import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { restorePurchases } from '../services/supabase';
import { Colors, Typography, Radius, Shadows, Spacing } from '../theme';

type State = 'idle' | 'loading' | 'success' | 'not_found' | 'error';

const PLAN_LABELS: Record<string, string> = {
  plus: 'Aevi Plus',
  pro: 'Aevi Pro',
};

export default function RestorePurchasesScreen() {
  const navigation = useNavigation<any>();
  const [state, setState] = useState<State>('idle');
  const [restoredPlan, setRestoredPlan] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRestore = async () => {
    setState('loading');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const result = await restorePurchases();
      if (result.restored && result.plan) {
        setRestoredPlan(PLAN_LABELS[result.plan] || result.plan);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setState('success');
      } else {
        setState('not_found');
      }
    } catch (e: any) {
      setErrorMsg("Couldn't restore purchases. Check your connection and try again.");
      setState('error');
    }
  };

  const reset = () => {
    setState('idle');
    setErrorMsg('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={Colors.roseDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restore Purchases</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Success state */}
        {state === 'success' && (
          <View style={styles.successCard}>
            <View style={styles.successOrb}>
              <Text style={styles.successOrbText}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Subscription restored</Text>
            <Text style={styles.successSub}>
              Your <Text style={styles.successPlan}>{restoredPlan}</Text> subscription is now active.
            </Text>
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
              activeOpacity={0.85}
            >
              <Text style={styles.continueBtnText}>Continue to app</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Not found state */}
        {state === 'not_found' && (
          <>
            <View style={styles.notFoundCard}>
              <View style={[styles.successOrb, styles.notFoundOrb]}>
                <Text style={styles.notFoundOrbText}>◉</Text>
              </View>
              <Text style={styles.notFoundTitle}>No purchases found</Text>
              <Text style={styles.notFoundSub}>
                We couldn't find an active subscription linked to your account. If you believe this is an error, contact support.
              </Text>
            </View>
            <TouchableOpacity style={styles.retryBtn} onPress={reset} activeOpacity={0.8}>
              <Text style={styles.retryBtnText}>Try again</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Idle / error state */}
        {(state === 'idle' || state === 'error') && (
          <>
            {/* Info card */}
            <View style={[styles.infoCard, Shadows.card]}>
              <View style={styles.infoIconWrap}>
                <Text style={styles.infoIcon}>◈</Text>
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>What does this do?</Text>
                <Text style={styles.infoBody}>
                  If you previously subscribed to Aevi Premium on this account, tapping Restore will re-activate your subscription without charging you again.
                </Text>
              </View>
            </View>

            {/* When to use */}
            <Text style={styles.sectionLabel}>WHEN TO USE THIS</Text>
            <View style={[styles.card, Shadows.card]}>
              {[
                { icon: '📱', text: 'You reinstalled the app and lost access' },
                { icon: '🔄', text: 'You switched to a new device' },
                { icon: '⚠️', text: 'Your premium features disappeared unexpectedly' },
              ].map((item, i) => (
                <View key={i} style={[styles.bulletRow, i > 0 && styles.bulletRowBorder]}>
                  <Text style={styles.bulletIcon}>{item.icon}</Text>
                  <Text style={styles.bulletText}>{item.text}</Text>
                </View>
              ))}
            </View>

            {/* Error banner */}
            {state === 'error' && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle-outline" size={15} color={Colors.error} />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            {/* Restore button */}
            <TouchableOpacity
              style={[styles.restoreBtn, Shadows.btn]}
              onPress={handleRestore}
              disabled={state === 'loading'}
              activeOpacity={0.85}
            >
              {state === 'loading'
                ? <ActivityIndicator size="small" color="white" />
                : <Text style={styles.restoreBtnText}>Restore Purchases</Text>
              }
            </TouchableOpacity>

            <Text style={styles.footerNote}>
              Restoration checks your current account for any active Aevi subscription. No charge will be made.
            </Text>
          </>
        )}

      </ScrollView>
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

  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: 20,
    paddingBottom: 60,
  },

  // ── Success ───────────────────────────────────────────────────────────────
  successCard: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  successOrb: {
    width: 80,
    height: 80,
    borderRadius: 26,
    backgroundColor: 'rgba(29,158,117,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(29,158,117,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...Shadows.cardMd,
  },
  successOrbText: { fontSize: 34, color: Colors.success },
  successTitle: {
    fontFamily: Typography.serif.semiBold,
    fontSize: 24,
    color: Colors.textDark,
    textAlign: 'center',
  },
  successSub: {
    fontFamily: Typography.sans.regular,
    fontSize: 14,
    color: Colors.textMid,
    textAlign: 'center',
    lineHeight: 22,
  },
  successPlan: {
    fontFamily: Typography.sans.semiBold,
    color: Colors.roseDark,
  },
  continueBtn: {
    marginTop: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: Radius.xl,
    backgroundColor: Colors.roseDeep,
    ...Shadows.btn,
  },
  continueBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 15,
    color: 'white',
  },

  // ── Not found ─────────────────────────────────────────────────────────────
  notFoundCard: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 10,
  },
  notFoundOrb: {
    backgroundColor: Colors.rosePale,
    borderColor: Colors.border,
  },
  notFoundOrbText: { fontSize: 32, color: Colors.roseDark },
  notFoundTitle: {
    fontFamily: Typography.serif.semiBold,
    fontSize: 22,
    color: Colors.textDark,
    textAlign: 'center',
  },
  notFoundSub: {
    fontFamily: Typography.sans.regular,
    fontSize: 14,
    color: Colors.textMid,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  retryBtn: {
    alignSelf: 'center',
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

  // ── Idle ─────────────────────────────────────────────────────────────────
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 16,
    marginBottom: 24,
  },
  infoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.rosePale,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoIcon: { fontSize: 17, color: Colors.roseMid },
  infoText: { flex: 1 },
  infoTitle: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 14,
    color: Colors.textDark,
    marginBottom: 6,
  },
  infoBody: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: Colors.textMid,
    lineHeight: 20,
  },

  sectionLabel: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 10,
    color: Colors.textLight,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    paddingVertical: 4,
    marginBottom: 24,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bulletRowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bulletIcon: { fontSize: 17 },
  bulletText: {
    fontFamily: Typography.sans.regular,
    fontSize: 14,
    color: Colors.textDark,
    flex: 1,
    lineHeight: 20,
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: Colors.error,
    flex: 1,
    lineHeight: 19,
  },

  restoreBtn: {
    backgroundColor: Colors.roseDeep,
    borderRadius: Radius.xl,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  restoreBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 16,
    color: 'white',
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
