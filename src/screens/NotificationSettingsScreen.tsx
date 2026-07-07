import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Switch, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Radius, Shadows, Spacing } from '../theme';

const STORAGE_KEY = 'aevi_notification_prefs';

interface NotifPrefs {
  dailyCheckIn: boolean;
  weeklyRecap: boolean;
  streakReminder: boolean;
  insightReady: boolean;
}

const DEFAULTS: NotifPrefs = {
  dailyCheckIn: true,
  weeklyRecap: false,
  streakReminder: true,
  insightReady: false,
};

function ToggleRow({
  icon, label, sub, value, onValueChange,
}: {
  icon: string; label: string; sub: string; value: boolean; onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleIconWrap}>
        <Text style={styles.toggleIcon}>{icon}</Text>
      </View>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleSub}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={(v) => { Haptics.selectionAsync(); onValueChange(v); }}
        trackColor={{ false: '#d4bfbe', true: Colors.roseDark }}
        thumbColor="#ffffff"
      />
    </View>
  );
}

export default function NotificationSettingsScreen() {
  const navigation = useNavigation<any>();
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULTS);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    });
  }, []);

  const update = (key: keyof NotifPrefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={Colors.roseDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Reminders */}
        <Text style={styles.sectionLabel}>REMINDERS</Text>
        <View style={[styles.card, Shadows.card]}>
          <ToggleRow
            icon="🌅"
            label="Daily Check-in"
            sub="A gentle nudge to reflect each morning"
            value={prefs.dailyCheckIn}
            onValueChange={(v) => update('dailyCheckIn', v)}
          />
          <View style={styles.separator} />
          <ToggleRow
            icon="📖"
            label="Weekly Recap"
            sub="A summary of your emotional week"
            value={prefs.weeklyRecap}
            onValueChange={(v) => update('weeklyRecap', v)}
          />
        </View>

        {/* Activity */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>ACTIVITY</Text>
        <View style={[styles.card, Shadows.card]}>
          <ToggleRow
            icon="🔥"
            label="Streak Reminder"
            sub="Stay consistent with your journaling"
            value={prefs.streakReminder}
            onValueChange={(v) => update('streakReminder', v)}
          />
          <View style={styles.separator} />
          <ToggleRow
            icon="✦"
            label="Insight Ready"
            sub="When a new personal insight is available"
            value={prefs.insightReady}
            onValueChange={(v) => update('insightReady', v)}
          />
        </View>

        {/* Quiet Hours */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>QUIET HOURS</Text>
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.quietRow}>
            <View style={styles.toggleIconWrap}>
              <Text style={styles.toggleIcon}>🌙</Text>
            </View>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Silence window</Text>
              <Text style={styles.toggleSub}>No notifications during this time</Text>
            </View>
          </View>
          <View style={styles.quietDisplay}>
            <Text style={styles.quietTime}>22:00 — 07:00</Text>
            <Text style={styles.quietBadge}>NIGHTLY</Text>
          </View>
          <Text style={styles.quietNote}>
            Quiet hours silence all notifications. Aevi respects your rest.
          </Text>
        </View>

        {/* Info note */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={15} color={Colors.roseMid} />
          <Text style={styles.infoText}>
            Notification delivery depends on your device's permission settings.
          </Text>
        </View>
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
    padding: 16,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.rosePale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIcon: { fontSize: 16 },
  toggleInfo: { flex: 1 },
  toggleLabel: {
    fontFamily: Typography.sans.medium,
    fontSize: 14,
    color: Colors.textDark,
  },
  toggleSub: {
    fontFamily: Typography.sans.regular,
    fontSize: 11,
    color: Colors.textMid,
    marginTop: 1,
  },

  quietRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  quietDisplay: {
    backgroundColor: Colors.rosePale,
    borderRadius: Radius.lg,
    alignItems: 'center',
    paddingVertical: 14,
    gap: 4,
    marginBottom: 10,
  },
  quietTime: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 22,
    color: Colors.textDark,
    letterSpacing: 1,
  },
  quietBadge: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 10,
    color: Colors.textLight,
    letterSpacing: 1.5,
  },
  quietNote: {
    fontFamily: Typography.sans.regular,
    fontSize: 12,
    color: Colors.textMid,
    textAlign: 'center',
    lineHeight: 18,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  infoText: {
    flex: 1,
    fontFamily: Typography.sans.regular,
    fontSize: 12,
    color: Colors.textMid,
    lineHeight: 18,
  },
});
