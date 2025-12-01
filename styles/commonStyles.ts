
import { StyleSheet } from 'react-native';

export const colors = {
  // Primary colors
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  primaryDark: '#5B21B6',
  
  // Secondary colors
  secondary: '#06B6D4',
  secondaryLight: '#22D3EE',
  secondaryDark: '#0891B2',
  
  // Accent colors
  accent: '#F59E0B',
  
  // Gradient colors
  gradient1: '#7C3AED',
  gradient2: '#A78BFA',
  
  // Background colors
  background: '#0F172A',
  backgroundLight: '#1E293B',
  
  // Card colors
  card: '#1E293B',
  cardLight: '#334155',
  
  // Text colors
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  
  // Border colors
  border: '#334155',
  
  // Status colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    color: colors.text,
    fontSize: 16,
  },
  textSecondary: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
});
