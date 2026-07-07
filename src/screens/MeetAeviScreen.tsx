import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import AeviOrb from '../components/AeviOrb';
import { Colors, Typography } from '../theme';

export default function MeetAeviScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const goalLabels: Record<string, string> = {
    reflect: 'self-reflection',
    decide: 'better decisions',
    create: 'creative writing',
    journal: 'daily journaling',
  };

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 40, friction: 8, useNativeDriver: true }),
    ]).start();

    // Navigate after 2.5s
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const goal = route.params?.goal || 'reflect';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#3D2B2B', '#5C4040', '#4A3030']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Ripple rings */}
      <View style={styles.ripple1} />
      <View style={styles.ripple2} />
      <View style={styles.ripple3} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.orb}>
          <AeviOrb size={120} />
        </View>
        <Text style={styles.title}>Meet Aevi</Text>
        <Text style={styles.subtitle}>
          I'm shaped around {goalLabels[goal] || 'your goals'}.{'\n'}Ready when you are.
        </Text>

        {/* Sparkles */}
        {['✦', '✦', '✦'].map((s, i) => (
          <Text key={i} style={[styles.sparkle, { opacity: 0.2 + i * 0.15, top: 120 + i * 80, right: 40 + i * 20 }]}>{s}</Text>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', paddingHorizontal: 32 },
  orb: { marginBottom: 36 },
  title: {
    fontFamily: Typography.serif.boldItalic,
    fontSize: 56,
    color: Colors.textOnDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Typography.sans.light,
    fontSize: 16,
    color: Colors.textOnDarkMuted,
    textAlign: 'center',
    lineHeight: 26,
  },
  ripple1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(213,180,180,0.08)',
  },
  ripple2: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(213,180,180,0.05)',
  },
  ripple3: {
    position: 'absolute',
    width: 460,
    height: 460,
    borderRadius: 230,
    borderWidth: 1,
    borderColor: 'rgba(213,180,180,0.03)',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 18,
    color: Colors.roseLight,
  },
});