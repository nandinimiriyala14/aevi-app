import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Switch, StatusBar, Alert, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMemories, clearMemories } from '../services/supabase';
import { Colors, Typography, Radius, Shadows, Spacing } from '../theme';

const STORAGE_KEY = 'aevi_privacy_prefs';

interface PrivacyPrefs {
  contextPersistence: boolean;
  anonymousAnalytics: boolean;
}

const DEFAULTS: PrivacyPrefs = {
  contextPersistence: true,
  anonymousAnalytics: false,
};

export default function PrivacySettingsScreen() {
  const navigation = useNavigation<any>();
  const [prefs, setPrefs] = useState<PrivacyPrefs>(DEFAULTS);
  const [memoryCount, setMemoryCount] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    });
    getMemories().then((mems) => setMemoryCount(mems.length));
  }, []);

  const update = (key: keyof PrivacyPrefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    Haptics.selectionAsync();
  };

  const handleClearMemories = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Clear All Memories?',
      "Aevi will forget everything it has learned about you. This cannot be undone.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setClearing(true);
            try {
              await clearMemories();
              setMemoryCount(0);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch {
              Alert.alert('Error', "Couldn't clear memories. Please try again.");
            } finally {
              setClearing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={Colors.roseDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Data</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Memory & Context */}
        <Text style={styles.sectionLabel}>MEMORY & CONTEXT</Text>
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.toggleRow}>
            <View style={styles.iconWrap}>
              <Text style={styles.rowIcon}>◈</Text>
            </View>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Context Persistence</Text>
              <Text style={styles.toggleSub}>Aevi remembers your past sessions</Text>
            </View>
            <Switch
              value={prefs.contextPersistence}
              onValueChange={(v) => update('contextPersistence', v)}
              trackColor={{ false: '#d4bfbe', true: Colors.roseDark }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.toggleRow}>
            <View style={styles.iconWrap}>
              <Text style={styles.rowIcon}>◎</Text>
            </View>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Anonymous Analytics</Text>
              <Text style={styles.toggleSub}>Help improve Aevi with usage data</Text>
            </View>
            <Switch
              value={prefs.anonymousAnalytics}
              onValueChange={(v) => update('anonymousAnalytics', v)}
              trackColor={{ false: '#d4bfbe', true: Colors.roseDark }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Your Data */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>YOUR DATA</Text>
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.memoryRow}>
            <View style={styles.iconWrap}>
              <Text style={styles.rowIcon}>✦</Text>
            </View>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Memory Bank</Text>
              <Text style={styles.toggleSub}>
                {memoryCount === null
                  ? 'Loading...'
                  : memoryCount === 0
                    ? 'No memories stored'
                    : `${memoryCount} memor${memoryCount === 1 ? 'y' : 'ies'} stored`}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.clearBtn, (memoryCount === 0 || clearing) && styles.clearBtnDisabled]}
              onPress={handleClearMemories}
              disabled={memoryCount === 0 || clearing}
              activeOpacity={0.8}
            >
              {clearing
                ? <ActivityIndicator size="small" color={Colors.error} />
                : <Text style={styles.clearBtnText}>Clear</Text>
              }
            </TouchableOpacity>
          </View>
          <View style={styles.infoNote}>
            <Ionicons name="information-circle-outline" size={14} color={Colors.roseMid} />
            <Text style={styles.infoNoteText}>
              Memories are private and never shared with third parties.
            </Text>
          </View>
        </View>

        {/* Legal */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>LEGAL</Text>
        <View style={[styles.card, Shadows.card]}>
          {[
            { icon: 'document-text-outline' as const, label: 'Privacy Policy', sub: 'How your data is protected', url: 'https://www.myaevi.app/privacy.html' },
            { icon: 'shield-checkmark-outline' as const, label: 'Terms of Service', sub: 'Your agreement with Aevi', url: 'https://www.myaevi.app/terms.html' },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <View style={styles.separator} />}
              <TouchableOpacity
                style={styles.linkRow}
                onPress={() => Linking.openURL(item.url)}
                activeOpacity={0.75}
              >
                <View style={styles.linkLeft}>
                  <View style={styles.legalIconWrap}>
                    <Ionicons name={item.icon} size={17} color={Colors.roseMid} />
                  </View>
                  <View>
                    <Text style={styles.toggleLabel}>{item.label}</Text>
                    <Text style={styles.toggleSub}>{item.sub}</Text>
                  </View>
                </View>
                <Ionicons name="open-outline" size={15} color={Colors.textLight} />
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        {/* Delete account link */}
        <TouchableOpacity
          style={styles.dangerRow}
          onPress={() => navigation.navigate('DeleteAccount')}
          activeOpacity={0.75}
        >
          <Ionicons name="trash-outline" size={15} color={Colors.error} />
          <Text style={styles.dangerText}>Delete My Account</Text>
        </TouchableOpacity>
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
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.rosePale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIcon: { fontSize: 15, color: Colors.roseMid },
  legalIconWrap: {
    backgroundColor: '#F0E8E8',
    borderRadius: 10,
    padding: 8,
  },
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

  memoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  clearBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.error,
    minWidth: 56,
    alignItems: 'center',
  },
  clearBtnDisabled: { opacity: 0.35 },
  clearBtnText: {
    fontFamily: Typography.sans.medium,
    fontSize: 12,
    color: Colors.error,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
  },
  infoNoteText: {
    flex: 1,
    fontFamily: Typography.sans.regular,
    fontSize: 11,
    color: Colors.textMid,
    lineHeight: 16,
  },

  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 28,
    paddingVertical: 8,
  },
  dangerText: {
    fontFamily: Typography.sans.medium,
    fontSize: 14,
    color: Colors.error,
  },
});
