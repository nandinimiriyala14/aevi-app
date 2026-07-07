import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Dimensions, Modal, Pressable, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../theme';

interface Props {
  selectedText: string;
  visible: boolean;
  onClose: () => void;
  onAction: (action: string, text: string) => void;
  showChatActions?: boolean;
}

const { height: SCREEN_H } = Dimensions.get('window');

const ACTIONS = [
  { id: 'journal', icon: '✦', label: 'Journal this' },
  { id: 'content', icon: '◇', label: 'Turn into content' },
  { id: 'rewrite', icon: '↺', label: 'Rewrite' },
  { id: 'insight', icon: '◎', label: 'Generate insight' },
] as const;

export default function TextActionSheet({
  selectedText, visible, onClose, onAction, showChatActions = true,
}: Props) {
  const { bottom } = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_H)).current;
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 22,
        stiffness: 220,
        mass: 0.8,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_H,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  }, [visible, translateY]);

  const fire = (action: string) => {
    onAction(action, selectedText);
    onClose();
  };

  const visibleActions = ACTIONS.filter(
    a => showChatActions || (a.id !== 'rewrite' && a.id !== 'insight'),
  );

  return (
    <Modal visible={modalVisible} transparent animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1 }} pointerEvents="box-none">
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          style={[s.sheet, { paddingBottom: 32 + bottom, transform: [{ translateY }] }]}
        >
          <View onStartShouldSetResponder={() => true}>

            {/* Drag handle */}
            <View style={s.handle} />

            {/* Text preview */}
            <View style={s.preview}>
              <Text style={s.previewText} numberOfLines={2}>
                {selectedText}
              </Text>
            </View>

            {/* Action list */}
            {visibleActions.map((action, i) => (
              <TouchableOpacity
                key={action.id}
                style={[s.item, i < visibleActions.length - 1 && s.itemBorder]}
                onPress={() => fire(action.id)}
                activeOpacity={0.6}
              >
                <Text style={s.itemIcon}>{action.icon}</Text>
                <Text style={s.itemLabel}>{action.label}</Text>
                <Text style={s.itemChevron}>›</Text>
              </TouchableOpacity>
            ))}

            {/* Divider before copy */}
            <View style={s.separator} />

            {/* Copy */}
            <TouchableOpacity style={s.copyBtn} onPress={() => fire('copy')} activeOpacity={0.6}>
              <Text style={s.copyText}>Copy</Text>
            </TouchableOpacity>

            {/* Delete — chat only */}
            {showChatActions && (
              <>
                <View style={s.separator} />
                <TouchableOpacity style={s.copyBtn} onPress={() => fire('delete')} activeOpacity={0.6}>
                  <Text style={s.deleteText}>Delete message</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#E4D0D0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  preview: {
    backgroundColor: '#F5EBEB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  previewText: {
    fontFamily: Typography.serif.italic,
    fontSize: 14,
    color: '#867070',
    lineHeight: 20,
  },
  item: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderColor: '#F5EBEB',
  },
  itemIcon: {
    fontSize: 16,
    color: '#867070',
    width: 28,
  },
  itemLabel: {
    flex: 1,
    fontFamily: Typography.sans.regular,
    fontSize: 16,
    color: '#3D2B2B',
  },
  itemChevron: {
    fontSize: 18,
    color: '#D5B4B4',
    lineHeight: 22,
  },
  separator: {
    height: 1,
    backgroundColor: '#F5EBEB',
    marginVertical: 4,
  },
  copyBtn: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyText: {
    fontFamily: Typography.sans.light,
    fontSize: 14,
    color: '#A08888',
  },
  deleteText: {
    fontFamily: Typography.sans.light,
    fontSize: 14,
    color: '#D4443A',
  },
});
