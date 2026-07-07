import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { AppInput } from '@/components/forms/AppInput';
import { colors, radius, shadows, spacing } from '@/constants/theme';

type PromoCodeCardProps = {
  onApply?: (code: string) => void;
};

export function PromoCodeCard({ onApply }: PromoCodeCardProps) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  function handleApply() {
    setMessage(code.trim() ? 'Promo preview applied for UI only.' : 'Enter a promo code to preview.');
    onApply?.(code.trim());
  }

  return (
    <View style={styles.card}>
      <View style={styles.copy}>
        <AppText variant="sectionTitle">Promo Code</AppText>
        <AppText tone="muted">Apply button is a frontend placeholder only.</AppText>
      </View>
      <View style={styles.row}>
        <View style={styles.inputWrap}>
          <AppInput value={code} onChangeText={setCode} placeholder="YUMMY10" leftIcon="pricetag-outline" autoCapitalize="characters" />
        </View>
        <AppButton label="Apply" size="md" fullWidth={false} onPress={handleApply} />
      </View>
      {message ? <AppBadge label={message} tone="info" icon="information-circle-outline" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.soft,
  },
  copy: {
    gap: spacing.xs,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputWrap: {
    flex: 1,
  },
});
