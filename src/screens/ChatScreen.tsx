import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Animated, ActivityIndicator, Image, Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import {
  sendMessage, getSession,
  getConversationMessages, supabase,
} from '../services/supabase';
import { Typography, Shadows } from '../theme';
import TextActionSheet from '../components/TextActionSheet';

const DAILY_COUNT_KEY = 'aevi_daily_msg_count';
const GREETING_KEY    = 'aevi_last_greeting_date';

// ─────────────────────────────────────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'divider';
  content: string;
  ts: number;
  type?: 'insight' | 'rewrite';
  loading?: boolean;
}

const STARTER_PROMPTS = [
  "I've been feeling stuck lately.",
  "Help me think through a decision.",
  "Reflect on how this week went.",
];

// ─────────────────────────────────────────────────────────────────────────────
// Typing indicator
// ─────────────────────────────────────────────────────────────────────────────

function TypingIndicator() {
  const d1 = useRef(new Animated.Value(0)).current;
  const d2 = useRef(new Animated.Value(0)).current;
  const d3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = (d: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(d, { toValue: -5, duration: 280, useNativeDriver: true }),
        Animated.timing(d, { toValue: 0,  duration: 280, useNativeDriver: true }),
        Animated.delay(380),
      ]));
    const a1 = anim(d1, 0); const a2 = anim(d2, 180); const a3 = anim(d3, 360);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [d1, d2, d3]);

  return (
    <View style={s.typingRow}>
      <Image source={require('../../assets/logo.png')} style={{ width: 28, height: 28, resizeMode: 'contain' }} />
      <View style={s.typingBubble}>
        {[d1, d2, d3].map((d, i) => (
          <Animated.View key={i} style={[s.typingDot, { transform: [{ translateY: d }] }]} />
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────────────────────

function EmptyState({ onSend }: { onSend: (p: string) => void }) {
  return (
    <View style={s.emptyOuter}>
      <View style={s.emptyInner}>
        <Image source={require('../../assets/logo.png')} style={{ width: 72, height: 72, resizeMode: 'contain', marginBottom: 20 }} />
        <Text style={s.emptyHeading}>What's on your mind?</Text>
        <Text style={s.emptySub}>
          A thought, a feeling, a decision —{'\n'}bring it here.
        </Text>
        <View style={s.pillsWrap}>
          {STARTER_PROMPTS.map((p) => (
            <TouchableOpacity
              key={p}
              style={s.pill}
              activeOpacity={0.7}
              onPress={() => { Haptics.selectionAsync(); onSend(p); }}
            >
              <Text style={s.pillText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers (module-level so they are stable references)
// ─────────────────────────────────────────────────────────────────────────────

const fmt = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

async function fetchMessages(): Promise<Message[]> {
  const rows = await getConversationMessages();
  const seen = new Set<string>();
  return rows
    .filter(m => {
      const key = m.role + m.content + m.created_at.slice(0, 16);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(m => ({
      id:      m.id,
      role:    m.role,
      content: m.content,
      ts:      new Date(m.created_at).getTime(),
    }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Highlight helper — renders text with query matches highlighted
// ─────────────────────────────────────────────────────────────────────────────

function HighlightText({ text, query, style }: { text: string; query: string; style: any }) {
  if (!query) return <Text selectable style={style}>{text}</Text>;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const parts: { t: string; hi: boolean }[] = [];
  let last = 0;
  let idx = lower.indexOf(q);
  while (idx !== -1) {
    if (idx > last) parts.push({ t: text.slice(last, idx), hi: false });
    parts.push({ t: text.slice(idx, idx + q.length), hi: true });
    last = idx + q.length;
    idx = lower.indexOf(q, last);
  }
  if (last < text.length) parts.push({ t: text.slice(last), hi: false });
  return (
    <Text selectable style={style}>
      {parts.map((p, i) =>
        p.hi
          ? <Text key={i} style={s.searchHighlight}>{p.t}</Text>
          : <React.Fragment key={i}>{p.t}</React.Fragment>
      )}
    </Text>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Message bubble — memoised so only changed items re-render
// ─────────────────────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  item: Message;
  onTextAction: (text: string, id: string) => void;
  searchQuery?: string;
}

const MessageBubble = React.memo(({ item, onTextAction, searchQuery = '' }: MessageBubbleProps) => {
  // ── Topic divider ───────────────────────────────────────────────────────────
  if (item.role === 'divider') {
    return (
      <View style={s.dividerRow}>
        <View style={s.dividerLine} />
        <Text style={s.dividerText}>— {item.content} —</Text>
        <View style={s.dividerLine} />
      </View>
    );
  }

  // ── Insight card ────────────────────────────────────────────────────────────
  if (item.type === 'insight') {
    return (
      <View style={s.specialWrap}>
        <View style={s.insightBubble}>
          {item.loading ? (
            <ActivityIndicator size="small" color="#9A7070" />
          ) : (
            <>
              <View style={s.specialHeader}>
                <Text style={s.insightIcon}>✦</Text>
                <Text style={s.insightLabel}>Insight</Text>
              </View>
              <Text style={s.insightBodyText}>{item.content}</Text>
            </>
          )}
        </View>
      </View>
    );
  }

  // ── Rewrite suggestion card ─────────────────────────────────────────────────
  if (item.type === 'rewrite') {
    return (
      <View style={s.specialWrap}>
        <TouchableOpacity
          style={s.rewriteBubble}
          activeOpacity={0.75}
          onPress={() => {
            if (item.loading) return;
            Share.share({ message: item.content });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
        >
          {item.loading ? (
            <ActivityIndicator size="small" color="#9A7070" />
          ) : (
            <>
              <View style={s.specialHeader}>
                <Text style={s.rewriteLabel}>Rewritten in your voice</Text>
                <Ionicons name="share-outline" size={14} color="#9A7070" />
              </View>
              <Text style={s.rewriteBodyText}>{item.content}</Text>
              <Text style={s.rewriteHint}>Tap to share or copy</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // ── Regular message ─────────────────────────────────────────────────────────
  const isUser = item.role === 'user';
  return (
    <View style={[s.bubbleWrap, isUser ? s.bubbleWrapUser : s.bubbleWrapAevi]}>
      {!isUser && (
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 28, height: 28, resizeMode: 'contain', marginRight: 8, marginTop: 18, flexShrink: 0 }}
        />
      )}
      <View style={{ flex: 1, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        <View style={[s.senderRow, isUser && s.senderRowUser]}>
          <Text style={[s.senderLabel, isUser && s.senderLabelUser]}>
            {isUser ? 'You' : 'Aevi'} {fmt(item.ts)}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          delayLongPress={400}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onTextAction(item.content, item.id);
          }}
        >
          <View style={[s.bubble, isUser ? s.bubbleUser : s.bubbleAevi]}>
            <HighlightText
              text={item.content}
              query={searchQuery}
              style={[s.bubbleText, isUser && s.bubbleTextUser]}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const { top }    = useSafeAreaInsets();
  const flatRef    = useRef<FlatList>(null);
  const isAtBottom = useRef(true);
  const hasFetched = useRef(false);
  const isSending  = useRef(false);
  const sendLock   = useRef(false);
  const { isConnected } = useNetInfo();
  const isOffline = isConnected === false;

  const [messages,      setMessages]      = useState<Message[]>([]);
  const [input,         setInput]         = useState('');
  const [sending,       setSending]       = useState(false);
  const [loading,       setLoading]       = useState(true);
  const [fetchError,    setFetchError]    = useState(false);
  const [toast,         setToast]         = useState<string | null>(null);
  const toastAnim  = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [userName,      setUserName]      = useState('');
  const [userAvatar,    setUserAvatar]    = useState<string | null>(null);
  const [apiError,       setApiError]       = useState<string | null>(null);
  const [limitReached,   setLimitReached]   = useState(false);
  const [plan,           setPlan]           = useState<'free' | 'plus' | 'pro'>('free');
  const [selectedText,      setSelectedText]      = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState('');
  const [showActionSheet,   setShowActionSheet]   = useState(false);
  const [searchVisible,     setSearchVisible]     = useState(false);
  const [searchQuery,       setSearchQuery]       = useState('');
  const [filteredMessages,  setFilteredMessages]  = useState<Message[]>([]);
  const searchInputRef = useRef<TextInput>(null);
  const searchAnim     = useRef(new Animated.Value(0)).current;
  const apiErrorTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);


  // ── Load session + daily count ───────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true); setFetchError(false);
    try {
      const [session, greetingDate] = await Promise.all([
        getSession(),
        AsyncStorage.getItem(GREETING_KEY),
      ]);

      let firstName = 'Friend';
      if (session?.user) {
        const fullName = session.user.user_metadata?.full_name || 'Friend';
        firstName = fullName.split(' ')[0] || fullName;
        setUserName(fullName);
        setUserAvatar(session.user.user_metadata?.avatar_url || null);
      }

      let userPlan: 'free' | 'plus' | 'pro' = 'free';
      if (session?.user?.id) {
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('plan')
          .eq('user_id', session.user.id)
          .single();
        console.log('Plan from Supabase:', subData?.plan);
        userPlan = (subData?.plan as 'free' | 'plus' | 'pro') || 'free';
      }
      setPlan(userPlan);
      if (userPlan === 'plus' || userPlan === 'pro') {
        setLimitReached(false);
      }
      console.log('User plan:', userPlan);

      setMessages(await fetchMessages());

      // Daily greeting — local only, shown once per calendar day
      const today = new Date().toISOString().slice(0, 10);
      if (greetingDate !== today) {
        const greetingContent = `Welcome back ✦ What's on your mind today, ${firstName}?`;
        setMessages(p => [...p, { id: 'greeting-' + Date.now(), role: 'assistant', content: greetingContent, ts: Date.now() }]);
        await AsyncStorage.setItem(GREETING_KEY, today);
      }
    } catch { setFetchError(true); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (isSending.current) return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (apiErrorTimer.current) clearTimeout(apiErrorTimer.current); }, []);


  useEffect(() => {
    if (!searchQuery.trim()) { setFilteredMessages([]); return; }
    const q = searchQuery.toLowerCase();
    setFilteredMessages(
      messages.filter(m =>
        (m.role === 'user' || m.role === 'assistant') &&
        m.content.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, messages]);

  // ── Search ──────────────────────────────────────────────────────────────────

  const openSearch = () => {
    setSearchVisible(true);
    Animated.timing(searchAnim, { toValue: 1, duration: 220, useNativeDriver: false }).start(() => {
      searchInputRef.current?.focus();
    });
  };

  const closeSearch = () => {
    setSearchQuery('');
    Animated.timing(searchAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start(() => {
      setSearchVisible(false);
      setFilteredMessages([]);
    });
  };

  // ── Send message ────────────────────────────────────────────────────────────

  const showApiError = (msg: string) => {
    setApiError(msg);
    if (apiErrorTimer.current) clearTimeout(apiErrorTimer.current);
    apiErrorTimer.current = setTimeout(() => setApiError(null), 4000);
  };

  const bumpDailyCount = async () => {
    const today = new Date().toISOString().slice(0, 10);
    let count = 1;
    try {
      const raw = await AsyncStorage.getItem(DAILY_COUNT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        count = parsed.date === today ? parsed.count + 1 : 1;
      }
      await AsyncStorage.setItem(DAILY_COUNT_KEY, JSON.stringify({ date: today, count }));
    } catch { /* non-critical */ }
  };

  const send = async (text?: string) => {
    if (sending || sendLock.current) return;
    const content = (text ?? input).trim();
    if (!content) return;
    sendLock.current = true;
    isSending.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setInput('');
    setApiError(null);
    setSending(true);
    await bumpDailyCount();

    // Add user message immediately to state
    const userMsg: Message = { id: 'temp-' + Date.now(), role: 'user', content, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    const chatHistory = [
      ...messages
        .filter(m => (m.role === 'user' || m.role === 'assistant') && !m.type)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content },
    ];

    try {
      const data = await sendMessage(chatHistory);
      const aeviMsg: Message = {
        id: 'aevi-' + Date.now(),
        role: 'assistant',
        content: data.content ?? '',
        ts: Date.now(),
      };
      setMessages(prev => [...prev, aeviMsg]);
    } catch (e: any) {
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
      if (e.message === 'LIMIT_REACHED') {
        if (plan === 'free') setLimitReached(true);
      } else {
        showApiError('Aevi is unavailable right now. Try again.');
      }
    } finally {
      sendLock.current = false;
      isSending.current = false;
      setSending(false);
    }
  };

  const tapStarter = (p: string) => {
    Haptics.selectionAsync();
    setInput(p);
    setTimeout(() => send(p), 50);
  };

  const insertDivider = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const label   = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const content = `New reflection · ${label}`;
    setMessages(p => [...p, { id: 'div-' + Date.now(), role: 'divider', content, ts: Date.now() }]);
  };

  // ── Toast ────────────────────────────────────────────────────────────────────

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setToast(null));
  };

  // ── Text / sheet actions ─────────────────────────────────────────────────────

  const handleTextAction = useCallback((text: string, id: string) => {
    setSelectedText(text);
    setSelectedMessageId(id);
    setShowActionSheet(true);
  }, []);

  const handleSheetAction = async (action: string, text: string) => {
    if (action === 'journal') {
      navigation.navigate('NewEntry', { initialContent: text, source: 'chat' });
    } else if (action === 'insight') {
      const pid = 'insight-' + Date.now();
      setMessages(p => [...p, { id: pid, role: 'assistant', content: '', ts: Date.now(), type: 'insight', loading: true }]);
      try {
        const data = await sendMessage([{ role: 'user', content: `Give me a powerful insight about this thought: "${text}"` }]);
        setMessages(p => p.map(m => m.id === pid ? { ...m, content: data.content ?? 'No insight returned.', loading: false } : m));
      } catch {
        setMessages(p => p.map(m => m.id === pid ? { ...m, content: "Couldn't generate an insight right now.", loading: false } : m));
      }
    } else if (action === 'content') {
      navigation.navigate('ContentCreator', { messages: [{ id: 'sel-' + Date.now(), role: 'user', content: text, ts: Date.now() }] });
    } else if (action === 'rewrite') {
      const pid = 'rewrite-' + Date.now();
      setMessages(p => [...p, { id: pid, role: 'assistant', content: '', ts: Date.now(), type: 'rewrite', loading: true }]);
      try {
        const data = await sendMessage([{ role: 'user', content: `Rewrite this more eloquently while keeping my authentic voice and meaning: ${text}` }]);
        setMessages(p => p.map(m => m.id === pid ? { ...m, content: data.content ?? 'Could not rewrite.', loading: false } : m));
      } catch {
        setMessages(p => p.map(m => m.id === pid ? { ...m, content: "Couldn't rewrite right now.", loading: false } : m));
      }
    } else if (action === 'copy') {
      await Clipboard.setStringAsync(text);
      showToast('Copied ✦');
    } else if (action === 'delete') {
      setMessages(p => p.filter(m => m.id !== selectedMessageId));
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const initials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <MessageBubble item={item} onTextAction={handleTextAction} searchQuery={searchQuery} />
    ),
    [handleTextAction, searchQuery],
  );

  // ── Loading state ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={[s.screen, { paddingTop: top }]}>
        <View style={s.center}>
          <ActivityIndicator color="#867070" size="large" />
          <Text style={s.loadLabel}>Gathering your thoughts...</Text>
        </View>
      </View>
    );
  }

  if (fetchError) {
    return (
      <View style={[s.screen, { paddingTop: top }]}>
        <View style={s.center}>
          <Text style={s.errorTitle}>Couldn't reach Aevi</Text>
          <Text style={s.errorSub}>Check your connection and try again.</Text>
          <TouchableOpacity style={s.retryBtn} activeOpacity={0.8}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); load(); }}>
            <Text style={s.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Chat UI ───────────────────────────────────────────────────────────────────

  return (
    <View style={[s.screen, { paddingTop: top }]}>

      {/* Header */}
      <View style={s.header}>
        {/* Avatar */}
        {userAvatar ? (
          <Image source={{ uri: userAvatar }} style={s.headerAvatar} />
        ) : (
          <View style={[s.headerAvatar, s.headerAvatarFallback]}>
            <Text style={s.headerAvatarInitials}>{initials(userName || 'Me')}</Text>
          </View>
        )}

        {/* Name + status */}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={s.headerName} numberOfLines={1}>{userName || 'You'}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
            <View style={s.onlineDot} />
            <Text style={s.headerStatus}>REFLECTIVE</Text>
          </View>
        </View>

        {/* Search */}
        <TouchableOpacity
          style={s.headerIconBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => { Haptics.selectionAsync(); openSearch(); }}
        >
          <Ionicons name="search-outline" size={22} color="#867070" />
        </TouchableOpacity>

      </View>

      {/* Search bar */}
      {searchVisible && (
        <Animated.View style={{
          overflow: 'hidden',
          maxHeight: searchAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 110] }),
          opacity: searchAnim,
          backgroundColor: '#FDF6F0',
          borderBottomWidth: 1,
          borderBottomColor: '#F0E8E4',
        }}>
          <View style={s.searchRow}>
            <Ionicons name="search-outline" size={16} color="#C4A8A8" />
            <TextInput
              ref={searchInputRef}
              style={s.searchInput}
              placeholder="Search your reflections..."
              placeholderTextColor="#C4A8A8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              returnKeyType="search"
            />
            <TouchableOpacity onPress={closeSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={18} color="#B09090" />
            </TouchableOpacity>
          </View>
          {searchQuery.length > 0 && (
            <Text style={s.searchCount}>
              {filteredMessages.length} {filteredMessages.length === 1 ? 'result' : 'results'}
            </Text>
          )}
        </Animated.View>
      )}

      {/* Messages */}
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatRef}
          data={searchQuery.length > 0 ? [...filteredMessages].reverse() : [...messages].reverse()}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          inverted
          style={{ flex: 1 }}
          contentContainerStyle={s.msgList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={20}
          onScroll={({ nativeEvent: { contentOffset } }) => {
            isAtBottom.current = contentOffset.y < 60;
          }}
          scrollEventThrottle={100}
        />
        {messages.length === 0 && !loading && (
          <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
            <EmptyState onSend={tapStarter} />
          </View>
        )}
      </View>

      {sending && <TypingIndicator />}

      {/* Limit nudge */}
      {limitReached && plan === 'free' && (
        <View style={s.nudgeBanner}>
          <Text style={s.nudgeText}>You've reached your daily limit ✦ Upgrade to keep reflecting</Text>
          <TouchableOpacity
            style={s.nudgeBtn}
            activeOpacity={0.8}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); navigation.navigate('Upgrade'); }}
          >
            <Text style={s.nudgeBtnText}>Upgrade</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* API error */}
      {apiError && (
        <View style={s.errorBanner}>
          <Text style={s.errorBannerText}>{apiError}</Text>
          <TouchableOpacity onPress={() => setApiError(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={14} color="#B09090" />
          </TouchableOpacity>
        </View>
      )}

      <TextActionSheet
        selectedText={selectedText}
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        onAction={handleSheetAction}
        showChatActions
      />

      {/* Toast */}
      {toast && (
        <Animated.View style={[s.toast, { opacity: toastAnim }]} pointerEvents="none">
          <Text style={s.toastText}>{toast}</Text>
        </Animated.View>
      )}

      {/* Input bar */}
      <View style={s.inputBar}>
        <TouchableOpacity style={s.inputIconBtn} onPress={insertDivider}>
          <Text style={s.plusText}>+</Text>
        </TouchableOpacity>
        <TextInput
          style={s.textInput}
          placeholder="A thought, a question, anything..."
          placeholderTextColor="#C4A8A8"
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={2000}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[s.sendBtn, (sending || !input.trim() || isOffline) && { opacity: 0.5 }]}
          onPress={() => send()}
          activeOpacity={0.8}
          disabled={sending || !input.trim() || isOffline}
        >
          <Text style={s.sendBtnText}>↑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: '#FDF6F0',
  },

  // ── Header ────────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FDF6F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8E4',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerAvatarFallback: {
    backgroundColor: '#9A6868',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarInitials: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  headerName: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 17,
    color: '#3D2B2B',
    lineHeight: 22,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#22c55e',
  },
  headerStatus: {
    fontFamily: Typography.sans.medium,
    fontSize: 12,
    color: '#22c55e',
    letterSpacing: 0.4,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Dropdown menu ──────────────────────────────────────────────────────────────
  menuOverlay: {
    flex: 1,
  },
  menuBox: {
    position: 'absolute',
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 190,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontFamily: Typography.sans.light,
    fontSize: 15,
    color: '#3D2B2B',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F5EBEB',
    marginHorizontal: 0,
  },

  // ── State screens ─────────────────────────────────────────────────────────────
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  loadLabel:  { fontFamily: Typography.sans.light,    fontSize: 14, color: '#A08888', marginTop: 8 },
  errorTitle: { fontFamily: Typography.sans.semiBold, fontSize: 18, color: '#3D2B2B', textAlign: 'center' },
  errorSub:   { fontFamily: Typography.sans.light,    fontSize: 14, color: '#A08888', textAlign: 'center', lineHeight: 21 },
  retryBtn: {
    marginTop: 8, paddingHorizontal: 28, paddingVertical: 12,
    borderRadius: 20, backgroundColor: '#867070',
    ...Shadows.btn,
  },
  retryText: { fontFamily: Typography.sans.semiBold, fontSize: 14, color: '#FFFFFF' },

  // ── Messages ──────────────────────────────────────────────────────────────────
  msgList: { paddingHorizontal: 0, paddingTop: 16, paddingBottom: 8 },

  bubbleWrap: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  bubbleWrapAevi: { alignItems: 'flex-start' },
  bubbleWrapUser: { alignItems: 'flex-start', justifyContent: 'flex-end' },

  aeviAvatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#867070',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 18,
    flexShrink: 0,
  },
  aeviAvatarText: { fontSize: 11, color: '#FFFFFF' },

  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  senderRowUser: { flexDirection: 'row-reverse' },
  senderLabel: {
    fontFamily: Typography.sans.light,
    fontSize: 11,
    color: '#D5B4B4',
  },
  senderLabelUser: { textAlign: 'right' },

  bubble: { borderRadius: 18, padding: 14 },
  bubbleAevi: {
    backgroundColor: '#F5EBEB',
    maxWidth: '88%',
    alignSelf: 'flex-start',
    marginRight: 'auto',
    marginLeft: 8,
  },
  bubbleUser: {
    backgroundColor: '#867070',
    maxWidth: '88%',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    marginRight: 8,
  },
  bubbleText: { fontFamily: Typography.sans.regular, fontSize: 15, color: '#3D2B2B', lineHeight: 22 },
  bubbleTextUser: { color: '#FFFFFF' },

  // ── Empty state ───────────────────────────────────────────────────────────────
  emptyOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyInner: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyHeading: {
    fontFamily: Typography.serif.italic,
    fontSize: 32,
    color: '#3D2B2B',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 40,
  },
  emptySub: {
    fontFamily: Typography.sans.light,
    fontSize: 16,
    color: '#A08888',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  pillsWrap: { alignItems: 'center', gap: 10, width: '100%' },
  pill: {
    borderWidth: 1,
    borderColor: '#D5B4B4',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  pillText: {
    fontFamily: Typography.sans.light,
    fontSize: 14,
    color: '#867070',
    textAlign: 'center',
  },

  // ── Topic divider ─────────────────────────────────────────────────────────────
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
    gap: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0E8E4',
  },
  dividerText: {
    fontSize: 12,
    color: '#D5B4B4',
    textAlign: 'center',
    fontFamily: Typography.sans.light,
    letterSpacing: 0.3,
  },

  // ── Typing indicator ──────────────────────────────────────────────────────────
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingBottom: 6 },
  typingAvatar: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#C4A8A8', alignItems: 'center', justifyContent: 'center' },
  typingAvatarText: { fontSize: 11, color: '#FFFFFF' },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F5EBEB', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14 },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#C4A8A8' },

  // ── Special cards (insight / rewrite) ─────────────────────────────────────────
  specialWrap: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  specialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  insightBubble: {
    backgroundColor: '#E8D5D5',
    borderRadius: 18,
    padding: 16,
    minHeight: 48,
    justifyContent: 'center',
  },
  insightCard: {
    backgroundColor: '#E8D5D5',
    borderRadius: 18,
    padding: 14,
    maxWidth: '75%',
    alignSelf: 'flex-start',
    marginVertical: 6,
  },
  insightIcon: { fontSize: 12, color: '#9A7070' },
  insightLabel: { fontFamily: Typography.sans.semiBold, fontSize: 12, color: '#9A7070', letterSpacing: 0.4 },
  insightBodyText: { fontFamily: Typography.sans.regular, fontSize: 15, color: '#3D2B2B', lineHeight: 22 },
  insightCardText: {
    fontSize: 15,
    color: '#3D2B2B',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  rewriteBubble: {
    backgroundColor: '#F0EAE8',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(213,180,180,0.35)',
    minHeight: 48,
    justifyContent: 'center',
  },
  rewriteLabel: { flex: 1, fontFamily: Typography.sans.semiBold, fontSize: 12, color: '#9A7070' },
  rewriteBodyText: { fontFamily: Typography.sans.regular, fontSize: 15, color: '#3D2B2B', lineHeight: 22 },
  rewriteHint: { fontFamily: Typography.sans.light, fontSize: 11, color: '#C4A8A8', marginTop: 8 },

  // ── Toast ─────────────────────────────────────────────────────────────────────
  toast: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: 'rgba(61,43,43,0.88)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  toastText: { fontFamily: Typography.sans.medium, fontSize: 13, color: '#FFFFFF' },

  // ── Message context sheet ──────────────────────────────────────────────────
  ctxOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  ctxSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
    paddingTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  ctxPreview: {
    fontFamily: Typography.sans.light,
    fontSize: 13,
    color: '#A08888',
    paddingHorizontal: 20,
    paddingVertical: 14,
    lineHeight: 20,
  },
  ctxSheetDivider: {
    height: 1,
    backgroundColor: '#F5EBEB',
  },
  ctxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  ctxItemText: {
    fontFamily: Typography.sans.regular,
    fontSize: 15,
    color: '#3D2B2B',
  },

  // ── Input bar ─────────────────────────────────────────────────────────────────
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  plusText: { fontSize: 20, color: '#C4A8A8', lineHeight: 24 },
  textInput: {
    flex: 1,
    fontFamily: Typography.sans.light,
    fontSize: 15,
    color: '#3D2B2B',
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 4,
    textAlignVertical: 'center',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#867070',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: { fontSize: 16, color: '#FFFFFF', fontWeight: '700' },

  // ── Limit nudge ───────────────────────────────────────────────────────────────
  nudgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5EBEB',
    borderTopWidth: 1,
    borderTopColor: 'rgba(213,180,180,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  nudgeText: {
    flex: 1,
    fontFamily: Typography.sans.light,
    fontSize: 13,
    color: '#867070',
    lineHeight: 18,
  },
  nudgeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#867070',
    flexShrink: 0,
  },
  nudgeBtnText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },

  // ── Text selection bar ────────────────────────────────────────────────────────
  selOverlay: {
    flex: 1,
  },
  selBarWrapper: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  selBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D2B2B',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  selBarBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selBarText: {
    fontFamily: Typography.sans.light,
    fontSize: 13,
    color: '#FDF6F0',
  },
  selBarDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(253,246,240,0.2)',
  },

  // ── Bubble input (read-only TextInput for text selection) ─────────────────────
  bubbleInput: {
    padding: 0,
    backgroundColor: 'transparent',
    textAlignVertical: 'top',
  },

  // ── API error banner ──────────────────────────────────────────────────────────
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245,235,235,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(213,180,180,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 9,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontFamily: Typography.sans.light,
    fontSize: 13,
    color: '#A08888',
  },

  // ── Search ────────────────────────────────────────────────────────────────────
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.sans.light,
    fontSize: 15,
    color: '#3D2B2B',
    padding: 0,
    paddingVertical: 0,
  },
  searchCount: {
    fontFamily: Typography.sans.light,
    fontSize: 12,
    color: '#B09090',
    textAlign: 'center',
    paddingVertical: 6,
  },
  searchHighlight: {
    backgroundColor: 'rgba(155,104,104,0.18)',
    borderRadius: 2,
    color: '#3D2B2B',
  },
});
