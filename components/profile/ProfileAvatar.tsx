import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { colors } from '@/constants/theme';

type ProfileAvatarProps = {
  name: string;
  imageSource?: ImageSourcePropType;
  size?: number;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'YR';
}

export function ProfileAvatar({ name, imageSource, size = 56 }: ProfileAvatarProps) {
  return (
    <View style={[styles.avatar, { height: size, width: size, borderRadius: size / 2 }]}>
      {imageSource ? (
        <Image source={imageSource} style={styles.image} />
      ) : (
        <AppText variant="sectionTitle" tone="inverse" adjustsFontSizeToFit numberOfLines={1}>
          {getInitials(name)}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
