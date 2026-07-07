import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AeviLogo from '../components/AeviLogo';
import { PrimaryBtn, GhostBtn } from '../components/UI';
import { Colors, Typography, Shadows } from '../theme';

export default function SessionExpiredScreen() {
  const navigation = useNavigation<any>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 480,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 14,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const goToLogin = () =>
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

  const goToSignup = () =>
    navigation.reset({ index: 0, routes: [{ name: 'Signup' }] });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#2d1818', '#3d2020', '#6a4040']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
      />

      {/* Ambient rings */}
      <View style={styles.ringOuter} />
      <View style={styles.ringInner} />

      <SafeAreaView style={styles.safe}>
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Logo */}
          <View style={styles.logoWrap}>
            <AeviLogo size={52} />
          </View>

          {/* Icon */}
          <View style={[styles.iconOrb, Shadows.orb]}>
            <Text style={styles.iconText}>◉</Text>
          </View>

          {/* Copy */}
          <Text style={styles.title}>Your session{'\n'}has ended.</Text>
          <Text style={styles.subtitle}>
            For your privacy, you've been signed out.{'\n'}
            Sign back in to continue your journey.
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <PrimaryBtn label="Sign in again" onPress={goToLogin} />
            <GhostBtn
              label="Create a new account"
              onPress={goToSignup}
              style={styles.ghostWrap}
              textStyle={styles.ghostLabel}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, justifyContent: 'center' },

  ringOuter: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignSelf: 'center',
    top: '18%',
  },
  ringInner: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignSelf: 'center',
    top: '27%',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  logoWrap: {
    marginBottom: 36,
    opacity: 0.7,
  },

  iconOrb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  iconText: {
    fontSize: 32,
    color: 'rgba(255,255,255,0.35)',
  },

  title: {
    fontFamily: Typography.serif.semiBoldItalic,
    fontSize: 36,
    color: Colors.textOnDark,
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: Typography.sans.regular,
    fontSize: 15,
    color: Colors.textOnDarkMuted,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 44,
  },

  actions: {
    width: '100%',
  },
  ghostWrap: {
    marginTop: 12,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  ghostLabel: {
    color: 'rgba(255,255,255,0.8)',
  },
});
