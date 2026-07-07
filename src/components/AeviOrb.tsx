import React, { useEffect, useRef } from 'react';
import { Animated, Image, Easing } from 'react-native';

interface AeviOrbProps {
  size?: number;
}

export default function AeviOrb({ size = 140 }: AeviOrbProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring2Scale = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    const ringLoop = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1.08,
            duration: 2400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 1,
            duration: 2400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

    ringLoop(ring1Scale, 0).start();
    ringLoop(ring2Scale, 400).start();
  }, []);

  const ring1Size = size * 1.3;
  const ring2Size = size * 1.6;

  return (
    <Animated.View
      style={{
        opacity: fade,
        alignItems: 'center',
        justifyContent: 'center',
        width: size * 1.6,
        height: size * 1.6,
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          width: ring1Size,
          height: ring1Size,
          borderRadius: size * 0.65,
          borderWidth: 1,
          borderColor: 'rgba(154, 104, 104, 0.2)',
          transform: [{ scale: ring1Scale }],
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          width: ring2Size,
          height: ring2Size,
          borderRadius: size * 0.8,
          borderWidth: 1,
          borderColor: 'rgba(154, 104, 104, 0.1)',
          transform: [{ scale: ring2Scale }],
        }}
      />
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: size, height: size, resizeMode: 'contain' }}
        />
      </Animated.View>
    </Animated.View>
  );
}
