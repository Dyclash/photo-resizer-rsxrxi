
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../styles/commonStyles';
import { generateAppMetadata } from '../utils/textGenerator';
import { AppMetadata } from '../types/PhotoTypes';

interface AppDescriptionInputProps {
  onGenerate: (metadata: AppMetadata) => void;
}

export function AppDescriptionInput({ onGenerate }: AppDescriptionInputProps) {
  const [description, setDescription] = useState('');
  const [metadata, setMetadata] = useState<AppMetadata | null>(null);

  const handleGenerate = () => {
    if (description.trim().length < 10) {
      console.log('Description too short');
      return;
    }

    const generated = generateAppMetadata(description);
    setMetadata(generated);
    onGenerate(generated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Describe Your App</Text>
      <Text style={styles.subtitle}>
        Tell us about your app to generate promotional content
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E.g., A fitness tracking app that helps users monitor their daily activities..."
        placeholderTextColor={colors.textSecondary}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.button, description.trim().length < 10 && styles.buttonDisabled]}
        onPress={handleGenerate}
        disabled={description.trim().length < 10}
      >
        <Text style={styles.buttonText}>Generate Content</Text>
      </TouchableOpacity>

      {metadata && (
        <ScrollView style={styles.resultsContainer}>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Promotional Text</Text>
            <Text style={styles.resultText}>{metadata.promotionalText}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Description</Text>
            <Text style={styles.resultText}>{metadata.description}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Keywords</Text>
            <Text style={styles.resultText}>{metadata.keywords}</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  buttonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 24,
    maxHeight: 400,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
