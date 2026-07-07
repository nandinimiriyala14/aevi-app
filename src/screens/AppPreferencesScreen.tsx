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

const STORAGE_KEY = 'aevi_app_prefs';

type ResponseLength = 'concise' | 'balanced' | 'detailed';

interface AppPrefs {
  responseLength: ResponseLength;
  haptics: boolean;
}

const DEFAULTS: AppPrefs = {
  responseLength: 'balanced',
  haptics: true,
};

const RESPONSE_OPTIONS: { id: ResponseLength; label: string; sub: string }[] = [
  { id: 'concise', label: 'Concise', sub: 'Shorter, focused replies' },
  { id: 'balanced', label: 'Balanced', sub: 'Thoughtful and complete' },
  { id: 'detailed', label: 'Detailed', sub: 'Rich, in-depth responses' },
];

export default function AppPreferencesScreen() {
  const navigation = useNavigation<any>();
  const [prefs, setPrefs] = useState<AppPrefs>(DEFAULTS);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    });
  }, []);

  const save = (next: AppPrefs) => {
    setPrefs(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const setResponseLength = (id: ResponseLength) => {
    Haptics.selectionAsync();
    save({ ...prefs, responseLength: id });
  };

  const setHaptics = (v: boolean) => {
    if (v) Haptics.selectionAsync();
    save({ ...prefs, haptics: v });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={Colors.roseDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Preferences</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Response Length */}
        <Text style={styles.sectionLabel}>CONVERSATION</Text>
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitleIcon}>◎</Text>
            <View>
              <Text style={styles.cardTitle}>Response Length</Text>
              <Text style={styles.cardSub}>How Aevi crafts its replies</Text>
            </View>
          </View>
          <View style={styles.optionGroup}>
            {RESPONSE_OPTIONS.map((opt) => {
              const active = prefs.responseLength === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.optionRow, active && styles.optionRowActive]}
                  onPress={() => setResponseLength(opt.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionInfo}>
                    <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                      {opt.label}
                    </Text>
                    <Text style={[styles.optionSub, active && styles.optionSubActive]}>
                      {opt.sub}
                    </Text>
                  </View>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* System */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>SYSTEM</Text>
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.toggleRow}>
            <View style={styles.iconWrap}>
              <Text style={styles.rowIcon}>◷</Text>
            </View>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Haptic Feedback</Text>
              <Text style={styles.toggleSub}>Subtle vibrations on interactions</Text>
            </View>
            <Switch
              value={prefs.haptics}
              onValueChange={setHaptics}
              trackColor={{ false: '#d4bfbe', true: Colors.roseDark }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* App version */}
        <Text style={styles.versionText}>Aevi · Version 1.0.0</Text>
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
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  cardTitleIcon: {
    fontSize: 15,
    color: Colors.roseMid,
    marginTop: 1,
  },
  cardTitle: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 14,
    color: Colors.textDark,
  },
  cardSub: {
    fontFamily: Typography.sans.regular,
    fontSize: 11,
    color: Colors.textMid,
    marginTop: 1,
  },

  // Response length options
  optionGroup: { gap: 8 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    backgroundColor: Colors.rosePale,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  optionRowActive: {
    backgroundColor: '#f5e8e8',
    borderColor: Colors.roseDark,
  },
  optionInfo: { flex: 1 },
  optionLabel: {
    fontFamily: Typography.sans.medium,
    fontSize: 14,
    color: Colors.textDark,
  },
  optionLabelActive: { color: Colors.roseDark },
  optionSub: {
    fontFamily: Typography.sans.regular,
    fontSize: 11,
    color: Colors.textMid,
    marginTop: 1,
  },
  optionSubActive: { color: Colors.roseMid },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.roseLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: Colors.roseDark },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.roseDark,
  },

  // Mood picker
  moodRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 4,
  },
  moodPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.rosePale,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  moodPillText: {
    fontFamily: Typography.sans.medium,
    fontSize: 13,
    color: Colors.textDark,
  },
  moodPillTextActive: { color: 'white' },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.rosePale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIcon: { fontSize: 15, color: Colors.roseMid },
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

  versionText: {
    fontFamily: Typography.sans.regular,
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 28,
  },
});
