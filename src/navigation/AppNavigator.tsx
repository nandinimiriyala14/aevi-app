import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import SessionExpiredScreen from '../screens/SessionExpiredScreen';
import OnboardingGoalScreen from '../screens/OnboardingGoalScreen';
import OnboardingVoiceScreen from '../screens/OnboardingVoiceScreen';
import MeetAeviScreen from '../screens/MeetAeviScreen';
import ChatScreen from '../screens/ChatScreen';
import JournalScreen from '../screens/JournalScreen';
import EntryDetailScreen from '../screens/EntryDetailScreen';
import NewEntryScreen from '../screens/NewEntryScreen';
import InsightsScreen from '../screens/InsightsScreen';
import UpgradeScreen from '../screens/UpgradeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import PrivacySettingsScreen from '../screens/PrivacySettingsScreen';
import DeleteAccountScreen from '../screens/DeleteAccountScreen';
import AppPreferencesScreen from '../screens/AppPreferencesScreen';
import CheckoutSuccessScreen from '../screens/CheckoutSuccessScreen';
import RestorePurchasesScreen from '../screens/RestorePurchasesScreen';
import SubscriptionManagementScreen from '../screens/SubscriptionManagementScreen';
import ContentCreatorScreen from '../screens/ContentCreatorScreen';

import { Colors, Typography } from '../theme';

// ─────────────────────────────────────────────────────────────────────────────
// Navigators
// ─────────────────────────────────────────────────────────────────────────────

const AuthNav = createNativeStackNavigator();
const MainNav = createNativeStackNavigator();
const Tab     = createBottomTabNavigator();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// ─────────────────────────────────────────────────────────────────────────────
// Loading screen — shown while Supabase resolves the initial session
// ─────────────────────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Image source={require('../../assets/icon.png')} style={{ width: 72, height: 72, borderRadius: 36 }} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab navigator
// ─────────────────────────────────────────────────────────────────────────────

function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: false,
        tabBarStyle: [styles.tabBar, { paddingBottom: insets.bottom + 6, height: 54 + insets.bottom }],
        tabBarActiveTintColor: '#3D2B2B',
        tabBarInactiveTintColor: '#A08888',
        tabBarShowLabel: true,
        tabBarButton: (props) => (
          <TouchableOpacity
            {...(props as any)}
            onPress={(e: any) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              props.onPress?.(e);
            }}
          />
        ),
        tabBarIcon: ({ focused }) => {
          const color = focused ? '#3D2B2B' : '#A08888';
          let name: IoniconName = 'chatbubble-outline';
          if (route.name === 'Chat')          name = focused ? 'chatbubble'      : 'chatbubble-outline';
          else if (route.name === 'Journal')  name = focused ? 'book'            : 'book-outline';
          else if (route.name === 'Insights') name = focused ? 'bar-chart'       : 'bar-chart-outline';
          else if (route.name === 'Profile')  name = focused ? 'person'          : 'person-outline';
          return <Ionicons name={name} size={22} color={color} />;
        },
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="Chat"     component={ChatScreen} />
      <Tab.Screen name="Journal"  component={JournalScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Profile"  component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth stack — shown when no session
// ─────────────────────────────────────────────────────────────────────────────

function AuthStack({ initialRoute }: { initialRoute: string }) {
  return (
    <AuthNav.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: Colors.bg },
      }}
    >
      <AuthNav.Screen name="Welcome"        component={WelcomeScreen} />
      <AuthNav.Screen name="Login"          component={LoginScreen} />
      <AuthNav.Screen name="Signup"         component={SignupScreen} />
      <AuthNav.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthNav.Screen name="ResetPassword"  component={ResetPasswordScreen} />
    </AuthNav.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main stack — shown when session exists
// ─────────────────────────────────────────────────────────────────────────────

function MainStack({ initialRoute }: { initialRoute: string }) {
  return (
    <MainNav.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: Colors.bg },
      }}
    >
      {/* Onboarding — shown on first launch after signup */}
      <MainNav.Screen name="OnboardingGoal"  component={OnboardingGoalScreen} />
      <MainNav.Screen name="OnboardingVoice" component={OnboardingVoiceScreen} />
      <MainNav.Screen
        name="MeetAevi"
        component={MeetAeviScreen}
        options={{ animation: 'fade' }}
      />

      {/* Main app */}
      <MainNav.Screen name="Main" component={MainTabs} />

      {/* Journal */}
      <MainNav.Screen name="EntryDetail" component={EntryDetailScreen} />
      <MainNav.Screen
        name="NewEntry"
        component={NewEntryScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
      />

      {/* Upgrade */}
      <MainNav.Screen
        name="Upgrade"
        component={UpgradeScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
      />

      {/* Profile & settings */}
      <MainNav.Screen name="EditProfile"            component={EditProfileScreen} />
      <MainNav.Screen name="NotificationSettings"   component={NotificationSettingsScreen} />
      <MainNav.Screen name="PrivacySettings"        component={PrivacySettingsScreen} />
      <MainNav.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
      />
      <MainNav.Screen name="AppPreferences"         component={AppPreferencesScreen} />

      {/* Purchases */}
      <MainNav.Screen
        name="CheckoutSuccess"
        component={CheckoutSuccessScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <MainNav.Screen name="RestorePurchases"       component={RestorePurchasesScreen} />
      <MainNav.Screen name="SubscriptionManagement" component={SubscriptionManagementScreen} />

      {/* Content */}
      <MainNav.Screen name="ContentCreator" component={ContentCreatorScreen} />

      {/* Session expired — navigated to manually when a 401 is detected */}
      <MainNav.Screen
        name="SessionExpired"
        component={SessionExpiredScreen}
        options={{ animation: 'fade' }}
      />
    </MainNav.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root navigator
// ─────────────────────────────────────────────────────────────────────────────

type AuthState = 'loading' | 'authed' | 'unauthed';

export default function AppNavigator() {
  const [authState,        setAuthState]        = useState<AuthState>('loading');
  const [initialMainRoute, setInitialMainRoute] = useState('Main');
  const [initialAuthRoute, setInitialAuthRoute] = useState('Welcome');
  const wasAuthed = useRef(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          // If the user had an active session, this is a token expiry or forced sign-out —
          // send them straight to Login. First-time users (never authed) stay on Welcome.
          setInitialAuthRoute(wasAuthed.current ? 'Login' : 'Welcome');
          wasAuthed.current = false;
          setAuthState('unauthed');
          return;
        }

        // INITIAL_SESSION fires on mount; SIGNED_IN fires after login/signup.
        // For both, check whether onboarding has been completed.
        if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && session) {
          wasAuthed.current = true;
          const prefs = await AsyncStorage.getItem('aevi_user_prefs');
          setInitialMainRoute(prefs ? 'Main' : 'OnboardingGoal');
          setAuthState('authed');
          return;
        }

        // INITIAL_SESSION with no session → not logged in
        if (event === 'INITIAL_SESSION' && !session) {
          setAuthState('unauthed');
        }

        // TOKEN_REFRESHED / USER_UPDATED → session still valid, no navigation change
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  if (authState === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {authState === 'authed'
        ? <MainStack initialRoute={initialMainRoute} />
        : <AuthStack initialRoute={initialAuthRoute} />
      }
    </NavigationContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FDF6F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: 'rgba(240,219,217,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(180,130,130,0.2)',
    paddingTop: 8,
  },
  tabLabel: {
    fontFamily: Typography.sans.medium,
    fontSize: 10,
  },
});
