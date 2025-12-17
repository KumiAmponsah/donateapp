import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
}

export default function ScreenContainer({
  children,
  style,
  backgroundColor = '#FFFFFF',
  scrollable = false,
  contentContainerStyle,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const Container = scrollable ? ScrollView : View;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
    >
      <Container 
        style={styles.content}
        contentContainerStyle={scrollable ? contentContainerStyle : undefined}
        showsVerticalScrollIndicator={scrollable ? false : undefined}
      >
        {children}
      </Container>
      {/* REMOVED: This spacer ensures content isn't hidden behind footer */}
      {/* The Footer component now handles this spacing */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});