import { ComponentProps, useState } from 'react';
import { Pressable } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppInput } from '@/components/forms/AppInput';
import { colors, layout } from '@/constants/theme';

type PasswordInputProps = Omit<ComponentProps<typeof AppInput>, 'secureTextEntry' | 'rightElement' | 'leftIcon'>;

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <AppInput
      {...props}
      leftIcon="lock-closed-outline"
      secureTextEntry={!visible}
      textContentType="password"
      autoCapitalize="none"
      rightElement={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          hitSlop={8}
          onPress={() => setVisible((current) => !current)}
          style={{ minHeight: layout.minTouchTarget, justifyContent: 'center' }}
        >
          <AppIcon
            name={visible ? 'eye-off-outline' : 'eye-outline'}
            size={21}
            color={colors.neutral.muted}
          />
        </Pressable>
      }
    />
  );
}
