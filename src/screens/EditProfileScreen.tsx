import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getSession, updateProfile } from '../services/supabase';
import { Colors, Typography, Radius, Shadows, Spacing } from '../theme';

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    getSession().then((session) => {
      if (session?.user) {
        setName(session.user.user_metadata?.full_name || '');
        setEmail(session.user.email || '');
      }
    });
  }, []);

  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '✦';
  const canSave = name.trim().length > 0 && !saving && !saved;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setSaveError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const { error } = await updateProfile(name.trim());
      if (error) throw error;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSaved(true);
      setTimeout(() => navigation.goBack(), 800);
    } catch {
      setSaving(false);
      setSaveError("Couldn't save changes. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={Colors.roseDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity
            style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!canSave}
            activeOpacity={0.85}
          >
            {saving
              ? <ActivityIndicator size="small" color="white" />
              : <Text style={styles.saveBtnText}>{saved ? '✓  Saved' : 'Save'}</Text>
            }
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {saveError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠  {saveError}</Text>
            </View>
          ) : null}

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, Shadows.dark]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>

          {/* Name */}
          <Text style={styles.fieldLabel}>DISPLAY NAME</Text>
          <View style={[styles.inputWrap, Shadows.card]}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(t) => { setSaved(false); setName(t); }}
              placeholder="Your name"
              placeholderTextColor={Colors.roseLight}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleSave}
              maxLength={60}
            />
          </View>

          {/* Email (read-only) */}
          <Text style={[styles.fieldLabel, { marginTop: 20 }]}>EMAIL ADDRESS</Text>
          <View style={[styles.inputWrap, styles.inputReadOnly, Shadows.card]}>
            <Text style={styles.inputReadOnlyText}>{email}</Text>
          </View>
          <Text style={styles.fieldHint}>Email changes require re-verification and are not supported yet.</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Change Password row */}
          <TouchableOpacity
            style={[styles.linkRow, Shadows.card]}
            onPress={() => navigation.navigate('ForgotPassword')}
            activeOpacity={0.75}
          >
            <View style={styles.linkLeft}>
              <View style={styles.linkIconWrap}>
                <Ionicons name="lock-closed-outline" size={16} color={Colors.roseMid} />
              </View>
              <View>
                <Text style={styles.linkLabel}>Change Password</Text>
                <Text style={styles.linkSub}>Send a reset link to your inbox</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgWarm },
  kav: { flex: 1 },

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
  saveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.xl,
    backgroundColor: Colors.roseDeep,
    ...Shadows.btn,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 13,
    color: Colors.textOnDark,
  },

  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: 20,
    paddingBottom: 60,
  },

  errorBanner: {
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
  },

  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.avatarBorder,
  },
  avatarText: {
    fontFamily: Typography.serif.bold,
    fontSize: 26,
    color: 'white',
  },

  fieldLabel: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 10,
    color: Colors.textLight,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  inputWrap: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  input: {
    fontFamily: Typography.sans.regular,
    fontSize: 15,
    color: Colors.textDark,
    padding: 0,
  },
  inputReadOnly: {
    backgroundColor: Colors.rosePale,
    borderColor: Colors.borderLight,
  },
  inputReadOnlyText: {
    fontFamily: Typography.sans.regular,
    fontSize: 15,
    color: Colors.textMid,
  },
  fieldHint: {
    fontFamily: Typography.sans.regular,
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 6,
    lineHeight: 16,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 24,
  },

  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 14,
  },
  linkLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  linkIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.rosePale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLabel: {
    fontFamily: Typography.sans.medium,
    fontSize: 14,
    color: Colors.textDark,
  },
  linkSub: {
    fontFamily: Typography.sans.regular,
    fontSize: 11,
    color: Colors.textMid,
    marginTop: 1,
  },
});
