import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { colors, radius, spacing } from '@/constants/theme';

type TrackingTimelineProps = {
  steps: Array<{
    label: string;
    description: string;
    completed: boolean;
    active: boolean;
  }>;
};

export function TrackingTimeline({ steps }: TrackingTimelineProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={step.label} style={styles.stepRow}>
          <View style={styles.markerColumn}>
            <View style={[styles.marker, step.completed && styles.completed, step.active && styles.active]}>
              <AppIcon name={step.completed ? 'checkmark' : 'ellipse-outline'} size={16} color={step.completed || step.active ? colors.neutral.surface : colors.neutral.muted} />
            </View>
            {index < steps.length - 1 ? <View style={[styles.line, step.completed && styles.lineCompleted]} /> : null}
          </View>
          <View style={styles.copy}>
            <AppText variant="bodyStrong" tone={step.active ? 'primary' : 'default'}>{step.label}</AppText>
            <AppText tone="muted">{step.description}</AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  markerColumn: {
    alignItems: 'center',
    width: 34,
  },
  marker: {
    alignItems: 'center',
    backgroundColor: colors.neutral.line,
    borderRadius: radius.pill,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  completed: {
    backgroundColor: colors.semantic.success,
  },
  active: {
    backgroundColor: colors.brand.primary,
  },
  line: {
    backgroundColor: colors.neutral.line,
    flex: 1,
    minHeight: 34,
    width: 2,
  },
  lineCompleted: {
    backgroundColor: colors.semantic.success,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
    paddingBottom: spacing.md,
  },
});
