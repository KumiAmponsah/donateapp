import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  disableTop?: boolean;
  disableBottom?: boolean;
  disableLeft?: boolean;
  disableRight?: boolean;
}

export default function SafeAreaWrapper({
  children,
  style,
  backgroundColor = '#FFFFFF',
  disableTop = false,
  disableBottom = false,
  disableLeft = false,
  disableRight = false,
}: SafeAreaWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: disableTop ? 0 : insets.top,
          paddingBottom: disableBottom ? 0 : insets.bottom,
          paddingLeft: disableLeft ? 0 : insets.left,
          paddingRight: disableRight ? 0 : insets.right,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});