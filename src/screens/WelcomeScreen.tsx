import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { PrimaryBtn, GhostBtn } from '../components/UI';
import AeviOrb from '../components/AeviOrb';
import { Typography, Spacing } from '../theme';

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  const logoAnim    = useRef(new Animated.Value(0)).current;
  const dividerAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const btnsAnim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(130, [
      Animated.spring(logoAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.spring(dividerAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.spring(taglineAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.spring(btnsAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
    ]).start();
  }, []);

  const animStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#e2c8c5', '#ebd4d1', '#f0dbd9', '#f0dbd9']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <SafeAreaView style={styles.safe}>
        {/* Hero */}
        <View style={styles.hero}>
          <Animated.View style={animStyle(logoAnim)}>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 8 }}>
              <AeviOrb size={140} />
              <Text style={styles.logoText}>Aevi</Text>
            </View>
          </Animated.View>

          {/* Diamond divider */}
          <Animated.View style={[styles.divider, animStyle(dividerAnim)]}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerDiamond}>◆</Text>
            <View style={styles.dividerLine} />
          </Animated.View>

          {/* Tagline */}
          <Animated.View style={[styles.taglineBlock, animStyle(taglineAnim)]}>
            <Text style={styles.taglineTitle}>Meet your alter ego.</Text>
            <Text style={styles.taglineSub}>
              A companion that remembers,{'\n'}reflects, and evolves with you.
            </Text>
          </Animated.View>
        </View>

        {/* Buttons */}
        <Animated.View style={[styles.buttons, animStyle(btnsAnim)]}>
          <PrimaryBtn
            label="Let's Begin"
            onPress={() => navigation.navigate('Signup')}
          />
          <GhostBtn
            label="Sign In"
            onPress={() => navigation.navigate('Login')}
          />
          <Text style={styles.footerTag}>PRIVATE · REMEMBERED · YOURS</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenH,
    paddingTop: 48,
    gap: 0,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 28,
    marginBottom: 28,
    width: 130,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(160,110,110,0.4)' },
  dividerDiamond: { fontSize: 8, color: 'rgba(170,120,120,0.6)' },
  taglineBlock: { alignItems: 'center', paddingHorizontal: 16 },
  taglineTitle: {
    fontFamily: Typography.serif.semiBold,
    fontSize: 30,
    color: '#2d1818',
    lineHeight: 39,
    marginBottom: 14,
    textAlign: 'center',
  },
  taglineSub: {
    fontFamily: Typography.sans.regular,
    fontSize: 15,
    color: '#8a6868',
    lineHeight: 25,
    textAlign: 'center',
    maxWidth: 260,
  },
  buttons: {
    paddingHorizontal: Spacing.screenH,
    paddingBottom: 48,
    gap: 12,
  },
  footerTag: {
    fontFamily: Typography.sans.medium,
    fontSize: 10,
    color: '#b89898',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 4,
  },
  logoText: {
    fontFamily: Typography.serif.semiBoldItalic,
    fontSize: 58,
    color: '#2d1818',
    letterSpacing: -1,
    marginTop: -4,
  },
});
