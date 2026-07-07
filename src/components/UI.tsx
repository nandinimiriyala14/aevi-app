import React, { useRef } from 'react';
import {
  TouchableOpacity, Text, View, TextInput,
  StyleSheet, Animated, ActivityIndicator,
  StyleProp, ViewStyle, TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme';

// ── PRIMARY BUTTON ──
interface PrimaryBtnProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryBtn({ label, onPress, loading, style }: PrimaryBtnProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={loading}
      >
        <LinearGradient
          colors={['#8a6060', '#6a4040']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.primaryBtn, Shadows.btn]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textOnDark} />
          ) : (
            <Text style={styles.primaryBtnText}>{label}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── GHOST BUTTON ──
interface GhostBtnProps {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function GhostBtn({ label, onPress, style, textStyle }: GhostBtnProps) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
        onPressIn={() => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 50 }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start()}
        activeOpacity={1}
        style={styles.ghostBtn}
      >
        <Text style={[styles.ghostBtnText, textStyle]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── CARD ──
interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function Card({ children, style, onPress }: CardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  if (onPress) {
    return (
      <Animated.View style={[{ transform: [{ scale }] }]}>
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
          onPressIn={() => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 50 }).start()}
          onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start()}
          activeOpacity={1}
          style={[styles.card, Shadows.card, style]}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return <View style={[styles.card, Shadows.card, style]}>{children}</View>;
}

// ── DARK CARD ──
export function DarkCard({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.darkCard, Shadows.dark, style]}>
      {children}
    </View>
  );
}

// ── INPUT FIELD ──
interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words';
  rightElement?: React.ReactNode;
}

export function InputField({
  label, placeholder, value, onChangeText,
  secureTextEntry, keyboardType, error, autoCapitalize = 'sentences',
  rightElement,
}: InputFieldProps) {
  const borderColor = useRef(new Animated.Value(0)).current;
  const borderInterpolate = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(180,130,130,0.2)', Colors.rose],
  });

  return (
    <View style={styles.fieldWrapper}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <Animated.View style={[styles.inputWrapper, { borderColor: error ? Colors.error : borderInterpolate }]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.roseLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => Animated.timing(borderColor, { toValue: 1, duration: 200, useNativeDriver: false }).start()}
          onBlur={() => Animated.timing(borderColor, { toValue: 0, duration: 200, useNativeDriver: false }).start()}
        />
        {rightElement}
      </Animated.View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ── BACK BUTTON ──
export function BackBtn({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
      style={styles.backBtn}
    >
      <Text style={styles.backBtnText}>←</Text>
    </TouchableOpacity>
  );
}

// ── PILL TAG ──
interface PillProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Pill({ label, selected, onPress, style }: PillProps) {
  return (
    <TouchableOpacity
      onPress={() => { Haptics.selectionAsync(); onPress?.(); }}
      style={[styles.pill, selected && styles.pillSelected, style]}
      activeOpacity={0.8}
    >
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── SECTION LABEL ──
export function SectionLabel({ text, style }: { text: string; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.sectionLabel, style]}>{text}</Text>;
}

const styles = StyleSheet.create({
  primaryBtn: {
    height: 56,
    borderRadius: Radius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  primaryBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 16,
    color: Colors.textOnDark,
    letterSpacing: 0.3,
  },
  ghostBtn: {
    height: 56,
    borderRadius: Radius['2xl'],
    borderWidth: 1.5,
    borderColor: 'rgba(160,110,110,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  ghostBtnText: {
    fontFamily: Typography.sans.medium,
    fontSize: 16,
    color: '#4d2f2f',
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  darkCard: {
    backgroundColor: Colors.roseDeep,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    overflow: 'hidden',
  },
  fieldWrapper: {
    marginBottom: Spacing.base,
  },
  fieldLabel: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 10,
    color: '#9a7070',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    backgroundColor: '#faf5f4',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    fontFamily: Typography.sans.regular,
    fontSize: 15,
    color: Colors.textDark,
    padding: Spacing.base,
    paddingVertical: 14,
  },
  errorText: {
    fontFamily: Typography.sans.regular,
    fontSize: 12,
    color: Colors.error,
    marginTop: 5,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  backBtnText: {
    fontSize: 17,
    color: Colors.textDark,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: Radius.pill,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: 'rgba(180,130,130,0.2)',
  },
  pillSelected: {
    backgroundColor: '#6a4040',
    borderColor: '#6a4040',
  },
  pillText: {
    fontFamily: Typography.sans.medium,
    fontSize: 13,
    color: '#4d3030',
  },
  pillTextSelected: {
    color: Colors.textOnDark,
  },
  sectionLabel: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 10,
    color: '#b09090',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
});
