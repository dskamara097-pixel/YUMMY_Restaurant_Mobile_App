import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AccountOptionRow } from '@/components/profile/AccountOptionRow';
import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { sampleFaqs } from '@/data/sampleData';

export default function HelpSupportScreen() {
  const [openFaqId, setOpenFaqId] = useState(sampleFaqs[0]?.id ?? '');
  const [notice, setNotice] = useState('');

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Help & Support" subtitle="Customer support UI" leftIcon="arrow-back" onLeftPress={() => router.back()} />

      <View style={styles.section}>
        <SectionHeader title="FAQs" subtitle="Common customer questions" />
        <View style={styles.list}>
          {sampleFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <Pressable key={faq.id} accessibilityRole="button" onPress={() => setOpenFaqId(isOpen ? '' : faq.id)} style={styles.faqCard}>
                <AppText variant="bodyStrong">{faq.question}</AppText>
                {isOpen ? <AppText tone="muted">{faq.answer}</AppText> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Contact Support" subtitle="UI-only actions" />
        <View style={styles.list}>
          <AccountOptionRow title="Call Restaurant" subtitle="Speak with the restaurant team" icon="call-outline" onPress={() => setNotice('Call restaurant is UI only in Phase 5A.')} />
          <AccountOptionRow title="Chat Support" subtitle="Open support conversation" icon="chatbubble-ellipses-outline" onPress={() => setNotice('Chat support is UI only in Phase 5A.')} />
          <AccountOptionRow title="Report Order Issue" subtitle="Create a help request placeholder" icon="alert-circle-outline" onPress={() => setNotice('Support tickets are UI only in Phase 5A.')} />
        </View>
      </View>

      <AppButton label="Contact Support" leftIcon="help-circle-outline" onPress={() => setNotice('Contact support is UI only in Phase 5A.')} />
      {notice ? <AppBadge label={notice} tone="info" icon="information-circle-outline" /> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  section: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
  faqCard: {
    backgroundColor: colors.neutral.surface,
    borderColor: colors.neutral.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
    ...shadows.soft,
  },
});
