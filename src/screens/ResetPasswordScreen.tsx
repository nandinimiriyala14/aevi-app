import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  StatusBar, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import AeviLogo from '../components/AeviLogo';
import { InputField, PrimaryBtn } from '../components/UI';
import { verifyRecoveryOtp, updatePassword } from '../services/supabase';
import { Colors, Typography, Radius, Shadows } from '../theme';

type Errors = {
  token?: string;
  password?: string;
  confirm?: string;
  general?: string;
};

export default function ResetPasswordScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const email: string = route.params?.email ?? '';

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const clearField = (key: keyof Errors) =>
    setErrors((prev) => ({ ...prev, [key]: undefined }));

  const validate = () => {
    const e: Errors = {};
    if (!token.trim()) e.token = 'Enter the code from your email';
    if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (password !== confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReset = async () => {
    if (!validate()) return;
    setLoading(true);

    const { error: verifyErr } = await verifyRecoveryOtp(email, token.trim());
    if (verifyErr) {
      setLoading(false);
      setErrors({ general: 'Invalid or expired code. Request a new reset link and try again.' });
      return;
    }

    const { error: updateErr } = await updatePassword(password);
    setLoading(false);
    if (updateErr) {
      setErrors({ general: updateErr.message });
      return;
    }

    setDone(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#e2c8c5', '#ebd4d1', '#f0dbd9']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>
              {done ? 'Password\nupdated.' : 'Create a new\npassword.'}
            </Text>
            <Text style={styles.subtitle}>
              {done
                ? 'You can now sign in with your new password.'
                : email
                ? `Enter the code we sent to ${email}.`
                : 'Enter the code from your email.'}
            </Text>
          </View>

          {/* Logo */}
          <View style={styles.logoSection}>
            <AeviLogo size={80} showText />
          </View>

          {/* Card */}
          <View style={[styles.card, Shadows.card]}>
            {done ? (
              /* ── Success state ── */
              <>
                <View style={styles.successOrb}>
                  <Text style={styles.successOrbText}>✓</Text>
                </View>
                <Text style={styles.successTitle}>All set</Text>
                <Text style={styles.successBody}>
                  Your password has been changed. Sign in to continue your journey.
                </Text>
                <PrimaryBtn
                  label="Sign in"
                  onPress={() =>
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
                  }
                  style={{ marginTop: 4 }}
                />
              </>
            ) : (
              /* ── Form state ── */
              <>
                {errors.general ? (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>⚠  {errors.general}</Text>
                  </View>
                ) : null}

                {/* Hint card */}
                <View style={styles.hintCard}>
                  <Text style={styles.hintText}>
                    Open the email we sent you and copy the code from the reset link.
                    It looks like a short string at the end of the URL.
                  </Text>
                </View>

                <InputField
                  label="VERIFICATION CODE"
                  placeholder="Paste code from email"
                  value={token}
                  onChangeText={(t) => { setToken(t); clearField('token'); }}
                  autoCapitalize="none"
                  error={errors.token}
                />

                <InputField
                  label="NEW PASSWORD"
                  placeholder=""
                  value={password}
                  onChangeText={(t) => { setPassword(t); clearField('password'); }}
                  secureTextEntry
                  error={errors.password}
                />

                <InputField
                  label="CONFIRM PASSWORD"
                  placeholder=""
                  value={confirm}
                  onChangeText={(t) => { setConfirm(t); clearField('confirm'); }}
                  secureTextEntry
                  error={errors.confirm}
                />

                <PrimaryBtn
                  label="Reset password"
                  onPress={handleReset}
                  loading={loading}
                />

                <View style={styles.switchRow}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backLink}>← Back to forgot password</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { paddingBottom: 32 },

  headerSection: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 0,
  },
  title: {
    fontFamily: Typography.serif.semiBoldItalic,
    fontSize: 38,
    color: '#2d1818',
    lineHeight: 44,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: Typography.sans.regular,
    fontSize: 14,
    color: '#9a7070',
  },

  logoSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },

  card: {
    marginHorizontal: 16,
    borderRadius: Radius['2xl'],
    backgroundColor: Colors.cardGlass,
    padding: 20,
    gap: 4,
  },

  errorBanner: {
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  errorBannerText: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: Colors.error,
  },

  hintCard: {
    backgroundColor: Colors.rosePale,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  hintText: {
    fontFamily: Typography.sans.regular,
    fontSize: 12,
    color: Colors.textMid,
    lineHeight: 18,
  },

  switchRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  backLink: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: Colors.textLink,
    textDecorationLine: 'underline',
  },

  successOrb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(29,158,117,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  successOrbText: {
    fontSize: 26,
    color: Colors.success,
    fontWeight: '700',
  },
  successTitle: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 17,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  successBody: {
    fontFamily: Typography.sans.regular,
    fontSize: 14,
    color: Colors.textMid,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 8,
  },
});
