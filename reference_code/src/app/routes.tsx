import { createBrowserRouter } from 'react-router';
import { MobileFrame } from './components/layout/MobileFrame';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { SignupScreen } from './components/screens/SignupScreen';
import { OnboardingGoalScreen } from './components/screens/OnboardingGoalScreen';
import { OnboardingVoiceScreen } from './components/screens/OnboardingVoiceScreen';
import { ChatScreen } from './components/screens/ChatScreen';
import { ReflectionJournalScreen } from './components/screens/ReflectionJournalScreen';
import { ContentCreatorScreen } from './components/screens/ContentCreatorScreen';
import { InsightsScreen } from './components/screens/InsightsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { PremiumUpgradeScreen } from './components/screens/PremiumUpgradeScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MobileFrame,
    children: [
      // Auth flow
      { index: true, Component: WelcomeScreen },
      { path: 'login', Component: LoginScreen },
      { path: 'signup', Component: SignupScreen },

      // Onboarding
      { path: 'onboarding', Component: OnboardingGoalScreen },
      { path: 'onboarding/voice', Component: OnboardingVoiceScreen },

      // Main app tabs
      { path: 'chat', Component: ChatScreen },
      { path: 'journal', Component: ReflectionJournalScreen },
      { path: 'insights', Component: InsightsScreen },
      { path: 'profile', Component: ProfileScreen },

      // Sub-screens
      { path: 'create', Component: ContentCreatorScreen },
      { path: 'premium', Component: PremiumUpgradeScreen },
    ],
  },
]);
