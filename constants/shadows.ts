import { ViewStyle } from 'react-native';

export const shadows = {
  none: {} satisfies ViewStyle,
  soft: {
    shadowColor: '#1E1E24',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  } satisfies ViewStyle,
  card: {
    shadowColor: '#1E1E24',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  } satisfies ViewStyle,
  floating: {
    shadowColor: '#1E1E24',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 8,
  } satisfies ViewStyle,
} as const;