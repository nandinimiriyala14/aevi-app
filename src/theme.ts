/**
 * Aevi Design System
 *
 * Single source of truth for every visual token in the app.
 * Import what you need: Colors, Typography, FontSize, Spacing,
 * Radius, Shadows, and the component-style factories at the bottom.
 */

import { StyleSheet } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────────────────────────────────────

export const Colors = {
  // ── Backgrounds ────────────────────────────────────────────────────────────
  bg:          '#f0dbd9',   // default screen background
  bgWarm:      '#f5ede9',   // warmer surface (Profile, Journal, Upgrade)
  bgChat:      '#f5ebeb',   // Chat screen
  bgDark:      '#3d2020',   // dark card / surface
  bgDarkDeep:  '#2d1818',   // deepest dark (mantra card, nav)

  // ── Brand rose scale ───────────────────────────────────────────────────────
  rose:        '#867070',
  roseDark:    '#5a3535',   // active tab, primary text accents
  roseDeep:    '#3d2020',   // dark gradient end, active tone button
  roseMid:     '#9a7878',   // subtitles, muted icons
  roseLight:   '#c8a0a0',   // placeholders, typing dots, avatar bg light
  roseBlush:   'rgba(180,130,130,0.2)',   // borders, dividers
  rosePale:    '#f5eeec',   // idle tag/pill backgrounds
  roseGlass:   'rgba(228,208,208,0.35)',

  // ── Avatar & icon ─────────────────────────────────────────────────────────
  avatarBg:     '#9a6868',                  // all circular avatars
  avatarBorder: 'rgba(160,110,110,0.3)',

  // ── Surfaces ──────────────────────────────────────────────────────────────
  card:          '#FFFFFF',
  cardGlass:     'rgba(255,255,255,0.75)',  // login / signup form card
  cardGlassWarm: 'rgba(255,255,255,0.7)',   // onboarding header card, back btn
  inputBg:       '#faf5f4',
  border:        'rgba(180,130,130,0.2)',
  borderLight:   'rgba(213,180,180,0.3)',
  borderMedium:  'rgba(160,110,110,0.3)',
  borderStrong:  'rgba(160,110,110,0.4)',   // ghost button border

  // ── Chat specific ─────────────────────────────────────────────────────────
  chatInputBg:     '#fdfaf9',
  chatInputBorder: '#e4d0d0',
  chatAeviBg:      'rgba(253,250,249,0.9)',
  chatUserBg:      '#867070',
  chatChipBg:      'rgba(255,255,255,0.8)',
  chatIconColor:   '#807474',
  chatHeaderBg:    'rgba(250,243,242,0.97)',

  // ── Text ──────────────────────────────────────────────────────────────────
  textDark:       '#2d1818',  // primary headings & body
  textMid:        '#9a7878',  // subtitles, muted copy
  textLight:      '#b09090',  // labels, captions
  textDim:        '#4f4444',  // aevi bubble text
  textLink:       '#7a5555',  // forgot password, inline links
  textGhost:      '#4d2f2f',  // ghost button label
  textOnDark:     '#FFFFFF',
  textOnDarkMuted:'rgba(255,255,255,0.65)',
  textOnDarkDim:  'rgba(255,255,255,0.5)',

  // ── Status & functional ───────────────────────────────────────────────────
  online:   '#22c55e',
  success:  '#1D9E75',
  error:    '#E53E3E',
  errorBg:  'rgba(229,62,62,0.08)',
  errorBorder: 'rgba(229,62,62,0.2)',

  // ── Warning card ──────────────────────────────────────────────────────────
  warningBg:     '#fde8e8',
  warningBorder: 'rgba(200,140,140,0.2)',
  warningIcon:   '#c87878',
  warningText:   '#7a4545',

  // ── Journal mood badges ───────────────────────────────────────────────────
  moodReflective: '#9a7878',
  moodGrateful:   '#7a9a7a',
  moodMelancholy: '#7a7a9a',
  moodRestless:   '#b09090',

  // ── Gradients (use as `colors` prop for LinearGradient) ───────────────────
  gradientHero:        ['#e2c8c5', '#ebd4d1', '#f0dbd9', '#f0dbd9'] as string[],
  gradientOrb:         ['#ddb8b8', '#b08888', '#907070'] as string[],
  gradientBtn:         ['#8a6060', '#6a4040'] as string[],
  gradientDark:        ['#5a3535', '#3d2020'] as string[],
  gradientPremium:     ['#8a6060', '#5a3535'] as string[],
  gradientImageCircle: ['#ddb8b8', '#b08888'] as string[],
};

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────────────────────────────────────

export const Typography = {
  /** Playfair Display — headings, emotional moments, quotes */
  serif: {
    regular:        'PlayfairDisplay_400Regular',
    italic:         'PlayfairDisplay_400Regular_Italic',
    semiBold:       'PlayfairDisplay_600SemiBold',
    semiBoldItalic: 'PlayfairDisplay_600SemiBold_Italic',
    bold:           'PlayfairDisplay_700Bold',
    boldItalic:     'PlayfairDisplay_700Bold_Italic',
  },
  /** Outfit — all body text, labels, buttons, inputs */
  sans: {
    light:    'Outfit_300Light',
    regular:  'Outfit_400Regular',
    medium:   'Outfit_500Medium',
    semiBold: 'Outfit_600SemiBold',
    bold:     'Outfit_700Bold',
  },
};

/** Numeric size scale — maps semantic names to px values */
export const FontSize = {
  xs:    10,   // uppercase labels, chart ticks, footer notes
  sm:    11,   // mood badge text, tag text, chip icons
  base:  12,   // captions, card subtitles, feature descriptions
  md:    13,   // body cards, form subtitles, promo text
  body:  14,   // primary reading text, inputs, message bubbles
  lg:    15,   // button labels, topic pills, nav sub-links
  xl:    16,   // header names, large button CTA
  '2xl': 17,   // mantra text, upgrade secondary button
  '3xl': 18,   // journal card titles, memory quotes
  '4xl': 22,   // quiet hours display
  '5xl': 28,   // upgrade headline
  '6xl': 30,   // screen titles (Insights, Reflections)
  '7xl': 36,   // home greeting name
  '8xl': 38,   // login / signup serif title
  '9xl': 42,   // upgrade price
  hero:  56,   // MeetAevi display title
};

export const LineHeight = {
  tight:   1.2,
  snug:    1.4,
  normal:  1.5,
  relaxed: 1.6,
  body:    22,   // use with FontSize.body for prose
  quote:   25.5,
};

export const LetterSpacing = {
  normal:  0.2,
  medium:  0.55,
  wide:    0.8,
  wider:   1.2,
  widest:  1.5,
  ultra:   2,
};

// ─────────────────────────────────────────────────────────────────────────────
// SPACING
// ─────────────────────────────────────────────────────────────────────────────

export const Spacing = {
  xs:      4,
  sm:      8,
  md:      12,
  base:    16,
  lg:      20,
  xl:      24,
  '2xl':   32,
  '3xl':   40,
  '4xl':   48,
  '5xl':   64,
  screenH: 20,   // standard horizontal screen padding
};

// ─────────────────────────────────────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────────────────────────────────────

export const Radius = {
  sm:   10,
  md:   14,
  lg:   18,
  xl:   20,
  '2xl': 24,
  pill: 100,
  full: 9999,
};

// ─────────────────────────────────────────────────────────────────────────────
// SHADOWS
// ─────────────────────────────────────────────────────────────────────────────

export const Shadows = {
  /** Subtle elevation for white cards on light backgrounds */
  card: {
    shadowColor:   '#7a5555',
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius:  8,
    elevation:     3,
  },
  /** Medium elevation for stacked cards */
  cardMd: {
    shadowColor:   '#7a5555',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius:  12,
    elevation:     5,
  },
  /** Primary button depth */
  btn: {
    shadowColor:   '#6a4040',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius:  16,
    elevation:     8,
  },
  /** Floating action button */
  fab: {
    shadowColor:   '#3c1e1e',
    shadowOffset:  { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius:  12,
    elevation:     8,
  },
  /** AeviLogo orb glow */
  orb: {
    shadowColor:   '#7A5050',
    shadowOffset:  { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius:  40,
    elevation:     15,
  },
  /** Dark surface cards */
  dark: {
    shadowColor:   '#2d1818',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius:  20,
    elevation:     10,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT STYLE FACTORIES
// Pre-built StyleSheet objects you can spread directly into component styles.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Standard tab-screen header: avatar circle + name + icon button.
 * Usage: spread HeaderStyles.header, HeaderStyles.avatar, etc.
 */
export const HeaderStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(180,130,130,0.12)',
  },
  headerBg: {
    backgroundColor: 'rgba(245,237,233,0.97)',
  },
  headerBgChat: {
    backgroundColor: 'rgba(250,243,242,0.97)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.avatarBorder,
  },
  avatarText: {
    fontSize: FontSize.base,
    color: Colors.textOnDark,
    fontFamily: Typography.sans.semiBold,
  },
  name: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textDark,
  },
  btn: {
    padding: 6,
  },
});

/**
 * Card surface variants.
 * Usage: <View style={[CardStyles.base, Shadows.card]}>
 */
export const CardStyles = StyleSheet.create({
  base: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
  },
  glass: {
    backgroundColor: Colors.cardGlass,
    borderRadius: Radius['2xl'],
    padding: Spacing.lg,
  },
  glassWarm: {
    backgroundColor: Colors.cardGlassWarm,
    borderRadius: Radius['2xl'],
    padding: Spacing.lg,
  },
  dark: {
    backgroundColor: Colors.bgDark,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  deepDark: {
    backgroundColor: Colors.bgDarkDeep,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  promo: {
    backgroundColor: '#f0e5e3',
    borderRadius: Radius.xl,
    padding: Spacing.base,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.warningBg,
    borderWidth: 1,
    borderColor: Colors.warningBorder,
    borderRadius: Radius.xl,
    padding: Spacing.base,
  },
});

/**
 * Avatar size presets.
 * Usage: <View style={AvatarSizes.md}>
 */
export const AvatarSizes = StyleSheet.create({
  /** 28×28 — chat message sender icon */
  sm: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.roseLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** 36×36 — header avatar across all tabs */
  md: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.avatarBorder,
  },
  /** 42×42 — chat screen header */
  lg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** 76×76 — Profile screen main avatar */
  xl: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.avatarBorder,
  },
});

/**
 * Button style presets (height/shape only — pair with LinearGradient or backgroundColor).
 */
export const ButtonStyles = StyleSheet.create({
  /** Full-width gradient CTA */
  primary: {
    height: 56,
    borderRadius: Radius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.btn,
  },
  primaryText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSize.xl,
    color: Colors.textOnDark,
    letterSpacing: LetterSpacing.normal,
  },
  /** Outlined ghost button */
  ghost: {
    height: 56,
    borderRadius: Radius['2xl'],
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSize.xl,
    color: Colors.textGhost,
  },
  /** White outlined secondary (Upgrade screen) */
  secondary: {
    height: 56,
    borderRadius: Radius['2xl'],
    borderWidth: 1.5,
    borderColor: 'rgba(160,110,110,0.3)',
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontFamily: Typography.sans.medium,
    fontSize: FontSize.lg,
    color: Colors.roseDark,
  },
  /** Small pill button (onboarding next, FAB) */
  pill: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.btn,
  },
  pillText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textOnDark,
  },
});

/**
 * Chat message bubble styles.
 */
export const BubbleStyles = StyleSheet.create({
  aevi: {
    backgroundColor: Colors.chatAeviBg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    padding: 14,
    paddingVertical: 12,
    ...Shadows.card,
  },
  aeviText: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSize.body,
    color: Colors.textDim,
    lineHeight: LineHeight.body,
  },
  user: {
    backgroundColor: Colors.chatUserBg,
    borderRadius: 20,
    borderTopRightRadius: 4,
    padding: 14,
    paddingVertical: 12,
  },
  userText: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSize.body,
    color: Colors.textOnDark,
    lineHeight: LineHeight.body,
  },
});

/**
 * Quick-action chip (Chat screen).
 */
export const ChipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    backgroundColor: Colors.chatChipBg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    ...Shadows.card,
  },
  chipIcon: {
    fontSize: FontSize.sm,
    color: Colors.chatIconColor,
  },
  chipText: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSize.base,
    color: Colors.chatIconColor,
  },
});

/**
 * Badge and tag variants.
 */
export const BadgeStyles = StyleSheet.create({
  /** Idle pill tag (Recurring Echoes, goal chips) */
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.rosePale,
  },
  pillText: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSize.base,
    color: Colors.roseDark,
  },
  /** Active/highlighted pill */
  pillActive: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: '#6a4040',
  },
  pillActiveText: {
    fontFamily: Typography.sans.medium,
    fontSize: FontSize.base,
    color: Colors.textOnDark,
  },
  /** Status badge (Insights "Steady Growth") */
  feature: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Colors.warningBg,
  },
  featureText: {
    fontFamily: Typography.sans.medium,
    fontSize: FontSize.base,
    color: '#9a5555',
  },
  /** Uppercase section label */
  sectionLabel: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSize.xs,
    color: Colors.textLight,
    letterSpacing: LetterSpacing.widest,
  },
});

/**
 * Onboarding step progress dots.
 */
export const ProgressDots = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(180,130,130,0.4)',
  },
  dotActive: {
    width: 28,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7a5555',
  },
});

/**
 * Accent bar used on memory / storage cards (3px left border effect).
 */
export const AccentBar = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 3,
    height: '100%',
    backgroundColor: Colors.bgDark,
  },
});

/**
 * Journal mood badge — pass the moodColor as backgroundColor with 18% opacity.
 * Usage: { ...MoodBadge.base, backgroundColor: moodColor + '18' }
 */
export const MoodBadge = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  text: {
    fontFamily: Typography.sans.medium,
    fontSize: FontSize.sm,
    letterSpacing: LetterSpacing.normal,
  },
});

/**
 * Input field base style.
 */
export const InputStyles = StyleSheet.create({
  wrapper: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  label: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSize.xs,
    color: '#9a7070',
    letterSpacing: LetterSpacing.widest,
    marginBottom: 6,
  },
  text: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSize.body,
    color: Colors.textDark,
  },
  errorText: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSize.base,
    color: Colors.error,
    marginTop: 4,
  },
});

export const InputPlaceholderColor = Colors.roseLight;
