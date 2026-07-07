import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  StatusBar, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AeviLogo from '../components/AeviLogo';
import { InputField, PrimaryBtn } from '../components/UI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn } from '../services/supabase';
import { Colors, Typography, Radius, Shadows } from '../theme';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim() || !email.includes('@')) e.email = 'Please enter a valid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      setErrors({
        general: error.message.includes('Invalid login credentials')
          ? 'Incorrect email or password. Please try again.'
          : error.message,
      });
      return;
    }
    const prefs = await AsyncStorage.getItem('aevi_user_prefs');
    if (prefs) {
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } else {
      navigation.navigate('OnboardingGoal');
    }
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
            <Text style={styles.title}>Welcome back.</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey.</Text>
          </View>

          {/* Logo */}
          <View style={styles.logoSection}>
            <AeviLogo size={100} showText />
          </View>

          {/* Form card */}
          <View style={[styles.card, Shadows.card]}>
            {errors.general ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠  {errors.general}</Text>
              </View>
            ) : null}

            <InputField
              label="EMAIL"
              placeholder=""
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

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

            <TouchableOpacity
              style={styles.forgotLink}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <PrimaryBtn label="Sign in" onPress={handleLogin} loading={loading} />

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.switchLink}>Sign up</Text>
              </TouchableOpacity>
            </View>

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
    marginVertical: 8,
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
  forgotLink: { alignSelf: 'flex-end', marginTop: -4, marginBottom: 12 },
  forgotText: {
    fontFamily: Typography.sans.regular,
    fontSize: 12,
    color: '#7a5555',
    textDecorationLine: 'underline',
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
});
