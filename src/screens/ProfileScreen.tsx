import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSession, getSubscription, signOut, deleteAccount } from '../services/supabase';
import { Colors, Typography, Radius, Shadows, Spacing } from '../theme';

const TONE_STORAGE_KEY = 'aevi_tone_pref';

const TONES = [
  { id: 'gentle',     label: 'Gentle',     icon: '◎' },
  { id: 'direct',     label: 'Direct',     icon: '⊙' },
  { id: 'motivating', label: 'Motivating', icon: '✦' },
];

const SETTINGS_ROWS = [
  { icon: 'person-outline',           label: 'Edit Profile',       screen: 'EditProfile' },
  { icon: 'card-outline',             label: 'Subscription',       screen: 'SubscriptionManagement' },
  { icon: 'notifications-outline',    label: 'Notifications',      screen: 'NotificationSettings' },
  { icon: 'shield-checkmark-outline', label: 'Privacy & Data',     screen: 'PrivacySettings' },
  { icon: 'settings-outline',         label: 'App Preferences',    screen: 'AppPreferences' },
] as const;

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { top } = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState('gentle');
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    const [session, tone] = await Promise.all([
      getSession(),
      AsyncStorage.getItem(TONE_STORAGE_KEY),
    ]);
    if (session?.user) {
      setName(session.user.user_metadata?.full_name || 'Friend');
      setEmail(session.user.email || '');
    }
    if (tone) setSelectedTone(tone);
    const sub = session?.user?.id ? await getSubscription(session.user.id) : null;
    if (sub?.plan) {
      const labels: Record<string, string> = { free: 'Free Plan', plus: 'Plus Plan', pro: 'Pro Plan' };
      setPlan(labels[sub.plan] ?? 'Free Plan');
    } else {
      setPlan('Free Plan');
    }
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const handleTone = (id: string) => {
    Haptics.selectionAsync();
    setSelectedTone(id);
    AsyncStorage.setItem(TONE_STORAGE_KEY, id);
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete your space?',
      'This will permanently delete your account, all conversations, journal entries and memories. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteAccount();
              await signOut();
              navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
            } catch {
              Alert.alert('Something went wrong', 'Please try again or contact support.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '✦';

  return (
    <View style={[styles.safe, { paddingTop: top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{initials}</Text>
          </View>
          <Text style={styles.headerName}>{name || 'Profile'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Avatar + name block */}
        <View style={styles.profileSection}>
          <View style={[styles.avatar, Shadows.dark]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          {plan ? <View style={styles.userPlanBadge}><Text style={styles.userPlanText}>{plan}</Text></View> : null}
        </View>

        {/* Tone Settings */}
        <View style={[styles.card, Shadows.card, { marginBottom: 16 }]}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitleIcon}>✦</Text>
            <View>
              <Text style={styles.cardTitle}>Tone Settings</Text>
              <Text style={styles.cardSubtitle}>How Aevi reflects your thoughts back to you</Text>
            </View>
          </View>
          <View style={styles.toneGrid}>
            {TONES.map((tone) => {
              const active = selectedTone === tone.id;
              return (
                <TouchableOpacity
                  key={tone.id}
                  onPress={() => handleTone(tone.id)}
                  style={[styles.toneBtn, active && styles.toneBtnActive]}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.toneBtnText, active && styles.toneBtnTextActive]}>
                    {tone.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Settings rows */}
        <Text style={styles.sectionLabel}>SETTINGS</Text>
        <View style={[styles.settingsCard, Shadows.card]}>
          {SETTINGS_ROWS.map((item, i) => (
            <React.Fragment key={item.screen}>
              {i > 0 && <View style={styles.rowDivider} />}
              <TouchableOpacity
                style={styles.settingsRow}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate(item.screen);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.rowLeft}>
                  <View style={styles.rowIconWrap}>
                    <Ionicons name={item.icon as any} size={17} color={Colors.roseMid} />
                  </View>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        {/* Sign out */}
        <View style={styles.signOutWrap}>
          <TouchableOpacity onPress={handleSignOut} activeOpacity={0.7}>
            <Text style={styles.signOutText}>Log Out of Your Space</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
            disabled={deleting}
            style={styles.deleteBtn}
          >
            {deleting
              ? <ActivityIndicator size="small" color="#D5B4B4" />
              : <Text style={styles.deleteBtnText}>Delete Account</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.avatarBorder,
  },
  headerAvatarText: {
    fontSize: 12,
    color: 'white',
    fontFamily: Typography.sans.semiBold,
  },
  headerName: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 15,
    color: Colors.textDark,
  },
  content: { padding: Spacing.base, paddingBottom: 110 },

  // ── Profile block ───────────────────────────────────────────────────────────
  profileSection: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.avatarBorder,
    marginBottom: 10,
  },
  avatarText: {
    fontFamily: Typography.serif.bold,
    fontSize: 26,
    color: 'white',
  },
  userName: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 18,
    color: Colors.textDark,
    marginBottom: 2,
  },
  userEmail: {
    fontFamily: Typography.sans.regular,
    fontSize: 12,
    color: Colors.roseMid,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  userPlanBadge: {
    backgroundColor: '#F0E8E8',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  userPlanText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 12,
    fontWeight: '600',
    color: '#9A6868',
  },

  // ── Tone card ───────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  cardTitleIcon: { fontSize: 15, color: Colors.roseMid, marginTop: 1 },
  cardTitle: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 14,
    color: Colors.textDark,
  },
  cardSubtitle: {
    fontFamily: Typography.sans.regular,
    fontSize: 11,
    color: Colors.textMid,
    marginTop: 1,
  },
  toneGrid: { flexDirection: 'row', gap: 8 },
  toneBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Radius.lg,
    backgroundColor: Colors.rosePale,
  },
  toneBtnActive: { backgroundColor: Colors.roseDeep },
  toneBtnText: {
    fontFamily: Typography.sans.medium,
    fontSize: 12,
    color: Colors.roseDark,
  },
  toneBtnTextActive: { color: 'white' },

  // ── Settings rows ───────────────────────────────────────────────────────────
  sectionLabel: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 10,
    color: Colors.textLight,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  settingsCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginBottom: 4,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 64,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.rosePale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontFamily: Typography.sans.medium,
    fontSize: 14,
    color: Colors.textDark,
  },

  // ── Sign out ────────────────────────────────────────────────────────────────
  signOutWrap: { alignItems: 'center', paddingVertical: 20 },
  signOutText: {
    fontFamily: Typography.sans.medium,
    fontSize: 14,
    color: Colors.warningIcon,
  },
  deleteBtn: { marginTop: 8, alignItems: 'center', paddingVertical: 4 },
  deleteBtnText: {
    fontFamily: Typography.sans.light,
    fontSize: 13,
    color: '#D5B4B4',
  },
});
