
import { StyleSheet, ViewStyle, TextStyle, useColorScheme } from 'react-native';

// Dark theme colors
export const darkColors = {
  background: '#0F0F1E',
  backgroundLight: '#1A1A2E',
  text: '#FFFFFF',
  textSecondary: '#A0A0B8',
  primary: '#7C3AED',
  primaryLight: '#9F67FF',
  primaryDark: '#5B21B6',
  secondary: '#06B6D4',
  secondaryLight: '#22D3EE',
  accent: '#F59E0B',
  accentLight: '#FCD34D',
  card: '#1E1E3F',
  cardLight: '#2A2A4E',
  highlight: '#EC4899',
  border: '#2D2D4A',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  gradient1: '#7C3AED',
  gradient2: '#EC4899',
};

// Light theme colors
export const lightColors = {
  background: '#F5F5F7',
  backgroundLight: '#FFFFFF',
  text: '#1D1D1F',
  textSecondary: '#6E6E73',
  primary: '#7C3AED',
  primaryLight: '#9F67FF',
  primaryDark: '#5B21B6',
  secondary: '#06B6D4',
  secondaryLight: '#22D3EE',
  accent: '#F59E0B',
  accentLight: '#FCD34D',
  card: '#FFFFFF',
  cardLight: '#F5F5F7',
  highlight: '#EC4899',
  border: '#D2D2D7',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  gradient1: '#7C3AED',
  gradient2: '#EC4899',
};

// Default to dark colors for backward compatibility
export const colors = darkColors;

// Hook to get theme-aware colors
export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkColors : lightColors;
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.textSecondary,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
});
