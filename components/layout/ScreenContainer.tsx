import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/constants/theme';

type ScreenContainerProps = PropsWithChildren<{
  scroll?: boolean;
  centered?: boolean;
  padded?: boolean;
  backgroundColor?: string;
  contentStyle?: ViewStyle;
}>;

export function ScreenContainer({
  children,
  scroll = false,
  centered = true,
  padded = true,
  backgroundColor = colors.neutral.canvas,
  contentStyle,
}: ScreenContainerProps) {
  const containerStyle = [
    styles.content,
    centered && styles.centered,
    padded && styles.padded,
    contentStyle,
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}> 
      {scroll ? (
        <ScrollView contentContainerStyle={containerStyle} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={containerStyle}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  centered: {
    justifyContent: 'center',
  },
  padded: {
    padding: layout.screenPadding,
  },
});