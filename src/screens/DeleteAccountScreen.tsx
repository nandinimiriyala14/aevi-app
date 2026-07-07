import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { signOut } from '../services/supabase';
import { Colors, Typography, Radius, Shadows, Spacing } from '../theme';

const CONFIRM_WORD = 'DELETE';

const WHAT_GETS_DELETED = [
  'Your journal entries and reflections',
  'All memories Aevi has built about you',
  'Your chat history and conversations',
  'Your account and profile information',
];

export default function DeleteAccountScreen() {
  const navigation = useNavigation<any>();
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const isConfirmed = confirmText.trim() === CONFIRM_WORD;

  const handleDelete = async () => {
    if (!isConfirmed || deleting) return;
    setDeleting(true);
    setError('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    try {
      await signOut();
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch {
      setDeleting(false);
      setError("Something went wrong. Please try again or contact support.");
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
          <Text style={styles.headerTitle}>Delete Account</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Warning card */}
          <View style={styles.warningCard}>
            <View style={styles.warningIconWrap}>
              <Text style={styles.warningIconText}>⚠</Text>
            </View>
            <Text style={styles.warningTitle}>This cannot be undone</Text>
            <Text style={styles.warningBody}>
              Deleting your account is permanent. All your data will be removed and cannot be recovered.
            </Text>
          </View>

          {/* What gets deleted */}
          <Text style={styles.sectionLabel}>WHAT WILL BE DELETED</Text>
          <View style={[styles.card, Shadows.card]}>
            {WHAT_GETS_DELETED.map((item, i) => (
              <View key={i} style={styles.deleteItem}>
                <View style={styles.deleteDot} />
                <Text style={styles.deleteItemText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Confirm input */}
          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>CONFIRM DELETION</Text>
          <View style={[styles.card, Shadows.card]}>
            <Text style={styles.confirmHint}>
              Type{' '}
              <Text style={styles.confirmWord}>DELETE</Text>
              {' '}below to confirm.
            </Text>
            <TextInput
              style={[styles.confirmInput, isConfirmed && styles.confirmInputActive]}
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder="Type DELETE"
              placeholderTextColor={Colors.roseLight}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="done"
              maxLength={10}
            />
          </View>

          {/* Error */}
          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠  {error}</Text>
            </View>
          ) : null}

          {/* Delete button */}
          <TouchableOpacity
            style={[styles.deleteBtn, (!isConfirmed || deleting) && styles.deleteBtnDisabled]}
            onPress={handleDelete}
            disabled={!isConfirmed || deleting}
            activeOpacity={0.85}
          >
            {deleting
              ? <ActivityIndicator size="small" color="white" />
              : (
                <>
                  <Ionicons name="trash-outline" size={16} color="white" />
                  <Text style={styles.deleteBtnText}>Permanently Delete My Account</Text>
                </>
              )
            }
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Keep my account</Text>
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
    color: Colors.error,
  },

  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: 20,
    paddingBottom: 60,
  },

  warningCard: {
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: Radius.xl,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  warningIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(229,62,62,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  warningIconText: { fontSize: 24, color: Colors.error },
  warningTitle: {
    fontFamily: Typography.serif.semiBold,
    fontSize: 18,
    color: Colors.error,
    marginBottom: 8,
    textAlign: 'center',
  },
  warningBody: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: '#8a3030',
    textAlign: 'center',
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
    padding: 16,
  },

  deleteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 5,
  },
  deleteDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.error,
    marginTop: 7,
    flexShrink: 0,
  },
  deleteItemText: {
    fontFamily: Typography.sans.regular,
    fontSize: 14,
    color: Colors.textDark,
    flex: 1,
    lineHeight: 20,
  },

  confirmHint: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: Colors.textMid,
    marginBottom: 12,
    lineHeight: 20,
  },
  confirmWord: {
    fontFamily: Typography.sans.semiBold,
    color: Colors.error,
    letterSpacing: 1,
  },
  confirmInput: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 16,
    color: Colors.textDark,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 14,
    paddingVertical: 13,
    letterSpacing: 2,
  },
  confirmInputActive: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorBg,
    color: Colors.error,
  },

  errorBanner: {
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: Radius.md,
    padding: 12,
    marginTop: 12,
  },
  errorText: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: Colors.error,
  },

  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.error,
    borderRadius: Radius.xl,
    paddingVertical: 16,
    marginTop: 24,
    ...Shadows.btn,
  },
  deleteBtnDisabled: { opacity: 0.35 },
  deleteBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 15,
    color: 'white',
  },

  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 4,
  },
  cancelText: {
    fontFamily: Typography.sans.medium,
    fontSize: 14,
    color: Colors.textMid,
  },
});
