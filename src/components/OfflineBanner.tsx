import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { Typography } from '../theme';

interface Props {
  visible: boolean;
}

export default function OfflineBanner({ visible }: Props) {
  const translateY = useRef(new Animated.Value(-40)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -40,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <Text style={styles.text}>No connection — your thoughts are safe ✦</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: '#5C4A4A',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    fontFamily: Typography.sans.light,
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
  },
});
