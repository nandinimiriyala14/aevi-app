import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  StatusBar, TouchableOpacity, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { InputField, PrimaryBtn } from '../components/UI';
import { signUp } from '../services/supabase';
import { Colors, Typography, Radius, Shadows } from '../theme';

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
  const [emailTaken, setEmailTaken] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim() || !email.includes('@')) e.email = 'Please enter a valid email';
    if (password.length < 8) e.password = 'Password must be at least 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    const { data, error } = await signUp(name.trim(), email.trim(), password);
    setLoading(false);
    if (error) {
      if (
        error.message.includes('already registered') ||
        error.message.includes('User already registered') ||
        (error as any).status === 422
      ) {
        setEmailTaken(true);
      } else {
        setErrors({ general: error.message });
      }
      return;
    }
    if (!data.session) { setConfirmed(true); return; }
    navigation.navigate('OnboardingGoal');
  };

  if (confirmed) {
    return (
      <SafeAreaView style={styles.confirmSafe}>
        <View style={styles.confirmContainer}>
          <Text style={styles.confirmIcon}>✉</Text>
          <Text style={styles.confirmTitle}>Check your email</Text>
          <Text style={styles.confirmText}>
            We sent a confirmation link to{'\n'}
            <Text style={styles.confirmEmail}>{email}</Text>
            {'\n\n'}Click it to activate your account.
          </Text>
          <TouchableOpacity style={styles.confirmBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.confirmBtnText}>Back to sign in</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.title}>Create your{'\n'}private space</Text>
            <Text style={styles.subtitle}>Your thoughts stay here. Always.</Text>
          </View>

          {/* Form card */}
          <View style={[styles.card, Shadows.card]}>
            {errors.general ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠  {errors.general}</Text>
              </View>
            ) : null}

            <InputField label="YOUR NAME" placeholder="" value={name} onChangeText={setName} error={errors.name} />
            <InputField
              label="EMAIL"
              placeholder=""
              value={email}
              onChangeText={(t) => { setEmail(t); if (emailTaken) setEmailTaken(false); }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            {emailTaken && (
              <View style={styles.takenRow}>
                <Text style={styles.takenText}>This email is already registered.</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.takenLink}>Sign in instead →</Text>
                </TouchableOpacity>
              </View>
            )}
            <InputField
              label="PASSWORD"
              placeholder=""
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              error={errors.password}
              rightElement={
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={{ padding: 8 }}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#A08888" />
                </TouchableOpacity>
              }
            />

            <PrimaryBtn label="Create Account" onPress={handleSignup} loading={loading} />

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.switchLink}>Sign in</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.privacy}>
              By continuing you agree to our{' '}
              <Text
                style={styles.privacyLink}
                onPress={() => Linking.openURL('https://www.myaevi.app/privacy.html')}
              >Privacy Policy</Text>
            </Text>
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
  confirmSafe: { flex: 1, backgroundColor: '#f0dbd9' },
  headerSection: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontFamily: Typography.serif.bold,
    fontSize: 38,
    color: '#2d1818',
    lineHeight: 46,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: Typography.sans.regular,
    fontSize: 14,
    color: '#9a7070',
  },
  card: {
    marginHorizontal: 16,
    borderRadius: Radius['2xl'],
    backgroundColor: 'rgba(255,255,255,0.75)',
    padding: 20,
    gap: 4,
  },
  errorBanner: {
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: 'rgba(229,62,62,0.2)',
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
    color: '#7a5555',
    textDecorationLine: 'underline',
  },
  privacy: {
    fontFamily: Typography.sans.regular,
    fontSize: 11,
    color: '#b09090',
    textAlign: 'center',
    marginTop: 8,
  },
  privacyLink: {
    textDecorationLine: 'underline',
    color: '#9a7878',
  },
  confirmContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  confirmIcon: { fontSize: 56, marginBottom: 24 },
  confirmTitle: {
    fontFamily: Typography.serif.semiBoldItalic,
    fontSize: 40,
    color: '#2d1818',
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmText: {
    fontFamily: Typography.sans.regular,
    fontSize: 15,
    color: '#9a7878',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  confirmEmail: { fontFamily: Typography.sans.semiBold, color: '#2d1818' },
  confirmBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#3d2020',
  },
  confirmBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 14,
    color: '#ffffff',
  },
  takenRow: {
    marginTop: -8,
    marginBottom: 8,
    gap: 4,
  },
  takenText: {
    fontFamily: Typography.sans.regular,
    fontSize: 13,
    color: '#867070',
  },
  takenLink: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 13,
    color: '#7a5555',
    textDecorationLine: 'underline',
  },
});
