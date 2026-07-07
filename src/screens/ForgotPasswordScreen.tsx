import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  StatusBar, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AeviLogo from '../components/AeviLogo';
import { InputField, PrimaryBtn } from '../components/UI';
import { resetPassword } from '../services/supabase';
import { Colors, Typography, Radius, Shadows } from '../theme';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setLoading(true);
    const { error: err } = await resetPassword(email.trim());
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  };

  const handleRetry = () => {
    setSent(false);
    setEmail('');
    setError('');
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
              {sent ? 'Check your\ninbox.' : 'Forgot your\npassword?'}
            </Text>
            <Text style={styles.subtitle}>
              {sent
                ? `We've sent reset instructions to ${email.trim()}.`
                : "We'll send a reset link to your inbox."}
            </Text>
          </View>

          {/* Logo */}
          <View style={styles.logoSection}>
            <AeviLogo size={80} showText />
          </View>

          {/* Card */}
          <View style={[styles.card, Shadows.card]}>
            {!sent ? (
              <>
                {error ? (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>⚠  {error}</Text>
                  </View>
                ) : null}

                <InputField
                  label="EMAIL"
                  placeholder=""
                  value={email}
                  onChangeText={(t) => { setEmail(t); if (error) setError(''); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <PrimaryBtn
                  label="Send reset link"
                  onPress={handleSend}
                  loading={loading}
                />

                <View style={styles.switchRow}>
                  <Text style={styles.switchText}>Remember it? </Text>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.switchLink}>Sign in</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {/* Success state */}
                <View style={styles.successOrb}>
                  <Text style={styles.successOrbText}>✦</Text>
                </View>

                <Text style={styles.successTitle}>Instructions sent</Text>
                <Text style={styles.successBody}>
                  Check your email and tap the reset link. Then return here to sign in.
                </Text>

                <PrimaryBtn
                  label="Back to sign in"
                  onPress={() => navigation.navigate('Login')}
                  style={{ marginTop: 4 }}
                />

                <View style={styles.switchRow}>
                  <Text style={styles.switchText}>Didn't receive it? </Text>
                  <TouchableOpacity onPress={handleRetry}>
                    <Text style={styles.switchLink}>Try again</Text>
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

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  switchText: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: '#9a7070',
  },
  switchLink: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 13,
    color: Colors.textLink,
    textDecorationLine: 'underline',
  },

  successOrb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.rosePale,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  successOrbText: {
    fontSize: 24,
    color: Colors.roseDark,
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
