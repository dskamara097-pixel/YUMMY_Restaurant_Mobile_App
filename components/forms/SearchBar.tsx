import { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppInput } from '@/components/forms/AppInput';
import { colors, layout } from '@/constants/theme';

type SearchBarProps = Omit<ComponentProps<typeof AppInput>, 'leftIcon' | 'rightElement' | 'label'> & {
  onClear?: () => void;
};

export function SearchBar({ value, onClear, placeholder = 'Search meals or categories', ...props }: SearchBarProps) {
  const canClear = Boolean(value && onClear);

  return (
    <View style={styles.container}>
      <AppInput
        {...props}
        value={value}
        placeholder={placeholder}
        leftIcon="search"
        autoCapitalize="none"
        returnKeyType="search"
        rightElement={
          canClear ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={8}
              onPress={onClear}
              style={styles.clearButton}
            >
              <AppIcon name="close-circle" size={20} color={colors.neutral.muted} />
            </Pressable>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  clearButton: {
    justifyContent: 'center',
    minHeight: layout.minTouchTarget,
  },
});
